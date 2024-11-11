import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import {postApi } from 'src/service/api';

import { Iconify } from 'src/components/iconify';
// ----------------------------------------------------------------------
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert,{ AlertColor } from '@mui/material/Alert';
import { decodeJwtToken } from 'src/utils/utilService';

interface LoginData {
  email: string;
  password: string;
}

export function SignInView() {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [open, setOpen] = useState(false);
  const [severityLevel, setSeverityLevel] = useState<AlertColor>('success');
  const [message, setMessage] = useState<string>('');

  useEffect(()=>{
    localStorage.clear();
  },[])

  const validateEmail = (emailInput: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailInput);
  };

  const validatePassword = (passwordInput: string) => {
    if (!passwordInput) {
      setPasswordError('Please enter a password');
      return false;
    }
    if (passwordInput.length <6) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSignIn = useCallback(async () => {
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!validatePassword(password)) {
      valid = false;
    }

    if (!valid) return;

    // Proceed with sign-in logic
    const data : LoginData = {
      email,
      password
    } 
    try {
      const response = await postApi('/v1/auth/login', data);
      if(response.status === 200 ) {
        const token = response.data.token;
        localStorage.setItem('token',token);
        
        const decodedToken = decodeJwtToken(token);
        localStorage.setItem('role',decodedToken.role);
        
      setSeverityLevel('success');
      setMessage('Logged in successfully');

        handleClick();
        window.location.href = 'http://localhost:3039/';

      }else{
      setSeverityLevel('error');
      setMessage(response.message);
      handleClick();
      }
    } catch (error) {
      setSeverityLevel('error');
      setMessage('Internal server error')
      handleClick();
      console.error('Login request failed:', error);
    }
    
  }, [email, password]);

  const renderForm = (
    <Box display="flex" flexDirection="column" alignItems="flex-end">
      <TextField
        fullWidth
        name="email"
        label="Email address"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (emailError) setEmailError('');
        }}
        error={!!emailError}
        helperText={emailError}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 ,cursor:'pointer'}} >
        Forgot password?
      </Link>

      <TextField
        fullWidth
        name="password"
        label="Password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (passwordError) setPasswordError('');
        }}
        error={!!passwordError}
        helperText={passwordError}
        type={showPassword ? 'text' : 'password'}
        InputLabelProps={{ shrink: true }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSignIn}
      >
        Sign in
      </LoadingButton>
    </Box>
  );

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 5 }}>
        <Typography variant="h5">Sign in</Typography>
        {/* <Typography variant="body2" color="text.secondary">
          Don’t have an account?
          <Link variant="subtitle2" sx={{ ml: 0.5 }}>
            Get started
          </Link>
        </Typography> */}
      </Box>

      {renderForm}

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}>
        <Typography
          variant="overline"
          sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
        >
          OR
        </Typography>
      </Divider>

      <Box gap={1} display="flex" justifyContent="center">
        <IconButton color="inherit">
          <Iconify icon="logos:google-icon" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="eva:github-fill" />
        </IconButton>
        <IconButton color="inherit">
          <Iconify icon="ri:twitter-x-fill" />
        </IconButton>
      </Box>
          <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} 
          anchorOrigin={{ vertical:'top', horizontal:'right' }}
          >
        <Alert
          onClose={handleClose}
          severity={severityLevel}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>

    </>
  );
}
