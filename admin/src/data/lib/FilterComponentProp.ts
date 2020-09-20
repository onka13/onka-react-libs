import { InputComponentProp } from './InputComponentProp';
import { ApiSearchRequest } from '../api/ApiRequest';

export class FilterComponentProp extends InputComponentProp {

  request!: ApiSearchRequest;

  public constructor(init?: Partial<FilterComponentProp>) {
    super(init);
    Object.assign(this, init);
  }
}
