import { pgTable, varchar, timestamp, bigint, jsonb } from 'drizzle-orm/pg-core';
import { guilds } from './guilds';
import { users } from './users';

/**
 * Guild Members table - Stores user data per guild
 */
export const guildMembers = pgTable('guild_members', {
  guildId: varchar('guild_id', { length: 20 })
    .notNull()
    .references(() => guilds.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 20 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  nickname: varchar('nickname', { length: 32 }),
  joinedAt: timestamp('joined_at').notNull(),
  leftAt: timestamp('left_at'),
  experience: bigint('experience', { mode: 'number' }).default(0),
  level: bigint('level', { mode: 'number' }).default(1),
  messageCount: bigint('message_count', { mode: 'number' }).default(0),
  data: jsonb('data').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Export types
export type GuildMember = typeof guildMembers.$inferSelect;
export type NewGuildMember = typeof guildMembers.$inferInsert;
