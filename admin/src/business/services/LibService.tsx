import React from 'react';
import { LocaleService } from './LocaleService';
import { PageConfig } from '../../data/lib/PageConfig';
import Loadable from 'react-loadable';
import { Subject, BehaviorSubject } from 'rxjs';
import { StaticService } from './StaticService';
import { UIManager } from './UIManager';
import get from 'lodash/get';
import set from 'lodash/set';
import { PageType } from '../../data/lib/Types';
import { PageField } from '../../data/lib/PageField';

/**
 * Contains business related the admin system
 */
export class LibService {
  private static _instance: LibService;
  static instance(): LibService {
    if (!this._instance) {
      this._instance = new LibService();
    }
    return this._instance;
  }

  private localeService: LocaleService;
  constructor() {
    this.localeService = LocaleService.instance();
  }

  /**
   * Selected last page
   */
  public selectedPage = new BehaviorSubject<PageConfig>(new PageConfig());

  /**
   * Drawer state
   */
  public drawerState = new BehaviorSubject<boolean>(true);

  /**
   * Emits to refresh data
   */
  public refreshPage = new Subject<any>();

  /**
   * Get translatation by key
   */
  translate(key: string, defaultValue?: string, formatParams?: object): string | any {
    return this.localeService.translate(key, defaultValue, formatParams);
  }
  /**
   * Get translated enum
   * @param enumObj enum object
   * @param enumName enum name
   * @param val value
   */
  translatEnum(enumObj: { [x: string]: any }, enumName: any, val: any) {
    var key = Object.keys(enumObj).filter((x) => enumObj[x] == val);
    if (key.length > 0) return this.translatEnumKey(enumName, key[0]);
    return null;
  }

  /**
   * Get translated text by enum key
   * @param enumName enum name
   * @param key key
   */
  translatEnumKey(enumName: string, key: string) {
    return this.translate('enums.' + enumName + '.' + key, key);
  }

  /**
   * Get route translated labels
   */
  getRouteLabel(pageConfig?: PageConfig, name: string = 'name'): string {
    if (!pageConfig) return '';
    return this.localeService.translate(`resources.${pageConfig.route}.${name}`, pageConfig.route);
  }

  getFieldLabel(pageConfig: PageConfig, field: string): string {
    field = field.replace(/(\[\d+\])/gim, '');
    return this.localeService.translate(`resources.${pageConfig.route}.fields.${field}`, field);
  }

  loadableComp(imp: () => Promise<any>, key: string) {
    return Loadable({
      loader: () =>
        imp()
          .then((a: any) => new Promise((resolve) => setTimeout(() => resolve(a), 50)))
          .then((resp: any) => resp[key]),
      loading() {
        return (
          <div className="progress">
            <div className="progress-bar bg-danger widthloop"></div>
          </div>
        );
      },
    });
  }

  isSuperAdmin() {
    return StaticService.instance().isSuper();
  }

  hasAccess(moduleKey: string, pageKey: string, actionKey: string) {
    if (this.isSuperAdmin()) return true;
    if (StaticService.instance().getRoles()[moduleKey + '_' + pageKey + '_admin']) return true;
    if (StaticService.instance().getRoles()[moduleKey + '_' + pageKey + '_' + actionKey]) return true;
    return false;
  }

  checkConfigPermision(pageConfig: PageConfig): PageConfig {
    if (UIManager.instance().isHideActions()) {
      pageConfig.export = false;
      pageConfig.get = false;
      pageConfig.new = false;
      pageConfig.edit = false;
      pageConfig.delete = false;
    } else {
      var isOwner = this.hasAccess(pageConfig.moduleKey, pageConfig.pageKey, 'admin');
      ['export', 'get', 'new', 'edit', 'delete'].forEach((key) => {
        // @ts-ignore
        pageConfig[key] = pageConfig[key] && (isOwner || this.hasAccess(pageConfig.moduleKey, pageConfig.pageKey, key));
      });
    }
    return pageConfig;
  }

  getPath(prefix?: string, name?: string) {
    return (prefix || '') + (name || '');
  }

  getFieldValue(data: any, prefix?: string, name?: string) {
    return get(data, this.getPath(prefix, name));
  }

  getValue(data: any, path: string) {
    //console.log('getValue', data, path);    
    return get(data, path);
  }

  setValue(data: any, path: string, value: any) {
    //console.log('setValue', data, path, value);    
    return set(data, path, value);
  }

  filterFields(pageFields: PageField[], pageType: PageType, prefix?: string): PageField[] {
    var fields = pageFields.filter((x) => {
      if (pageType == 'edit') return x.displayInEdit;
      if (pageType == 'create') return x.displayInCreate;
      if (pageType == 'detail') return x.displayInDetail;
      return false;
    });
    if (prefix) {
      fields.forEach((field) => {
        field.prefix = prefix;
      });
    }
    return fields;
  }
}
