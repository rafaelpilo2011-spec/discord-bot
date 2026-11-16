export class ReportService {
  constructor(private prisma: any) {}

  async create(data: {
    guildId: string;
    reporterId: string;
    targetId: string;
    reason: string;
    channelId?: string;
    messageId?: string;
  }) {
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

  async listOpen(guildId: string) {
    return this.prisma.report.findMany({
      where: { guildId, status: 'open' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async close(id: string) {
    return this.prisma.report.update({
      where: { id },
      data: { status: 'closed' },
    });
  }
}
