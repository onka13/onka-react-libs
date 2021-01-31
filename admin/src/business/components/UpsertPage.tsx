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
import { Subject, BehaviorSubject } from 'rxjs';

export function UpsertPage(props: UpsertPageProp) {
  let pageConfig = LibService.instance().checkConfigPermision(props.pageConfig);
  let history = useHistory();
  const { id } = useParams<{ id: any }>();
  const isEdit = !!id || !!props.isEdit;
  const [status, setStatus] = useState<PageStatus>('none');

  const [count, setCount] = useState(0);
  const forceUpdate = () => setCount((prev) => prev + 1);
  const refFormData = useRef<Parameters>(props.initialValues);
  const refErrors = useRef<Parameters>();

  const { validate } = useFormValidator({});
  const formSubject = useRef<Subject<Parameters>>(new Subject<Parameters>());

  const getErrors = () => refErrors.current || {};
  const setErrors = (data: Parameters) => {
    refErrors.current = data;
    forceUpdate();
  };
  const getFormData = () => refFormData.current;
  const setFormData = (data: Parameters) => {
    refFormData.current = data;
    //forceUpdate();
    formSubject.current.next(data);
  };

  const onSubmit = async function () {
    if (props.onSubmit) {
      props.onSubmit(getFormData());
      return;
    }
    UIManager.instance().displayLoading(true);
    var record = await new ApiBusinessLogic().upsert(isEdit, pageConfig.route, getFormData());
    UIManager.instance().displayLoading(false);
    var redirect = UIManager.instance().getRedirect() || 'edit';
    if (isEdit && redirect == 'edit' && record.value?.id) {
      setFormData({ ...getFormData(), ...record.value });
      return;
    }
    UIManager.instance().gotoPage(history, redirect, pageConfig, {
      id: record.value?.id ?? id,
      preserveQueryParams: true,
    });
  };

  const handleSubmit = (e: any) => {
    console.log('handleSubmit', getFormData());
    console.log('handleSubmit err', getErrors());
    e.preventDefault();
    var fields = (props.fields ? props.fields : props.tabs?.flatMap((x) => x.fields)) || [];
    var errorList = validate(fields, getFormData());
    if (errorList) {
      setErrors(errorList);
      return;
    } else {
      setErrors({});
    }
    onSubmit();
  };

  const updateFormData = function (data: Parameters) {
    setFormData(data);
    formSubject.current.next(data);
    props.onChange && props.onChange(data);
  };

  const handleChanges = (values: HandleChangeType[]) => {
    console.log('handleChanges formData', getFormData());
    var dataCloned = { ...getFormData() };
    for (let i = 0; i < values.length; i++) {
      const item = values[i];
      LibService.instance().setValue(dataCloned, item.name, item.value);
    }
    setFormData(dataCloned);
  };

  const loadData = function () {
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
  };

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

  //if (status == 'loading') return UIManager.instance().renderLoading();

  const viewProps: UpsertPageViewProp = {
    pageConfig: pageConfig,
    columnCount: props.columnCount,
    fields: props.fields,
    isEdit: isEdit,
    onChange: props.onChange,
    tabs: props.tabs,
    errors: getErrors(),
    formData: [], //getFormData(),
    subject: formSubject.current,
    handleChanges,
    handleSubmit,
    template: props.template,
  };
  console.log('UpsertPage', viewProps);
  return <UpsertPageView {...viewProps} />;
}
