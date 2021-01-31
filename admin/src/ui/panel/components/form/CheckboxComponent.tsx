import React from 'react';
import { FormControl, FormControlLabel, Checkbox, FormHelperText } from '@material-ui/core';
import { LibService } from '../../../../business/services/LibService';
import { InputComponentProp } from '../../../../data/lib/InputComponentProp';
import { useFormHelper } from '../../../../business/helpers/UseForm';

export function CheckboxComponent(props: InputComponentProp) {
  const handleChange = (e: any) => {
    props.form.handleChanges([{ name: props.path, value: e.target.checked }]);
  };
  const formHelper = useFormHelper({
    form: props.form,
    path: props.path,
    defaultValue: false,
  });

  console.log('CheckboxComponent render', props.field.name, formHelper.value);

  return (
    <FormControl error={!!formHelper.error}>
      <FormControlLabel
        id={props.field.name}
        label={LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}
        control={<Checkbox checked={formHelper.value} onChange={handleChange} name={props.field.name} />}
      />
      <FormHelperText>{formHelper.error}</FormHelperText>
    </FormControl>
  );
}
