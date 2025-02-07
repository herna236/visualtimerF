import React, { useState } from 'react';
import api from './api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Paper, Divider, Alert } from '@mui/material';

function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');

      const response = await api.post('/login', { email, password });
      const { token, userId } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);

      console.log('Logged in successfully');
      navigate('/timer-control');
    } catch (error) {
      setError(error.response?.data || 'An error occurred');
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 3, textAlign: 'center', mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Sign In
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
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default SignInPage;
