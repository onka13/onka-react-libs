import React from 'react';
import { UIManager } from '../../../business/services/UIManager';
import { IAdminProps } from '../../Admin';
import { IMenuProp, MenuComponent } from './MenuComponent';
import { IToolbarProps, Toolbar } from './Toolbar';

export interface IMasterProps {
  children?: any;
  menu: IMenuProp;
  toolbar: IToolbarProps;
  footer?: any;
}

export function Master(props: IMasterProps) {
  if (UIManager.instance().isDialog()) {
    return props.children;
  }
  return (
    <div className="nk-app-root">
      <div className="nk-main ">
        <MenuComponent {...props.menu} />
        <div className="nk-wrap ">
          <Toolbar {...props.toolbar} />
          <div className="nk-content ">
            <div className="container-fluid">
              <div className="nk-content-inner">
                <div className="nk-content-body">{props.children}</div>
              </div>
            </div>
          </div>
          {props.footer}
        </div>
      </div>
    </div>
  );
}
