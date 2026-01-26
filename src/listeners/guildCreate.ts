import { ApplyOptions } from '@sapphire/decorators';
import { Listener } from '@sapphire/framework';
import type { Guild } from 'discord.js';
import { eq } from 'drizzle-orm';
import { db } from '../lib/db';
import { guilds } from '../lib/db/schema';

@ApplyOptions<Listener.Options>({
  event: 'guildCreate'
})
export class GuildCreateListener extends Listener {
  public override async run(guild: Guild) {
    try {
      // Verificar si el servidor ya existe (por si acaso)
      const existingGuild = await db.select().from(guilds).where(eq(guilds.id, guild.id)).limit(1);

      if (existingGuild.length === 0) {
        // Register new guild in the database
        await db.insert(guilds).values({
          id: guild.id,
          name: guild.name
        });

        this.container.logger.info(`Bot joined new guild: ${guild.name} (${guild.id})`);
        this.container.logger.info(`Total guilds: ${this.container.client.guilds.cache.size}`);
      } else {
        this.container.logger.info(`Bot re-joined guild: ${guild.name} (${guild.id})`);
      }
    } catch (error) {
      this.container.logger.error(`Failed to register guild ${guild.name} (${guild.id}):`, error);
    }
  }
}
