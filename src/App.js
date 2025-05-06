import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

function App() {
  const [formData, setFormData] = useState({
    income: '',
    credit_score: '',
    employment_years: '',
    debt_to_income_ratio: '',
    loan_amount: '',
    loan_term: '',
    existing_loans: '',
    age: '',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:8000/api/loan/predict', formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred while processing your application');
    } finally {
      setLoading(false);
    }
  };

  const renderExplanationChart = () => {
    if (!result?.explanation) return null;

    const data = Object.entries(result.explanation).map(([name, value]) => ({
      name,
      value: Math.abs(value),
    }));

    return (
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Decision Explanation
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          AI-Powered Loan Application
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Annual Income"
                name="income"
                type="number"
                value={formData.income}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Credit Score"
                name="credit_score"
                type="number"
                value={formData.credit_score}
                onChange={handleInputChange}
                required
                inputProps={{ min: 300, max: 850 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Years of Employment"
                name="employment_years"
                type="number"
                value={formData.employment_years}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Debt-to-Income Ratio"
                name="debt_to_income_ratio"
                type="number"
                value={formData.debt_to_income_ratio}
                onChange={handleInputChange}
                required
                inputProps={{ min: 0, max: 1, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Loan Amount"
                name="loan_amount"
                type="number"
                value={formData.loan_amount}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Loan Term (months)"
                name="loan_term"
                type="number"
                value={formData.loan_term}
                onChange={handleInputChange}
                required
                inputProps={{ min: 12, max: 60 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Existing Loans"
                name="existing_loans"
                type="number"
                value={formData.existing_loans}
                onChange={handleInputChange}
                required
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                name="age"
                type="number"
                value={formData.age}
                onChange={handleInputChange}
                required
                inputProps={{ min: 18, max: 100 }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Submit Application'}
            </Button>
          </Box>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error}
          </Alert>
        )}

        {result && (
          <Box sx={{ mt: 3 }}>
            <Alert
              severity={result.approved ? 'success' : 'error'}
              sx={{ mb: 2 }}
            >
              {result.approved
                ? 'Congratulations! Your loan application has been approved.'
                : 'We regret to inform you that your loan application has been declined.'}
            </Alert>

            <Typography variant="h6" gutterBottom>
              Application Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography>
                  Approval Probability: {(result.probability * 100).toFixed(2)}%
                </Typography>
              </Grid>
              {result.suggested_loan_amount && (
                <Grid item xs={12} sm={6}>
                  <Typography>
                    Suggested Loan Amount: ${result.suggested_loan_amount.toFixed(2)}
                  </Typography>
                </Grid>
              )}
              {result.suggested_term && (
                <Grid item xs={12} sm={6}>
                  <Typography>
                    Suggested Term: {result.suggested_term} months
                  </Typography>
                </Grid>
              )}
            </Grid>

            {renderExplanationChart()}
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default App; 