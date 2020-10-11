import { InputComponentProp } from './InputComponentProp';
import { ApiSearchRequest } from '../api/ApiRequest';
import { PageFilterField } from './PageFilterField';

export class FilterComponentProp extends InputComponentProp {
  request!: ApiSearchRequest;

  /**
   * Field
   */
  filterField!: PageFilterField;

  /**
   * Fields
   */
  filterFields!: PageFilterField[];  

  public constructor(init?: Partial<FilterComponentProp>) {
    super(init);
    Object.assign(this, init);
  }
}
