import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api/axiosConfig';
import ImageDisplay from './ImageDisplay';
import Howler from 'react-howler';
import { Button, TextField, Box, Typography, FormControlLabel, Checkbox, Container } from '@mui/material';

const TimerControl = () => {
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [inputMinutes, setInputMinutes] = useState('');
  const [inputSeconds, setInputSeconds] = useState('');
  const [totalDuration, setTotalDuration] = useState(0);
  const [pausedTime, setPausedTime] = useState(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isSoundPlaying, setSoundPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [playSound, setPlaySound] = useState(true);
  const [fetchImageTrigger, setFetchImageTrigger] = useState(false);
  const [alarmStopped, setAlarmStopped] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (!token || !userId) {
      console.error('Please sign in to access a timer');
      navigate('/');
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            clearInterval(interval);
            setIsActive(false);
            setIsTimeUp(true);
            if (playSound) {
              setSoundPlaying(true);
            }
            return 0;
          }
        });
      }, 1000);
    } else if (!isActive && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timer, playSound]);

  const startTimer = async () => {
    const minutes = parseInt(inputMinutes, 10) || 0;
    const seconds = parseInt(inputSeconds, 10) || 0;
    const duration = minutes * 60 + seconds;

    if (duration > 0) {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
          throw new Error('No authentication token or userId found.');
        }

        const response = await api.get(`/user-status/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.trialPeriodOver && response.data.hasPaid === false && duration > 60) {
          alert('Your trial period is over. You can only use timers for 60 seconds or less with the unpaid version.');
          return;
        }

        await api.post('/start-timer', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setTimer(duration);
        setTotalDuration(duration);
        setIsActive(true);
        setPausedTime(null);
        setIsTimeUp(false);
        setSoundPlaying(false);
        setHasStarted(true);
        setAlarmStopped(false);

      } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error.message);
        alert('Error starting timer: ' + (error.response?.data.message || 'An error occurred'));
      }
    } else {
      alert('Please enter a valid duration.');
    }
  };

  const pauseTimer = () => {
    setIsActive(false);
    setPausedTime(timer);
  };

  const resumeTimer = () => {
    setIsActive(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimer(0);
    setTotalDuration(0);
    setPausedTime(null);
    setIsTimeUp(false);
    setSoundPlaying(false);
    setHasStarted(false);
    setFetchImageTrigger(prev => !prev);
    setAlarmStopped(false);
  };

  const stopSound = () => {
    setSoundPlaying(false);
    setAlarmStopped(true);
  };

  const handleSoundToggle = () => {
    setPlaySound(!playSound);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <Container>
      {/* Box to align buttons to the far-right */}
      <Box display="flex" justifyContent="flex-end" gap={2} mb={2} mt={2}>
        <Link to="/Profile">
          <Button variant="contained" color="primary">Profile</Button>
        </Link>
        <Button onClick={handleLogout} variant="contained" color="secondary">Logout</Button>
      </Box>

      {!hasStarted && (
        <Box mb={2} textAlign="center">
          <Typography variant="h6">Set Timer Duration</Typography>
          <Box display="flex" alignItems="center" gap={2} justifyContent="center">
            <TextField
              label="Minutes"
              type="number"
              value={inputMinutes}
              onChange={(e) => setInputMinutes(e.target.value)}
              min="0"
              fullWidth
              sx={{ maxWidth: '100px' }}
            />
            <TextField
              label="Seconds"
              type="number"
              value={inputSeconds}
              onChange={(e) => setInputSeconds(e.target.value)}
              min="0"
              max="59"
              fullWidth
              sx={{ maxWidth: '100px' }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={playSound}
                  onChange={handleSoundToggle}
                  color="primary"
                />
              }
              label="Play Alarm Sound"
            />
          </Box>
          <Button variant="contained" color="primary" onClick={startTimer} sx={{ mt: 2, width: 'auto' }}>
            Start Timer
          </Button>
        </Box>
      )}

      {hasStarted && !isTimeUp && (
        <Box display="flex" gap={2} mb={2} justifyContent="center">
          {isActive ? (
            <Button variant="contained" color="warning" onClick={pauseTimer}>Pause</Button>
          ) : pausedTime !== null ? (
            <Button variant="contained" color="success" onClick={resumeTimer}>Resume</Button>
          ) : null}
          <Button variant="contained" color="secondary" onClick={resetTimer}>Reset</Button>
        </Box>
      )}

      {hasStarted && (
        <Box mb={2} textAlign="center">
          <Typography variant="h6">Time left: {timer} seconds</Typography>
        </Box>
      )}

      {/* Centering the image */}
      <Box display="flex" justifyContent="center" mb={2}>
        <ImageDisplay key={fetchImageTrigger} timer={timer} totalDuration={totalDuration} fetchImageTrigger={fetchImageTrigger} />
      </Box>

      {isTimeUp && (
        <Box textAlign="center">
          {playSound && !alarmStopped ? (
            <>
              <Typography variant="body1">Press stop alarm to turn off alert</Typography>
              <Button onClick={stopSound} className="stop-alarm-button">Stop Alarm</Button>
              <Howler
                src="/alarm.mp3"
                playing={true}
                loop={true}
                volume={1}
              />
            </>
          ) : (
            <>
              <Typography variant="body1">Time's Up! Press Reset for a new timer.</Typography>
              <Button onClick={resetTimer} className="reset-button">Reset</Button>
            </>
          )}
        </Box>
      )}
    </Container>
  );
};

export default TimerControl;
