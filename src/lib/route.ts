export default class BaseRoute<T> {
  path: string;
  controller: T;

  constructor(path: string, controller: T) {
    this.path = path;
    this.controller = controller;
  }
}
