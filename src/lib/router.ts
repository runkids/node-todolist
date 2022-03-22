import Response from '@/lib/response';
import Request from '@/lib/request';
import { match, Match } from 'path-to-regexp';
import { HttpStatus } from '@/config';

type Methods = 'get' | 'options' | 'post' | 'delete' | 'patch';
type PathMatcher = (method: Methods, path: string, middleware: RouteMiddleware) => () => boolean;
export type RouteMiddleware = (req: Request, res: Response) => void;

class Router {
  private stack: Array<() => boolean> = [];
  private request: Request;
  private response: Response;
  private url: string;
  private method: Methods;

  private pathMatcher: PathMatcher = (method, path, middleware) => {
    return () => {
      const pathMatch = match(path, { decode: decodeURIComponent });
      const pathMatchResult: Match = pathMatch(this.url);

      if (this.method === method && pathMatchResult !== false) {
        this.request.params = pathMatchResult.params;

        try {
          middleware(this.request, this.response);
        } catch (e) {
          // 共用錯誤捕捉
          this.errorHandler(e);
        }

        return true;
      } else {
        return false;
      }
    };
  };

  public options(path: string, middleware: RouteMiddleware) {
    this.stack.push(this.pathMatcher('options', path, middleware));
  }

  public get(path: string, middleware: RouteMiddleware) {
    this.stack.push(this.pathMatcher('get', path, middleware));
  }

  public post(path: string, middleware: RouteMiddleware) {
    this.stack.push(this.pathMatcher('post', path, middleware));
  }

  public patch(path: string, middleware: RouteMiddleware) {
    this.stack.push(this.pathMatcher('patch', path, middleware));
  }

  public delete(path: string, middleware: RouteMiddleware) {
    this.stack.push(this.pathMatcher('delete', path, middleware));
  }

  private pathNotFound() {
    this.response.status(HttpStatus.NOT_FOUND).json({ status: 'failed', message: '無此網站路由' });
  }

  private errorHandler(error) {
    this.response.status(HttpStatus.BAD_REQUEST).json({ status: 'failed', message: `${error}` });
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
