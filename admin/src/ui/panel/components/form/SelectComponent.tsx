import React, { useCallback, useEffect, useState } from 'react';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import { Option } from '../../../../data/lib/Types';
import { SelectInputComponentProp } from '../../../../data/lib/InputComponentProp';
import { LibService } from '../../../../business/services/LibService';

export function SelectComponent(props: SelectInputComponentProp) {
  console.log('InputComponent', props);
  const handleChange = useCallback((e: any) => {
    //setValue(e.target.value);
    props.onChange(e.target.value);
  }, []);
  const [value, setValue] = useState('');
  useEffect(() => {
    setValue(props.rowData === undefined ? '' : props.rowData);
  }, [props.rowData]);
  const [values, setValues] = useState(() => {
    if (props.field.enum) {
      return Object.keys(props.field.enum).map((x, index) => {
        return { key: props.field.enum[x], label: LibService.instance().translatEnumKey(props.field.enumName, x) };
      });
    }
    return props.values || [];
  });  
  return (
    <FormControl error={!!props.error} className={props.className} fullWidth>
      <InputLabel id={props.field.name}>{LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}</InputLabel>
      <Select labelId={props.field.name} value={value} onChange={handleChange}>
        <MenuItem value="">-</MenuItem>
        {values?.map((x, index) => {
          return (
            <MenuItem key={index} value={x.key}>
              {x.label}
            </MenuItem>
          );
        })}
      </Select>
      <FormHelperText>{props.error}</FormHelperText>
    </FormControl>
  );
}
