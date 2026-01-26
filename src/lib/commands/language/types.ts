export interface LanguageUpdateResult {
  success: boolean;
  language?: string;
  error?: string;
}

export interface LanguageUpdateOptions {
  guildId: string;
  language: string;
}
