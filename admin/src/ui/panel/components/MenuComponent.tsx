import React, { useEffect, useState } from 'react';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { List, ListItem, Collapse, ListItemText, ListItemIcon, makeStyles, createStyles, Theme } from '@material-ui/core';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import DashboardIcon from '@material-ui/icons/Dashboard';
import { Menu } from '../../../data/lib/Menu';
import { LibService } from '../../../business/services/LibService';
import { RouteItem } from '../../../data/lib/RouteItem';
import { LocaleService } from '../../../business/services/LocaleService';

export interface IMenuProp {
  menus: Menu[];
  routes: RouteItem[][];
  headerMenu?: any;
  footerMenu?: any;
  hideDashBoard?: boolean;
  logo?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  })
);

export function MenuComponent(props: IMenuProp) {
  const classes = useStyles();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<String>();

  useEffect(() => {
    var clonedMenus = props.menus.filter((x) => true);
    // init menus with permission
    clonedMenus.forEach((menuItem) => {
      menuItem.routes = [];
      props.routes.forEach((routes) => {
        routes.forEach((route) => {
          if (route.config.hideMenu) return;
          if (route.config.menu == menuItem.menuKey) {
            if (!LibService.instance().hasAccess(route.config.moduleKey, route.config.pageKey, 'list')) return;
            menuItem.routes.push(route);
            menuItem.hasAccess = true;
          }
        });
      });
    });
    setMenus(clonedMenus);
  }, []);

  return (
    <div>
      {props.logo && (
        <div className="logo">
          <img src={props.logo} alt="logo" />
        </div>
      )}
      <List component="nav" aria-labelledby="nested-list-subheader" className={classes.root}>
        {props.headerMenu}
        {!props.hideDashBoard && (
          <ListItem button component={Link} to={'/panel'}>
            <ListItemIcon>
              <DashboardIcon color="inherit" />
            </ListItemIcon>
            <ListItemText primary={LocaleService.instance().translate('menu.dashboard', 'Dashboard')} />
            <ExpandLess style={{ visibility: 'hidden' }} />
          </ListItem>
        )}
        {menus.map((menu, i) => {
          if (!menu.hasAccess) return null;
          var isSelected = selectedMenu == menu.menuKey;
          return (
            <div key={'menu' + i}>
              <ListItem button onClick={() => setSelectedMenu(isSelected ? '' : menu.menuKey)}>
                <ListItemIcon>{menu.icon}</ListItemIcon>
                <ListItemText primary={LocaleService.instance().translate('menu.' + menu.menuKey)} />
                {isSelected ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={isSelected} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {menu.routes.map((route, j) => {
                    return (
                      <ListItem
                        button
                        key={'submenu' + i + j}
                        className={classes.nested}
                        component={Link}
                        to={'/panel' + route.config.route}
                        //selected={route.config.route}
                      >
                        <ListItemIcon></ListItemIcon>
                        <ListItemText primary={LibService.instance().getRouteLabel(route.config)} />
                      </ListItem>
                    );
                  })}
                </List>
              </Collapse>
            </div>
          );
        })}
        {props.footerMenu}
      </List>
    </div>
  );
}
