import React from 'react';
import { FormControl, FormControlLabel, Checkbox, FormHelperText } from '@material-ui/core';
import { LibService } from '../../../../business/services/LibService';
import { InputComponentProp } from '../../../../data/lib/InputComponentProp';
import { useFormHelper } from '../../../../business/helpers/UseForm';
import { LocaleService } from '../../../../business/services/LocaleService';

export function CheckboxComponent(props: InputComponentProp) {
  const handleChange = (e: any) => {
    props.form.handleChanges(props.formKey, [{ name: props.path, value: e.target.checked }]);
  };
  const formHelper = useFormHelper({
    formKey: props.formKey,
    form: props.form,
    path: props.path,
    defaultValue: false,
  });

  //console.log('CheckboxComponent render', props.field.name, props, formHelper.value);

  return (
    <FormControl error={!!formHelper.error}>
      <FormControlLabel
        id={props.field.name}
        label={LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}
        control={
          <Checkbox
            checked={formHelper.value}
            onChange={handleChange}
            name={props.field.name}
            disabled={props.isEdit ? props.field.isReadOnlyEdit : props.field.isReadOnlyCreate}
          />
        }
      />
      <FormHelperText>{formHelper.error}</FormHelperText>
    </FormControl>
  );
}
