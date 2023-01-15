import React from 'react';
import { DialogComponent, DialogData } from '../components/DialogComponent';
import { Snackbar, SnackBarComponent } from '../components/SnackBarComponent';
import { Parameters, PageType } from '../../data/lib/Types';
import { PageConfig } from '../../data/lib/PageConfig';
import { LocaleService } from './LocaleService';
import { CircularProgress } from '@mui/material';
import { NavigateFunction } from 'react-router-dom';

export class UIManager {
  private constructor() {}
  private static _instance = new UIManager();
  static instance(): UIManager {
    return this._instance;
  }

  dialog!: DialogComponent;
  drawer!: DialogComponent;
  snackbar!: SnackBarComponent;

  renderLoading() {
    return (
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  displayLoading(show: boolean) {
    if (!show) {
      this.dialog.close();
      return;
    }
    this.dialog.open(
      {
        content: <CircularProgress color="secondary" />,
        width: 'unset',
        height: 'unset',
      },
      undefined,
      {
        hasBackdrop: true,
        closable: false,
      }
    );
  }

  /**
   * Display message
   * @param msg message
   * @param type type
   */
  displayMessage(snack: Snackbar) {
    this.snackbar.add(snack);
  }

  /**
   * Open confirm dialog
   */
  confirm(data: DialogData, callback: (res: any) => void) {
    this.dialog.open(
      {
        ...{
          title: LocaleService.instance().translate('lib.page.warning'),
          content: LocaleService.instance().translate('lib.confirm'),
          actions: [
            { label: LocaleService.instance().translate('lib.false'), value: false, theme: 'secondary' },
            { label: LocaleService.instance().translate('lib.true'), value: true, theme: 'primary' },
          ],
        },
        ...data,
      },
      callback,
      {
        small: true,
        hasBackdrop: true,
        closable: false,
        expandableContent: true,
      }
    );
  }

  /**
   * Go to page
   */
  gotoPage(
    navigate: NavigateFunction,
    pageType: PageType,
    pageConfig: PageConfig,
    extra: {
      id?: any;
      preserveQueryParams?: boolean;
    } = { preserveQueryParams: true }
  ) {
    if (pageType == 'none') return;

    var route = this.getLink(pageType, pageConfig, extra);
    navigate(route);
  }

  getLink(
    pageType: PageType,
    pageConfig: PageConfig,
    extra: {
      id?: any;
      preserveQueryParams?: boolean;
    } = { preserveQueryParams: true }
  ): string {
    var route = '/panel' + pageConfig.route;
    if (pageType == 'create') {
      route += '/create';
    } else if (pageType == 'edit') {
      route += '/edit/' + extra.id;
    } else if (pageType == 'detail') {
      route += '/detail/' + extra.id;
    } else if (pageType == 'list') {
    }
    if (extra.preserveQueryParams) {
      //route += window.location.search;
      route += '?' + this.getUrlExtraParams();
    }
    return route;
  }

  getUrlExtraParams(): string {
    return new URL(window.location.origin + window.location.hash.slice(1)).search.slice(1);
  }

  getUrlSearchParams(): URLSearchParams {
    return new URLSearchParams(new URL(window.location.origin + window.location.hash.slice(1)).search.slice(1));
  }

  getQueryParams(): Parameters {
    var params: Parameters = {};
    var searchParams = this.getUrlSearchParams();
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }

  getQueryParam(key: string): any {
    var searchParams = this.getUrlSearchParams();
    return searchParams.get(key);
  }

  changeQueryParams(navigate: NavigateFunction, values: Parameters, replace: boolean = false) {
    var searchParams = this.getUrlSearchParams();
    for (const key in values) {
      searchParams.set(key, values[key]);
    }
    var search = '?' + searchParams.toString();
    if (replace) navigate({ search }, { replace: true });
    else navigate({ search });
  }

  /* Dialog */
  isDialog(): boolean {
    return this.getQueryParam('dialog') == '1';
  }
  isHideFilters(): boolean {
    return this.getQueryParam('hideFilters') == '1';
  }
  isSelectField(): boolean {
    return this.getQueryParam('selectField') == '1';
  }
  isHideActions(): boolean {
    return this.getQueryParam('hideActions') == '1';
  }
  isHideDefaultFilters(): boolean {
    return this.getQueryParam('hideDefaultFilters') == '1';
  }
  // default values from query string
  getDefaultValues() {
    return JSON.parse(this.getQueryParam('defaultValues') || '{}');
  }
  getRedirect(): PageType {
    return this.getQueryParam('redirect');
  }
  getDialogId(): number {
    return this.getQueryParam('dialogId');
  }
  getDialogTitle(): string {
    return this.getQueryParam('title');
  }
  hasToolbar(): boolean {
    return this.getQueryParam('toolbar') == '1';
  }
  getPageNumber(): number {
    return this.getQueryParam('page') || 1;
  }
  getSort(defaultValue?: string): string {
    return this.getQueryParam('sort') || defaultValue || 'id';
  }
  getSortOrder(defaultValue?: string): string {
    return this.getQueryParam('sortOrder') || defaultValue || 'ASC';
  }
}
