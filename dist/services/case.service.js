"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarningService = exports.CaseService = void 0;
class CaseService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.case.create({
            data: {
                guildId: data.guildId,
                type: data.type,
                moderatorId: data.moderatorId,
                targetId: data.targetId,
                reason: data.reason,
                duration: data.duration,
                result: data.result,
                details: data.details || '{}',
            },
        });
    }
    async getById(guildId, caseId) {
        return this.prisma.case.findFirst({
            where: { id: caseId, guildId },
            include: { warnings: true },
        });
    }
    async listByTarget(guildId, targetId) {
        return this.prisma.case.findMany({
            where: { guildId, targetId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async listByGuild(guildId, limit = 50) {
        return this.prisma.case.findMany({
            where: { guildId },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
}
exports.CaseService = CaseService;
class WarningService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.warning.create({
            data: {
                guildId: data.guildId,
                caseId: data.caseId,
                userId: data.userId,
                moderatorId: data.moderatorId,
                reason: data.reason,
            },
        });
    }
    async listByUser(guildId, userId) {
        return this.prisma.warning.findMany({
            where: { guildId, userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async remove(id) {
        return this.prisma.warning.delete({ where: { id } });
    }
}
exports.WarningService = WarningService;
//# sourceMappingURL=case.service.js.map