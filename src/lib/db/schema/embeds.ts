import { jsonb, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';
import { guilds } from './guilds';

/**
 * Embed data structure
 */
export interface EmbedData {
  title?: string;
  description?: string;
  color?: number;
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  image?: string;
  thumbnail?: string;
  footer?: {
    text: string;
    iconUrl?: string;
  };
  author?: {
    name: string;
    iconUrl?: string;
    url?: string;
  };
  timestamp?: boolean;
  url?: string;
}

/**
 * Embeds table - Stores custom embeds for guilds
 */
export const embeds = pgTable('embeds', {
  id: varchar('id', { length: 50 }).primaryKey(), // Format: guildId_embedName
  guildId: varchar('guild_id', { length: 20 })
    .notNull()
    .references(() => guilds.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 50 }).notNull(), // Unique name within guild
  data: jsonb('data').$type<EmbedData>().notNull(),
  createdBy: varchar('created_by', { length: 20 }).notNull(), // User ID
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Export types
export type Embed = typeof embeds.$inferSelect;
export type NewEmbed = typeof embeds.$inferInsert;
