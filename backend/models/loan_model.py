import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.preprocessing import StandardScaler
from typing import Dict, List, Tuple, Optional

class LoanPredictionModel:
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.feature_names = [
            'income', 'credit_score', 'employment_years', 'debt_to_income_ratio',
            'loan_amount', 'loan_term', 'existing_loans', 'age'
        ]
        
    def train(self, X: pd.DataFrame, y: pd.Series):
        """Train the XGBoost model on historical loan data"""
        X_scaled = self.scaler.fit_transform(X)
        self.model = xgb.XGBClassifier(
            objective='binary:logistic',
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5
        )
        self.model.fit(X_scaled, y)
        
    def predict(self, applicant_data: Dict) -> Tuple[float, Dict]:
        """
        Predict loan approval probability and generate feature importance
        
        Returns:
            Tuple containing:
            - Approval probability (float)
            - Feature importance values (Dict)
        """
        # Convert input data to DataFrame
        input_data = pd.DataFrame([applicant_data])
        input_scaled = self.scaler.transform(input_data)
        
        # Get prediction probability
        proba = self.model.predict_proba(input_scaled)[0][1]
        
        # Get feature importance
        importance = self.model.feature_importances_
        explanation = {
            feature: float(imp)
            for feature, imp in zip(self.feature_names, importance)
        }
        
        return proba, explanation
    
    def validate_input(self, data: Dict) -> Tuple[bool, Optional[str]]:
        """
        Validate input data for loan application
        
        Returns:
            Tuple containing:
            - Validation status (bool)
            - Error message if validation fails (Optional[str])
        """
        required_fields = set(self.feature_names)
        if not all(field in data for field in required_fields):
            return False, "Missing required fields"
            
        # Validate numeric ranges
        if not (0 <= data['credit_score'] <= 850):
            return False, "Invalid credit score"
            
        if data['income'] <= 0:
            return False, "Income must be positive"
            
        if not (0 <= data['debt_to_income_ratio'] <= 1):
            return False, "Invalid debt-to-income ratio"
            
        if data['age'] < 18 or data['age'] > 100:
            return False, "Invalid age"
            
        return True, None 