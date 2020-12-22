import React, { useEffect, useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { DialogComponent } from '../business/components/DialogComponent';
import { SnackBarComponent } from '../business/components/SnackBarComponent';
import { ErrorHandler } from '../business/ErrorBoundary';
import { AccountBusinessLogic } from '../business/services/AccountBusinessLogic';
import { LocaleService } from '../business/services/LocaleService';
import { UIManager } from '../business/services/UIManager';
import { IMenuProp } from './panel/components/MenuComponent';
import { PrivateRoute } from './panel/components/PrivateRoute';
import { IToolbarProps } from './panel/components/Toolbar';
import { Home } from './panel/pages/Home';
import { ILoginProps, Login } from './public/Login';
import { NoMatch } from './public/NoMatch';
import { StylesProvider, createGenerateClassName } from '@material-ui/styles';

export interface IAdminProps {
  children?: React.ReactNode;
  rootRoutes?: any[];
  onLoad?: () => Promise<any>;
  dashboard?: JSX.Element;
  noMatch?: JSX.Element;
  loginComponent?: (props: ILoginProps) => JSX.Element;
  footer?: any;
  menu: IMenuProp;
  toolbar: IToolbarProps;
  login?: ILoginProps;
}

const generateClassName = createGenerateClassName({
  productionPrefix: 'c',
  disableGlobal: true,
});

export function Admin(props: IAdminProps) {
  const [done, setDone] = useState(false);
  var business = AccountBusinessLogic.instance();
  async function preload() {
    if (props.onLoad) await props.onLoad();
    await LocaleService.instance().loadDefaultLang();
    setDone(true);
  }
  useEffect(() => {    
    preload();
  }, []);
  if (!done) return <div></div>;
  return (
    <StylesProvider generateClassName={generateClassName}>
      <BrowserRouter>
        <ErrorHandler />
        <DialogComponent onRef={(c) => (UIManager.instance().dialog = c)} mode="dialog" />
        <DialogComponent onRef={(c) => (UIManager.instance().drawer = c)} mode="drawer" />
        <SnackBarComponent onRef={(c) => (UIManager.instance().snackbar = c)} />
        {props.children}
        <Switch>
          <Route exact path="/">
            {business.isLoggedIn() ? <Redirect to="/panel" /> : <Redirect to="/login" />}
          </Route>
          <PrivateRoute path="/panel">
            <Home {...props} />
          </PrivateRoute>
          {props.rootRoutes}
          <Route path="/login">{props.loginComponent ? <props.loginComponent {...props.login} /> : <Login {...props.login} />}</Route>
          <Route path="*">{props.noMatch ? props.noMatch : <NoMatch />}</Route>
        </Switch>
      </BrowserRouter>
    </StylesProvider>
  );
}
