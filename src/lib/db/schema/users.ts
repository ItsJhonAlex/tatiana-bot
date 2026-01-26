import { pgTable, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';

/**
 * Users table - Stores Discord user data
 */
export const users = pgTable('users', {
  id: varchar('id', { length: 20 }).primaryKey(), // Discord user ID
  username: varchar('username', { length: 32 }).notNull(), // New unique username system
  globalName: varchar('global_name', { length: 32 }), // Display name (can be different from username)
  avatar: varchar('avatar', { length: 100 }),
  bot: boolean('bot').default(false),
  language: varchar('language', { length: 10 }).default('en-US'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
