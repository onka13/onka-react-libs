import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { StaticService } from '../../../business/services/StaticService';
import { AccountBusinessLogic } from '../../../business/services/AccountBusinessLogic';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { LibService } from '../../../business/services/LibService';
import { PageConfig } from '../../../data/lib/PageConfig';
import { UIManager } from '../../../business/services/UIManager';
import { LocaleService } from '../../../business/services/LocaleService';
import {
  AppBar,
  createStyles,
  IconButton,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  Theme,
  Toolbar as MuiToolbar,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import LanguageIcon from '@material-ui/icons/Language';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Refresh } from '@material-ui/icons';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    grow: {
      flexGrow: 1,
    },
    sectionDesktop: {
      display: 'flex',
    },
  })
);

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
}

export function Toolbar(props: IToolbarProps) {
  const classes = useStyles();
  let history = useHistory();
  let location = useLocation();
  const [pageConfig, setPageConfig] = useState<PageConfig>();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [open, setOpen] = React.useState(LibService.instance().drawerState.value);

  const handleDrawerToggle = (e: any) => {
    var drawerState = !open;
    setOpen(drawerState);
    LibService.instance().drawerState.next(drawerState);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRefreshPage = (event: any) => {
    LibService.instance().refreshPage.next();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
      })}
    >
      <MuiToolbar>
        <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerToggle} edge="start" className={clsx(classes.menuButton)}>
          <MenuIcon />
        </IconButton>
        {pageConfig && (
          <Link to={UIManager.instance().getLink('list', pageConfig)} className={classes.grow}>
            <Typography variant="h6">{LibService.instance().getRouteLabel(pageConfig)}</Typography>
          </Link>
        )}
        <div className={classes.sectionDesktop}>
          <IconButton edge="end" onClick={handleRefreshPage} color="inherit">
            <Refresh />
          </IconButton>
          {!props.hideUserMenu && (
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={'primary-account-menu'}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          )}
          {props.rightContent}
        </div>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          id={'primary-account-menu'}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          {props.userMenuItems}
          <MenuItem>
            <ListItemIcon>
              <AccountCircle fontSize="small" />
            </ListItemIcon>
            <ListItemText>{StaticService.instance().getUserName()}</ListItemText>
          </MenuItem>
          <MenuItem onClick={changeLang}>
            <ListItemIcon>
              <LanguageIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Change Language</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleSignout}>
            <ListItemIcon>
              <ExitToAppIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Sign Out</ListItemText>
          </MenuItem>
        </Menu>
      </MuiToolbar>
    </AppBar>
  );
}
