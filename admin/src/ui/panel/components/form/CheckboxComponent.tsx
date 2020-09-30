import React from "react";
import { FormControl, FormControlLabel, Checkbox, FormHelperText } from "@material-ui/core";
import { LibService } from "../../../../business/services/LibService";
import { InputComponentProp } from "../../../../data/lib/InputComponentProp";

export function CheckboxComponent(props: InputComponentProp) {
  const handleChange = (e: any) => {
    props.onChange(e.target.checked);
  };
  return (
    <FormControl error={!!props.error}>
      <FormControlLabel
        id={props.field.name}
        label={LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}
        control={<Checkbox checked={!!props.rowData} onChange={handleChange} name={props.field.name} />}
      />
      <FormHelperText>{props.error}</FormHelperText>
    </FormControl>
  );
}