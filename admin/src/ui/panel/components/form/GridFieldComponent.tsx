import React from 'react';
import { LibService } from '../../../../business/services/LibService';
import { GridComponentProp } from '../../../../data/lib/GridComponentProp';

export function GridFieldComponent(props: GridComponentProp) {
  const field = props.gridField;
  var path = LibService.instance().getPath(field.prefix, field.name);
  var val;
  if (field.enumName) {
    val = LibService.instance().getValue(props.rowData, path);
    val = LibService.instance().translatEnum(field.enum, field.enumName, val);
  } else if (field.reference) {
    var relatedData = props.rowData[field.reference.dataField];
    val = relatedData ? relatedData[field.reference.filterField] : '';
  } else {
    val = LibService.instance().getValue(props.rowData, path);
  }
  return <span>{val}</span>;
}
