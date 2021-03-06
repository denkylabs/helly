import { APIDMChannel, APIUser, Routes } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import { User } from '../structures';

/** Manages API methods for {@link User}s */
class UserManager {
  /** The {@link Client} that instantiated this Manager */
  client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  /** User that the client is logged in as */
  get me() {
    return this.cache.get(this.client.id);
  }

  /** A manager of the users belonging to this client */
  get cache() {
    return this.client.caches.users;
  }

  /** Creates a DM{@link Channel} between the client and a user */
  async createDM(id: string) {
    const data = (await this.client.rest.make(Routes.userChannels(), 'Post', { recipient_id: id })) as APIDMChannel;
    return this.client.channels.updateOrSet(data.id, data);
  }

  /** Obtains a user from Discord, or the user cache if it's already available */
  async fetch(id: string) {
    const data = (await this.client.rest.make(Routes.user(id))) as APIUser;
    return this.updateOrSet(id, data);
  }

  /**
   * Updates or caches a {@link User} with the provided {@link APIUser} data
   * @private
   */
  updateOrSet(id: string, data: APIUser) {
    const cachedUser = this.client.caches.users.get(id);
    if (cachedUser) return cachedUser.parseData(data);

    const user = new User(this.client, data);
    this.client.caches.users.set(id, user);

    return user;
  }
}

export { UserManager };
