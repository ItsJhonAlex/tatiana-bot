import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import type { Client } from 'discord.js';
import { db } from '../lib/db';

@ApplyOptions<Listener.Options>({
  event: 'ready',
  once: true
})
export class ReadyListener extends Listener {
  public override async run(client: Client) {
    const { username, id } = client.user!;

    this.container.logger.info(`Successfully logged in as ${username} (${id})`);
    this.container.logger.info(`Database connected: ${!!db}`);
    this.container.logger.info('Tatiana Bot is ready!');
  }
}
