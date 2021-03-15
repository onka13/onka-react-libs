import { BaseBusinessLogicService } from './BaseBusinessLogic';
import { StaticService } from './StaticService';

/**
 * Account Business Logic, contains user account related functions
 */
export class AccountBusinessLogic {
  private business: BaseBusinessLogicService;
  private staticService: StaticService;

  loginUrl = 'AdminApi/public/login';
  logoutUrl = 'AdminApi/AdminUserSecure/logout';

  private constructor() {
    this.business = BaseBusinessLogicService.instance();
    this.staticService = StaticService.instance();
  }

  private static _instance: AccountBusinessLogic;
  static instance(): AccountBusinessLogic {
    if (!this._instance) {
      this._instance = new AccountBusinessLogic();
    }
    return this._instance;
  }

  /**
   * Is user logged in?
   */
  isLoggedIn(): boolean {
    return this.staticService.isLoggedIn();
  }

  /**
   * Logout user
   */
  logout(): Promise<any> {
    return this.business.request<any>('POST', this.logoutUrl, {}).then((result) => {
      return true;
    }).finally(()=> {
      this.staticService.logout();  
    });
  }

  /**
   * Login user
   * @param email email
   * @param password password
   */
  login(email: string, password: string): Promise<Boolean> {
    return this.business
      .request<any>('POST', this.loginUrl, {
        email,
        password,
      })
      .then((result) => {
        if (!result.value || !result.value.token) throw Error('API problem. No token!');
        this.staticService.login(email, result.value);
        return true;
      });
  }
}
