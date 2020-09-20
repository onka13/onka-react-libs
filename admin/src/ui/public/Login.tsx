import React, { useState } from 'react';
import { AccountBusinessLogic } from '../../business/services/AccountBusinessLogic';
import { useHistory } from 'react-router-dom';
import { UIManager } from '../../business/services/UIManager';

export interface ILoginProps {
  footer?: any;
  logoLight?: string;
  logoDark?: string;
}

export function Login(props: ILoginProps) {
  let history = useHistory();
  const [email, setEmail] = useState('');
  function handleChangeEmail(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }
  const [pass, setPass] = useState('');
  function handleChangePass(e: React.ChangeEvent<HTMLInputElement>) {
    setPass(e.target.value);
  }
  async function handleSubmit(e: any) {
    e.preventDefault();
    UIManager.instance().displayLoading(true);
    AccountBusinessLogic.instance()
      .login(email, pass)
      .then(() => {
        history.push('/panel');
      })
      .finally(() => {
        UIManager.instance().displayLoading(false);
      });
  }
  return (
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
  );
}
