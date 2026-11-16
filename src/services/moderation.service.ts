import { GuildMember } from 'discord.js';

export class ModerationService {
  constructor(private caseService: any) {}

  async notifyTargetDM(guildId: string, userId: string, content: string, settings: any) {
    if (!settings.dmOnModeration) return;
    try {
      const client = (globalThis as any).client;
      if (client) {
        const user = await client.users.fetch(userId);
        if (user) await user.send(content);
      }
    } catch {
      // DM bloqueada, não impede a moderação
    }
  }

  async createCase(data: {
    guildId: string;
    type: string;
    moderatorId: string;
    targetId: string;
    reason: string;
    duration?: number;
    result: 'success' | 'failed' | 'partial';
    details?: string;
  }) {
    return this.caseService.create(data);
  }
}
