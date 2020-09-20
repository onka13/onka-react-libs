import React from "react";
import { useEffect } from "react";
import { SelectInputComponentProp, LibService } from "../../../..";
import { Option } from "../../../../data/lib/Types";

export function SelectComponent(props: SelectInputComponentProp) {
    const refSelect = React.createRef<HTMLSelectElement>();
    const handleChange = (e: any) => {
      props.onChange(e.target.value);
    };
    var values: Option[] = [];
    if (props.values) {
      values = props.values;
    } else if (props.field.enum) {
      values = Object.keys(props.field.enum).map((x, index) => {
        return { key: props.field.enum[x], label: LibService.instance().translatEnumKey(props.field.enumName, x) };
      });
    }
    useEffect(() => {
      if (!refSelect.current) return;
      if (props.readonly) return;
      if (values.length < 5) return;
      $(refSelect.current).select2({
        placeholder: '',
        allowClear: !props.field.isRequired,
      });
    }, [refSelect]);
    return (
      <div className="form-group">
        <label className="form-label" htmlFor={props.field.name}>
          {LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}
        </label>
        <div className="form-control-wrap">
          <select
            ref={refSelect}
            onChange={handleChange}
            value={props.rowData || ''}
            className={'form-control ' + (props.error ? 'invalid' : '')}
            disabled={props.readonly}
          >
            {values.map((x, index) => {
              return (
                <option key={index} value={x.key}>
                  {x.label}
                </option>
              );
            })}
          </select>
          {props.error && <span className="invalid">{props.error}</span>}
        </div>
      </div>
    );
  }