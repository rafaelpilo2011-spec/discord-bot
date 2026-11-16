import { Message, TextChannel } from 'discord.js';

export interface AutomodConfig {
  maxMentions: number;
  maxLinks: number;
  blockedDomains: string[];
  blockedExtensions: string[];
  maxCaps: number;
  maxEmojis: number;
  ignoredChannelIds: string[];
  ignoredRoleIds: string[];
}

export class AutomoderationMiddleware {
  private config: AutomodConfig;

  constructor(config: Partial<AutomodConfig> = {}) {
    this.config = {
      maxMentions: 5,
      maxLinks: 3,
      blockedDomains: [],
      blockedExtensions: ['exe', 'bat', 'scr', 'ps1'],
      maxCaps: 70,
      maxEmojis: 10,
      ignoredChannelIds: [],
      ignoredRoleIds: [],
      ...config,
    };
  }

  async analyze(message: Message): Promise<{ allowed: boolean; reason?: string }> {
    if (message.author.bot) return { allowed: true };
    if (!message.guild) return { allowed: true };

    const channel = message.channel as TextChannel;
    if (this.config.ignoredChannelIds.includes(channel.id)) return { allowed: true };

    // Excesso de menções
    const mentionCount = message.mentions.users.size + message.mentions.roles.size;
    if (mentionCount > this.config.maxMentions) {
      return { allowed: false, reason: 'Excesso de menções' };
    }

    // Excesso de links
    const linkCount = (message.content.match(/https?:\/\//g) || []).length;
    if (linkCount > this.config.maxLinks) {
      return { allowed: false, reason: 'Excesso de links' };
    }

    // Domínios bloqueados
    for (const domain of this.config.blockedDomains) {
      if (message.content.includes(domain)) {
        return { allowed: false, reason: `Domínio bloqueado: ${domain}` };
      }
    }

    // Excesso de maiúsculas
    if (message.content.length > 20) {
      const capsCount = (message.content.match(/[A-Z]/g) || []).length;
      const capsRatio = capsCount / message.content.length;
      if (capsRatio > this.config.maxCaps / 100) {
        return { allowed: false, reason: 'Excesso de letras maiúsculas' };
      }
    }

    // Excesso de emojis
    const emojiCount = (message.content.match(/<a?:[^:]+:\d+>|[\p{Emoji}]/gu) || []).length;
    if (emojiCount > this.config.maxEmojis) {
      return { allowed: false, reason: 'Excesso de emojis' };
    }

    // Anexos bloqueados
    for (const attachment of message.attachments.values()) {
      const ext = attachment.name.split('.').pop()?.toLowerCase();
      if (ext && this.config.blockedExtensions.includes(ext)) {
        return { allowed: false, reason: `Extensão bloqueada: .${ext}` };
      }
    }

    return { allowed: true };
  }
}
