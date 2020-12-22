import React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { ApiBusinessLogic } from '../services/ApiBusinessLogic';
import { UIManager } from '../services/UIManager';
import { LibService } from '../services/LibService';
import { PageStatus, Parameters } from '../../data/lib/Types';
import { UpsertPageProp } from '../../data/lib/UpsertPageProp';
import { useFormValidator } from '../helpers/UseFormValidator';
import { HandleChangeType } from '../helpers/UseForm';
import { UpsertPageView } from './useUpsertPageView';
import { UpsertPageViewProp } from '../../data/lib/UpsertPageViewProp';

export function UpsertPage(props: UpsertPageProp) {
  let pageConfig = LibService.instance().checkConfigPermision(props.pageConfig);
  let history = useHistory();
  const { id } = useParams<{ id: any }>();
  const isEdit = !!id || !!props.isEdit;
  const [status, setStatus] = useState<PageStatus>('none');

  const onSubmit = async function () {
    if (props.onSubmit) {
      props.onSubmit(formData);
      return;
    }
    UIManager.instance().displayLoading(true);
    var record = await new ApiBusinessLogic().upsert(isEdit, pageConfig.route, formData);
    UIManager.instance().displayLoading(false);
    var redirect = UIManager.instance().getRedirect() || 'edit';
    UIManager.instance().gotoPage(history, redirect, pageConfig, {
      id: record.value?.id ?? id,
      preserveQueryParams: true,
    });
  };

  const [formData, setFormData] = useState<Parameters>(() => {
    return props.initialValues;
  });
  //const refFormData = useRef<Parameters>();
  //const refErrors = useRef<Parameters>();

  const [errors, setErrors] = useState<Parameters>({});
  const { validate } = useFormValidator({});

  const handleSubmit = useCallback(
    (e: any) => {
      console.log('handleSubmit', formData);
      e.preventDefault();
      var fields = (props.fields ? props.fields : props.tabs?.flatMap((x) => x.fields)) || [];
      var errorList = validate(fields, formData);
      if (errorList) {
        //refErrors.current = errorList;
        setErrors(errorList);
        return;
      }
      onSubmit();
    },
    [formData]
  );

  const updateFormData = useCallback(function (data: Parameters) {
    setFormData(data);
    props.onChange && props.onChange(data);
  }, []);

  const handleChanges = useCallback(
    (values: HandleChangeType[]) => {
      console.log('handleChanges formData', formData);
      var dataCloned = { ...formData };
      for (let i = 0; i < values.length; i++) {
        const item = values[i];
        LibService.instance().setValue(dataCloned, item.name, item.value);
      }
      //refFormData.current = dataCloned;
      setFormData(dataCloned);
    },
    [formData]
  );

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

  const viewProps: UpsertPageViewProp = {
    pageConfig: pageConfig,
    columnCount: props.columnCount,
    fields: props.fields,
    isEdit: props.isEdit,
    onChange: props.onChange,
    tabs: props.tabs,
    errors,
    formData,
    handleChanges,
    handleSubmit,
  };
  console.log('UpsertPage', viewProps);
  return <UpsertPageView {...viewProps} />;
}
