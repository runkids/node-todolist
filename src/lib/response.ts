import { ServerResponse, OutgoingHttpHeaders, OutgoingHttpHeader } from 'http';

let headers: OutgoingHttpHeaders | OutgoingHttpHeader[] = {};

class Response {
  private res: ServerResponse;

  constructor(res: ServerResponse) {
    this.res = res;
  }

  static initHeaders(setting: Record<string, any>) {
    headers = setting;
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
