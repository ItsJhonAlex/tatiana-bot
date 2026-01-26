import { pgTable, varchar, text, timestamp, bigint, boolean } from 'drizzle-orm/pg-core';

/**
 * Command Usage table - Tracks command usage statistics
 */
export const commandUsage = pgTable('command_usage', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  guildId: varchar('guild_id', { length: 20 }),
  userId: varchar('user_id', { length: 20 }).notNull(),
  commandName: varchar('command_name', { length: 100 }).notNull(),
  success: boolean('success').default(true),
  error: text('error'),
  executedAt: timestamp('executed_at').defaultNow().notNull()
});

// Export types
export type CommandUsage = typeof commandUsage.$inferSelect;
export type NewCommandUsage = typeof commandUsage.$inferInsert;
