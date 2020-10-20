import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ApiBusinessLogic } from '../services/ApiBusinessLogic';
import { UIManager } from '../services/UIManager';
import { LibService } from '../services/LibService';
import { PageStatus } from '../../data/lib/Types';
import { PagePropBase } from '../../data/lib/PagePropBase';
import { DetailPageView } from './DetailPageView';

export function DetailPage(props: PagePropBase) {
  let pageConfig = LibService.instance().checkConfigPermision(props.pageConfig);
  let history = useHistory();
  const [state, setState] = useState<{ [x: string]: any }>({});
  const [status, setStatus] = useState<PageStatus>('loading');
  const { id } = useParams<{ id: any }>();

  function loadData() {
    setStatus('loading');
    new ApiBusinessLogic()
      .get(pageConfig.route, id)
      .then((response) => {
        setState(response.value);
        setStatus('done');
      })
      .catch((reason) => {
        UIManager.instance().gotoPage(history, 'list', pageConfig, { id, preserveQueryParams: true });
        throw reason;
      });
  }

  useEffect(() => {
    loadData();
    var refreshSubscription = LibService.instance().refreshPage.subscribe(() => {
      loadData();
    });
    return () => {
      refreshSubscription.unsubscribe();
    };
  }, []);

  if (status == 'loading') return UIManager.instance().renderLoading();

  return <DetailPageView {...props} data={state} />;
}
