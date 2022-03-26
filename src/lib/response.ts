import { ServerResponse, OutgoingHttpHeaders, OutgoingHttpHeader } from 'http';

export let headers: OutgoingHttpHeaders | OutgoingHttpHeader[] = {
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,PATCH,DELETE',
  'Content-Type': 'application/json',
};

class Response {
  private res: ServerResponse;

  constructor(res: ServerResponse) {
    this.res = res;
  }

  public headers(setting: Record<string, any>) {
    headers = setting;
    return this;
  }

  public status(statusCode: number) {
    this.res.writeHead(statusCode, headers);
    return this;
  }

  public json(body: Record<string, any>) {
    this.res.write(JSON.stringify(body));
    this.end();
  }

  public end() {
    this.res.end();
  }
}

export default Response;
