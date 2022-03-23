import Response from '@/lib/response';
import Request from '@/lib/request';
import { match, Match } from 'path-to-regexp';
import { HttpStatus } from '@/config';

type Method = 'get' | 'options' | 'post' | 'delete' | 'patch';
type PathMatcher = (method: Method, path: string, middleware: RouteHandler) => () => boolean;
export type RouteHandler = (req: Request, res: Response) => void;

class Router {
  private stack: Array<() => boolean> = [];
  private request: Request;
  private response: Response;
  private url: string;
  private method: Method;

  private pathMatcher: PathMatcher = (method, path, handler) => {
    return () => {
      const pathMatch = match(path, { decode: decodeURIComponent });
      const pathMatchResult: Match = pathMatch(this.url);

      if (this.method === method && pathMatchResult !== false) {
        this.request.params = pathMatchResult.params;

        try {
          handler(this.request, this.response);
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

  public options(path: string, handler: RouteHandler) {
    this.stack.push(this.pathMatcher('options', path, handler));
  }

  public get(path: string, handler: RouteHandler) {
    this.stack.push(this.pathMatcher('get', path, handler));
  }

  public post(path: string, handler: RouteHandler) {
    this.stack.push(this.pathMatcher('post', path, handler));
  }

  public patch(path: string, handler: RouteHandler) {
    this.stack.push(this.pathMatcher('patch', path, handler));
  }

  public delete(path: string, handler: RouteHandler) {
    this.stack.push(this.pathMatcher('delete', path, handler));
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
    this.method = req.method.toLowerCase() as Method;

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
