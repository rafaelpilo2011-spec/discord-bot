"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntiRaidService = void 0;
class AntiRaidService {
    prisma;
    raidService;
    joinCache = new Map();
    messageCache = new Map();
    constructor(prisma, raidService) {
        this.prisma = prisma;
        this.raidService = raidService;
    }
    recordJoin(guildId, userId) {
        const now = Date.now();
        const entries = this.joinCache.get(guildId) || [];
        entries.push({ timestamp: now, userId });
        this.joinCache.set(guildId, entries);
    }
    recordMessage(guildId, userId, content) {
        const now = Date.now();
        const entries = this.messageCache.get(guildId) || [];
        entries.push({ timestamp: now, userId, content });
        this.messageCache.set(guildId, entries);
    }
    async analyze(guildId, settings) {
        const now = Date.now();
        const windowMs = 300000;
        const joins = (this.joinCache.get(guildId) || []).filter((j) => now - j.timestamp < windowMs);
        const messages = (this.messageCache.get(guildId) || []).filter((m) => now - m.timestamp < windowMs);
        const signals = [];
        let totalScore = 0;
        if (joins.length >= settings.maxNewAccounts) {
            signals.push({
                type: 'join_spike',
                score: joins.length,
                triggered: true,
                details: { count: joins.length, windowMinutes: windowMs / 60000 },
            });
            totalScore += joins.length * 10;
        }
        if (messages.length >= settings.spamLimit * 10) {
            signals.push({
                type: 'message_spam',
                score: messages.length,
                triggered: true,
                details: { count: messages.length },
            });
            totalScore += messages.length * 2;
        }
        let recommendedAction = 'none';
        if (totalScore >= 100)
            recommendedAction = 'emergency';
        else if (totalScore >= 50)
            recommendedAction = 'protect';
        else if (totalScore >= 20)
            recommendedAction = 'alert';
        return {
            isRaid: totalScore > 0,
            signals,
            totalScore,
            recommendedAction,
        };
    }
    async recordRaidEvent(guildId, type, severity, score, action) {
        return this.raidService.create({
            guildId,
            type,
            severity,
            signalScore: score,
            actionTaken: action,
        });
    }
    async applyProtectionAction(guild, action, settings) {
        const logChannel = settings.logChannelId
            ? guild.channels.cache.get(settings.logChannelId)
            : undefined;
        if (logChannel) {
            await logChannel.send({
                embeds: [
                    {
                        title: '⚠️ Ação de proteção contra raids',
                        description: action,
                        color: 0xffa500,
                        timestamp: new Date().toISOString(),
                    },
                ],
            });
        }
    }
    async simulate(guildId, type, count) {
        for (let i = 0; i < count; i++) {
            this.recordJoin(guildId, `simulated_${Date.now()}_${i}`);
        }
        return { recorded: count, type };
    }
}
exports.AntiRaidService = AntiRaidService;
//# sourceMappingURL=antiRaid.service.js.map