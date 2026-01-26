import { PermissionFlagsBits, type Guild, type GuildMember } from 'discord.js';

/**
 * Check if user is server owner
 */
export function isServerOwner(guild: Guild, userId: string): boolean {
  return guild.ownerId === userId;
}

/**
 * Check if user has Administrator permission
 */
export function isAdministrator(member: GuildMember): boolean {
  return member.permissions.has(PermissionFlagsBits.Administrator);
}

/**
 * Check if user can manage server
 */
export function canManageGuild(member: GuildMember): boolean {
  return member.permissions.has(PermissionFlagsBits.ManageGuild);
}

/**
 * Check if user can manage roles
 */
export function canManageRoles(member: GuildMember): boolean {
  return member.permissions.has(PermissionFlagsBits.ManageRoles);
}

/**
 * Check if user can kick members
 */
export function canKickMembers(member: GuildMember): boolean {
  return member.permissions.has(PermissionFlagsBits.KickMembers);
}

/**
 * Check if user can ban members
 */
export function canBanMembers(member: GuildMember): boolean {
  return member.permissions.has(PermissionFlagsBits.BanMembers);
}

/**
 * Check if user is bot owner (from environment variable)
 */
export function isBotOwner(userId: string): boolean {
  const ownerIds = process.env.OWNER_IDS?.split(',').map((id) => id.trim()) || [];
  return ownerIds.includes(userId);
}

/**
 * Check if user has any administrative permission
 * (Owner, Administrator, Manage Guild, or Bot Owner)
 */
export function hasAdminPermission(guild: Guild, member: GuildMember): boolean {
  return isServerOwner(guild, member.id) || isAdministrator(member) || canManageGuild(member) || isBotOwner(member.id);
}

/**
 * Get all administrators in a guild
 */
export async function getGuildAdministrators(guild: Guild): Promise<GuildMember[]> {
  const members = await guild.members.fetch();
  return members.filter((member) => isAdministrator(member) || isServerOwner(guild, member.id)).map((m) => m);
}
