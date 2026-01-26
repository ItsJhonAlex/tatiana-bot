import { boolean, jsonb, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

/**
 * Guild Settings - Type-safe settings object
 */
export interface GuildSettings {
  // Channels
  welcomeChannel?: string;
  logChannel?: string;
  announcementsChannel?: string;

  // Messages
  welcomeMessage?: string;
  leaveMessage?: string;

  // Roles
  autoRole?: string;
  modRoles?: string[];

  // Features
  features?: {
    logging?: boolean;
    autoroles?: boolean;
    leveling?: boolean;
    moderation?: boolean;
  };

  // Custom data
  [key: string]: unknown;
}

/**
 * Guilds table - Stores Discord guild (server) configurations
 */
export const guilds = pgTable('guilds', {
  id: varchar('id', { length: 20 }).primaryKey(), // Discord guild ID
  name: varchar('name', { length: 100 }).notNull(),
  prefix: varchar('prefix', { length: 10 }).default('!'),
  language: varchar('language', { length: 10 }).default('en-US'),
  premium: boolean('premium').default(false),
  settings: jsonb('settings').$type<GuildSettings>().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Export types
export type Guild = typeof guilds.$inferSelect;
export type NewGuild = typeof guilds.$inferInsert;
