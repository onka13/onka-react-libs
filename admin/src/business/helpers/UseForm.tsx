import React, { useState, useEffect } from 'react';
import { Parameters } from '../../data/lib/Types';
import { PageField } from '../../data/lib/PageField';
import { useFormValidator } from './UseFormValidator';
import { LibService } from '../services/LibService';

interface IUseFormProps {
  fields: PageField[];
  initialValues: any;
  onSubmit: Function;
}

interface UseFormResponse {
  formData: Parameters;
  setFormData: React.Dispatch<React.SetStateAction<Parameters>>;
  handleSubmit: (e: any) => {};
  errors: Parameters;
  handleChange: (name: string) => (value: any) => void;
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
    console.log('useForm handleChange', name, value);
    var data = { ...formData };
    LibService.instance().setValue(data, name, value); // { ...formData, [name]: value }
    console.log('useForm data', data);
    setFormData(data);
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
  };
}
