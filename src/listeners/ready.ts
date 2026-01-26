import { Listener } from '@sapphire/framework';
import type { Client } from 'discord.js';
import { db } from '../lib/db';

export class ReadyListener extends Listener {
  public constructor(context: Listener.LoaderContext, options: Listener.Options) {
    super(context, {
      ...options,
      event: 'ready',
      once: true
    });
  }

  public async run(client: Client) {
    const { username, id } = client.user!;

    this.container.logger.info(`Successfully logged in as ${username} (${id})`);
    this.container.logger.info(`Database connected: ${!!db}`);

    // Log ready status
    this.container.logger.info('Tatiana Bot is ready!');
  }
}
