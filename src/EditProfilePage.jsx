import React, { useState, useEffect } from 'react';
import api from './api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Container, Alert } from '@mui/material';

function EditProfilePage() {
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user email on component mount
    const fetchUserEmail = async () => {
      try {
        const response = await api.get('/user-email', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setEmail(response.data.email);
        setNewEmail(response.data.email);
      } catch (err) {
        console.error('Error fetching user email:', err);
        setError('Failed to load user email.');
      }
    };

    fetchUserEmail();
  }, []);

  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
  };

  const handleEditProfile = async () => {
    try {
      const response = await api.put('/edit-profile', { newEmail }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setEmail(response.data.user.email);
      setSuccessMessage('Email updated successfully!');
      setError('');
    } catch (err) {
      console.error('Error updating email:', err);
      setError('Failed to update email.');
      setSuccessMessage('');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/delete-account', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Clear token and userId from local storage
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      // Set success message
      setSuccessMessage(`${email} was successfully deleted`);

      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      console.error('Error deleting account:', err);
      setError('Failed to delete account.');
    }
  };

  const GoBack = () => {
    navigate('/timer-control');
  };

  return (
    <Container>
      <Box textAlign="center" mt={4}>
        <Typography variant="h4" gutterBottom>Edit Profile</Typography>

        {/* Display error or success messages */}
        {error && <Alert severity="error">{error}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        {/* Email Display */}
        <Box mb={2}>
          <Typography variant="body1">Current Email: <strong>{email}</strong></Typography>
        </Box>

        {/* New Email Input */}
        <Box mb={2}>
          <TextField
            label="Enter new email"
            type="email"
            value={newEmail}
            onChange={handleEmailChange}
            variant="outlined"
          />
        </Box>

        {/* Action Buttons */}
        <Box display="flex" justifyContent="center" gap={2} mt={2}>
          <Button variant="contained" color="primary" onClick={handleEditProfile}>
            Update Email
          </Button>
          <Button variant="outlined" color="secondary" onClick={GoBack}>
            Go Back
          </Button>
        </Box>

        {/* Delete Account Button */}
        <Box mt={3}>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteAccount}

          >
            Delete Account
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default EditProfilePage;
