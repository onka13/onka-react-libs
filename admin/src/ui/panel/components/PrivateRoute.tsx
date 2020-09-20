import React, { ReactNode } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { AccountBusinessLogic } from "../../../business/services/AccountBusinessLogic";

interface IProps extends RouteProps {
  children: ReactNode;
}

export function PrivateRoute({ children, ...rest }: IProps) {
  var business = AccountBusinessLogic.instance();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        business.isLoggedIn() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
