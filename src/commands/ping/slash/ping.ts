import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import type { ChatInputCommandInteraction } from 'discord.js';
import { PingLogic } from '../../../lib/commands/ping/logic';
import type { PingResult } from '../../../lib/commands/ping/types';
import { getUserLanguage } from '../../../lib/utils/user';

@ApplyOptions<Command.Options>({
  name: 'ping',
  description: 'Check the bot latency',
  fullCategory: ['General']
})
export class PingSlashCommand extends Command {
  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder //
        .setName(this.name)
        .setDescription(this.description)
    );
  }

  public override async chatInputRun(interaction: ChatInputCommandInteraction) {
    const response = await interaction.reply({
      content: '🏓 Pinging...'
    });

    const msg = await response.fetch();

    const result: PingResult = {
      latency: PingLogic.calculateLatency(msg.createdTimestamp, interaction.createdTimestamp),
      apiLatency: Math.round(this.container.client.ws.ping),
      timestamp: Date.now()
    };

    // Get user language from database
    const language = await getUserLanguage(interaction.user.id);

    const content = PingLogic.formatResponse(result, language);
    const statusEmoji = PingLogic.getStatusEmoji(result.latency);

    return interaction.editReply({
      content: `${statusEmoji} ${content}`
    });
  }
}
