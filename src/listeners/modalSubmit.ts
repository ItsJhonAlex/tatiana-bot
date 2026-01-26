import { Listener } from '@sapphire/framework';
import { Events, MessageFlags, type ModalSubmitInteraction } from 'discord.js';
import { EmbedLogic } from '../lib/commands/embed/logic.js';
import type { EmbedData } from '../lib/db/schema/embeds.js';

export class ModalSubmitListener extends Listener<typeof Events.InteractionCreate> {
  public constructor(context: Listener.LoaderContext, options: Listener.Options) {
    super(context, {
      ...options,
      event: Events.InteractionCreate
    });
  }

  public async run(interaction: ModalSubmitInteraction) {
    if (!interaction.isModalSubmit()) return;
    if (!interaction.customId.startsWith('embed-create-')) return;

    // Extract embed name from customId
    const embedName = interaction.customId.replace('embed-create-', '');

    if (!interaction.inGuild()) {
      return interaction.reply({
        content: 'This command can only be used in a server.',
        flags: MessageFlags.Ephemeral
      });
    }

    // Get field values
    const title = interaction.fields.getTextInputValue('title');
    const description = interaction.fields.getTextInputValue('description');
    const colorHex = interaction.fields.getTextInputValue('color');
    const image = interaction.fields.getTextInputValue('image');
    const footerText = interaction.fields.getTextInputValue('footer');

    // Validate that at least title or description is provided
    if (!title && !description) {
      return interaction.reply({
        content: 'You must provide at least a title or description for the embed.',
        flags: MessageFlags.Ephemeral
      });
    }

    // Parse color
    let color: number | undefined;
    if (colorHex) {
      const hex = colorHex.replace('#', '');
      color = parseInt(hex, 16);
      if (isNaN(color)) {
        return interaction.reply({
          content: 'Invalid color format. Use hex format like #FF0000',
          flags: MessageFlags.Ephemeral
        });
      }
    }

    // Build embed data
    const embedData: EmbedData = {};
    if (title) embedData.title = title;
    if (description) embedData.description = description;
    if (color) embedData.color = color;
    if (image) embedData.image = image;
    if (footerText) embedData.footer = { text: footerText };

    // Create embed
    const result = await EmbedLogic.createEmbed({
      guildId: interaction.guildId,
      name: embedName,
      data: embedData,
      createdBy: interaction.user.id
    });

    if (!result.success) {
      return interaction.reply({
        content: `Failed to create embed: ${result.error}`,
        flags: MessageFlags.Ephemeral
      });
    }

    // Show preview
    const preview = EmbedLogic.buildEmbed(embedData);

    return interaction.reply({
      content: `✅ Embed \`${embedName}\` created successfully!`,
      embeds: [preview],
      flags: MessageFlags.Ephemeral
    });
  }
}
