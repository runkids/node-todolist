import { ServerResponse, OutgoingHttpHeaders, OutgoingHttpHeader } from 'http';

let headers: OutgoingHttpHeaders | OutgoingHttpHeader[] = {};

class Response {
  private res: ServerResponse;

  static setHeaders(setting) {
    headers = setting;
  }

  public handle(res: ServerResponse) {
    this.res = res;
    return this;
  }

  public status(statusCode: number) {
    this.res.writeHead(statusCode, headers);
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
