import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { MessageFlags, PermissionFlagsBits } from 'discord.js';
import { LanguageLogic } from '../../../lib/commands/language/logic.js';

@ApplyOptions<Command.Options>({
  name: 'language',
  description: 'Configure the server language',
  preconditions: ['AdminOnly'],
  requiredUserPermissions: [PermissionFlagsBits.Administrator]
})
export class LanguageCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .setDMPermission(false)
          .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
          .addStringOption((option) =>
            option
              .setName('language')
              .setDescription('The language to set for this server')
              .setRequired(true)
              .addChoices({ name: 'English (US)', value: 'en-US' }, { name: 'Español (España)', value: 'es-ES' })
          ),
      {
        idHints: [],
        guildIds: process.env.DEV_GUILD_ID ? [process.env.DEV_GUILD_ID] : undefined
      }
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    if (!interaction.inGuild()) {
      return interaction.reply({
        content: 'This command can only be used in a server.',
        flags: MessageFlags.Ephemeral
      });
    }

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const selectedLanguage = interaction.options.getString('language', true);

    // Update guild language
    const result = await LanguageLogic.updateGuildLanguage({
      guildId: interaction.guildId,
      language: selectedLanguage
    });

    if (!result.success) {
      const errorMsg =
        selectedLanguage === 'es-ES'
          ? 'No se pudo actualizar el idioma del servidor. Por favor intenta de nuevo.'
          : 'Failed to update server language. Please try again.';
      return interaction.editReply({ content: errorMsg });
    }

    // Get language name for display
    const languageName = LanguageLogic.getLanguageName(selectedLanguage, selectedLanguage === 'es-ES' ? 'es' : 'en');

    const successMsg =
      selectedLanguage === 'es-ES'
        ? `¡Idioma del servidor actualizado a ${languageName}!`
        : `Server language updated to ${languageName}!`;

    return interaction.editReply({ content: successMsg });
  }
}
