import { IncomingMessage, ServerResponse } from 'http';
import Response from '@/utils/response';
import { match } from 'path-to-regexp';

const resHandler = new Response();

class Router {
  private request: IncomingMessage;
  private response: ServerResponse;
  private url: string;
  private method: string;

  constructor(req: IncomingMessage, res: ServerResponse) {
    this.request = req;
    this.response = res;
    this.url = req.url;
    this.method = req.method?.toLowerCase();

    this.options(this.url, () => {
      resHandler.handle(this.response).status(200).end();
    });
  }

  private createRouteHandler(method: string, path: string, callback) {
    const pathMatch = match(path, { decode: decodeURIComponent });
    if (this.method === method && pathMatch(this.url) !== false) {
      // parse params from request url
      const { params } = pathMatch(this.url) as { path: string; index: number; params: Record<string, any> };
      callback({ ...this.request, params }, this.response);
    }
    if (this.url === '/') {
      this.notFoundHandler();
    }
  }

  public options(path: string, callback) {
    this.createRouteHandler('options', path, callback);
  }

  public get(path: string, callback) {
    this.createRouteHandler('get', path, callback);
  }

  public post(path: string, callback) {
    this.createRouteHandler('post', path, callback);
  }

  public patch(path: string, callback) {
    this.createRouteHandler('patch', path, callback);
  }

  public delete(path: string, callback) {
    this.createRouteHandler('delete', path, callback);
  }

  private notFoundHandler() {
    const resHandler = new Response();
    resHandler.handle(this.response).status(404).json({ status: 'failed', message: '無此網站路由' }).end();
  }
}

export default Router;
