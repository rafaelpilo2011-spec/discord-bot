import { PermissionResolvable, GuildMember } from 'discord.js';
export declare function checkCooldown(key: string, limit: number, windowMs: number): {
    allowed: boolean;
    remainingMs: number;
};
export declare function clearCooldown(key: string): void;
export declare function hasPermission(member: GuildMember | null, permission: PermissionResolvable | PermissionResolvable[]): boolean;
export declare function isAboveHierarchy(executor: GuildMember | null, target: GuildMember | null): boolean;
