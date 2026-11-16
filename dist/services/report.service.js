"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
class ReportService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.report.create({
            data: {
                guildId: data.guildId,
                reporterId: data.reporterId,
                targetId: data.targetId,
                reason: data.reason,
                channelId: data.channelId,
                messageId: data.messageId,
            },
        });
    }
    async listOpen(guildId) {
        return this.prisma.report.findMany({
            where: { guildId, status: 'open' },
            orderBy: { createdAt: 'desc' },
        });
    }
    async close(id) {
        return this.prisma.report.update({
            where: { id },
            data: { status: 'closed' },
        });
    }
}
exports.ReportService = ReportService;
//# sourceMappingURL=report.service.js.map