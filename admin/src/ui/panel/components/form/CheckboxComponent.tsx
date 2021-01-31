import React, { useEffect, useState } from "react";
import { FormControl, FormControlLabel, Checkbox, FormHelperText } from "@material-ui/core";
import { LibService } from "../../../../business/services/LibService";
import { InputComponentProp } from "../../../../data/lib/InputComponentProp";

export function CheckboxComponent(props: InputComponentProp) {
  const handleChange = (e: any) => {
    props.onChange(e.target.checked);
  };
  const [value, setValue] = useState(false);
  // useEffect(() => {
  //   setValue(props.rowData || false);
  // }, [props.rowData]);

  const path = LibService.instance().getPath(props.field.prefix, props.field.name);

  useEffect(() => {
    var subscription = props.formSubject.subscribe((data) => {
      console.log('formSubject.subscribe checkbox: ', data);
      const rowData = LibService.instance().getValue(data, path);
      setValue(rowData || false);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  console.log('CheckboxComponent', props.field.name, value);

  return (
    <FormControl error={!!props.error}>
      <FormControlLabel
        id={props.field.name}
        label={LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}
        control={<Checkbox checked={value} onChange={handleChange} name={props.field.name} />}
      />
      <FormHelperText>{props.error}</FormHelperText>
    </FormControl>
  );
}