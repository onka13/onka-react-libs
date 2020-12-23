import { TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { LibService } from '../../../../business/services/LibService';
import { InputComponentProp } from '../../../../data/lib/InputComponentProp';

export function DateComponent(props: InputComponentProp) {
  const handleChange = (e: any) => {
    props.onChange(e.target.value);
  };
  const [value, setValue] = useState('');
  useEffect(() => {
    setValue(props.rowData ? props.rowData.slice(0, 16) : '');
  }, [props.rowData]);

  console.log('DateComponent', value, props.rowData);

  return (
    <TextField
      id={props.field.name}
      label={LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}
      value={value}
      error={!!props.error}
      helperText={props.error}
      onChange={handleChange}
      InputLabelProps={{
        shrink: true,
      }}
      type="datetime-local"
      fullWidth
    />
  );
}
