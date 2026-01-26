import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<Listener.Options>({
  event: Events.MessageCreate
})
export class MessageCreateListener extends Listener {
  public override async run(message: Message) {
    if (message.author.bot) return;

    this.container.logger.debug(`Message received: ${message.content}`);
    this.container.logger.debug(`Prefix: ${this.container.client.options.defaultPrefix}`);
  }
}
