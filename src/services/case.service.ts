export class CaseService {
  constructor(private prisma: any) {}

  async create(data: {
    guildId: string;
    type: string;
    moderatorId: string;
    targetId: string;
    reason: string;
    duration?: number;
    result: 'success' | 'failed' | 'partial';
    details?: string;
  }) {
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

  async getById(guildId: string, caseId: string) {
    return this.prisma.case.findFirst({
      where: { id: caseId, guildId },
      include: { warnings: true },
    });
  }

  async listByTarget(guildId: string, targetId: string) {
    return this.prisma.case.findMany({
      where: { guildId, targetId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async listByGuild(guildId: string, limit = 50) {
    return this.prisma.case.findMany({
      where: { guildId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}

export class WarningService {
  constructor(private prisma: any) {}

  async create(data: {
    guildId: string;
    caseId: string;
    userId: string;
    moderatorId: string;
    reason: string;
  }) {
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

  async listByUser(guildId: string, userId: string) {
    return this.prisma.warning.findMany({
      where: { guildId, userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string) {
    return this.prisma.warning.delete({ where: { id } });
  }
}
