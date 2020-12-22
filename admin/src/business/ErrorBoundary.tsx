import React, { useEffect } from 'react';
import { ApiError } from '../data/models/ApiError';
import { LocaleService } from './services/LocaleService';
import { useHistory } from 'react-router-dom';
import { ConfigService } from './services/ConfigService';
import { UIManager } from './services/UIManager';
import { BaseBusinessLogicService } from './services/BaseBusinessLogic';
import { ServiceHttpStatusResult } from '../data/api/ServiceResult';

//@ts-ignore
window.removeEventListeners('unhandledrejection'); // defined in html

export function ErrorHandler() {
  const history = useHistory();

  function globalErrorHandler(e: any) {
    e.preventDefault();
    e.stopImmediatePropagation();
    UIManager.instance().displayLoading(false);
    if (e.reason instanceof ApiError) {
      let localeService = LocaleService.instance();
      let configService = ConfigService.instance();
      let error = e.reason as ApiError;
      console.log('err', error.detail);

      var localeKey = 'lib.api.code' + error.detail.code;
      var msg = localeService.translate(localeKey, localeKey);
      if (msg == localeKey) msg = error.detail.message || '';
      if (msg) {
        UIManager.instance().displayMessage({
          text: msg,
          type: 'info',
        });
      }
      if (error.detail.status == 400) {
        if (error.detail.code == 100 || error.detail.code == 101) {
          history.push('/login');
        }
        return;
      }
      if (error.detail.status < 200 || error.detail.status >= 300) {
        if (configService.isProd()) {
          UIManager.instance().displayMessage({
            text: localeService.translate('lib.error'),
            type: 'danger',
          });
        } else {
          UIManager.instance().displayMessage({
            text: error.detail.message + '\n\n' + error.detail.statusText,
            type: 'danger',
          });
        }
      }
    }
  }

  function apiResponse(result: ServiceHttpStatusResult<any>) {
    var localeKey = 'lib.api.code' + result.code;
    var msg = LocaleService.instance().translate(localeKey);
    if (msg == localeKey) msg = result.message || '';
    if (msg) {
      UIManager.instance().displayMessage({
        text: msg,
        type: 'info',
      });
    }
  }

  useEffect(() => {
    window.addEventListener('unhandledrejection', function (e) {
      console.log('unhandledrejection listener');
      globalErrorHandler(e);
    });
    window.addEventListener('error', function (e) {
      console.log('error listener');
      globalErrorHandler(e);
    });
    BaseBusinessLogicService.instance().apiResponse.subscribe(apiResponse);
  }, []);
  return <div></div>;
}

export class ErrorBoundary extends React.Component<{}, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    console.log('error', error, info);
    //TODO: log msg
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
