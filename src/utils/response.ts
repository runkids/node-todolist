import { ServerResponse } from 'http';

const HEADERS = {
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
  'Content-Type': 'application/json',
};

class Response {
  private res: ServerResponse;

  public handle(res: ServerResponse) {
    this.res = res;
    return this;
  }

  public status(statusCode: number) {
    this.res.writeHead(statusCode, HEADERS);
    return this;
  }

  public json(resBody: Record<string, any>) {
    this.res.write(JSON.stringify(resBody));
    return this;
  }

  public end() {
    this.res.end();
  }
}

export default Response;
