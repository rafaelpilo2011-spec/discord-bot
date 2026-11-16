"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaidService = void 0;
class RaidService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.raidEvent.create({
            data: {
                guildId: data.guildId,
                type: data.type,
                severity: data.severity,
                signalScore: data.signalScore,
                actionTaken: data.actionTaken,
            },
        });
    }
    async resolve(raidId) {
        return this.prisma.raidEvent.update({
            where: { id: raidId },
            data: { resolved: true, endedAt: new Date() },
        });
    }
    async listActive(guildId) {
        return this.prisma.raidEvent.findMany({
            where: { guildId, resolved: false },
            orderBy: { startedAt: 'desc' },
        });
    }
}
exports.RaidService = RaidService;
//# sourceMappingURL=raid.service.js.map