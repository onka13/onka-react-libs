import React from 'react';
import { TextField } from '@material-ui/core';
import { LibService } from '../../../../business/services/LibService';
import { InputComponentProp } from '../../../../data/lib/InputComponentProp';
import { useFormHelper } from '../../../../business/helpers/UseForm';

export function NumberComponent(props: InputComponentProp) {
  const handleChange = (e: any) => {
    props.form.handleChanges(props.formKey, [{ name: props.path, value: e.target.value }]);
  };

  const formHelper = useFormHelper({
    formKey: props.formKey, 
    form: props.form,
    path: props.path,
    defaultValue: 0,
  });

  return (
    <TextField
      id={props.field.name}
      label={LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}
      value={formHelper.value}
      error={!!formHelper.error}
      helperText={formHelper.error}
      onChange={handleChange}
      type="number"
      fullWidth
      InputProps={{
        readOnly: props.isEdit ? props.field.isReadOnlyEdit : props.field.isReadOnlyCreate,
      }}
    />
  );
}
