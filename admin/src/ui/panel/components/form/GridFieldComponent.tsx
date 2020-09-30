import React from 'react';
import { LibService } from '../../../../business/services/LibService';
import { GridComponentProp } from '../../../../data/lib/GridComponentProp';

export function GridFieldComponent(props: GridComponentProp) {
  var path = LibService.instance().getPath(props.field.prefix, props.field.name);
  var val;
  if (props.field.enumName) {
    val = LibService.instance().translatEnum(props.field.enum, props.field.enumName, val);
  } else {
    val = LibService.instance().getValue(props.rowData, path);
  }
  return <span>{val}</span>;
}
