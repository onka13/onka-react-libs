import { useEffect, useRef, useState } from 'react';
import { ParametersArray, Parameters, ParametersFunc, ParametersT } from '../../data/lib/Types';
import { PageField } from '../../data/lib/PageField';
import { useFormValidator } from './UseFormValidator';
import { LibService } from '../services/LibService';
import { Subject, Subscription } from 'rxjs';

export interface IUseFormProps {
  formKey: string;
  fields: PageField[];
  initialValues: any;
  onSubmit?: ParametersFunc;
  onAfterChanges?: Function;
}

export type HandleChangeType = { name: string; value: any };

export interface UseFormResponse {
  getFormData: (formKey: string) => Parameters;
  updateFormData: (formKey: string, data: Parameters) => void;
  handleSubmit: (formKey: string, e: any) => void;
  getErrors: (formKey: string) => Parameters;
  handleChange: (formKey: string, name: string) => (value: any) => void;
  handleChanges: (formKey: string, values: HandleChangeType[]) => void;
  subscribe: (formKey: string, func: ParametersFunc) => Subscription;
  unsubscribe: (subs: Subscription) => void;
  subscribeError: (formKey: string, func: ParametersFunc) => Subscription;
  unsubscribeError: (subs: Subscription) => void;
  getValue: (formKey: string, path: string) => any;
  getError: (formKey: string, path: string) => any;
  initForm: (props: IUseFormProps) => void;
  initInitialValues: (formKey: string) => void;
}

export function useForm(): UseFormResponse {
  const refProps = useRef<ParametersArray>({});
  const refFormData = useRef<ParametersArray>({});
  const refErrors = useRef<ParametersArray>({});
  const formSubject = useRef<ParametersT<Subject<Parameters>>>({});
  const errorSubject = useRef<ParametersT<Subject<Parameters>>>({});

  const initForm = (props: IUseFormProps) => {
    console.log('useForm init', props.formKey, props);
    if (refFormData.current[props.formKey]) return;
    refProps.current[props.formKey] = props;
    refFormData.current[props.formKey] = props.initialValues;
    formSubject.current[props.formKey] = new Subject<Parameters>();
    errorSubject.current[props.formKey] = new Subject<Parameters>();
    if (props.initialValues) updateFormData(props.formKey, props.initialValues);
  };

  const initInitialValues = (formKey: string) => {
    var initialValues = refProps.current[formKey]?.initialValues;
    if (initialValues) updateFormData(formKey, initialValues);
  };

  const getErrors = (formKey: string) => refErrors.current[formKey] || {};
  const setErrors = (formKey: string, data: Parameters) => {
    refErrors.current[formKey] = data;
    errorSubject.current[formKey].next(data);
  };
  const getFormData = (formKey: string) => refFormData.current[formKey];
  const setFormData = (formKey: string, data: Parameters) => {
    refFormData.current[formKey] = data;
    formSubject.current[formKey].next(data);
  };

  const { validate } = useFormValidator({});

  const handleSubmit = (formKey: string, e: any) => {
    e.preventDefault();
    var errorList = validate(refProps.current[formKey].fields, getFormData(formKey));
    if (errorList) {
      setErrors(formKey, errorList);
      return;
    }
    refProps.current[formKey].onSubmit && refProps.current[formKey].onSubmit(getFormData(formKey));
  };

  const getValue = (formKey: string, path: string) => {
    return LibService.instance().getValue(getFormData(formKey), path);
  };

  const getError = (formKey: string, path: string) => {
    return LibService.instance().getValue(getErrors(formKey), path);
  };

  const updateFormData = (formKey: string, data: Parameters) => {
    if (!data) data = {};
    setFormData(formKey, data);
    formSubject.current[formKey].next(data);
  };

  const handleChanges = (formKey: string, values: HandleChangeType[]) => {
    var dataCloned = { ...getFormData(formKey) };
    for (let i = 0; i < values.length; i++) {
      const item = values[i];
      LibService.instance().setValue(dataCloned, item.name, item.value);
    }
    setFormData(formKey, dataCloned);
    refProps.current[formKey].onAfterChanges && refProps.current[formKey].onAfterChanges();
  };

  const handleChange = (formKey: string, name: string) => (value: any) => {
    handleChanges(formKey, [{ name, value }]);
  };

  const subscribe = (formKey: string, func: ParametersFunc) => {
    return formSubject.current[formKey].subscribe(func);
  };
  const unsubscribe = (subs: Subscription) => {
    subs.unsubscribe();
  };
  const subscribeError = (formKey: string, func: ParametersFunc) => {
    return errorSubject.current[formKey].subscribe(func);
  };
  const unsubscribeError = (subs: Subscription) => {
    subs.unsubscribe();
  };

  useEffect(() => {}, []);

  return {
    initForm,
    initInitialValues,
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
  formKey: string,
  form: UseFormResponse;
  path: string;
  defaultValue?: any;
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
    var subscription = props.form.subscribe(props.formKey, (data) => {
      const rowData = props.form.getValue(props.formKey, props.path);
      if (props.preSetValue) setValue(props.preSetValue(rowData, props.defaultValue));
      else setValue(rowData || props.defaultValue);
    });
    var subscriptionError = props.form.subscribeError(props.formKey, (data) => {
      const errorData = props.form.getError(props.formKey, props.path);
      setError(errorData || '');
    });
    props.form.initInitialValues(props.formKey);
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
