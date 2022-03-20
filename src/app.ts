import * as http from 'http';
import Router from '@/utils/router';

class App {
  public port: string | number;
  public server: http.Server;

  constructor(routes) {
    this.port = process.env.PORT || 3000;
    this.server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
      let body = '';
      const router = new Router(req, res);

      req.on('data', chunk => {
        body += chunk;
      });

      req.on('end', () => {
        routes.forEach(Route => {
          new Route(router, body);
        });
      });
    });
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
