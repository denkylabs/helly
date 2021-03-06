import { RequestMethod, REST } from '@discordjs/rest';
import type { Client } from '../../client/Client';

type Headers = Record<string, string>;
type Methods = keyof typeof RequestMethod;

/** This is a utility class that makes requests to the Discord API easier */
class RestManager extends REST {
  /** The {@link Client} that instantiated this Manager */
  client: Client;
  constructor(client: Client) {
    super({
      api: client.options.rest.api,
      cdn: client.options.rest.cdn,
      version: client.options.ws.version,
    });
    this.setToken(client.token);
    this.client = client;
  }

  make(endpoint: string, method: Methods = 'Get', body = undefined as unknown, headers = {} as Headers) {
    const fullRoute: `/${string}` = endpoint.startsWith('/') ? (endpoint as `/${string}`) : `/${endpoint}`;
    return this.request({
      fullRoute,
      body,
      method: method as RequestMethod,
      headers,
    });
  }
}

export { RestManager };
