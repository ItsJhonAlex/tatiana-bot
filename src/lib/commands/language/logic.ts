import { eq } from 'drizzle-orm';
import { db } from '../../../lib/db/index.js';
import { guilds } from '../../../lib/db/schema/index.js';
import type { LanguageUpdateOptions, LanguageUpdateResult } from './types.js';

export class LanguageLogic {
  private static readonly SUPPORTED_LANGUAGES = ['en-US', 'es-ES'];
  private static readonly LANGUAGE_NAMES: Record<string, { en: string; es: string }> = {
    'en-US': { en: 'English (US)', es: 'Inglés (US)' },
    'es-ES': { en: 'Spanish (Spain)', es: 'Español (España)' }
  };

  /**
   * Update guild language in database
   */
  static async updateGuildLanguage(options: LanguageUpdateOptions): Promise<LanguageUpdateResult> {
    const { guildId, language } = options;

    try {
      // Validate language is supported
      if (!this.SUPPORTED_LANGUAGES.includes(language)) {
        return {
          success: false,
          error: 'Unsupported language'
        };
      }

      // Update guild language in database
      await db
        .update(guilds)
        .set({
          language,
          updatedAt: new Date()
        })
        .where(eq(guilds.id, guildId));

      return {
        success: true,
        language
      };
    } catch (error) {
      console.error('Error updating guild language:', error);
      return {
        success: false,
        error: 'Database error'
      };
    }
  }

  /**
   * Get language name in specific language
   */
  static getLanguageName(languageCode: string, displayLanguage: 'en' | 'es' = 'en'): string {
    return this.LANGUAGE_NAMES[languageCode]?.[displayLanguage] || languageCode;
  }

  /**
   * Get all supported languages
   */
  static getSupportedLanguages(): string[] {
    return [...this.SUPPORTED_LANGUAGES];
  }
}
