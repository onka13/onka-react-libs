import React from 'react';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
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
    if (relatedData) {
      if (field.isList) {
        val = relatedData.map((item: any, i: any) => {
          return <Chip key={i} label={item[field.reference.filterField] ?? ''} />;
        });
      } else {
        val = relatedData[field.reference.filterField];
      }
    }
  }
  return (
    <Grid container spacing={3} className="detail-grid-field">
      <Grid item xs={4} className="detail-grid-field-label">
        <strong>{LibService.instance().getFieldLabel(props.pageConfig, field.name)}</strong>
      </Grid>
      <Grid item xs={8} className="detail-grid-field-value">
        <span>
          :{' '}
          {props.isLink && (
            <a href={val} target="_blank">
              {val}
            </a>
          )}
          {!props.isLink && (val === undefined ? '' : ` ${val}`)}
        </span>
      </Grid>
    </Grid>
  );
}
