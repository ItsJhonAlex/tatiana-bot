import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { EmbedBuilder, GuildMember, MessageFlags } from 'discord.js';
import { getVariableExample, getVariableList, parseVariables } from '../../../lib/utils/variables.js';

@ApplyOptions<Command.Options>({
  name: 'variables',
  description: 'Show all available variables for custom messages',
  fullCategory: ['Utility']
})
export class VariablesCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(
      (builder) =>
        builder
          .setName(this.name)
          .setDescription(this.description)
          .addBooleanOption((option) =>
            option.setName('preview').setDescription('Show a preview with your current data').setRequired(false)
          ),
      {
        idHints: [],
        guildIds: process.env.DEV_GUILD_ID ? [process.env.DEV_GUILD_ID] : undefined
      }
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const showPreview = interaction.options.getBoolean('preview') ?? false;
    const language: 'en' | 'es' = interaction.locale.startsWith('es') ? 'es' : 'en';

    const title = language === 'es' ? '📝 Variables Disponibles' : '📝 Available Variables';
    const exampleTitle = language === 'es' ? '💡 Ejemplo' : '💡 Example';
    const previewTitle = language === 'es' ? '🔍 Vista Previa' : '🔍 Preview';
    const footerText =
      language === 'es'
        ? 'Usa estas variables en mensajes de bienvenida, despedida y embeds personalizados'
        : 'Use these variables in welcome messages, farewell messages, and custom embeds';

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(getVariableList(language))
      .setColor(0x5865f2)
      .addFields({
        name: exampleTitle,
        value: `\`\`\`${getVariableExample(language)}\`\`\``
      })
      .setFooter({ text: footerText })
      .setTimestamp();

    // Add preview if requested
    if (showPreview && interaction.guild && interaction.member && interaction.member instanceof GuildMember) {
      const exampleText = getVariableExample(language);
      const parsedText = parseVariables(exampleText, {
        user: interaction.user,
        member: interaction.member,
        guild: interaction.guild
      });

      embed.addFields({
        name: previewTitle,
        value: parsedText
      });
    }

    return interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral
    });
  }
}
