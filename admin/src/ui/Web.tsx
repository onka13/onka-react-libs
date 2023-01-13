import React, { useEffect, useState } from 'react';
import { DialogComponent } from '../business/components/DialogComponent';
import { SnackBarComponent } from '../business/components/SnackBarComponent';
import { ErrorHandler } from '../business/ErrorBoundary';
import { LocaleService } from '../business/services/LocaleService';
import { UIManager } from '../business/services/UIManager';
import { Theme } from '@mui/material/styles/createTheme';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
//import createGenerateClassName from '@mui/styles/createGenerateClassName/createGenerateClassName';
//import StylesProvider from '@mui/styles/StylesProvider/StylesProvider';

export interface IWebProps {
  children?: React.ReactNode;
  onLoad?: () => Promise<any>;
  theme?: Partial<Theme> | ((outerTheme: Theme) => Theme);
}

// const generateClassName = createGenerateClassName({
//   productionPrefix: 'c',
//   disableGlobal: true,
// });

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
    if (props.theme) return <ThemeProvider theme={props.theme}>{child}</ThemeProvider>;
    return child;
  };
  return wrapper(
    // <StylesProvider generateClassName={generateClassName}>
    <>
      <ErrorHandler />
      <DialogComponent onRef={(c) => (UIManager.instance().dialog = c)} mode="dialog" />
      <DialogComponent onRef={(c) => (UIManager.instance().drawer = c)} mode="drawer" />
      <SnackBarComponent onRef={(c) => (UIManager.instance().snackbar = c)} />
      {props.children}
    </>
    // </StylesProvider>
  );
}
