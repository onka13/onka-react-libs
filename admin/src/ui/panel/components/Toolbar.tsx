import React, { useEffect, useState } from 'react';
import { StaticService } from '../../../business/services/StaticService';
import { AppHelper } from '../../../business/helpers/AppHelper';
import { AccountBusinessLogic } from '../../../business/services/AccountBusinessLogic';
import { useHistory, useLocation } from 'react-router-dom';
import { LibService } from '../../../business/services/LibService';
import { PageConfig } from '../../../data/lib/PageConfig';
import { UIManager } from '../../../business/services/UIManager';
import { LocaleService } from '../../../business/services/LocaleService';

function LocaleList() {
  const currentLocale = LocaleService.instance().getCurrentLang();
  const handleListItemClick = (locale: string) => {
    UIManager.instance().dialog.close();
    LocaleService.instance().changeLang(locale);
    window.location.reload();
  };
  return (
    <div className="dialog-desc">
      <button className="btn" onClick={() => handleListItemClick('tr')}>
        <img src={process.env.PUBLIC_URL + '/images/flags/turkey.png'} className="mr10" />
        <span className={currentLocale == 'tr' ? 'selected' : ''}>Türkçe</span>
      </button>
      <button className="btn" onClick={() => handleListItemClick('en')}>
        <img src={process.env.PUBLIC_URL + '/images/flags/uk.png'} className="mr10" />
        <span className={currentLocale == 'en' ? 'selected' : ''}>English</span>
      </button>
    </div>
  );
}

export interface IToolbarProps {
  rightContent?: any;
  hideUserMenu?: boolean;
  userMenuItems?: any;
  logoLight?: string;
  logoDark?: string;
}

export function Toolbar(props: IToolbarProps) {
  let history = useHistory();
  let location = useLocation();
  const [pageConfig, setPageConfig] = useState<PageConfig>();
  async function handleSignout(e: any) {
    e.preventDefault();
    await AccountBusinessLogic.instance().logout();
    history.push('/login');
  }
  function changeLang(e: any) {
    e.preventDefault();
    UIManager.instance().dialog.open(
      {
        content: <LocaleList />,
        title: 'Change Language',
      },
      (response) => {
        console.log('response', response);
      },
      {
        hasBackdrop: true,
        closable: true,
        small: true,
        wrapContent: true,
        expandableContent: true,
      }
    );
  }
  useEffect(() => {
    LibService.instance().selectedPage.subscribe((pageConfig) => {
      setPageConfig(pageConfig);
    });
  }, [location]);
  return (
    <div className="nk-header nk-header-fixed is-light">
      <div className="container-fluid">
        <div className="nk-header-wrap">
          <div className="nk-menu-trigger d-xl-none ml-n1">
            <a href="#" className="nk-nav-toggle nk-quick-nav-icon" data-target="sidebarMenu">
              <em className="icon ni ni-menu"></em>
            </a>
          </div>
          <div className="nk-header-brand d-xl-none">
            <a href="/panel" className="logo-link">
              {props.logoLight && <img className="logo-light logo-img" src={props.logoLight} alt="logo" />}
              {props.logoDark && <img className="logo-dark logo-img" src={props.logoDark} alt="logo-dark" />}
            </a>
          </div>
          <div className="nk-header-news d-none d-xl-block">
            {pageConfig && (
              <button className="btn" onClick={(e) => UIManager.instance().gotoPage(history, 'list', pageConfig)}>
                {LibService.instance().getRouteLabel(pageConfig)}
              </button>
            )}
          </div>
          <div className="nk-header-tools d-flex">
            <button className="btn" onClick={(e) => LibService.instance().refreshPage.next()}>
              <em className="icon ni ni-reload"></em>
            </button>
            <ul className="nk-quick-nav">
              <li className="dropdown user-dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                  <div className="user-toggle">
                    <div className="user-avatar sm">
                      <em className="icon ni ni-user-alt"></em>
                    </div>
                    <div className="user-info d-none d-md-block">
                      {/* <div className="user-status">User</div> */}
                      <div className="user-name dropdown-indicator">{StaticService.instance().getUserName()}</div>
                    </div>
                  </div>
                </a>
                {!props.hideUserMenu && (
                  <div className="dropdown-menu dropdown-menu-md dropdown-menu-right dropdown-menu-s1">
                    <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
                      <div className="user-card">
                        <div className="user-avatar">
                          <span>{AppHelper.getFirstLetters(StaticService.instance().getUserName())}</span>
                        </div>
                        <div className="user-info">
                          <span className="lead-text">{StaticService.instance().getUserName()}</span>
                          <span className="sub-text">{StaticService.instance().getUserEmail()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="dropdown-inner">
                      <ul className="link-list">
                        <li>
                          <a href="#" onClick={changeLang}>
                            <em className="icon ni ni-globe"></em>
                            <span>Change Language</span>
                          </a>
                        </li>
                        {props.userMenuItems}
                      </ul>
                    </div>
                    <div className="dropdown-inner">
                      <ul className="link-list">
                        <li>
                          <a href="#" onClick={handleSignout}>
                            <em className="icon ni ni-signout"></em>
                            <span>Sign out</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            </ul>
            {props.rightContent}
          </div>
        </div>
      </div>
    </div>
  );
}
