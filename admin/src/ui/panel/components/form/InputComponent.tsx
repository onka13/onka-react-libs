import { TextField } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { LibService } from '../../../../business/services/LibService';
import { InputComponentProp } from '../../../../data/lib/InputComponentProp';

export function InputComponent(props: InputComponentProp) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  let timer = useRef<ReturnType<typeof setTimeout>>();
  function loadDataTimer(value: string) {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      props.form.handleChanges([{ name: props.path, value: value }]);
    }, 200);
  }
  const handleChange = (e: any) => {
    setValue(e.target.value);
    loadDataTimer(e.target.value);
  };

  useEffect(() => {
    var subscription = props.form.subscribe((data) => {
      const rowData = props.form.getValue(props.path);
      setValue(rowData || '');
    });
    var subscriptionError = props.form.subscribeError((data) => {
      const rowData = props.form.getError(props.path);
      setError(rowData || '');
    });
    return () => {
      props.form.unsubscribe(subscription);
      props.form.unsubscribeError(subscriptionError);
    };
  }, []);

  console.log('InputComponent render', props.field.name, value);

  return (
    <TextField
      id={props.field.name}
      label={LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}
      value={value}
      error={!!error}
      helperText={error}
      onChange={handleChange}
      multiline={props.isMultiline}
      fullWidth
      InputProps={{
        readOnly: props.field.isReadOnly,
      }}
    />
  );
}
