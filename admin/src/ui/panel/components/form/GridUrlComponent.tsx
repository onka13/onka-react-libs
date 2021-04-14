import React from 'react';
import { GridComponentProp } from '../../../../data/lib/GridComponentProp';
import { GridFieldComponent } from './GridFieldComponent';

export function GridUrlComponent(props: GridComponentProp) {  
  return <GridFieldComponent {...props} isLink={true}/>;
}
