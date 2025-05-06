from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Optional
from models.loan_model import LoanPredictionModel
import numpy as np
import pandas as pd

app = FastAPI(title="AI Loan Sanctioning System")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the loan prediction model
loan_model = LoanPredictionModel()

# Load and train the model with real data from CSV
def initialize_model():
    try:
        df = pd.read_csv(r'C:\Users\Vedant Kumar\Desktop\AGENT\backend\loan_data.csv')
        X = df.drop('approved', axis=1)
        # Rename columns to match model's expected feature names
        X = X.rename(columns={
            'annual_income': 'income',
            'years_of_employment': 'employment_years'
        })
        y = df['approved']
        loan_model.train(X, y)
    except Exception as e:
        print(f"Error loading training data: {e}")
        # Fallback: use synthetic data if CSV fails
        np.random.seed(42)
        n_samples = 1000
        X = pd.DataFrame({
            'income': np.random.normal(50000, 20000, n_samples),
            'credit_score': np.random.normal(700, 50, n_samples),
            'employment_years': np.random.normal(5, 3, n_samples),
            'debt_to_income_ratio': np.random.uniform(0, 0.8, n_samples),
            'loan_amount': np.random.normal(30000, 15000, n_samples),
            'loan_term': np.random.randint(12, 360, n_samples),
            'existing_loans': np.random.randint(0, 5, n_samples),
            'age': np.random.normal(35, 10, n_samples)
        })
        y = (
            (X['income'] > 40000) &
            (X['credit_score'] > 650) &
            (X['debt_to_income_ratio'] < 0.5)
        ).astype(int)
        loan_model.train(X, y)

initialize_model()

class LoanApplication(BaseModel):
    income: float
    credit_score: int
    employment_years: float
    debt_to_income_ratio: float
    loan_amount: float
    loan_term: int
    existing_loans: int
    age: int

class LoanResponse(BaseModel):
    approved: bool
    probability: float
    explanation: Dict[str, float]
    suggested_loan_amount: Optional[float] = None
    suggested_term: Optional[int] = None

@app.post("/api/loan/predict", response_model=LoanResponse)
async def predict_loan(application: LoanApplication):
    # Validate input
    is_valid, error_message = loan_model.validate_input(application.dict())
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_message)
    
    # Get prediction and explanation
    probability, explanation = loan_model.predict(application.dict())
    
    # Calculate suggested loan amount and term based on income and credit score
    suggested_loan_amount = min(
        application.income * 0.5,  # Max 50% of annual income
        application.loan_amount * 1.2  # Up to 20% more than requested
    )
    
    suggested_term = min(
        int(application.loan_term * 1.2),  # Up to 20% longer term
        360  # Max 60 months
    )
    
    return LoanResponse(
        approved=probability > 0.7,  # Threshold for approval
        probability=probability,
        explanation=explanation,
        suggested_loan_amount=suggested_loan_amount,
        suggested_term=suggested_term
    )

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"} 