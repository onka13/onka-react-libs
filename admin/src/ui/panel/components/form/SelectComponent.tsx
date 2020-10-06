import React from 'react';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@material-ui/core';
import { Option } from '../../../../data/lib/Types';
import { SelectInputComponentProp } from '../../../../data/lib/InputComponentProp';
import { LibService } from '../../../../business/services/LibService';

export function SelectComponent(props: SelectInputComponentProp) {
  const handleChange = (e: any) => {
    props.onChange(e.target.value);
  };
  var values: Option[] = [];
  if (props.values) {
    values = props.values;
  } else if (props.field.enum) {
    values = Object.keys(props.field.enum).map((x, index) => {
      return { key: props.field.enum[x], label: LibService.instance().translatEnumKey(props.field.enumName, x) };
    });
  }
  return (
    <FormControl error={!!props.error} className={props.className} fullWidth>
      <InputLabel id={props.field.name}>{LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}</InputLabel>
      <Select labelId={props.field.name} value={props.rowData === undefined ? '' : props.rowData} onChange={handleChange}>
        <MenuItem value="">-</MenuItem>
        {values.map((x, index) => {
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
