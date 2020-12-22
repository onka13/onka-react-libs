import { TextField } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import { LibService } from '../../../../business/services/LibService';
import { InputComponentProp } from '../../../../data/lib/InputComponentProp';

export function InputComponent(props: InputComponentProp) {
  const handleChange = useCallback((e: any) => {
    props.onChange(e.target.value);
  }, []);
  const [value, setValue] = useState('');
  useEffect(() => {
    setValue(props.rowData || '');
  }, [props.rowData]);
  return (
    <TextField
      id={props.field.name}
      label={LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}
      defaultValue={value}
      value={value}
      error={!!props.error}
      helperText={props.error}
      onChange={handleChange}
      multiline={props.isMultiline}
      fullWidth
    />
  );
}