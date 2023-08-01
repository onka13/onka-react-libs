import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiBusinessLogic } from '../services/ApiBusinessLogic';
import { UIManager } from '../services/UIManager';
import { LibService } from '../services/LibService';
import { PageStatus } from '../../data/lib/Types';
import { UpsertPageProp } from '../../data/lib/UpsertPageProp';
import { useForm } from '../helpers/UseForm';
import { UpsertPageView } from './useUpsertPageView';
import { UpsertPageViewProp } from '../../data/lib/UpsertPageViewProp';
import { stringify } from 'querystring';

export function UpsertPage(props: UpsertPageProp) {
  let pageConfig = LibService.instance().checkConfigPermision(props.pageConfig);
  const navigate = useNavigate();
  const { id } = useParams<{ id: any }>();
  const isEdit = !!id || !!props.isEdit;
  const [pageStatus, setStatus] = useState<PageStatus>('none');
  const formKey = props.pageConfig.route;
  const form = useForm();

  const onSubmit = async function () {
    if (props.onSubmit) {
      props.onSubmit(form.getFormData(formKey));
      return;
    }
    UIManager.instance().displayLoading(true);
    var record = await new ApiBusinessLogic().upsert(isEdit, pageConfig.route, form.getFormData(formKey));
    UIManager.instance().displayLoading(false);
    var redirect = UIManager.instance().getRedirect() || 'edit';
    if (isEdit && redirect == 'edit' && record.value?.id) {
      form.updateFormData(formKey, { ...form.getFormData(formKey), ...record.value });
      return;
    }
    UIManager.instance().gotoPage(navigate, redirect, pageConfig, {
      id: record.value?.id ?? id,
      preserveQueryParams: true,
    });
  };

  form.initForm({
    formKey: formKey,
    fields: (props.fields ? props.fields : props.tabs?.flatMap((x) => x.fields)) || [],
    initialValues: props.initialValues,
    onSubmit: onSubmit,
  });

  const loadData = function () {
    setStatus('loading');
    (props.loadData ? props.loadData() : new ApiBusinessLogic().get(pageConfig.route, id))
      .then((response) => {
        setStatus('done');
        form.updateFormData(formKey, response.value);
      })
      .catch((reason) => {
        setStatus('none');
        UIManager.instance().gotoPage(navigate, 'list', pageConfig, { id, preserveQueryParams: true });
        throw reason;
      });
  };

  useEffect(() => {
    form.initInitialValues(formKey);
    if (!isEdit) return;
    loadData();
    var refreshSubscription = LibService.instance().refreshPage.subscribe(() => {
      loadData();
    });
    return () => {
      refreshSubscription.unsubscribe();
    };
  }, []);

  const viewProps: UpsertPageViewProp = {
    formKey,
    pageConfig: pageConfig,
    columnCount: props.columnCount,
    fields: props.fields,
    isEdit: isEdit,
    tabs: props.tabs,
    template: props.template,
    form: form,
    loading: pageStatus == 'loading',
  };
  return <UpsertPageView {...viewProps} />;
}
