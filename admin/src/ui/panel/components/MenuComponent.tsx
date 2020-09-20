import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu } from '../../../data/lib/Menu';
import { LocaleService } from '../../../business/services/LocaleService';
import { LibService } from '../../../business/services/LibService';
import { RouteItem } from '../../../data/lib/RouteItem';

export interface IMenuProp {
  menus: Menu[];
  routes: RouteItem[][];
  headerMenu?: any;
  footerMenu?: any;
  hideDashBoard?: boolean;
  logoLight?: string;
  logoDark?: string;
}

export function MenuComponent(props: IMenuProp) {
  const [menus, setMenus] = useState<Menu[]>([]);
  useEffect(() => {
    var clonedMenus = [...props.menus];
    // init menus with permission
    clonedMenus.forEach((menuItem) => {
      props.routes.forEach((routes) => {
        routes.forEach((route) => {
          if (route.config.hideMenu) return;
          if (route.config.menu == menuItem.menuKey) {
            if (!LibService.instance().hasAccess(route.config.moduleKey, route.config.pageKey, 'list')) return;
            menuItem.routes.push(route);
            // TODO: check permission
            menuItem.hasAccess = true;
          }
        });
      });
    });
    setMenus(clonedMenus);
    setTimeout(() => {
      // @ts-ignore
      window['NioApp'].init();
    }, 1000);
  }, []);
  return (
    <div className="nk-sidebar nk-sidebar-fixed is-dark " data-content="sidebarMenu">
      <div className="nk-sidebar-element nk-sidebar-head">
        <div className="nk-sidebar-brand">
          <Link to="/panel" className="logo-link nk-sidebar-logo">
            {props.logoLight && <img className="logo-light logo-img" src={props.logoLight} alt="logo" />}
            {props.logoDark && <img className="logo-dark logo-img" src={props.logoDark} alt="logo-dark" />}
          </Link>
        </div>
        <div className="nk-menu-trigger mr-n2">
          <a href="#" className="nk-nav-toggle nk-quick-nav-icon d-xl-none" data-target="sidebarMenu">
            <em className="icon ni ni-arrow-left"></em>
          </a>
        </div>
      </div>
      <div className="nk-sidebar-element">
        <div className="nk-sidebar-content">
          <div className="nk-sidebar-menu" data-simplebar>
            <ul className="nk-menu">
              {props.headerMenu}
              {!props.hideDashBoard && (
                <li className="nk-menu-item">
                  <NavLink exact strict to="/panel" className="nk-menu-link">
                    <span className="nk-menu-icon">
                      <em className="icon ni ni-dashlite"></em>
                    </span>
                    <span className="nk-menu-text">Dashboard</span>
                  </NavLink>
                </li>
              )}
              {menus.map((menu, i) => {
                if (!menu.hasAccess) return null;
                return (
                  <li key={i} className="nk-menu-item has-sub">
                    <a href="#" className="nk-menu-link nk-menu-toggle">
                      <span className="nk-menu-icon">
                        <em className={'icon ni ' + (menu.icon ?? 'ni-files')}></em>
                      </span>
                      <span className="nk-menu-text">{LocaleService.instance().translate('menu.' + menu.menuKey)}</span>
                    </a>
                    <ul className="nk-menu-sub">
                      {menu.routes.map((route, j) => {
                        return (
                          <li key={j} className="nk-menu-item">
                            <Link to={'/panel' + route.config.route} className="nk-menu-link">
                              <span className="nk-menu-text">{LibService.instance().getRouteLabel(route.config)}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              })}
              {props.footerMenu}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
