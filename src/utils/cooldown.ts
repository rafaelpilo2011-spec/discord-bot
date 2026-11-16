import { Collection, PermissionResolvable, GuildMember } from 'discord.js';

const cooldowns = new Collection<string, { last: number; count: number }>();

export function checkCooldown(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remainingMs: number } {
  const now = Date.now();
  const record = cooldowns.get(key) || { last: now, count: 0 };

  if (now - record.last > windowMs) {
    record.last = now;
    record.count = 0;
  }

  record.count += 1;
  cooldowns.set(key, record);

  if (record.count > limit) {
    const remaining = record.last + windowMs - now;
    return { allowed: false, remainingMs: remaining > 0 ? remaining : 0 };
  }

  return { allowed: true, remainingMs: 0 };
}

export function clearCooldown(key: string) {
  cooldowns.delete(key);
}

export function hasPermission(
  member: GuildMember | null,
  permission: PermissionResolvable | PermissionResolvable[]
): boolean {
  if (!member) return false;
  if (member.id === member.guild.ownerId) return true;
  return member.permissions.has(permission);
}

export function isAboveHierarchy(
  executor: GuildMember | null,
  target: GuildMember | null
): boolean {
  if (!executor || !target) return false;
  if (executor.id === executor.guild.ownerId) return true;
  if (target.id === executor.guild.ownerId) return false;
  return executor.roles.highest.position > target.roles.highest.position;
}
