import { pgTable, varchar, text, timestamp, bigint, boolean } from 'drizzle-orm/pg-core';
import { guilds } from './guilds';
import { users } from './users';

/**
 * Warnings table - Stores user warnings per guild
 */
export const warnings = pgTable('warnings', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  guildId: varchar('guild_id', { length: 20 })
    .notNull()
    .references(() => guilds.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 20 })
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  moderatorId: varchar('moderator_id', { length: 20 }).notNull(),
  reason: text('reason').notNull(),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Export types
export type Warning = typeof warnings.$inferSelect;
export type NewWarning = typeof warnings.$inferInsert;
