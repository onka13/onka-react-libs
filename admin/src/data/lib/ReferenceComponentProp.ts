import { InputComponentProp } from './InputComponentProp';

export class ReferenceComponentProp extends InputComponentProp {

  

  public constructor(init?: Partial<ReferenceComponentProp>) {
    super(init);
    Object.assign(this, init);
  }
}
