import { EmbedBuilder } from 'discord.js';
import { and, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { embeds, type EmbedData } from '../../db/schema/index.js';
import { parseVariables, type VariableContext } from '../../utils/variables.js';
import type { CreateEmbedOptions, EmbedResult, ListEmbedsResult, UpdateEmbedOptions } from './types.js';

export class EmbedLogic {
  /**
   * Create a new embed
   */
  static async createEmbed(options: CreateEmbedOptions): Promise<EmbedResult> {
    const { guildId, name, data, createdBy } = options;

    try {
      // Check if embed already exists
      const existing = await db
        .select()
        .from(embeds)
        .where(and(eq(embeds.guildId, guildId), eq(embeds.name, name)))
        .limit(1);

      if (existing.length > 0) {
        return {
          success: false,
          error: 'An embed with this name already exists'
        };
      }

      // Create embed
      await db.insert(embeds).values({
        id: `${guildId}_${name}`,
        guildId,
        name,
        data,
        createdBy
      });

      return {
        success: true,
        embedName: name
      };
    } catch (error) {
      console.error('Error creating embed:', error);
      return {
        success: false,
        error: 'Database error'
      };
    }
  }

  /**
   * Update an existing embed
   */
  static async updateEmbed(options: UpdateEmbedOptions): Promise<EmbedResult> {
    const { guildId, name, data } = options;

    try {
      // Get existing embed
      const existing = await db
        .select()
        .from(embeds)
        .where(and(eq(embeds.guildId, guildId), eq(embeds.name, name)))
        .limit(1);

      if (existing.length === 0) {
        return {
          success: false,
          error: 'Embed not found'
        };
      }

      // Merge existing data with new data
      const updatedData: EmbedData = {
        ...(existing[0]?.data || {}),
        ...data
      };

      // Update embed
      await db
        .update(embeds)
        .set({
          data: updatedData,
          updatedAt: new Date()
        })
        .where(and(eq(embeds.guildId, guildId), eq(embeds.name, name)));

      return {
        success: true,
        embedName: name
      };
    } catch (error) {
      console.error('Error updating embed:', error);
      return {
        success: false,
        error: 'Database error'
      };
    }
  }

  /**
   * Get an embed by name
   */
  static async getEmbed(guildId: string, name: string): Promise<EmbedData | null> {
    try {
      const result = await db
        .select()
        .from(embeds)
        .where(and(eq(embeds.guildId, guildId), eq(embeds.name, name)))
        .limit(1);

      return result.length > 0 ? result[0]?.data || null : null;
    } catch (error) {
      console.error('Error getting embed:', error);
      return null;
    }
  }

  /**
   * Delete an embed
   */
  static async deleteEmbed(guildId: string, name: string): Promise<EmbedResult> {
    try {
      const result = await db
        .delete(embeds)
        .where(and(eq(embeds.guildId, guildId), eq(embeds.name, name)))
        .returning();

      if (result.length === 0) {
        return {
          success: false,
          error: 'Embed not found'
        };
      }

      return {
        success: true,
        embedName: name
      };
    } catch (error) {
      console.error('Error deleting embed:', error);
      return {
        success: false,
        error: 'Database error'
      };
    }
  }

  /**
   * List all embeds for a guild
   */
  static async listEmbeds(guildId: string): Promise<ListEmbedsResult> {
    try {
      const result = await db.select().from(embeds).where(eq(embeds.guildId, guildId));

      return {
        success: true,
        embeds: result.map((embed) => ({
          name: embed.name,
          title: embed.data.title
        }))
      };
    } catch (error) {
      console.error('Error listing embeds:', error);
      return {
        success: false,
        error: 'Database error'
      };
    }
  }

  /**
   * Convert EmbedData to Discord EmbedBuilder
   * @param data Embed data
   * @param context Optional variable context for parsing variables in text
   */
  static buildEmbed(data: EmbedData, context?: VariableContext): EmbedBuilder {
    const embed = new EmbedBuilder();

    // Parse variables in text fields if context is provided
    const parseText = (text: string | undefined) => {
      if (!text) return text;
      return context ? parseVariables(text, context) : text;
    };

    if (data.title) embed.setTitle(parseText(data.title)!);
    if (data.description) embed.setDescription(parseText(data.description)!);
    if (data.color) embed.setColor(data.color);
    if (data.url) embed.setURL(data.url);
    if (data.image) embed.setImage(data.image);
    if (data.thumbnail) embed.setThumbnail(data.thumbnail);
    if (data.timestamp) embed.setTimestamp();

    if (data.fields && data.fields.length > 0) {
      const parsedFields = data.fields.map((field) => ({
        name: parseText(field.name)!,
        value: parseText(field.value)!,
        inline: field.inline
      }));
      embed.addFields(parsedFields);
    }

    if (data.footer) {
      embed.setFooter({
        text: parseText(data.footer.text)!,
        iconURL: data.footer.iconUrl
      });
    }

    if (data.author) {
      embed.setAuthor({
        name: parseText(data.author.name)!,
        iconURL: data.author.iconUrl,
        url: data.author.url
      });
    }

    return embed;
  }
}
