import { pgTable, varchar, timestamp, boolean, jsonb } from 'drizzle-orm/pg-core';

/**
 * Guilds table - Stores Discord guild (server) configurations
 */
export const guilds = pgTable('guilds', {
  id: varchar('id', { length: 20 }).primaryKey(), // Discord guild ID
  name: varchar('name', { length: 100 }).notNull(),
  prefix: varchar('prefix', { length: 10 }).default('!'),
  language: varchar('language', { length: 10 }).default('en-US'),
  premium: boolean('premium').default(false),
  settings: jsonb('settings').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Export types
export type Guild = typeof guilds.$inferSelect;
export type NewGuild = typeof guilds.$inferInsert;
