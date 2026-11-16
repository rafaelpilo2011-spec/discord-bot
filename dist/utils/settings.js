"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SETTINGS = void 0;
exports.mergeSettings = mergeSettings;
exports.DEFAULT_SETTINGS = {
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    raidMode: 'monitor',
    raidEnabled: true,
    spamLimit: 5,
    spamWindowSeconds: 10,
    maxMentions: 5,
    maxLinks: 3,
    maxNewAccounts: 5,
    newAccountWindow: 300,
    emergencyActive: false,
    retentionDays: 30,
    notifyDm: true,
    dmOnModeration: true,
    ignoredChannelIds: [],
    ignoredRoleIds: [],
};
function mergeSettings(db, overrides = {}) {
    return {
        id: db.id,
        guildId: db.guildId,
        language: overrides.language ?? db.language ?? 'pt-BR',
        timezone: overrides.timezone ?? db.timezone ?? 'America/Sao_Paulo',
        logChannelId: db.logChannelId ?? null,
        modRoleId: db.modRoleId ?? null,
        adminRoleId: db.adminRoleId ?? null,
        welcomeChannelId: db.welcomeChannelId ?? null,
        defaultRoleId: db.defaultRoleId ?? null,
        quarantineRoleId: db.quarantineRoleId ?? null,
        ignoredChannelIds: Array.isArray(db.ignoredChannelIds)
            ? db.ignoredChannelIds
            : JSON.parse(db.ignoredChannelIds ?? '[]'),
        ignoredRoleIds: Array.isArray(db.ignoredRoleIds)
            ? db.ignoredRoleIds
            : JSON.parse(db.ignoredRoleIds ?? '[]'),
        raidMode: (overrides.raidMode ?? db.raidMode ?? 'monitor'),
        raidEnabled: db.raidEnabled ?? true,
        spamLimit: db.spamLimit ?? 5,
        spamWindowSeconds: db.spamWindowSeconds ?? 10,
        maxMentions: db.maxMentions ?? 5,
        maxLinks: db.maxLinks ?? 3,
        maxNewAccounts: db.maxNewAccounts ?? 5,
        newAccountWindow: db.newAccountWindow ?? 300,
        emergencyActive: db.emergencyActive ?? false,
        emergencyEndsAt: db.emergencyEndsAt ?? null,
        retentionDays: db.retentionDays ?? 30,
        notifyDm: db.notifyDm ?? true,
        dmOnModeration: db.dmOnModeration ?? true,
    };
}
//# sourceMappingURL=settings.js.map