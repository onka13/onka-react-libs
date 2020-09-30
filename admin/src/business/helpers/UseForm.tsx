import React, { useState, useEffect } from 'react';
import { Parameters } from '../../data/lib/Types';
import { PageField } from '../../data/lib/PageField';
import { useFormValidator } from './UseFormValidator';
import { LibService } from '../services/LibService';

export interface IUseFormProps {
  fields: PageField[];
  initialValues: any;
  onSubmit: Function;
}

export type HandleChangeType = { name: string; value: any };

export interface UseFormResponse {
  formData: Parameters;
  setFormData: React.Dispatch<React.SetStateAction<Parameters>>;
  handleSubmit: (e: any) => {};
  errors: Parameters;
  handleChange: (name: string) => (value: any) => void;
  handleChanges: (values: HandleChangeType[]) => void;
}

export function useForm(props: IUseFormProps): UseFormResponse {
  const [formData, setFormData] = useState<Parameters>(props.initialValues);
  const [errors, setErrors] = useState<Parameters>({});
  const { validate } = useFormValidator({});
  async function handleSubmit(e: any) {
    e.preventDefault();
    console.log('values', formData);
    var errorList = validate(props.fields, formData);
    if (errorList) {
      setErrors(errorList);
      return;
    }
    props.onSubmit();
  }

  const handleChange = (name: string) => (value: any) => {    
    handleChanges([{name, value}]);
  };

  const handleChanges = (values: HandleChangeType[]) => {
    console.log('useForm handleChanges', values);
    var data = { ...formData };
    for (let i = 0; i < values.length; i++) {
      const item = values[i];
      LibService.instance().setValue(data, item.name, item.value);
    }
    setFormData(data);
    console.log('useForm data', data);
  };

  useEffect(() => {
    return () => {};
  });

  return {
    formData,
    setFormData,
    handleSubmit,
    errors,
    handleChange,
    handleChanges,
  };
}
