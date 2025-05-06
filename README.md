# AI-Powered Loan Sanctioning System

This is an advanced loan sanctioning system that uses machine learning to automate and improve the loan approval process. The system includes features like automated eligibility checks, ML-based prediction, decision explanations, and a modern user interface.

## Features

- 🤖 Automated Loan Eligibility Checks
- 📊 ML-based Loan Approval Prediction
- 🧠 Transparent Decision Explanations (SHAP)
- 📁 Automatic Data Validation
- 🧾 Smart Loan Suggestions
- ⏱️ Real-time Processing
- 🖥️ Modern React Frontend
- 🔐 Secure API Implementation

## Project Structure

```
.
├── backend/
│   ├── models/
│   │   └── loan_model.py
│   └── main.py
├── frontend/
│   ├── src/
│   │   └── App.js
│   └── package.json
└── requirements.txt
```

## Setup Instructions

### Backend Setup

1. Create a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the backend server:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Install Node.js dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## API Documentation

Once the backend server is running, you can access the API documentation at:
http://localhost:8000/docs

## Usage

1. Open the application in your browser
2. Fill out the loan application form with the required information
3. Submit the form to get an instant decision
4. View the detailed explanation of the decision and suggested loan terms

## Security Features

- Input validation and sanitization
- Secure API endpoints
- Data privacy protection
- CORS configuration

## Model Details

The system uses an XGBoost classifier trained on historical loan data to make predictions. The model considers various factors including:
- Income
- Credit Score
- Employment History
- Debt-to-Income Ratio
- Loan Amount
- Loan Term
- Existing Loans
- Age

## Contributing

Feel free to submit issues and enhancement requests! 