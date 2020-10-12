import { Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React, { FunctionComponent } from 'react';
import { PageType, Parameters, ThemeType } from '../../data/lib/Types';

/**
 * Dialog action data
 */
export interface DialogDataAction {
  value: any;
  label: string;
  theme?: ThemeType;
}

/**
 * Dialog data
 */
export interface DialogData {
  url?: string;
  content?: string | JSX.Element;
  dialogId?: number;
  addSelectField?: boolean;
  hideActions?: boolean;
  hideFilters?: boolean;
  hideDefaultFilters?: boolean;
  defaultValues?: Parameters;
  redirect?: PageType;
  title?: string;
  toolbar?: boolean;
  actions?: DialogDataAction[];
  width?: string;
  height?: string;
}

export interface DialogOptions {
  fullScreen?: boolean;
  small?: boolean;
  medium?: boolean;
  hasBackdrop?: boolean;
  closable?: boolean;
  alignItems?: any;
  justifyContent?: any;
  wrapContent?: boolean;
  expandableContent?: boolean;
}

interface DialogComponentProps {
  onRef: (c: DialogComponent) => {};
  mode: 'dialog' | 'drawer';
}

/**
 * Onka dialog component
 */
export class DialogComponent extends React.Component<DialogComponentProps, { show: boolean }> {
  /**
   * Url to display in iframe
   */
  url!: string;
  data!: DialogData;
  state = {
    show: false,
  };
  afterClosed?: (result?: any) => void;
  options: DialogOptions = {};

  constructor(props: DialogComponentProps) {
    super(props);
    props.onRef && props.onRef(this);
  }

  /**
   * Prepare data
   */
  init() {
    if (this.data.url) {
      if (!this.data.dialogId) this.data.dialogId = new Date().getTime();
      var baseUrl = this.data.url + '?dialog=1&dialogId=' + this.data.dialogId;
      if (this.data.addSelectField) baseUrl += '&selectField=1';
      if (this.data.hideActions) baseUrl += '&hideActions=1';
      if (this.data.hideFilters) baseUrl += '&hideFilters=1';
      if (this.data.hideDefaultFilters) baseUrl += '&hideDefaultFilters=1';
      if (this.data.toolbar) baseUrl += '&toolbar=1';
      if (this.data.redirect) baseUrl += '&redirect=' + this.data.redirect;
      if (this.data.defaultValues) baseUrl += '&defaultValues=' + JSON.stringify(this.data.defaultValues);
      if (this.data.title) baseUrl += '&title=' + this.data.title;
      this.url = baseUrl; // bypassSecurityTrustResourceUrl
    }
    // @ts-ignore
    window['iframeCallback' + this.data.dialogId] = (record) => {
      this.close(record);
    };
  }

  close(action?: DialogDataAction | any) {
    this.setState({ show: false });
    this.data = {};
    this.options = {};
    this.url = '';
    this.afterClosed && this.afterClosed(action);
  }

  open(config: DialogData, afterClosed?: (result?: any) => void, options?: DialogOptions) {
    if (!options)
      options = {
        hasBackdrop: true,
      };
    if (options.fullScreen) {
      config.width = '100vw';
      config.height = '100vh';
    } else if (options.medium) {
      config.width = '30vw';
      config.height = '40vh';
    } else if (options.small) {
      config.width = '20vw';
      config.height = '20vh';
    }
    if (!config.width) config.width = '95vw';
    if (!config.height) config.height = '90vh';
    this.data = config;
    this.afterClosed = afterClosed;
    this.options = options || {};
    this.init();

    this.setState({ show: true });
  }

  _inner() {
    var contentIsComp = typeof this.data.content == 'object';
    if (contentIsComp) {
      if (this.options.wrapContent) {
        return (
          <div className="dialog-content">
            {this.options.closable && (
              <a className="close" onClick={(e) => this.close()}>
                <CloseIcon />
              </a>
            )}
            {this.data.content}
          </div>
        );
      }
      return this.data.content;
    }
    return (
      <div className="dialog-content">
        {this.options.closable && (
          <a className="close" onClick={(e) => this.close()}>
            <CloseIcon />
          </a>
        )}
        {this.data.title && <h1 className="dialog-title">{this.data.title}</h1>}
        {this.data.content && <div className="dialog-desc">{this.data.content}</div>}
        {this.data.actions && (
          <div className="dialog-actions">
            {this.data.actions.map((action, i) => {
              return (
                <Button key={i} onClick={(e) => this.close(action)} color={action.theme} variant="outlined">
                  <span className="pl10 pr10">{action.label}</span>
                </Button>
              );
            })}
          </div>
        )}
        {this.url && <iframe style={{ overflow: 'hidden', height: '100%', width: '100%' }} height="100%" width="100%" frameBorder={0} src={this.url}></iframe>}
      </div>
    );
  }

  render() {
    if (!this.state.show) return null;
    return (
      <>
        {this.options.hasBackdrop && <div className={'overlay'} onClick={(e) => this.options.closable && this.close()}></div>}
        <div
          className={'dialog fullscreen ' + (this.options.hasBackdrop ? 'overlay' : '')}
          style={{ alignItems: this.options.alignItems || 'center', justifyContent: this.options.justifyContent || 'center' }}
        >
          <div className="dialog-container" style={{ width: this.data.width, minHeight: this.data.height, height: (this.url || !this.options.expandableContent) ? this.data.height : 'unset' }}>
            {this._inner()}
          </div>
        </div>
      </>
    );
  }
}
