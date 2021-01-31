import { TextField } from '@material-ui/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { LibService } from '../../../../business/services/LibService';
import { InputComponentProp } from '../../../../data/lib/InputComponentProp';

export function InputComponent(props: InputComponentProp) {
  //console.log('InputComponent', props);
  const [value, setValue] = useState('');
  let timer = useRef<ReturnType<typeof setTimeout>>();
  function loadDataTimer(value: string) {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      props.onChange(value);
    }, 200);
  }
  const handleChange = (e: any) => {
    setValue(e.target.value);
    loadDataTimer(e.target.value);
  };
  // useEffect(() => {
  //   setValue(props.rowData || '');
  // }, [props.rowData]);

  const path = LibService.instance().getPath(props.field.prefix, props.field.name);

  useEffect(() => {
    var subscription = props.formSubject.subscribe((data) => {
      console.log('formSubject.subscribe input: ', data);
      const rowData = LibService.instance().getValue(data, path);
      setValue(rowData || '');
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  console.log('InputComponent', props.field.name, value);

  return (
    <TextField
      id={props.field.name}
      label={LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}
      value={value}
      error={!!props.error}
      helperText={props.error}
      onChange={handleChange}
      multiline={props.isMultiline}
      fullWidth
      InputProps={{
        readOnly: props.field.isReadOnly,
      }}
    />
  );
}
