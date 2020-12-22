import { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ApiBusinessLogic } from '../services/ApiBusinessLogic';
import { UIManager } from '../services/UIManager';
import { LibService } from '../services/LibService';
import { PageStatus } from '../../data/lib/Types';
import { UpsertPageProp } from '../../data/lib/UpsertPageProp';
import { useUpsertPageView } from './useUpsertPageView';

export function UpsertPage(props: UpsertPageProp) {  
  let pageConfig = LibService.instance().checkConfigPermision(props.pageConfig);
  let history = useHistory();
  const { id } = useParams<{ id: any }>();
  const isEdit = !!id || !!props.isEdit;
  const [status, setStatus] = useState<PageStatus>('none');
  const onSubmit = (async function() {
    if (props.onSubmit) {
      props.onSubmit(formData);
      return;
    }
    UIManager.instance().displayLoading(true);
    var record = await new ApiBusinessLogic().upsert(isEdit, pageConfig.route, {});
    UIManager.instance().displayLoading(false);
    var redirect = UIManager.instance().getRedirect() || 'edit';
    UIManager.instance().gotoPage(history, redirect, pageConfig, {
      id: record.value?.id ?? id,
      preserveQueryParams: true,
    });
  });
  const { UpsertPageView, formData, updateFormData } = useUpsertPageView({    
    onSubmit,
    pageConfig: props.pageConfig,
    columnCount: props.columnCount,
    fields: props.fields,
    initialValues: props.initialValues,
    isEdit: props.isEdit,
    onChange: props.onChange,
    tabs: props.tabs,
  });

  const loadData = useCallback(function () {
    setStatus('loading');
    (props.loadData ? props.loadData() : new ApiBusinessLogic().get(pageConfig.route, id))
      .then((response) => {
        updateFormData(response.value);
        setStatus('done');
      })
      .catch((reason) => {
        setStatus('none');
        UIManager.instance().gotoPage(history, 'list', pageConfig, { id, preserveQueryParams: true });
        throw reason;
      });
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    loadData();
    var refreshSubscription = LibService.instance().refreshPage.subscribe(() => {
      loadData();
    });
    return () => {
      refreshSubscription.unsubscribe();
    };
  }, []);

  if (status == 'loading') return UIManager.instance().renderLoading();

  return UpsertPageView;
}
