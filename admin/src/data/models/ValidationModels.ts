export type ValidationTypes = "required" | "email" | "max" | "min" | "maxLength" | "minLength";

export class ValidationBase {
  type!: ValidationTypes;
  public constructor(init: Partial<ValidationBase>) {
    Object.assign(this, init);
  }
}

export class RequiredValidation extends ValidationBase {}

export class EmailValidation extends ValidationBase {}

export class ValueValidation extends ValidationBase {
  value!: number;
  public constructor(init: Partial<ValueValidation>) {
    super(init);
    Object.assign(this, init);
  }
}

export class Validators {
  static required = new RequiredValidation({ type: "required" });
  static email = new EmailValidation({ type: "email" });
  static max = (value: number) => new ValueValidation({ type: "max", value });
  static min = (value: number) => new ValueValidation({ type: "min", value });
  static maxLength = (value: number) => new ValueValidation({ type: "minLength", value });
  static minLength = (value: number) => new ValueValidation({ type: "maxLength", value });
}
