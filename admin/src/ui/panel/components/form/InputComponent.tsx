import React from 'react';
import { LibService } from '../../../../business/services/LibService';
import { InputComponentProp } from '../../../../data/lib/InputComponentProp';

export function InputComponent(props: InputComponentProp) {
  const handleChange = (e: any) => {
    props.onChange(e.target.value);
  };
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={props.field.name}>
        {LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}
      </label>
      <div className="form-control-wrap">
        <input
          type="text"
          className={'form-control ' + (props.error ? 'invalid' : '')}
          id={props.field.name}
          value={props.rowData || ''}
          onChange={handleChange}
          readOnly={props.readonly}
        />
        {props.error && <span className="invalid">{props.error}</span>}
      </div>
    </div>
  );
}
