import React, { ReactNode } from 'react';
import { Navigate, RouteProps } from 'react-router-dom';
import { AccountBusinessLogic } from '../../../business/services/AccountBusinessLogic';

export function PrivateRoute({ children }: RouteProps): React.ReactElement {
  let isLoggedIn = AccountBusinessLogic.instance().isLoggedIn();
  if (isLoggedIn) {
    return <>{children}</>;
  }
  return <Navigate to="/login" />;
}
