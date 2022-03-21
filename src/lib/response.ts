import { ServerResponse, OutgoingHttpHeaders, OutgoingHttpHeader } from 'http';

let headers: OutgoingHttpHeaders | OutgoingHttpHeader[] = {};

class Response {
  private serverResponse: ServerResponse;

  constructor(res: ServerResponse) {
    this.serverResponse = res;
  }

  static setHeaders(setting) {
    headers = setting;
  }

  public status(statusCode: number) {
    this.serverResponse.writeHead(statusCode, headers);
    return this;
  }

  public json(resBody: Record<string, any>) {
    this.serverResponse.write(JSON.stringify(resBody));
    return this;
  }

  public end() {
    this.serverResponse.end();
  }
}

export default Response;
