import React from 'react';
import { LibService } from '../../../..';
import { DetailComponentProp } from '../../../../data/lib/DetailComponentProp';

export function DetailFieldComponent(props: DetailComponentProp) {
  var val = props.rowData;
  if (props.field.enumName) {
    val = LibService.instance().translatEnum(props.field.enum, props.field.enumName, val);
  }
  return (
    <div className="profile-ud-item">
      <div className="profile-ud wider">
        <span className="profile-ud-label">{LibService.instance().getFieldLabel(props.pageConfig, props.field.name)}</span>
        <span className="profile-ud-value">{val}</span>
      </div>
    </div>
  );
}
