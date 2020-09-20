import React from 'react';
import { DialogComponent, DialogData } from '../components/DialogComponent';
import { Snackbar, SnackBarComponent } from '../components/SnackBarComponent';
import { Parameters, PageType } from '../../data/lib/Types';
import { PageConfig } from '../../data/lib/PageConfig';
import * as H from 'history';
import { LocaleService } from './LocaleService';

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
        <span className="sr-only">...</span>
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
        content: (
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">...</span>
          </div>
        ),
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
            { label: LocaleService.instance().translate('lib.false'), value: false, theme: 'danger' },
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
        expandableContent: true
      }
    );
  }

  /**
   * Go to page
   */
  gotoPage(
    history: H.History<H.LocationState>,
    pageType: PageType,
    pageConfig: PageConfig,
    extra: {
      id?: any;
      preserveQueryParams?: boolean;
    } = { preserveQueryParams: true }
  ) {
    if (pageType == 'none') return;

    var route = this.getLink(pageType, pageConfig, extra);
    history.push(route);
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
      route += window.location.search;
    }
    return route;
  }

  getQueryParams(): Parameters {
    var params: Parameters = {};
    var searchParams = new URLSearchParams(window.location.href);
    searchParams.forEach((value, key) => {
      //console.log("param", key, value);
      params[key] = value;
    });
    return params;
  }

  getQueryParam(key: string): any {
    var searchParams = new URLSearchParams(window.location.search);
    return searchParams.get(key);
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
}
