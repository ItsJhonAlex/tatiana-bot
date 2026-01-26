import type { Guild, GuildMember, User } from 'discord.js';

/**
 * Variable context for message parsing
 */
export interface VariableContext {
  user?: User;
  member?: GuildMember;
  guild?: Guild;
  custom?: Record<string, string>;
}

/**
 * Available variables for messages
 */
export const AVAILABLE_VARIABLES = {
  // User variables
  user: {
    mention: '{user}',
    name: '{user.name}',
    username: '{user.username}',
    tag: '{user.tag}',
    id: '{user.id}',
    avatar: '{user.avatar}',
    displayName: '{user.displayName}'
  },
  // Member variables (server-specific)
  member: {
    nickname: '{member.nickname}',
    joinedAt: '{member.joinedAt}',
    roles: '{member.roles}'
  },
  // Server/Guild variables
  server: {
    name: '{server.name}',
    members: '{server.members}',
    id: '{server.id}',
    icon: '{server.icon}'
  }
};

/**
 * Parse variables in a string and replace them with actual values
 */
export function parseVariables(text: string, context: VariableContext): string {
  let result = text;

  // User variables
  if (context.user) {
    result = result
      .replace(/\{user\}/g, `<@${context.user.id}>`)
      .replace(/\{user\.mention\}/g, `<@${context.user.id}>`)
      .replace(/\{user\.name\}/g, context.user.displayName || context.user.username)
      .replace(/\{user\.username\}/g, context.user.username)
      .replace(/\{user\.tag\}/g, context.user.tag)
      .replace(/\{user\.id\}/g, context.user.id)
      .replace(/\{user\.avatar\}/g, context.user.displayAvatarURL({ size: 256 }))
      .replace(/\{user\.displayName\}/g, context.user.displayName || context.user.username);
  }

  // Member variables (server-specific)
  if (context.member) {
    result = result
      .replace(/\{member\.nickname\}/g, context.member.nickname || context.member.user.username)
      .replace(/\{member\.joinedAt\}/g, context.member.joinedAt?.toLocaleDateString() || 'Unknown')
      .replace(/\{member\.roles\}/g, context.member.roles.cache.size.toString());
  }

  // Server/Guild variables
  if (context.guild) {
    result = result
      .replace(/\{server\.name\}/g, context.guild.name)
      .replace(/\{server\.members\}/g, context.guild.memberCount.toString())
      .replace(/\{server\.id\}/g, context.guild.id)
      .replace(/\{server\.icon\}/g, context.guild.iconURL({ size: 256 }) || 'No icon');
  }

  // Custom variables
  if (context.custom) {
    Object.entries(context.custom).forEach(([key, value]) => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      result = result.replace(regex, value);
    });
  }

  return result;
}

/**
 * Get list of all available variables as a formatted string
 */
export function getVariableList(language: 'en' | 'es' = 'en'): string {
  const descriptions = {
    en: {
      user: '**User Variables:**',
      userMention: '`{user}` - Mentions the user',
      userName: '`{user.name}` - User display name',
      userUsername: '`{user.username}` - Username',
      userTag: '`{user.tag}` - User tag (username#0000)',
      userId: '`{user.id}` - User ID',
      userAvatar: '`{user.avatar}` - User avatar URL',
      userDisplayName: '`{user.displayName}` - User display name',
      member: '**Member Variables:**',
      memberNickname: '`{member.nickname}` - Server nickname',
      memberJoinedAt: '`{member.joinedAt}` - Join date',
      memberRoles: '`{member.roles}` - Number of roles',
      server: '**Server Variables:**',
      serverName: '`{server.name}` - Server name',
      serverMembers: '`{server.members}` - Member count',
      serverId: '`{server.id}` - Server ID',
      serverIcon: '`{server.icon}` - Server icon URL'
    },
    es: {
      user: '**Variables de Usuario:**',
      userMention: '`{user}` - Menciona al usuario',
      userName: '`{user.name}` - Nombre del usuario',
      userUsername: '`{user.username}` - Nombre de usuario',
      userTag: '`{user.tag}` - Tag del usuario (username#0000)',
      userId: '`{user.id}` - ID del usuario',
      userAvatar: '`{user.avatar}` - URL del avatar',
      userDisplayName: '`{user.displayName}` - Nombre de visualización',
      member: '**Variables de Miembro:**',
      memberNickname: '`{member.nickname}` - Apodo en el servidor',
      memberJoinedAt: '`{member.joinedAt}` - Fecha de unión',
      memberRoles: '`{member.roles}` - Cantidad de roles',
      server: '**Variables de Servidor:**',
      serverName: '`{server.name}` - Nombre del servidor',
      serverMembers: '`{server.members}` - Cantidad de miembros',
      serverId: '`{server.id}` - ID del servidor',
      serverIcon: '`{server.icon}` - URL del ícono del servidor'
    }
  };

  const desc = descriptions[language];

  return `
${desc.user}
${desc.userMention}
${desc.userName}
${desc.userUsername}
${desc.userTag}
${desc.userId}
${desc.userAvatar}
${desc.userDisplayName}

${desc.member}
${desc.memberNickname}
${desc.memberJoinedAt}
${desc.memberRoles}

${desc.server}
${desc.serverName}
${desc.serverMembers}
${desc.serverId}
${desc.serverIcon}
  `.trim();
}

/**
 * Get example message with variables
 */
export function getVariableExample(language: 'en' | 'es' = 'en'): string {
  return language === 'es'
    ? '¡Bienvenido {user} a {server.name}! Ahora somos {server.members} miembros.'
    : 'Welcome {user} to {server.name}! We now have {server.members} members.';
}
