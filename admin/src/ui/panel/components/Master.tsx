import React, { useEffect } from 'react';
import clsx from 'clsx';
import { Theme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import { UIManager } from '../../../business/services/UIManager';
import { IMenuProp, MenuComponent } from './MenuComponent';
import { IToolbarProps, Toolbar } from './Toolbar';
import { LibService } from '../../../business/services/LibService';
import { makeStyles } from '../../../business/components/makesStyles';
import { merge } from 'lodash'

export interface IMasterProps {
  children?: any;
  menu: IMenuProp;
  toolbar: IToolbarProps;
  footer?: any;
}

const drawerWidth = 240;

const useStyles = makeStyles()((theme: Theme) =>
  ({
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
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      minHeight: theme.mixins.toolbar.minHeight,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      //overflow: 'hidden',
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  })
);

export function Master(props: IMasterProps) {
  if (UIManager.instance().isDialog()) {
    return props.children;
  }
  const { classes, cx } = useStyles();
  const [open, setOpen] = React.useState(LibService.instance().drawerState.value);

  useEffect(() => {
    LibService.instance().drawerState.subscribe((value) => {
      setOpen(value);
    });
  }, []);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Toolbar {...props.toolbar} />
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <MenuComponent {...props.menu} />
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        {props.children}
      </main>
    </div>
  );
}
