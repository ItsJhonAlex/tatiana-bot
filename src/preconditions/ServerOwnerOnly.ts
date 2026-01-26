import { Precondition } from '@sapphire/framework';
import type { CommandInteraction, ContextMenuCommandInteraction, Message } from 'discord.js';
import { isServerOwner } from '../lib/utils/permissions';

export class ServerOwnerOnly extends Precondition {
  public override async messageRun(message: Message) {
    if (!message.guild) {
      return this.error({ message: 'This command can only be used in a server.' });
    }

    return isServerOwner(message.guild, message.author.id)
      ? this.ok()
      : this.error({ message: 'This command can only be used by the server owner.' });
  }

  public override async chatInputRun(interaction: CommandInteraction) {
    if (!interaction.guild) {
      return this.error({ message: 'This command can only be used in a server.' });
    }

    return isServerOwner(interaction.guild, interaction.user.id)
      ? this.ok()
      : this.error({ message: 'This command can only be used by the server owner.' });
  }

  public override async contextMenuRun(interaction: ContextMenuCommandInteraction) {
    if (!interaction.guild) {
      return this.error({ message: 'This command can only be used in a server.' });
    }

    return isServerOwner(interaction.guild, interaction.user.id)
      ? this.ok()
      : this.error({ message: 'This command can only be used by the server owner.' });
  }
}
