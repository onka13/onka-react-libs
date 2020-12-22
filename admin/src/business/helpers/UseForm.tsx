import { useCallback, useEffect, useState } from 'react';
import { Parameters } from '../../data/lib/Types';
import { PageField } from '../../data/lib/PageField';
import { useFormValidator } from './UseFormValidator';
import { LibService } from '../services/LibService';

export interface IUseFormProps {
  fields: PageField[];
  initialValues: any;
  onSubmit: (data:Parameters) => void;
  onChange?: (values: Parameters) => void;
}

export type HandleChangeType = { name: string; value: any };

export interface UseFormResponse {
  formData: Parameters;
  updateFormData: (data: Parameters) => void;
  handleSubmit: (e: any) => void;
  errors: Parameters;
  handleChange: (name: string) => (value: any) => void;
  handleChanges: (values: HandleChangeType[]) => void;
}

export function useForm(props: IUseFormProps): UseFormResponse {
  console.log('useForm', props);
  const [formData, setFormData] = useState<Parameters>(() => props.initialValues);
  const [errors, setErrors] = useState<Parameters>({});
  const { validate } = useFormValidator({});

  const handleSubmit = useCallback(function(e: any){
    console.log("handleSubmit", formData);
    e.preventDefault();
    var errorList = validate(props.fields, formData);
    if (errorList) {
      setErrors(errorList);
      return;
    }
    props.onSubmit(formData);
  }, [formData]);

  const updateFormData = useCallback(function(data: Parameters) {
    setFormData(data);
    props.onChange && props.onChange(data);
  }, [formData]);

  const handleChanges = useCallback((values: HandleChangeType[]) => {
    console.log("handleChanges formData", formData);  
    var dataCloned = { ...formData };
    for (let i = 0; i < values.length; i++) {
      const item = values[i];
      LibService.instance().setValue(dataCloned, item.name, item.value);
    }
    setFormData(dataCloned);
    console.log("handleChanges dataCloned", dataCloned);    
  }, [formData]);

  const handleChange =  useCallback((name: string) => (value: any) => {
    handleChanges([{ name, value }]);
  }, []);

  useEffect(() => {
    console.log('useForm effect', formData);
  }, []);

  return {
    formData,
    updateFormData,
    handleSubmit,
    errors,
    handleChange,
    handleChanges,
  };
}
