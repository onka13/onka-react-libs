import { useState, useEffect } from 'react';
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
  const isEdit = (id && id > 0) || !!props.isEdit;
  const [status, setStatus] = useState<PageStatus>('none');
  const { formData, setFormData, UpsertPageView } = useUpsertPageView({
    onSubmit,
    pageConfig: props.pageConfig,
    columnCount: props.columnCount,
    fields: props.fields,
    initialValues: props.initialValues,
    isEdit: props.isEdit,
    onChange: props.onChange,
    tabs: props.tabs,
  });

  function loadData() {
    setStatus('loading');
    (props.loadData ? props.loadData() : new ApiBusinessLogic().get(pageConfig.route, id))
      .then((response) => {
        setFormData(response.value);
        setStatus('done');
      })
      .catch((reason) => {
        setStatus('none');
        UIManager.instance().gotoPage(history, 'list', pageConfig, { id, preserveQueryParams: true });
        throw reason;
      });
  }

  async function onSubmit() {
    if (props.onSubmit) {
      props.onSubmit(formData);
      return;
    }
    UIManager.instance().displayLoading(true);
    var record = await new ApiBusinessLogic().upsert(isEdit, pageConfig.route, formData);
    UIManager.instance().displayLoading(false);
    var redirect = UIManager.instance().getRedirect() || 'list';
    UIManager.instance().gotoPage(history, redirect, pageConfig, {
      id: record.value?.id,
      preserveQueryParams: true,
    });
  }

  useEffect(() => {
    if (isEdit) {
      loadData();
      var refreshSubscription = LibService.instance().refreshPage.subscribe(() => {
        loadData();
      });
      return () => {
        refreshSubscription.unsubscribe();
      };
    }
  }, []);

  if (status == 'loading') return UIManager.instance().renderLoading();

  return UpsertPageView;
}
