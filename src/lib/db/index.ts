import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Database connection
const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// For migrations
export const migrationClient = postgres(connectionString, { max: 1 });

// For query purposes
const queryClient = postgres(connectionString);

export const db = drizzle(queryClient, { schema });

// Export all schema tables and types
export * from './schema';
