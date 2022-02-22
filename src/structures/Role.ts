import type { APIRole } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import { BaseStructure } from './BaseStructure';
import type { Guild } from './Guild';

class Role extends BaseStructure {
  /** Raw {@link Role} data */
  data: APIRole;
  /** @private */
  #guildId: string;
  constructor(client: Client, data: APIRole, guild: Guild) {
    super(client);
    this.#guildId = guild.id;
    this.parseData(data);
  }

  get name() {
    return this.data.name;
  }

  get id() {
    return this.data.id;
  }

  get guild() {
    return this.client.guilds.cache.get(this.#guildId);
  }

  /** @private */
  parseData(data: APIRole): this {
    if (!data) return this;
    this.data = { ...this.data, ...data };
    return this;
  }
}

export { Role };
