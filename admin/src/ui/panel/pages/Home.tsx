import React, { useEffect } from 'react';
import { Switch, useRouteMatch, Route, useLocation } from 'react-router-dom';
import { LibService } from '../../../business/services/LibService';
import { PageConfig } from '../../../data/lib/PageConfig';
import { IAdminProps } from '../../Admin';
import { NoMatch } from '../../public/NoMatch';
import { Master } from '../components/Master';
import { PrivateRoute } from '../components/PrivateRoute';

export function Home(props: IAdminProps) {
  let match = useRouteMatch();

  return (
    <Master toolbar={props.toolbar} menu={props.menu} footer={props.footer}>
      <Switch>
        <PrivateRoute exact path={match.url}>
          {props.dashboard}
        </PrivateRoute>
        {props.menu.routes.flatMap((item, index) => {
          return item.flatMap((routeItem, i) => {
            var url = match.url + routeItem.config.route;
            return [
              routeItem.list && (
                <PrivateRoute key={4 * i} exact path={url}>
                  <RouteChanged config={routeItem.config} />
                  <routeItem.list />
                </PrivateRoute>
              ),
              routeItem.detail && (
                <PrivateRoute key={4 * i + 1} exact path={url + '/detail/:id'}>
                  <RouteChanged config={routeItem.config} />
                  <routeItem.detail />
                </PrivateRoute>
              ),
              routeItem.create && (
                <PrivateRoute key={4 * i + 2} exact path={url + '/create'}>
                  <RouteChanged config={routeItem.config} />
                  <routeItem.create />
                </PrivateRoute>
              ),
              routeItem.edit && (
                <PrivateRoute key={4 * i + 3} exact path={url + '/edit/:id'}>
                  <RouteChanged config={routeItem.config} />
                  <routeItem.edit />
                </PrivateRoute>
              ),
            ];
          });
        })}
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
    </Master>
  );
}

function RouteChanged({ config }: { config: PageConfig }) {
  let location = useLocation();
  useEffect(() => {
    LibService.instance().selectedPage.next(config);
  }, [location]);
  return <span></span>;
}

export default Home;
