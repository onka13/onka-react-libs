import React, { useState } from 'react';
import 'select2';
import { LibService } from '../../../../business/services/LibService';
import { FilterComponentProp } from '../../../../data/lib/FilterComponentProp';

export function FilterComponent(props: FilterComponentProp) {
  //console.log("FilterComponent", props);
  const [state, setState] = useState(props.rowData);
  const handleChange = (e: any) => {
    setState(e.target.value);
    props.onChange(e.target.value);
  };
  return (
    <label>
      <input
        type="search"
        className="form-control form-control-sm"
        placeholder={LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}
        value={state || ''}
        onChange={handleChange}
      />
    </label>
  );
}
