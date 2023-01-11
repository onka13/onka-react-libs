import React, { useState } from 'react';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { SelectInputComponentProp } from '../../../../data/lib/InputComponentProp';
import { LibService } from '../../../../business/services/LibService';
import { useFormHelper } from '../../../../business/helpers/UseForm';

export function SelectComponent(props: SelectInputComponentProp) {
  const handleChange = (e: any) => {
    props.form.handleChanges(props.formKey, [{ name: props.path, value: e.target.value }]);
  };

  const formHelper = useFormHelper({
    formKey: props.formKey, 
    form: props.form,
    path: props.path,
    defaultValue: '',
    preSetValue: (rowData, defaultValue) => (rowData === undefined ? '' : rowData),
  });

  const [values] = useState(() => {
    if (props.field.enum) {
      return Object.keys(props.field.enum).map((x) => {
        return { key: props.field.enum[x], label: LibService.instance().translatEnumKey(props.field.enumName, x) };
      });
    }
    return props.values || [];
  });
  return (
    <FormControl error={!!formHelper.error} className={props.className} fullWidth>
      <InputLabel id={props.field.name}>{LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}</InputLabel>
      <Select labelId={props.field.name} value={formHelper.value} onChange={handleChange}>
        <MenuItem value="">-</MenuItem>
        {values?.map((x, index) => {
          return (
            <MenuItem key={index} value={x.key}>
              {x.label}
            </MenuItem>
          );
        })}
      </Select>
      <FormHelperText>{formHelper.error}</FormHelperText>
    </FormControl>
  );
}
