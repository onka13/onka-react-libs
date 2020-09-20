/**
 * Page Type
 */
export type PageType = 'list' | 'detail' | 'edit' | 'create' | 'filter' | 'none';

/**
 * Page status
 */
export type PageStatus = 'loading' | 'no-data' | 'done' | 'none';

export type ThemeType = 'primary' | 'secondary' | 'success' | 'info' | 'danger' | 'warning' | 'dark' | 'light';

export type Option = { key: string; label: any }

export type Parameters = { [x: string]: any };