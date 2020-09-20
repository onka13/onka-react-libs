import React from "react";
import { InputComponentProp } from "../../../..";
import { LibService } from "../../../../business/services/LibService";

export function CheckboxComponent(props: InputComponentProp) {
    const handleChange = (e: any) => {
      props.onChange(e.target.checked);
    };
    return (
      <div className="form-group">
        <label className="form-label" htmlFor={props.field.name}>
          {LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}
        </label>
        <div className="form-control-wrap">
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className={'custom-control-input ' + (props.error ? 'invalid' : '')}
              id={props.field.name}
              checked={!!props.rowData}
              value={props.rowData || ''}
              onChange={handleChange}
              readOnly={props.readonly}
            />
            <label className="custom-control-label" htmlFor={props.field.name}>
              <span></span>
              {props.error && <span className="invalid">{props.error}</span>}
            </label>
          </div>
        </div>
      </div>
    );
  }