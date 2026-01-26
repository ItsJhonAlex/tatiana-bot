import { Precondition } from '@sapphire/framework';
import type { CommandInteraction, ContextMenuCommandInteraction, GuildMember, Message } from 'discord.js';
import { canBanMembers, canKickMembers } from '../lib/utils/permissions';

export class ModeratorOnly extends Precondition {
  public override async messageRun(message: Message) {
    if (!message.guild || !message.member) {
      return this.error({ message: 'This command can only be used in a server.' });
    }

    const member = message.member as GuildMember;
    return canKickMembers(member) || canBanMembers(member)
      ? this.ok()
      : this.error({ message: 'You need moderation permissions to use this command.' });
  }

  public override async chatInputRun(interaction: CommandInteraction) {
    if (!interaction.guild || !interaction.member) {
      return this.error({ message: 'This command can only be used in a server.' });
    }

    const member = interaction.member as GuildMember;
    return canKickMembers(member) || canBanMembers(member)
      ? this.ok()
      : this.error({ message: 'You need moderation permissions to use this command.' });
  }

  public override async contextMenuRun(interaction: ContextMenuCommandInteraction) {
    if (!interaction.guild || !interaction.member) {
      return this.error({ message: 'This command can only be used in a server.' });
    }

    const member = interaction.member as GuildMember;
    return canKickMembers(member) || canBanMembers(member)
      ? this.ok()
      : this.error({ message: 'You need moderation permissions to use this command.' });
  }
}
