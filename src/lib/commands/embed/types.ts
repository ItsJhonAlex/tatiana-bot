import type { EmbedData } from '../../db/schema/embeds.js';

export interface CreateEmbedOptions {
  guildId: string;
  name: string;
  data: EmbedData;
  createdBy: string;
}

export interface UpdateEmbedOptions {
  guildId: string;
  name: string;
  data: Partial<EmbedData>;
}

export interface EmbedResult {
  success: boolean;
  embedName?: string;
  error?: string;
}

export interface ListEmbedsResult {
  success: boolean;
  embeds?: Array<{ name: string; title?: string }>;
  error?: string;
}
