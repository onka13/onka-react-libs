import React, { useEffect, useState } from 'react';
import { DialogComponent } from '../business/components/DialogComponent';
import { SnackBarComponent } from '../business/components/SnackBarComponent';
import { ErrorHandler } from '../business/ErrorBoundary';
import { LocaleService } from '../business/services/LocaleService';
import { UIManager } from '../business/services/UIManager';
import { StylesProvider, createGenerateClassName } from '@material-ui/styles';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import { MuiThemeProvider } from '@material-ui/core/styles';

export interface IWebProps {
  children?: React.ReactNode;
  onLoad?: () => Promise<any>;
  theme?: Partial<Theme> | ((outerTheme: Theme) => Theme);
}

const generateClassName = createGenerateClassName({
  productionPrefix: 'c',
  disableGlobal: true,
});

export function Web(props: IWebProps) {
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
    if (props.theme) return <MuiThemeProvider theme={props.theme}>{child}</MuiThemeProvider>;
    return child;
  };
  return wrapper(
    <StylesProvider generateClassName={generateClassName}>
      <ErrorHandler />
      <DialogComponent onRef={(c) => (UIManager.instance().dialog = c)} mode="dialog" />
      <DialogComponent onRef={(c) => (UIManager.instance().drawer = c)} mode="drawer" />
      <SnackBarComponent onRef={(c) => (UIManager.instance().snackbar = c)} />
      {props.children}
    </StylesProvider>
  );
}
