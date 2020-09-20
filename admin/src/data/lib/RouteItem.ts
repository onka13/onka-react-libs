import { Component } from "react";
import { PageConfig } from "./PageConfig";

export class RouteItem {
  list: any;
  detail: any;
  edit: any;
  create: any;
  config!: PageConfig;

  public constructor(init?: Partial<RouteItem>) {
    Object.assign(this, init);
  }
}
