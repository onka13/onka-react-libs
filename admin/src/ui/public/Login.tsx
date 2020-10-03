import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Card, CardContent, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { AccountBusinessLogic } from '../../business/services/AccountBusinessLogic';
import { UIManager } from '../../business/services/UIManager';
import { LibService } from '../../business/services/LibService';

export interface ILoginProps {
  footer?: any;
  logo?: string;
}

export function Login(props: ILoginProps) {
  let history = useHistory();
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
        history.push('/panel');
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
/*
<div className="nk-app-root">
      <div className="nk-main ">
        <div className="nk-wrap nk-wrap-nosidebar">
          <div className="nk-content ">
            <div className="nk-block nk-block-middle nk-auth-body  wide-xs">
              <div className="brand-logo pb-4 text-center">
                <a href="#" className="logo-link">
                  {props.logoLight && <img className="logo-light logo-img" src={props.logoLight} alt="logo" />}
                  {props.logoDark && <img className="logo-dark logo-img" src={props.logoDark} alt="logo-dark" />}
                </a>
              </div>
              <div className="card card-bordered">
                <div className="card-inner card-inner-lg">
                  <div className="nk-block-head">
                    <div className="nk-block-head-content">
                      <h4 className="nk-block-title">Sign-In</h4>
                      <div className="nk-block-des">
                        <p>Access the panel using your email and passcode.</p>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <div className="form-label-group">
                        <label className="form-label" htmlFor="default-01">
                          Email
                        </label>
                      </div>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="default-01"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={handleChangeEmail}
                      />
                    </div>
                    <div className="form-group">
                      <div className="form-label-group">
                        <label className="form-label" htmlFor="password">
                          Passcode
                        </label>
                        <a className="link link-primary link-sm" href="#">
                          Forgot Code?
                        </a>
                      </div>
                      <div className="form-control-wrap">
                        <a href="#" className="form-icon form-icon-right passcode-switch" data-target="password">
                          <em className="passcode-icon icon-show icon ni ni-eye"></em>
                          <em className="passcode-icon icon-hide icon ni ni-eye-off"></em>
                        </a>
                        <input
                          type="password"
                          className="form-control form-control-lg"
                          id="password"
                          placeholder="Enter your passcode"
                          value={pass}
                          onChange={handleChangePass}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <button className="btn btn-lg btn-primary btn-block" type="submit">
                        Sign in
                      </button>
                    </div>
                  </form>
                  <div className="form-note-s2 text-center pt-4">
                    {' '}
                    New on our platform? <a href="#">Create an account</a>
                  </div>
                  <div className="text-center pt-4 pb-3">
                    <h6 className="overline-title overline-title-sap">
                      <span>OR</span>
                    </h6>
                  </div>
                  <ul className="nav justify-center gx-4">
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        Facebook
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="#">
                        Google
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {props.footer}
          </div>
        </div>
      </div>
    </div>
*/
