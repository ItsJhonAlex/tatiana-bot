import { ApplyOptions } from '@sapphire/decorators';
import { Subcommand } from '@sapphire/plugin-subcommands';
import {
  ActionRowBuilder,
  MessageFlags,
  ModalBuilder,
  PermissionFlagsBits,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js';
import { EmbedLogic } from '../../../lib/commands/embed/logic.js';

@ApplyOptions<Subcommand.Options>({
  name: 'embed',
  description: 'Create and manage custom embeds',
  preconditions: ['AdminOnly'],
  requiredUserPermissions: [PermissionFlagsBits.Administrator],
  subcommands: [
    { name: 'create', chatInputRun: 'chatInputCreate' },
    { name: 'show', chatInputRun: 'chatInputShow' },
    { name: 'list', chatInputRun: 'chatInputList' },
    { name: 'delete', chatInputRun: 'chatInputDelete' }
  ]
})
export class EmbedCommand extends Subcommand {
  public override registerApplicationCommands(registry: Subcommand.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .setDMPermission(false)
          .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
          // Create subcommand
          .addSubcommand((subcommand) =>
            subcommand
              .setName('create')
              .setDescription('Create a new embed (opens a form)')
              .addStringOption((option) => option.setName('name').setDescription('Embed name').setRequired(true))
          )
          // Show subcommand
          .addSubcommand((subcommand) =>
            subcommand
              .setName('show')
              .setDescription('Display a saved embed')
              .addStringOption((option) =>
                option.setName('name').setDescription('Embed name').setRequired(true).setAutocomplete(true)
              )
          )
          // List subcommand
          .addSubcommand((subcommand) => subcommand.setName('list').setDescription('List all saved embeds'))
          // Delete subcommand
          .addSubcommand((subcommand) =>
            subcommand
              .setName('delete')
              .setDescription('Delete a saved embed')
              .addStringOption((option) =>
                option.setName('name').setDescription('Embed name').setRequired(true).setAutocomplete(true)
              )
          ),
      {
        idHints: [],
        guildIds: process.env.DEV_GUILD_ID ? [process.env.DEV_GUILD_ID] : undefined
      }
    );
  }

  public async chatInputCreate(interaction: Subcommand.ChatInputCommandInteraction) {
    if (!interaction.inGuild()) {
      return interaction.reply({
        content: 'This command can only be used in a server.',
        flags: MessageFlags.Ephemeral
      });
    }

    const name = interaction.options.getString('name', true);

    // Create modal for embed creation
    const modal = new ModalBuilder().setCustomId(`embed-create-${name}`).setTitle(`Create Embed: ${name}`);

    // Title input
    const titleInput = new TextInputBuilder()
      .setCustomId('title')
      .setLabel('Embed Title')
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setMaxLength(256);

    // Description input
    const descriptionInput = new TextInputBuilder()
      .setCustomId('description')
      .setLabel('Embed Description')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false)
      .setMaxLength(4000);

    // Color input
    const colorInput = new TextInputBuilder()
      .setCustomId('color')
      .setLabel('Color (hex: #FF0000)')
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setPlaceholder('#5865F2')
      .setMaxLength(7);

    // Image URL input
    const imageInput = new TextInputBuilder()
      .setCustomId('image')
      .setLabel('Image URL')
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setPlaceholder('https://example.com/image.png');

    // Footer input
    const footerInput = new TextInputBuilder()
      .setCustomId('footer')
      .setLabel('Footer Text')
      .setStyle(TextInputStyle.Short)
      .setRequired(false)
      .setMaxLength(2048);

    // Add inputs to action rows
    const rows = [titleInput, descriptionInput, colorInput, imageInput, footerInput].map((input) =>
      new ActionRowBuilder<TextInputBuilder>().addComponents(input)
    );

    modal.addComponents(...rows);

    // Show modal
    await interaction.showModal(modal);
  }

  public async chatInputShow(interaction: Subcommand.ChatInputCommandInteraction) {
    if (!interaction.inGuild()) {
      return interaction.reply({
        content: 'This command can only be used in a server.',
        flags: MessageFlags.Ephemeral
      });
    }

    const name = interaction.options.getString('name', true);

    const embedData = await EmbedLogic.getEmbed(interaction.guildId, name);

    if (!embedData) {
      return interaction.reply({
        content: `Embed \`${name}\` not found.`,
        flags: MessageFlags.Ephemeral
      });
    }

    const embed = EmbedLogic.buildEmbed(embedData);

    return interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral
    });
  }

  public async chatInputList(interaction: Subcommand.ChatInputCommandInteraction) {
    if (!interaction.inGuild()) {
      return interaction.reply({
        content: 'This command can only be used in a server.',
        flags: MessageFlags.Ephemeral
      });
    }

    const result = await EmbedLogic.listEmbeds(interaction.guildId);

    if (!result.success) {
      return interaction.reply({
        content: `Failed to list embeds: ${result.error}`,
        flags: MessageFlags.Ephemeral
      });
    }

    if (!result.embeds || result.embeds.length === 0) {
      return interaction.reply({
        content: 'No embeds found for this server.',
        flags: MessageFlags.Ephemeral
      });
    }

    const embedList = result.embeds.map((e) => `• \`${e.name}\`${e.title ? ` - ${e.title}` : ''}`).join('\n');

    return interaction.reply({
      content: `**Saved Embeds (${result.embeds.length})**\n${embedList}`,
      flags: MessageFlags.Ephemeral
    });
  }

  public async chatInputDelete(interaction: Subcommand.ChatInputCommandInteraction) {
    if (!interaction.inGuild()) {
      return interaction.reply({
        content: 'This command can only be used in a server.',
        flags: MessageFlags.Ephemeral
      });
    }

    const name = interaction.options.getString('name', true);

    const result = await EmbedLogic.deleteEmbed(interaction.guildId, name);

    if (!result.success) {
      return interaction.reply({
        content: `Failed to delete embed: ${result.error}`,
        flags: MessageFlags.Ephemeral
      });
    }

    return interaction.reply({
      content: `✅ Embed \`${name}\` deleted successfully.`,
      flags: MessageFlags.Ephemeral
    });
  }

  public override async autocompleteRun(interaction: Subcommand.AutocompleteInteraction) {
    if (!interaction.inGuild()) return;

    const focusedOption = interaction.options.getFocused(true);

    // Only handle autocomplete for 'name' option
    if (focusedOption.name !== 'name') return;

    // Get all embeds for this guild
    const result = await EmbedLogic.listEmbeds(interaction.guildId);

    if (!result.success || !result.embeds) {
      return interaction.respond([]);
    }

    // Filter embeds based on user input
    const filtered = result.embeds
      .filter((embed) => embed.name.toLowerCase().includes(focusedOption.value.toLowerCase()))
      .slice(0, 25); // Discord limits to 25 options

    // Return as autocomplete choices
    return interaction.respond(
      filtered.map((embed) => ({
        name: `${embed.name}${embed.title ? ` - ${embed.title}` : ''}`,
        value: embed.name
      }))
    );
  }
}
