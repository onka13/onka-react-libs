import { HandleChangeType, UseFormResponse } from '../../business/helpers/UseForm';
import { ComponentPropBase } from './ComponentPropBase';
import { PageField } from './PageField';
import { Option, Parameters } from './Types';
import { Subject } from 'rxjs';

export class InputComponentProp extends ComponentPropBase {
  /**
   * update or create
   */
  isEdit!: boolean;

  isMultiline?: boolean;

  /**
   * Field
   */
  field!: PageField;

  /**
   * Fields
   */
  fields!: PageField[];

  isFilter!: boolean;

  form!: UseFormResponse;

  public constructor(init?: Partial<InputComponentProp>) {
    super(init);
    Object.assign(this, init);
  }
}

export class SelectInputComponentProp extends InputComponentProp {
  values?: Option[];

  public constructor(init?: Partial<SelectInputComponentProp>) {
    super(init);
    Object.assign(this, init);
  }
}
