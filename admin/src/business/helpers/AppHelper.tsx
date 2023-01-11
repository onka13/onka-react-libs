import React from 'react';

export class AppHelper {
  private constructor() {}

  static getFirstLetters(str: string) : string {
    return str?.match(/\b(\w)/g)?.join("") || "";
  }
}
