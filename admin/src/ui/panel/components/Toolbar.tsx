import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { StaticService } from '../../../business/services/StaticService';
import { AccountBusinessLogic } from '../../../business/services/AccountBusinessLogic';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LibService } from '../../../business/services/LibService';
import { PageConfig } from '../../../data/lib/PageConfig';
import { UIManager } from '../../../business/services/UIManager';
import { LocaleService } from '../../../business/services/LocaleService';
import { AppBar, Button, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Theme, Toolbar as MuiToolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LanguageIcon from '@mui/icons-material/Language';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Refresh } from '@mui/icons-material';
import { ConfigService } from '../../../business/services/ConfigService';
import { makeStyles } from '../../../business/components/makesStyles';

const drawerWidth = 240;

const useStyles = makeStyles()((theme) => ({
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
  // TODO: drawerHeader
  // drawerHeader: {
  //   display: 'flex',
  //   alignItems: 'center',
  //   padding: theme.spacing(0, 1),
  //   // necessary for content to be below app bar
  //   ...theme.mixins.toolbar,
  //   justifyContent: 'flex-end',
  // },
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
}));

function LocaleList() {
  const currentLocale = LocaleService.instance().getCurrentLang();
  const handleListItemClick = (locale: string) => {
    UIManager.instance().dialog.close();
    LocaleService.instance().changeLang(locale);
    window.location.reload();
  };
  var langs = Object.keys(ConfigService.instance().getLangList());
  return (
    <div className="dialog-desc">
      {langs.map((item, index) => {
        return (
          <Button key={index} onClick={() => handleListItemClick(item)} color={currentLocale == item ? 'secondary' : undefined} fullWidth>
            <img src={process.env.PUBLIC_URL + '/images/flags/' + item + '.png'} className="mr10" />
            <span>{item}</span>
          </Button>
        );
      })}
    </div>
  );
}

export interface IToolbarProps {
  rightContent?: any;
  hideUserMenu?: boolean;
  userMenuItems?: any;
}

export function Toolbar(props: IToolbarProps) {
  const { classes, cx } = useStyles();
  const navigate = useNavigate();
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
    LibService.instance().refreshPage.next(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  async function handleSignout(e: any) {
    e.preventDefault();
    await AccountBusinessLogic.instance().logout();
    navigate('/login');
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
          <Link to={UIManager.instance().getLink('list', pageConfig, { preserveQueryParams: false })} className={classes.grow} style={{ color: 'inherit' }}>
            <Typography variant="h6" color="inherit">
              {LibService.instance().getRouteLabel(pageConfig)}
            </Typography>
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
