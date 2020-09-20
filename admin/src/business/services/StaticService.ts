/**
 * Stores static values, access local storage
 */
export class StaticService {

  static TOKEN_NAME = "PanelToken";

  roles: any;
  localCurrency: any;

  private constructor() {}

  private static _instance = new StaticService();

  static instance(): StaticService {
    return this._instance;
  }

  /**
   * Get user roles
   */
  getRoles() {
    if (!this.roles) {
      try {
        this.roles = JSON.parse(localStorage.getItem("roles") ?? "");
      } catch (error) {}
      if (!this.roles) this.roles = {};
    }
    return this.roles;
  }

  /**
   * Set user roles
   */
  setRoles(value: any) {
    if (!value) return;
    this.roles = value;
  }

  /**
   * Is logged in?
   */
  isLoggedIn() {
    return !!localStorage.getItem(StaticService.TOKEN_NAME);
  }

  /**
   * Is super user
   */
  isSuper() {
    return !!localStorage.getItem("isSuper");
  }

  /**
   * Get admin panel token
   */
  getToken() {
    return localStorage.getItem(StaticService.TOKEN_NAME);
  }

  /**
   * Store login data
   * @param data login data
   */
  login(email: string, data: { token: string; theme: any; name: string; isSuper: string; roles: any[] }) {
    localStorage.setItem("email", email);
    localStorage.setItem(StaticService.TOKEN_NAME, data.token);
    localStorage.setItem("theme", data.theme || "1");
    localStorage.setItem("name", data.name);
    localStorage.setItem("isSuper", data.isSuper);

    var roles: { [x: string]: boolean } = {};
    if (data.roles) {
      for (let i = 0; i < data.roles.length; i++) {
        const role = data.roles[i];
        roles[role.moduleKey + "_" + role.pageKey + "_" + role.actionKey] = true;
      }
    }
    localStorage.setItem("roles", JSON.stringify(roles));
  }

  /**R
   * Clear login data
   */
  logout() {
    ["AdminToken", "username", "name", "isSuper", "roles"].forEach((x) => {
      localStorage.removeItem(x);
    });
  }

  /**
   * Set current locale
   * @param locale locale
   */
  setCurrentLang(locale: string) {
    localStorage.setItem("locale", locale);
  }

  /**
   * Get current language
   */
  getCurrentLang() {
    return localStorage.getItem("locale");
  }

  /**
   * Get current email
   */
  getUserEmail() {
    return localStorage.getItem("email") || "";
  }
  /**
   * Get current username
   */
  getUserName() {
    return localStorage.getItem("name") || "";
  }

  /**
   * Get current user theme
   */
  getUserTheme() {
    return localStorage.getItem("theme");
  }

  /**
   * Set user theme
   * @param theme theme
   */
  setUserTheme(theme: string) {
    localStorage.setItem("theme", theme);
  }

  /**
   * Set username
   */
  setUserName(name: string) {
    localStorage.setItem("name", name);
  }

  /**
   * Clear all static values
   */
  clear() {
    this.roles = null;
    this.localCurrency = null;
    this.logout();
  }
}
