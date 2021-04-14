import React from 'react';
import { DetailComponentProp } from '../../../../data/lib/DetailComponentProp';
import { DetailFieldComponent } from './DetailFieldComponent';

export function DetailUrlComponent(props: DetailComponentProp) { 
  return (
    <DetailFieldComponent {...props} isLink={true}/>
  );
}
