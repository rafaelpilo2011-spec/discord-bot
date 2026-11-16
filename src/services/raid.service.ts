export class RaidService {
  constructor(private prisma: any) {}

  async create(data: {
    guildId: string;
    type: string;
    severity: string;
    signalScore: number;
    actionTaken?: string;
  }) {
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

  async resolve(raidId: string) {
    return this.prisma.raidEvent.update({
      where: { id: raidId },
      data: { resolved: true, endedAt: new Date() },
    });
  }

  async listActive(guildId: string) {
    return this.prisma.raidEvent.findMany({
      where: { guildId, resolved: false },
      orderBy: { startedAt: 'desc' },
    });
  }
}
