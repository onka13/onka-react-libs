import { TextField } from '@material-ui/core';
import React, { useRef } from 'react';
import { useFormHelper } from '../../../../business/helpers/UseForm';
import { LibService } from '../../../../business/services/LibService';
import { InputComponentProp } from '../../../../data/lib/InputComponentProp';

export function InputComponent(props: InputComponentProp) {
  const formHelper = useFormHelper({
    form: props.form,
    path: props.path,
    defaultValue: '',
  });
  let timer = useRef<ReturnType<typeof setTimeout>>();
  function loadDataTimer(value: string) {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      props.form.handleChanges([{ name: props.path, value: value }]);
    }, 200);
  }
  const handleChange = (e: any) => {
    formHelper.setValue(e.target.value);
    loadDataTimer(e.target.value);
  };

  console.log('InputComponent render', props.field.name, formHelper.value);

  return (
    <TextField
      id={props.field.name}
      label={LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}
      value={formHelper.value}
      error={!!formHelper.error}
      helperText={formHelper.error}
      onChange={handleChange}
      multiline={props.isMultiline}
      fullWidth
      InputProps={{
        readOnly: props.isEdit ? props.field.isReadOnlyEdit : props.field.isReadOnlyCreate,
      }}
    />
  );
}
