import { TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { LibService } from '../../../../business/services/LibService';
import { FilterComponentProp } from '../../../../data/lib/FilterComponentProp';

export function FilterComponent(props: FilterComponentProp) {
  const handleChange = (e: any) => {
    props.onChange(e.target.value);
  };
  return (
    <TextField
      id={props.filterField.filterName}
      label={LibService.instance().getFieldLabel(props.pageConfig, props.filterField.filterName)}
      defaultValue={props.rowData || ''}
      onChange={handleChange}      
    />
  );
}
