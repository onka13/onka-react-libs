import { useRef } from 'react';
import { Parameters, ParametersFunc, ParametersReturnFunc } from '../../data/lib/Types';
import { PageField } from '../../data/lib/PageField';
import { useFormValidator } from './UseFormValidator';
import { LibService } from '../services/LibService';
import { Subject, Subscription } from 'rxjs';

export interface IUseFormProps {
  fields: PageField[];
  initialValues: any;
  onSubmit: ParametersFunc;
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
    props.onSubmit(getFormData());
  };

  const getValue = (path: string) => {
    return LibService.instance().getValue(getFormData(), path);
  }
  
  const getError = (path: string) => {
    return LibService.instance().getValue(getErrors(), path);
  }

  const updateFormData = (data: Parameters) => {
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
    unsubscribeError
  };
}
