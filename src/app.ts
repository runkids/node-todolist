import * as http from 'http';
import Router from '@/lib/router';
import Response from '@/lib/response';

class App {
  public port: string | number;
  public server: http.Server;

  constructor(routes) {
    const router = new Router();
    this.port = process.env.PORT || 4000;

    Response.setHeaders({
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,PATCH,DELETE',
      'Content-Type': 'application/json',
    });

    //註冊路由
    routes.forEach(Route => {
      new Route(router);
    });

    function requestListener(req: http.IncomingMessage, res: http.ServerResponse) {
      let body = '';
      req
        .on('data', chunk => {
          body += chunk;
        })
        .on('end', () => {
          //執行註冊過的路由
          router.runStack(req, res, body);
        });
    }

    this.server = http.createServer(requestListener);
  }

  public listen() {
    this.server.listen(this.port, () => {
      console.info(`=================================`);
      console.info(`🚀 App listening on the port ${this.port}`);
      console.info(`=================================`);
    });
  }
}

export default App;
