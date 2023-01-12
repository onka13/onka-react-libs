import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { LibService } from '../../../business/services/LibService';
import { PageConfig } from '../../../data/lib/PageConfig';
import { IAdminProps } from '../../Admin';
import { NoMatch } from '../../public/NoMatch';
import { Master } from '../components/Master';
import { PrivateRoute } from '../components/PrivateRoute';

export function Home(props: IAdminProps) {
  return (
    <Master toolbar={props.toolbar} menu={props.menu} footer={props.footer}>
      <Routes>
        <Route path="" element={<PrivateRoute> {props.dashboard}</PrivateRoute>}></Route>
        {props.menu.routes.flatMap((item, index) => {
          return item.flatMap((routeItem, i) => {
            var url = routeItem.config.route;
            return [
              routeItem.list && (
                <Route
                  key={4 * i}
                  path={url}
                  element={
                    <>
                      <RouteChanged config={routeItem.config} />
                      <routeItem.list />
                    </>
                  }
                ></Route>
              ),
              routeItem.detail && (
                <Route
                  key={4 * i + 1}
                  path={url + '/detail/:id'}
                  element={
                    <>
                      <RouteChanged config={routeItem.config} />
                      <routeItem.detail />
                    </>
                  }
                ></Route>
              ),
              routeItem.create && (
                <Route
                  key={4 * i + 2}
                  path={url + '/create'}
                  element={
                    <>
                      <RouteChanged config={routeItem.config} />
                      <routeItem.create />
                    </>
                  }
                ></Route>
              ),
              routeItem.edit && (
                <Route
                  key={4 * i + 3}
                  path={url + '/edit/:id'}
                  element={
                    <>
                      <RouteChanged config={routeItem.config} />
                      <routeItem.edit />
                    </>
                  }
                ></Route>
              ),
            ];
          });
        })}
        <Route path="*">
          <NoMatch />
        </Route>
      </Routes>
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
