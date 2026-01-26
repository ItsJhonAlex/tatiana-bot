/**
 * Map Discord locale codes to supported bot languages
 */
export const LOCALE_MAP: Record<string, string> = {
  // English variants
  'en-US': 'en-US',
  'en-GB': 'en-US',

  // Spanish variants
  'es-ES': 'es-ES',
  'es-419': 'es-ES', // Latin America
  'es-MX': 'es-ES', // Mexico
  'es-AR': 'es-ES', // Argentina
  'es-CL': 'es-ES', // Chile
  'es-CO': 'es-ES', // Colombia

  // Portuguese
  'pt-BR': 'en-US' // TODO: Add pt-BR support

  // Add more mappings as needed
};

/**
 * Get bot language from Discord locale
 */
export function mapDiscordLocale(discordLocale: string): string {
  return LOCALE_MAP[discordLocale] || 'en-US';
}

/**
 * Supported languages
 */
export const SUPPORTED_LANGUAGES = ['en-US', 'es-ES'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
