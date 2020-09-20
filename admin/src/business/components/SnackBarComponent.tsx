import React from "react";

interface SnackBarComponentProps {
  onRef: (c: SnackBarComponent) => {};
}

export interface Snackbar {
  type: "danger" | "success" | "info" | "warning";
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
    return new Date().getTime() + "";
  }
  add(snackbar: Snackbar): string {
    var id = snackbar.id || this._randomId();
    if (!snackbar.type) snackbar.type = "info";
    if (!snackbar.duration && snackbar.duration != 0) snackbar.duration = 5;
    this.state.snackbars[id] = snackbar;
    this.setState({ snackbars: this.state.snackbars });

    if (snackbar.type != "danger" && snackbar.duration > 0) {
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
      <div className="snack" style={{ display: "flex", alignItems: "flex-end" }}>
        {Object.keys(this.state.snackbars).map((key, index) => {
          var snackbar = this.state.snackbars[key];
          var icon;
          switch (snackbar.type) {
            case "danger":
              icon = "ni-cross-circle";
              break;
            case "success":
              icon = "ni-check-circle";
              break;
            default:
              icon = "ni-alert-circle";
              break;
          }
          return (
            <div key={key} className={"alert alert-" + snackbar.type + " alert-icon alert-dismissible "}>
              <em className={"icon ni " + icon}></em> {snackbar.text}{" "}
              <button
                className="close"
                onClick={(e) => {
                  e.preventDefault();
                  this.remove(key);
                }}
              ></button>
            </div>
          );
        })}
      </div>
    );
  }
}
