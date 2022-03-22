import { ServerResponse, OutgoingHttpHeaders, OutgoingHttpHeader } from 'http';

let headers: OutgoingHttpHeaders | OutgoingHttpHeader[] = {};

class Response {
  private res: ServerResponse;

  constructor(res: ServerResponse) {
    this.res = res;
  }

  static setHeaders(setting: Record<string, any>) {
    headers = setting;
  }

  public status(statusCode: number) {
    this.res.writeHead(statusCode, headers);
    return this;
  }

  public json(body: Record<string, any>) {
    this.res.write(JSON.stringify(body));
    return this;
  }

  public end() {
    this.res.end();
  }
}

export default Response;
