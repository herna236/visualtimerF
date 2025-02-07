import React, { useState } from 'react';
import api from './api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper, Divider, Alert } from '@mui/material';

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await api.post('/register', { email, password });

      if (response.data.token && response.data.userId) {
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('token', response.data.token);
        console.log('User registered successfully');
        navigate('/timer-control');
      } else {
        setError('Unexpected response: Token or userId not found');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 3, textAlign: 'center', mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Sign Up
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            inputProps={{ minLength: 8 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign Up
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default SignUpPage;
