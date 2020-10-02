import React from 'react';
import MuiAlert, { Color } from '@material-ui/lab/Alert';
import { IconButton } from '@material-ui/core';
import RemoveIcon from "@material-ui/icons/Clear";
//import MuiSnackbar from '@material-ui/core/Snackbar';

interface SnackBarComponentProps {
  onRef: (c: SnackBarComponent) => {};
}

export interface Snackbar {
  type: 'danger' | 'success' | 'info' | 'warning';
  /**
   * In sec.
   */
  duration?: number;
  text: string;
  id?: string;
}

export class SnackBarComponent extends React.Component<SnackBarComponentProps> {
  state: { snackbars: { [x: string]: Snackbar } } = {
    snackbars: {},
  };
  constructor(props: SnackBarComponentProps) {
    super(props);
    props.onRef && props.onRef(this);
  }
  _randomId(): string {
    return new Date().getTime() + '';
  }
  add(snackbar: Snackbar): string {
    var id = snackbar.id || this._randomId();
    if (!snackbar.type) snackbar.type = 'info';
    if (!snackbar.duration && snackbar.duration != 0) snackbar.duration = 5;
    this.state.snackbars[id] = snackbar;
    this.setState({ snackbars: this.state.snackbars });

    if (snackbar.type != 'danger' && snackbar.duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, snackbar.duration * 1000);
    }
    return id;
  }
  remove(id: string) {
    delete this.state.snackbars[id];
    this.setState({ snackbars: this.state.snackbars });
  }
  render() {
    return (
      <div className="snack" style={{ display: 'flex', alignItems: 'flex-end' }}>
        {Object.keys(this.state.snackbars).map((key, index) => {
          var snackbar = this.state.snackbars[key];
          var severity: Color;
          switch (snackbar.type) {
            case 'danger':
              severity = 'error';
              break;
            case 'success':
              severity = 'success';
              break;
            case 'warning':
              severity = 'warning';
              break;
            default:
              severity = 'info';
              break;
          }
          return (
            <MuiAlert
              key={key}
              elevation={6}
              variant="filled"
              severity={severity}
              className="alert"
              action={
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={(e) => {
                    e.preventDefault();
                    this.remove(key);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              }
            >
              {snackbar.text}
            </MuiAlert>
          );
        })}
      </div>
    );
  }
}
