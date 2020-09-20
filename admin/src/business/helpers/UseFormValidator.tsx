import React, { useState, useEffect } from 'react';
import { Parameters } from '../../data/lib/Types';
import { PageField } from '../../data/lib/PageField';
import { RequiredValidation, EmailValidation, ValueValidation } from '../../data/models/ValidationModels';
import { LocaleService } from '../services/LocaleService';
import { LibService } from '../services/LibService';

function validate(fields: PageField[], state: any): Parameters | undefined {
  if (!fields) return;
  let errorList: Parameters = {};
  fields.forEach((field) => {
    let path = LibService.instance().getPath(field.prefix, field.name);
    let value = LibService.instance().getValue(state, field.name);
    field.validators?.forEach((validator) => {
      let error = null;
      if (validator instanceof RequiredValidation) {
        if (value === null || value === "" || value === undefined) {
          error = LocaleService.instance().translate('lib.validation.required');
        }
      } else if (validator instanceof EmailValidation) {
        if (value) {
          var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (!re.test(String(value).toLowerCase())) {
            error = LocaleService.instance().translate('lib.validation.email');
          }
        }
      } else if (validator instanceof ValueValidation) {
        let validation = validator as ValueValidation;
        if (validation.type == 'minLength') {
          let validation = validator as ValueValidation;
          if ((value + '').length > validation.value) {
            error = LocaleService.instance().translate('lib.validation.minlength');
          }
        } else if (validation.type == 'maxLength') {
          if ((value + '').length > validation.value) {
            error = LocaleService.instance().translate('lib.validation.maxLength');
          }
        } else if (validation.type == 'min') {
          if (parseFloat(value) < validation.value) {
            error = LocaleService.instance().translate('lib.validation.min');
          }
        } else if (validation.type == 'max') {
          if (parseFloat(value) > validation.value) {
            error = LocaleService.instance().translate('lib.validation.max');
          }
        }
      }
      if (error) LibService.instance().setValue(errorList, path, error);
    });
  });
  //console.log("errors", errorList);
  if (Object.keys(errorList).length > 0) {
    return errorList;
  }
}

interface IUseFormValidatorProps {}

interface UseFormValidatorResponse {
  validate(fields: PageField[], state: any): Parameters | undefined;
}

export function useFormValidator(props: IUseFormValidatorProps): UseFormValidatorResponse {
  return { validate };
}
