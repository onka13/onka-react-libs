import { RouteItem } from "./RouteItem";

export class Menu {
  
  menuKey!: string;
  
  icon?: string;

  routes!: RouteItem[];

  hasAccess!: boolean;

  public constructor(init?: Partial<Menu>) {
    Object.assign(this, init);
  }
}
