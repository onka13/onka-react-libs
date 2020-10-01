import React from 'react';
import { TextField } from '@material-ui/core';
import { LibService } from '../../../../business/services/LibService';
import { InputComponentProp } from '../../../../data/lib/InputComponentProp';

export function NumberComponent(props: InputComponentProp) {
  const handleChange = (e: any) => {
    props.onChange(e.target.value);
  };
  return (
    <TextField
      id={props.field.name}
      label={LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}
      defaultValue={props.rowData || ''}
      error={!!props.error}
      helperText={props.error}
      onChange={handleChange}
      type="number"
    />
  );
}