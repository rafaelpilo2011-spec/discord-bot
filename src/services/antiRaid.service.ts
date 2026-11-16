export class AntiRaidService {
  private joinCache = new Map<string, { timestamp: number; userId: string }[]>();
  private messageCache = new Map<string, { timestamp: number; userId: string; content: string }[]>();

  constructor(private prisma: any, private raidService: any) {}

  recordJoin(guildId: string, userId: string) {
    const now = Date.now();
    const entries = this.joinCache.get(guildId) || [];
    entries.push({ timestamp: now, userId });
    this.joinCache.set(guildId, entries);
  }

  recordMessage(guildId: string, userId: string, content: string) {
    const now = Date.now();
    const entries = this.messageCache.get(guildId) || [];
    entries.push({ timestamp: now, userId, content });
    this.messageCache.set(guildId, entries);
  }

  async analyze(guildId: string, settings: any): Promise<any> {
    const now = Date.now();
    const windowMs = 300000;
    const joins = (this.joinCache.get(guildId) || []).filter(
      (j: any) => now - j.timestamp < windowMs
    );
    const messages = (this.messageCache.get(guildId) || []).filter(
      (m: any) => now - m.timestamp < windowMs
    );

    const signals: any[] = [];
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

    let recommendedAction: 'none' | 'alert' | 'protect' | 'emergency' = 'none';
    if (totalScore >= 100) recommendedAction = 'emergency';
    else if (totalScore >= 50) recommendedAction = 'protect';
    else if (totalScore >= 20) recommendedAction = 'alert';

    return {
      isRaid: totalScore > 0,
      signals,
      totalScore,
      recommendedAction,
    };
  }

  async recordRaidEvent(guildId: string, type: string, severity: string, score: number, action?: string) {
    return this.raidService.create({
      guildId,
      type,
      severity,
      signalScore: score,
      actionTaken: action,
    });
  }

  async applyProtectionAction(guild: any, action: string, settings: any) {
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

  async simulate(guildId: string, type: string, count: number) {
    for (let i = 0; i < count; i++) {
      this.recordJoin(guildId, `simulated_${Date.now()}_${i}`);
    }
    return { recorded: count, type };
  }
}
