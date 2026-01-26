import { Precondition } from '@sapphire/framework';
import type { CommandInteraction, ContextMenuCommandInteraction, Message } from 'discord.js';
import { isBotOwner } from '../lib/utils/permissions';

export class OwnerOnlyPrecondition extends Precondition {
  public override async messageRun(message: Message) {
    return isBotOwner(message.author.id)
      ? this.ok()
      : this.error({ message: 'This command can only be used by the bot owner.' });
  }

  public override async chatInputRun(interaction: CommandInteraction) {
    return isBotOwner(interaction.user.id)
      ? this.ok()
      : this.error({ message: 'This command can only be used by the bot owner.' });
  }

  public override async contextMenuRun(interaction: ContextMenuCommandInteraction) {
    return isBotOwner(interaction.user.id)
      ? this.ok()
      : this.error({ message: 'This command can only be used by the bot owner.' });
  }
}
