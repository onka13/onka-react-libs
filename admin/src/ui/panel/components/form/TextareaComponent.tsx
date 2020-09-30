import React from 'react';
import { InputComponentProp } from '../../../../data/lib/InputComponentProp';
import { InputComponent } from './InputComponent';

export function TextareaComponent(props: InputComponentProp) {
  return <InputComponent {...props} isMultiline={true} />;
}
