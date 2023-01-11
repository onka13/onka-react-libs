import { PropTypes } from '@mui/material';

/**
 * Page Type
 */
export type PageType = 'list' | 'detail' | 'edit' | 'create' | 'filter' | 'none';

/**
 * Page status
 */
export type PageStatus = 'loading' | 'no-data' | 'done' | 'none';

export type ThemeType = PropTypes.Color; // 'primary' | 'secondary' | 'success' | 'info' | 'danger' | 'warning' | 'dark' | 'light';

export type Option = { key: string; label: any };

export class OptionModel {
  id!: number;
  text!: any;

  public constructor(init?: Partial<OptionModel>) {
    Object.assign(this, init);
  }
}

export type Parameters = { [x: string]: any };
export type ParametersArray = { [x: string]: Parameters };
export type ParametersT<T> = { [x: string]: T };
export type ParametersFunc = (data: Parameters) => void;
export type ParametersReturnFunc = () => Parameters;

export class PageFieldDepend
{
  name!: string;
  field?: string;
  value?: string;
}

