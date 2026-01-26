import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { PingLogic } from '../../../lib/commands/ping/logic';
import type { PingResult } from '../../../lib/commands/ping/types';

@ApplyOptions<Command.Options>({
  name: 'ping',
  description: 'Check the bot latency',
  fullCategory: ['General'],
  aliases: ['pong', 'latency']
})
export class PingPrefixCommand extends Command {
  public override async messageRun(message: Message) {
    const msg = await message.reply('🏓 Pinging...');

    const result: PingResult = {
      latency: PingLogic.calculateLatency(msg.createdTimestamp, message.createdTimestamp),
      apiLatency: Math.round(this.container.client.ws.ping),
      timestamp: Date.now()
    };

    // Get user language from guild settings or default
    const language = 'en-US'; // TODO: Get from database

    const response = PingLogic.formatResponse(result, language);
    const statusEmoji = PingLogic.getStatusEmoji(result.latency);

    return msg.edit(`${statusEmoji} ${response}`);
  }
}
