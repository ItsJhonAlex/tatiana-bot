import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import type { Guild } from 'discord.js';
import { eq } from 'drizzle-orm';
import { db } from '../lib/db';
import { guilds } from '../lib/db/schema';

@ApplyOptions<Listener.Options>({
  event: 'guildDelete'
})
export class GuildDeleteListener extends Listener {
  public override async run(guild: Guild) {
    try {
      // Delete the guild from the database
      await db.delete(guilds).where(eq(guilds.id, guild.id));

      this.container.logger.info(`Bot left guild: ${guild.name} (${guild.id})`);
      this.container.logger.info(`Total guilds: ${this.container.client.guilds.cache.size}`);
    } catch (error) {
      this.container.logger.error(`Failed to remove guild ${guild.name} (${guild.id}):`, error);
    }
  }
}
