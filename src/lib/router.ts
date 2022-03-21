import Response from '@/lib/response';
import { IncomingMessage } from 'http';
import { match } from 'path-to-regexp';
import { HttpStatus } from '@/config';

type Methods = 'get' | 'options' | 'post' | 'delete' | 'patch';

type Request = IncomingMessage & { body: string };

type PathMatchResult = { path: string; index: number; params: Record<string, any> };

type MiddleWareRequest = Request & {
  params: any;
};

type MiddleWareResponse = Response;

export type RouteMiddleware = (req: MiddleWareRequest, res: MiddleWareResponse) => void;

class Router {
  private stack: Array<() => boolean> = [];
  private request: Request;
  private response: Response;
  private url: string;
  private method: Methods;

  private pathMatcher(method: Methods, path: string, callback: RouteMiddleware): () => boolean {
    return () => {
      const pathMatch = match(path, { decode: decodeURIComponent });
      const pathMatchResult = pathMatch(this.url) as unknown;

      if (this.method === method && pathMatchResult !== false) {
        // parse params from request url
        const { params } = pathMatchResult as PathMatchResult;
        const req = Object.assign(this.request, { params });
        const res = this.response;

        callback(req, res);

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
    this.response.status(HttpStatus.NOT_FOUND).json({ status: 'failed', message: '無此網站路由' }).end();
  }

  public runStack(req: Request, res: Response) {
    this.request = req;
    this.response = res;
    this.url = req.url;
    this.method = req.method.toLowerCase() as Methods;

    this.options(this.url, () => {
      this.response.status(HttpStatus.OK).end();
    });

    let match = false;
    let idx = 0;
    //當有符合的路徑就不再執行 while ，全部都沒有符合就視為找不到路徑
    while (!match && idx < this.stack.length) {
      match = this.stack[idx]();
      if (match) {
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
