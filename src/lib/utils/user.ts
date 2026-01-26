import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';

/**
 * Get user language from database
 * @param userId Discord user ID
 * @returns User's preferred language or default 'en-US'
 */
export async function getUserLanguage(userId: string): Promise<string> {
  try {
    const user = await db.select({ language: users.language }).from(users).where(eq(users.id, userId)).limit(1);

    if (user.length > 0 && user[0]?.language) {
      return user[0].language;
    }

    return 'en-US';
  } catch (error) {
    console.error('Error fetching user language:', error);
    return 'en-US';
  }
}
