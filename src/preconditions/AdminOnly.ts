import { Precondition } from '@sapphire/framework';
import type { CommandInteraction, ContextMenuCommandInteraction, GuildMember, Message } from 'discord.js';
import { hasAdminPermission } from '../lib/utils/permissions';

export class AdminOnly extends Precondition {
  public override async messageRun(message: Message) {
    if (!message.guild || !message.member) {
      return this.error({ message: 'This command can only be used in a server.' });
    }

    return hasAdminPermission(message.guild, message.member as GuildMember)
      ? this.ok()
      : this.error({ message: 'You need administrator permissions to use this command.' });
  }

  public override async chatInputRun(interaction: CommandInteraction) {
    if (!interaction.guild || !interaction.member) {
      return this.error({ message: 'This command can only be used in a server.' });
    }

    return hasAdminPermission(interaction.guild, interaction.member as GuildMember)
      ? this.ok()
      : this.error({ message: 'You need administrator permissions to use this command.' });
  }

  public override async contextMenuRun(interaction: ContextMenuCommandInteraction) {
    if (!interaction.guild || !interaction.member) {
      return this.error({ message: 'This command can only be used in a server.' });
    }

    return hasAdminPermission(interaction.guild, interaction.member as GuildMember)
      ? this.ok()
      : this.error({ message: 'You need administrator permissions to use this command.' });
  }
}
