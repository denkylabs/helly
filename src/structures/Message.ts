import { APIMessage, MessageType } from 'discord-api-types/v10';
import type { Client } from '../client/Client';
import { Parsers } from '../utils/Transformers';
import { BaseStructure } from './BaseStructure';
import type { MessageOptions, MessagePayload } from './Channel';
import { Embed } from './Embed';
import { GuildMember } from './GuildMember';

export type MessageData = Partial<Message>;

class Message extends BaseStructure {
  /** Raw message data */
  data: APIMessage;
  constructor(client: Client, data: APIMessage) {
    super(client);
    this.parseData(data);
  }

  get author() {
    return this.client.users.cache.get(this.data.author.id) ?? this.client.users.updateOrSet(this.data.author.id, this.data.author);
  }

  /** The id of the application of the interaction that sent this message, if any */
  get applicationId() {
    return this.data.application_id;
  }

  /** The message's content */
  get content() {
    return this.data.content;
  }

  /** The message's id */
  get id() {
    return this.data.id;
  }

  /** Whether or not this message is pinned */
  get pinned() {
    return this.data.pinned;
  }

  /** Whether or not the message was Text-To-Speech */
  get tts() {
    return this.data.tts;
  }

  /** A random number or string used for checking message delivery */
  get nonce() {
    return this.data.nonce;
  }

  /* A list of embeds in the message - e.g. YouTube Player */
  get embeds() {
    return this.data.embeds.map(e => new Embed(e));
  }

  /** The {@link Guild} that the message belongs to */
  get guild() {
    return !this.guildId ? undefined : this.client.caches.guilds.get(this.guildId);
  }

  /** The {@link Channel} that the message belongs to */
  get channel() {
    return !this.channelId ? undefined : this.client.caches.channels.get(this.channelId);
  }

  /** The URL to jump to this message */
  get url() {
    return `https://discord.com/channels/${this.guildId ?? '@me'}/${this.channelId}/${this.id}`;
  }

  /** Message reference data */
  get messageReference() {
    return Parsers.parseMessageReference(this.data.message_reference);
  }

  /** Whether or not this message was sent by Discord, not actually a user (e.g. pin notifications) */
  get system() {
    return ![MessageType.Default, MessageType.Reply, MessageType.ChatInputCommand, MessageType.ContextMenuCommand].includes(this.data.type);
  }

  /** The type of the message */
  get type() {
    return Parsers.parseMessageFlags(this.data.flags);
  }

  /** Represents the author of the message as a guild member. */
  get member() {
    if (!this.guild) return undefined;
    return this.data.member ? new GuildMember(this.client, this.data.member, this.guild) : this.guild?.members.cache.get(this.author.id);
  }

  /** The id of the channel the message is in */
  get channelId() {
    return this.data.channel_id;
  }

  /** The id of the guild the message is in */
  get guildId() {
    return this.data.guild_id ?? this.channel?.guild?.id;
  }

  /**
   * Replies to the message
   * @param content - The content of the message
   * @example
   * ```js
   * const { Embed } = require('helly');
   * const embed = new Embed().setTitle('Pong!')
   * message.reply({ embeds: [embed] })
   * ```
   * @example
   * ```js
   * const { Embed } = require('helly');
   * const embed = new Embed().setTitle('Pong!')
   * message.reply({ content: 'Ping?', embeds: [embed] })
   * ```
   * @example
   * ```js
   * if (message.content === 'Hello!') message.reply('Hello!')
   * ```
   */
  reply(content: MessageOptions) {
    const parsedContent = (typeof content === 'string' ? { content } : content) as MessagePayload;

    parsedContent.messageReference = {
      messageId: this.id,
      channelId: this.channelId,
      guildId: this.guildId,
      failIfNotExists: this.client.options.failIfNotExists,
    };

    return this.channel?.send(content);
  }

  /** @private */
  parseData(data: APIMessage) {
    if (!data) return this;

    this.data = { ...this.data, ...data };
    return this;
  }
}

export { Message };
