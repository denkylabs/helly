import { MessageOptions, Webhook } from '../structures';
import { Client } from './Client';

/** The webhook client */
class WebhookClient {
  /** The id of the webhook */
  id: string;
  /** The token of the webhook */
  token: string;
  /** The webhook representing this client */
  webhook: Webhook;
  /**
   * @param client A {@link Client} instance
   * @param id The id of the webhook
   * @param token The token of the webhook
   */
  constructor(client: Client, id: string, token: string) {
    if (!client) throw new Error('A client must be provided');
    if (!(client instanceof Client)) throw new Error('The client must be an instance of Client');

    if (!id) throw new Error('The id of the webhook is required.');
    if (!token) throw new Error('The token of the webhook is required.');

    this.webhook = new Webhook(client, { id, token });
  }

  /**
   * Sends a message with this webhook
   * @param content The content of the message
   * @example
   * ```js
   * const { EmbedBuilder } = require('helly');
   * const embed = new EmbedBuilder().setTitle('...world!')
   * webhook.send({ content: 'Hello...', embeds: [embed] })
   * ```
   * @example
   * ```js
   * webhook.send('I\'m watching you!')
   * ```
   */
  send(content: MessageOptions) {
    return this.webhook.send(content);
  }

  /**
   * Sends a raw slack message with this webhook
   * @param message The data to send
   * @example
   * ```js
   * webhook.sendSlackMessage({
   *  'username': 'Wumpus',
   *  'text': 'Hey there!',
   *  'attachments': [{
   *    'pretext': 'this looks pretty cool',
   *    'color': '#F0F',
   *    'ts': 123456789
   *  }]
   * })
   * ```
   * @see https://api.slack.com/incoming-webhooks
   * @see https://discord.com/developers/docs/resources/webhook#execute-slackcompatible-webhook
   */
  sendSlackMessage(message: Record<string, unknown>) {
    return this.webhook.sendSlackMessage(message);
  }

  /** Gets a message that was sent by this webhook */
  fetchMessage(id: string) {
    return this.webhook.fetchMessage(id);
  }

  /** Deletes a message that was sent by this webhook */
  deleteMessage(id: string) {
    return this.webhook.deleteMessage(id);
  }

  /**
   * Edits a message that was sent by this webhook
   * @param id The Id of the message to edit
   * @param content The new content of the message
   * @example
   * ```js
   * const { EmbedBuilder } = require('helly');
   * const embed = new EmbedBuilder().setTitle('...world!')
   * webhook.editMessage('123456789123456', { content: 'Hello...', embeds: [embed] })
   * ```
   * @example
   * ```js
   * webhook.editMessage('123456789123456', 'I\'m watching you!')
   * ```
   */
  editMessage(id: string, content: MessageOptions) {
    return this.webhook.editMessage(id, content);
  }
}

export { WebhookClient };
