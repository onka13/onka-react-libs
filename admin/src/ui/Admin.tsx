import React, { useEffect, useState } from 'react';
import { BrowserRouter, HashRouter, Navigate, Route, Routes } from 'react-router-dom';
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
import { Theme } from '@mui/material/styles/createTheme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import createGenerateClassName from '@mui/styles/createGenerateClassName/createGenerateClassName';
import StylesProvider from '@mui/styles/StylesProvider/StylesProvider';

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
  theme?: Partial<Theme> | ((outerTheme: Theme) => Theme);
}

const generateClassName = createGenerateClassName({
  productionPrefix: 'c',
  disableGlobal: true,
});

export function Admin(props: IAdminProps) {
  const [done, setDone] = useState(false);
  async function preload() {
    if (props.onLoad) await props.onLoad();
    await LocaleService.instance().loadDefaultLang();
    setDone(true);
  }
  useEffect(() => {
    preload();
  }, []);
  if (!done) return <div></div>;
  const wrapper = (child: any) => {
    if (props.theme) return <ThemeProvider theme={props.theme}>{child}</ThemeProvider>;
    return child;
  };
  return wrapper(
    <StylesProvider generateClassName={generateClassName}>
      <HashRouter>
        <ErrorHandler />
        <DialogComponent onRef={(c) => (UIManager.instance().dialog = c)} mode="dialog" />
        <DialogComponent onRef={(c) => (UIManager.instance().drawer = c)} mode="drawer" />
        <SnackBarComponent onRef={(c) => (UIManager.instance().snackbar = c)} />
        {props.children}
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Navigate to="/panel" />
              </PrivateRoute>
            }
          ></Route>
          <Route path="/panel/*" element={<Home {...props} />}></Route>
          {/* TODO */}
          {/* {props.rootRoutes} */}
          <Route path="/login" element={props.loginComponent ? <props.loginComponent {...props.login} /> : <Login {...props.login} />}></Route>
          <Route path="*" element={props.noMatch ? props.noMatch : <NoMatch />}></Route>
        </Routes>
      </HashRouter>
    </StylesProvider>
  );
}
