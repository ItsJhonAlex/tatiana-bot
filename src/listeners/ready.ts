import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import { Events, type Client } from 'discord.js';
import { eq } from 'drizzle-orm';
import { db } from '../lib/db';
import { guilds } from '../lib/db/schema';

@ApplyOptions<Listener.Options>({
  event: Events.ClientReady,
  once: true
})
export class ReadyListener extends Listener {
  public override async run(client: Client) {
    try {
      const { username, id } = client.user!;

      this.container.logger.info(`Successfully logged in as ${username} (${id})`);
      this.container.logger.info(`Database connected: ${!!db}`);

      // Synchronize existing guilds with the database
      await this.syncGuilds(client);

      this.container.logger.info('Tatiana Bot is ready!');
      this.container.logger.info(`Commands loaded: ${this.container.stores.get('commands').size}`);
    } catch (error) {
      this.container.logger.error('Error in ready listener:', error);
    }
  }

  private async syncGuilds(client: Client) {
    const guildCount = client.guilds.cache.size;
    this.container.logger.info(`Syncing ${guildCount} guilds with database...`);

    let newGuilds = 0;
    let existingGuilds = 0;

    for (const [guildId, guild] of client.guilds.cache) {
      try {
        // Check if the guild already exists in the database
        const existingGuild = await db.select().from(guilds).where(eq(guilds.id, guildId)).limit(1);

        if (existingGuild.length === 0) {
          // Server exist insert new guild
          await db.insert(guilds).values({
            id: guildId,
            name: guild.name
          });
          newGuilds++;
          this.container.logger.info(`Registered new guild: ${guild.name} (${guildId})`);
        } else {
          // Server exists, update name if changed
          const dbGuild = existingGuild[0];
          if (dbGuild && dbGuild.name !== guild.name) {
            await db.update(guilds).set({ name: guild.name }).where(eq(guilds.id, guildId));
            this.container.logger.info(`Updated guild name: ${guild.name} (${guildId})`);
          }
          existingGuilds++;
        }
      } catch (error) {
        this.container.logger.error(`Failed to sync guild ${guild.name} (${guildId}):`, error);
      }
    }

    this.container.logger.info(`Guild sync complete: ${newGuilds} new, ${existingGuilds} existing`);
  }
}
