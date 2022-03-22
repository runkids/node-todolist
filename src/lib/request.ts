import { IncomingMessage } from 'http';

class Request {
  private req: IncomingMessage & { body: string; params: Record<string, any> };

  constructor(req: IncomingMessage, body: string) {
    this.req = Object.assign(req, { body, params: {} });
  }

  set params(params) {
    this.req.params = params;
  }

  get params() {
    return this.req.params;
  }

  get body() {
    return this.req.body;
  }

  get method() {
    return this.req.method;
  }

  get url() {
    return this.req.url;
  }
}

export default Request;
