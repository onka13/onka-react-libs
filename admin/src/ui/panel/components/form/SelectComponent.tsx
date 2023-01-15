import React, { useEffect, useState } from 'react';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { SelectInputComponentProp } from '../../../../data/lib/InputComponentProp';
import { LibService } from '../../../../business/services/LibService';

export function SelectComponent(props: SelectInputComponentProp) {
  const  [value, setValue] = useState();
  const [error, setError] = useState('');

  const [values] = useState(() => {
    if (props.field.enum) {
      return Object.keys(props.field.enum).map((x) => {
        return { key: props.field.enum[x], label: LibService.instance().translatEnumKey(props.field.enumName, x) };
      });
    }
    return props.values || [];
  });

  useEffect(() => {
    var subscription = props.form.subscribe(props.formKey, (data) => {
      const rowData = props.form.getValue(props.formKey, props.path);
      setValue(rowData);
    });
    var subscriptionError = props.form.subscribeError(props.formKey, (data) => {
      const rowData = props.form.getError(props.formKey, props.path);
      setError(rowData || '');
    });
    props.form.initInitialValues(props.formKey);
    return () => {
      props.form.unsubscribe(subscription);
      props.form.unsubscribeError(subscriptionError);
    };
  }, []);

  const handleChange = (e: any) => {
    props.form.handleChanges(props.formKey, [{ name: props.path, value: e.target.value }]);
  };

  return (
    <FormControl error={!!error} className={props.className} fullWidth>
      <InputLabel id={props.field.name}>{LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}</InputLabel>
      <Select labelId={props.field.name} value={value || ''} onChange={handleChange}>
        <MenuItem value="">-</MenuItem>
        {values?.map((x, index) => {
          return (
            <MenuItem key={index} value={x.key}>
              {x.label}
            </MenuItem>
          );
        })}
      </Select>
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
}
