import { LanguagelistType } from './LocaleService';

/**
 * Configuration service
 */
export class ConfigService {
  /**
   * Api Url
   */
  _apiUrl!: string;

  /**
   * True if prod env
   */
  _isProd: boolean = false;

  /**
   * Language list
   */
  _langList: LanguagelistType = {};

  private static _instance: ConfigService;
  static instance(): ConfigService {
    if (!this._instance) {
      this._instance = new ConfigService();
    }
    return this._instance;
  }

  private constructor() {
  }

  getApiUrl() {
    return this._apiUrl;
  }

  setApiUrl(url: string) {
    this._apiUrl = url;
  }

  getLangList(): LanguagelistType {
    return this._langList || {};
  }

  setLangList(langList: LanguagelistType) {
    this._langList = langList;
  }

  isProd() {
    return this._isProd;
  }

  setIsProd(isProd: boolean) {
    this._isProd = isProd;
  }
}
