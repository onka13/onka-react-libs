import { useState } from 'react';
import { Parameters } from '../../data/lib/Types';
import { PageField } from '../../data/lib/PageField';
import { useFormValidator } from './UseFormValidator';
import { LibService } from '../services/LibService';

export interface IUseFormProps {
  fields: PageField[];
  initialValues: any;
  onSubmit: Function;
  onChange?: (values: Parameters) => void;
}

export type HandleChangeType = { name: string; value: any };

export interface UseFormResponse {
  formData: Parameters;
  setFormData: (data: Parameters) => void;
  handleSubmit: (e: any) => {};
  errors: Parameters;
  handleChange: (name: string) => (value: any) => void;
  handleChanges: (values: HandleChangeType[]) => void;
}

export function useForm(props: IUseFormProps): UseFormResponse {
  const [data, setData] = useState<Parameters>(props.initialValues);
  const [errors, setErrors] = useState<Parameters>({});
  const { validate } = useFormValidator({});

  async function handleSubmit(e: any) {
    e.preventDefault();
    var errorList = validate(props.fields, data);
    if (errorList) {
      setErrors(errorList);
      return;
    }
    props.onSubmit();
  }

  function setFormData(data: Parameters) {
    setData(data);
    props.onChange && props.onChange(data);
  }

  const handleChange = (name: string) => (value: any) => {
    handleChanges([{ name, value }]);
  };

  const handleChanges = (values: HandleChangeType[]) => {
    var dataCloned = { ...data };
    for (let i = 0; i < values.length; i++) {
      const item = values[i];
      LibService.instance().setValue(dataCloned, item.name, item.value);
    }
    setFormData(dataCloned);
    console.log("handleChanges", dataCloned);    
  };

  return {
    formData: data,
    setFormData,
    handleSubmit,
    errors,
    handleChange,
    handleChanges,
  };
}
