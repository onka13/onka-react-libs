import { useEffect, useRef, useState } from 'react';
import { Parameters, ParametersFunc, ParametersReturnFunc } from '../../data/lib/Types';
import { PageField } from '../../data/lib/PageField';
import { useFormValidator } from './UseFormValidator';
import { LibService } from '../services/LibService';
import { Subject, Subscription } from 'rxjs';

export interface IUseFormProps {
  fields: PageField[];
  initialValues: any;
  onSubmit?: ParametersFunc;
  onAfterChanges?: Function;
}

export type HandleChangeType = { name: string; value: any };

export interface UseFormResponse {
  getFormData: ParametersReturnFunc;
  updateFormData: ParametersFunc;
  handleSubmit: (e: any) => void;
  getErrors: ParametersReturnFunc;
  handleChange: (name: string) => (value: any) => void;
  handleChanges: (values: HandleChangeType[]) => void;
  subscribe: (func: ParametersFunc) => Subscription;
  unsubscribe: (subs: Subscription) => void;
  subscribeError: (func: ParametersFunc) => Subscription;
  unsubscribeError: (subs: Subscription) => void;
  getValue: (path: string) => any;
  getError: (path: string) => any;
}

export function useForm(props: IUseFormProps): UseFormResponse {
  console.log('useForm', props);
  const refFormData = useRef<Parameters>(props.initialValues);
  const refErrors = useRef<Parameters>();
  const formSubject = useRef<Subject<Parameters>>(new Subject<Parameters>());
  const errorSubject = useRef<Subject<Parameters>>(new Subject<Parameters>());

  const getErrors = () => refErrors.current || {};
  const setErrors = (data: Parameters) => {
    refErrors.current = data;
    errorSubject.current.next(data);
  };
  const getFormData = () => refFormData.current;
  const setFormData = (data: Parameters) => {
    refFormData.current = data;
    formSubject.current.next(data);
  };

  const { validate } = useFormValidator({});

  const handleSubmit = (e: any) => {
    console.log('handleSubmit', getFormData());
    e.preventDefault();
    var errorList = validate(props.fields, getFormData());
    if (errorList) {
      setErrors(errorList);
      return;
    }
    props.onSubmit && props.onSubmit(getFormData());
  };

  const getValue = (path: string) => {
    return LibService.instance().getValue(getFormData(), path);
  };

  const getError = (path: string) => {
    return LibService.instance().getValue(getErrors(), path);
  };

  const updateFormData = (data: Parameters) => {
    if (!data) data = {};
    setFormData(data);
    formSubject.current.next(data);
  };

  const handleChanges = (values: HandleChangeType[]) => {
    console.log('handleChanges formData', getFormData());
    var dataCloned = { ...getFormData() };
    for (let i = 0; i < values.length; i++) {
      const item = values[i];
      LibService.instance().setValue(dataCloned, item.name, item.value);
    }
    setFormData(dataCloned);
    props.onAfterChanges && props.onAfterChanges();
  };

  const handleChange = (name: string) => (value: any) => {
    handleChanges([{ name, value }]);
  };

  const subscribe = (func: ParametersFunc) => {
    return formSubject.current.subscribe(func);
  };
  const unsubscribe = (subs: Subscription) => {
    subs.unsubscribe();
  };
  const subscribeError = (func: ParametersFunc) => {
    return errorSubject.current.subscribe(func);
  };
  const unsubscribeError = (subs: Subscription) => {
    subs.unsubscribe();
  };

  useEffect(() => {
    if (props.initialValues) updateFormData(props.initialValues);
  }, []);

  return {
    getFormData,
    updateFormData,
    handleSubmit,
    handleChange,
    handleChanges,
    getErrors,
    subscribe,
    unsubscribe,
    getValue,
    getError,
    subscribeError,
    unsubscribeError,
  };
}

export interface IUseFormHelperProps {
  form: UseFormResponse;
  path: string;
  defaultValue: any;
  preSetValue?: (rowData: any, defaultValue: any) => any;
}

export interface UseFormHelperResponse {
  value: any;
  error: string;
  setValue: (value: any) => void;
}

export function useFormHelper(props: IUseFormHelperProps): UseFormHelperResponse {
  const [value, setValue] = useState(props.defaultValue);
  const [error, setError] = useState('');

  useEffect(() => {
    var subscription = props.form.subscribe((data) => {
      const rowData = props.form.getValue(props.path);
      if (props.preSetValue) setValue(props.preSetValue(rowData, props.defaultValue));
      else setValue(rowData || props.defaultValue);
    });
    var subscriptionError = props.form.subscribeError((data) => {
      const errorData = props.form.getError(props.path);
      setError(errorData || '');
    });
    return () => {
      props.form.unsubscribe(subscription);
      props.form.unsubscribeError(subscriptionError);
    };
  }, []);

  return {
    value,
    error,
    setValue,
  };
}
