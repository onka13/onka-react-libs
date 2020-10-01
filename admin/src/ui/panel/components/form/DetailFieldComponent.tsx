import { Grid } from '@material-ui/core';
import React from 'react';
import { LibService } from '../../../../business/services/LibService';
import { DetailComponentProp } from '../../../../data/lib/DetailComponentProp';

export function DetailFieldComponent(props: DetailComponentProp) {
  var val = props.rowData;
  if (props.field.enumName) {
    val = LibService.instance().translatEnum(props.field.enum, props.field.enumName, val);
  }
  return (
    <Grid container spacing={3}>
      <Grid item xs={4}>
        <strong>{LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}</strong>
      </Grid>
      <Grid item xs={8}>
        : {val}
      </Grid>
    </Grid>
  );
}
