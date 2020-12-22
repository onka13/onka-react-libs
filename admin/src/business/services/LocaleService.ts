import * as lodash from 'lodash';
import * as en from '../../assets/l10n/en.json';
import * as tr from '../../assets/l10n/tr.json';

import { ConfigService } from './ConfigService';
import { StaticService } from './StaticService';

export type LanguagelistType = { [x: string]: () => Promise<any> };

/**
 * Localization service
 */
export class LocaleService {
  /**
   * Json content of l10n
   */
  jsonContent = {};

  private static _instance: LocaleService;
  static instance(): LocaleService {
    if (!this._instance) {
      this._instance = new LocaleService();
    }
    return this._instance;
  }

  /**
   * Language list
   */
  langList: LanguagelistType = {
    en: () => Promise.resolve(en),
    tr: () => Promise.resolve(tr),
  };

  private constructor() {
    // get extended langs
    console.log('LocaleService cons');
  }

  getCurrentLang(): string | null {
    return StaticService.instance().getCurrentLang();
  }

  /**
   * Load default language
   */
  loadDefaultLang(): Promise<any> {
    var lang = StaticService.instance().getCurrentLang();
    return this.changeLang(lang);
  }

  /**
   * Change selected language
   * @param lang language
   */
  changeLang(lang: string | any): Promise<any> {
    if (!lang) lang = 'en';
    //console.log('LocaleService changeLang', lang);
    StaticService.instance().setCurrentLang(lang);
    const part1 = this.langList[lang];
    const part2 = ConfigService.instance().getLangList()[lang];
    return part1()
      .then((data) => {
        //console.log('changeLang1', data.default);
        this.jsonContent = data.default;
      })
      .then(() => {
        if (part2) return part2();
      })
      .then((newData) => {
        //console.log('changeLang2', newData);
        if (!newData) return;
        this.jsonContent = lodash.merge(this.jsonContent, newData);
        //console.log('final', this.jsonContent);
      })
      .catch((error) => {
        return Promise.resolve();
      });
  }

  /**
   * get content by key
   * @param key key
   * @param defaultValue default value
   */
  get(key: string, defaultValue?: string): any {
    var r = lodash.get(this.jsonContent, key, defaultValue);
    return r;
  }

  /**
   * Get translation by key
   * @param key key
   * @param defaultValue default value
   * @param formatParams parameters to replace, like; { title: 'Hello' }
   */
  translate(key: string, defaultValue?: string, formatParams?: object): string {
    if (!formatParams) return this.get(key, defaultValue);
    return lodash.template(this.get(key, defaultValue))(formatParams);
  }

  private getValue(key: string): string | undefined {
    var keys = key.split('.');
    var root: any = this.jsonContent;
    for (let i = 0; i < keys.length; i++) {
      root = root[keys[i]];
      if (!root) return;
    }
    return root;
  }
}