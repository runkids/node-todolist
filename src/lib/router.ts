import { IncomingMessage, ServerResponse } from 'http';
import Response from '@/lib/response';
import { match } from 'path-to-regexp';

type Methods = 'get' | 'options' | 'post' | 'delete' | 'patch';
export type RouteMiddleware = (req: IncomingMessage, res: ServerResponse, { body: string, params: any }) => void;

const resHandler = new Response();

class Router {
  private stack = [];
  private request: IncomingMessage;
  private response: ServerResponse;
  private url: string;
  private method: Methods;

  private pathMatcher(method: Methods, path: string, callback: RouteMiddleware) {
    return (body: string) => {
      const pathMatch = match(path, { decode: decodeURIComponent });
      if (this.method === method && pathMatch(this.url) !== false) {
        // parse params from request url
        const { params } = pathMatch(this.url) as { path: string; index: number; params: Record<string, any> };
        callback(this.request, this.response, { body, params });
        return true;
      } else {
        return false;
      }
    };
  }

  public options(path: string, callback: RouteMiddleware) {
    this.stack.push(this.pathMatcher('options', path, callback));
  }

  public get(path: string, callback: RouteMiddleware) {
    this.stack.push(this.pathMatcher('get', path, callback));
  }

  public post(path: string, callback: RouteMiddleware) {
    this.stack.push(this.pathMatcher('post', path, callback));
  }

  public patch(path: string, callback: RouteMiddleware) {
    this.stack.push(this.pathMatcher('patch', path, callback));
  }

  public delete(path: string, callback: RouteMiddleware) {
    this.stack.push(this.pathMatcher('delete', path, callback));
  }

  private pathNotFound() {
    const resHandler = new Response();
    resHandler.handle(this.response).status(404).json({ status: 'failed', message: '無此網站路由' }).end();
  }

  public runStack(req, res, body: string) {
    this.request = req;
    this.response = res;
    this.url = req.url;
    this.method = req.method.toLowerCase() as Methods;

    this.options(this.url, () => {
      resHandler.handle(this.response).status(200).end();
    });

    let match = false;
    let idx = 0;
    //當有符合的路徑就不再執行 while ，全部都沒有符合就視為找不到路徑
    while (match !== true && idx < this.stack.length) {
      match = this.stack[idx](body);
      if (match === true) {
        continue;
      }
      idx++;
    }
    if (!match) {
      this.pathNotFound();
    }
  }
}

export default Router;
