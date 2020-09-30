import { ReactNode } from "react";
import { RouteItem } from "./RouteItem";

export class Menu {
  
  menuKey!: string;
  
  icon?: ReactNode;

  routes!: RouteItem[];

  hasAccess!: boolean;

  public constructor(init?: Partial<Menu>) {
    Object.assign(this, init);
  }
}
