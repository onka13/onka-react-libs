import { HandleChangeType } from '../../business/helpers/UseForm';
import { ComponentPropBase } from './ComponentPropBase';
import { PageField } from './PageField';
import { Option } from './Types';

export class InputComponentProp extends ComponentPropBase {
  /**
   * update or create
   */
  isEdit!: boolean;

  onChange!: Function;

  error?: string;

  isMultiline?: boolean;

  /**
   * Field
   */
  field!: PageField;

  /**
   * Fields
   */
  fields!: PageField[];

  handleChanges!: (values: HandleChangeType[]) => void;

  isFilter!: boolean;

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
