import React from 'react';
import { TextField } from '@material-ui/core';
import { useFormHelper } from '../../../../business/helpers/UseForm';
import { LibService } from '../../../../business/services/LibService';
import { InputComponentProp } from '../../../../data/lib/InputComponentProp';

export function DateComponent(props: InputComponentProp) {
  const handleChange = (e: any) => {
    props.form.handleChanges([{ name: props.path, value: e.target.value }]);
  };
  const formHelper = useFormHelper({
    form: props.form,
    path: props.path,
    defaultValue: '',
    preSetValue: (rowData, defaultValue) => (rowData ? rowData.slice(0, 16) : defaultValue),
  });

  console.log('DateComponent render', formHelper.value);

  return (
    <TextField
      id={props.field.name}
      label={LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}
      value={formHelper.value}
      error={!!formHelper.error}
      helperText={formHelper.error}
      onChange={handleChange}
      InputLabelProps={{
        shrink: true,
      }}
      type="datetime-local"
      fullWidth
    />
  );
}
