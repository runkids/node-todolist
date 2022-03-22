import * as http from 'http';
import Router from '@/lib/router';
import Response from '@/lib/response';
import Request from '@/lib/request';

class App {
  public server: http.Server;

  constructor(routes) {
    const router = new Router();

    Response.initHeaders({
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
          router.runStack(new Request(req, body), new Response(res));
        });
    }

    this.server = http.createServer(requestListener);
  }

  public listen(port: string | number) {
    this.server.listen(port, () => {
      console.info(`=================================`);
      console.info(`🚀 App listening on the port ${port}`);
      console.info(`=================================`);
    });
  }
}

export default App;
