import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AccountBusinessLogic } from '../../business/services/AccountBusinessLogic';
import { UIManager } from '../../business/services/UIManager';
import { LibService } from '../../business/services/LibService';

export interface ILoginProps {
  footer?: any;
  logo?: string;
}

export function Login(props: ILoginProps) {
  const navigate = useNavigate();
  const [values, setValues] = React.useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (prop: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  async function handleSubmit(e: any) {
    e.preventDefault();
    UIManager.instance().displayLoading(true);
    AccountBusinessLogic.instance()
      .login(values.email, values.password)
      .then(() => {
        navigate('/panel');
      })
      .finally(() => {
        UIManager.instance().displayLoading(false);
      });
  }
  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column">
        {props.logo && (
          <div className="logo">
            <img src={props.logo} alt="logo" />
          </div>
        )}
        <Card style={{ width: '35%' }}>
          <CardContent className="p40">
            <Typography variant="h6">Sign-In</Typography>
            <Typography variant="subtitle2">Access the panel using your email and passcode</Typography>
            <div className="m10"> </div>
            <form onSubmit={handleSubmit}>
              <TextField
                id={'email'}
                label={LibService.instance().translate('login.email', 'Email')}
                onChange={handleChange('email')}
                placeholder={LibService.instance().translate('login.emailPlaceHolder', 'Enter your email address')}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                type="email"
                required
              />
              <TextField
                id={'password'}
                label={LibService.instance().translate('login.password', 'Password')}
                onChange={handleChange('password')}
                placeholder={LibService.instance().translate('login.passwordPlaceHolder', 'Enter your password')}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword}>
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                required
              />
              <Button variant="contained" color="primary" type="submit" fullWidth className="mt20" size="large">
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="m50"> </div>
      </Box>
      <div style={{ position: 'fixed', bottom: 0, width: '100%' }}>{props.footer}</div>
    </>
  );
}