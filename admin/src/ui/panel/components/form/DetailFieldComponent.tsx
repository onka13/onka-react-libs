import { Grid } from '@material-ui/core';
import React from 'react';
import { LibService } from '../../../../business/services/LibService';
import { DetailComponentProp } from '../../../../data/lib/DetailComponentProp';

export function DetailFieldComponent(props: DetailComponentProp) {
  var val = props.rowData;
  const field = props.field;
  var path = LibService.instance().getPath(field.prefix, field.name);

  if (field.enumName) {
    val = LibService.instance().translatEnum(field.enum, field.enumName, val);
  } else if (field.reference) {
    var relatedData = props.data[field.reference.dataField];
    val = relatedData ? relatedData[field.reference.filterField] : '';
  }
  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <strong>{LibService.instance().getFieldLabel(props.pageConfig, field.name)}</strong>
      </Grid>
      <Grid item xs={8}>
        : {val}
      </Grid>
    </Grid>
  );
}
