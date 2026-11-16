"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkCooldown = checkCooldown;
exports.clearCooldown = clearCooldown;
exports.hasPermission = hasPermission;
exports.isAboveHierarchy = isAboveHierarchy;
const discord_js_1 = require("discord.js");
const cooldowns = new discord_js_1.Collection();
function checkCooldown(key, limit, windowMs) {
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
function clearCooldown(key) {
    cooldowns.delete(key);
}
function hasPermission(member, permission) {
    if (!member)
        return false;
    if (member.id === member.guild.ownerId)
        return true;
    return member.permissions.has(permission);
}
function isAboveHierarchy(executor, target) {
    if (!executor || !target)
        return false;
    if (executor.id === executor.guild.ownerId)
        return true;
    if (target.id === executor.guild.ownerId)
        return false;
    return executor.roles.highest.position > target.roles.highest.position;
}
//# sourceMappingURL=cooldown.js.map