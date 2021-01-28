import React from 'react';
import Chip from '@material-ui/core/Chip';
import { LibService } from '../../../../business/services/LibService';
import { GridComponentProp } from '../../../../data/lib/GridComponentProp';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  gridChips: {
    
  },
});

export function GridFieldComponent(props: GridComponentProp) {
  const classes = useStyles();
  const field = props.gridField;
  var path = LibService.instance().getPath(field.prefix, field.name);
  var val;
  if (field.enumName) {
    val = LibService.instance().getValue(props.rowData, path);
    val = LibService.instance().translatEnum(field.enum, field.enumName, val);
  } else if (field.reference) {
    var relatedData = props.rowData[field.reference.dataField];
    if (relatedData) {
      if (field.isList) {
        val = relatedData.map((item: any, i: any) => {
          return <Chip key={i} label={item[field.reference.filterField] ?? ''} />;
        });
      } else {
        val = relatedData[field.reference.filterField];
      }
      return <span className={classes.gridChips}>{val}</span>;
    }
  } else {
    val = LibService.instance().getValue(props.rowData, path);
  }
  return <span>{val}</span>;
}
