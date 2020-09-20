import React from 'react';
import { InputComponentProp, LibService } from '../../../..';

export function TextareaComponent(props: InputComponentProp) {
  const handleChange = (e: any) => {
    props.onChange(e.target.value);
  };
  return (
    <div className="form-group">
      <label className="form-label" htmlFor={props.field.name}>
        {LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}
      </label>
      <div className="form-control-wrap">
        <textarea className={'form-control ' + (props.error ? 'invalid' : '')} id={props.field.name} onChange={handleChange} readOnly={props.readonly}>
          {props.rowData}
        </textarea>
        {props.error && <span className="invalid">{props.error}</span>}
      </div>
    </div>
  );
}
