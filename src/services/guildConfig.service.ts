export class GuildConfigService {
  constructor(private prisma: any) {}

  async getOrCreate(guildId: string): Promise<any> {
    let config = await this.prisma.guildConfig.findUnique({ where: { guildId } });

    if (!config) {
      config = await this.prisma.guildConfig.create({
        data: {
          guildId,
          language: 'pt-BR',
          timezone: 'America/Sao_Paulo',
          spamLimit: 5,
          spamWindowSeconds: 10,
          maxMentions: 5,
          maxLinks: 3,
          maxNewAccounts: 5,
          newAccountWindow: 300,
          retentionDays: 30,
          notifyDm: true,
          dmOnModeration: true,
          ignoredChannelIds: '[]',
          ignoredRoleIds: '[]',
        },
      });
    }

    return config;
  }

  async update(guildId: string, data: any): Promise<any> {
    const updateData: any = {};

    if (data.language) updateData.language = data.language;
    if (data.timezone) updateData.timezone = data.timezone;
    if (data.logChannelId !== undefined) updateData.logChannelId = data.logChannelId;
    if (data.modRoleId !== undefined) updateData.modRoleId = data.modRoleId;
    if (data.adminRoleId !== undefined) updateData.adminRoleId = data.adminRoleId;
    if (data.welcomeChannelId !== undefined) updateData.welcomeChannelId = data.welcomeChannelId;
    if (data.defaultRoleId !== undefined) updateData.defaultRoleId = data.defaultRoleId;
    if (data.quarantineRoleId !== undefined) updateData.quarantineRoleId = data.quarantineRoleId;
    if (data.ignoredChannelIds) updateData.ignoredChannelIds = JSON.stringify(data.ignoredChannelIds);
    if (data.ignoredRoleIds) updateData.ignoredRoleIds = JSON.stringify(data.ignoredRoleIds);
    if (data.raidMode) updateData.raidMode = data.raidMode;
    if (data.raidEnabled !== undefined) updateData.raidEnabled = data.raidEnabled;
    if (data.spamLimit !== undefined) updateData.spamLimit = data.spamLimit;
    if (data.spamWindowSeconds !== undefined) updateData.spamWindowSeconds = data.spamWindowSeconds;
    if (data.maxMentions !== undefined) updateData.maxMentions = data.maxMentions;
    if (data.maxLinks !== undefined) updateData.maxLinks = data.maxLinks;
    if (data.maxNewAccounts !== undefined) updateData.maxNewAccounts = data.maxNewAccounts;
    if (data.newAccountWindow !== undefined) updateData.newAccountWindow = data.newAccountWindow;
    if (data.emergencyActive !== undefined) updateData.emergencyActive = data.emergencyActive;
    if (data.emergencyEndsAt !== undefined) updateData.emergencyEndsAt = data.emergencyEndsAt;
    if (data.retentionDays !== undefined) updateData.retentionDays = data.retentionDays;
    if (data.notifyDm !== undefined) updateData.notifyDm = data.notifyDm;
    if (data.dmOnModeration !== undefined) updateData.dmOnModeration = data.dmOnModeration;

    return this.prisma.guildConfig.update({
      where: { guildId },
      data: updateData,
    });
  }

  async exportConfig(guildId: string): Promise<Record<string, unknown>> {
    const config = await this.prisma.guildConfig.findUnique({ where: { guildId } });
    if (!config) throw new Error('Configuração não encontrada');

    return {
      guildId: config.guildId,
      language: config.language,
      timezone: config.timezone,
      logChannelId: config.logChannelId,
      modRoleId: config.modRoleId,
      adminRoleId: config.adminRoleId,
      welcomeChannelId: config.welcomeChannelId,
      defaultRoleId: config.defaultRoleId,
      quarantineRoleId: config.quarantineRoleId,
      ignoredChannelIds: config.ignoredChannelIds,
      ignoredRoleIds: config.ignoredRoleIds,
      raidMode: config.raidMode,
      raidEnabled: config.raidEnabled,
      spamLimit: config.spamLimit,
      spamWindowSeconds: config.spamWindowSeconds,
      maxMentions: config.maxMentions,
      maxLinks: config.maxLinks,
      maxNewAccounts: config.maxNewAccounts,
      newAccountWindow: config.newAccountWindow,
      retentionDays: config.retentionDays,
      notifyDm: config.notifyDm,
      dmOnModeration: config.dmOnModeration,
    };
  }

  async importConfig(
    guildId: string,
    data: Record<string, unknown>,
    actorId: string
  ): Promise<any> {
    const allowed = [
      'language', 'timezone', 'logChannelId', 'modRoleId', 'adminRoleId', 'welcomeChannelId',
      'defaultRoleId', 'quarantineRoleId', 'ignoredChannelIds', 'ignoredRoleIds', 'raidMode',
      'raidEnabled', 'spamLimit', 'spamWindowSeconds', 'maxMentions', 'maxLinks',
      'maxNewAccounts', 'newAccountWindow', 'retentionDays', 'notifyDm', 'dmOnModeration',
    ];

    const filtered: any = {};
    for (const key of allowed) {
      if (key in data) filtered[key] = data[key];
    }

    await this.prisma.configHistory.create({
      data: {
        guildId,
        actorId,
        action: 'import',
        details: JSON.stringify({ keys: Object.keys(filtered) }),
      },
    });

    return this.update(guildId, filtered);
  }

  async restoreDefaults(guildId: string, actorId: string): Promise<any> {
    await this.prisma.configHistory.create({
      data: {
        guildId,
        actorId,
        action: 'restore',
        details: JSON.stringify({}),
      },
    });

    return this.prisma.guildConfig.upsert({
      where: { guildId },
      create: {
        guildId,
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        spamLimit: 5,
        spamWindowSeconds: 10,
        maxMentions: 5,
        maxLinks: 3,
        maxNewAccounts: 5,
        newAccountWindow: 300,
        retentionDays: 30,
        notifyDm: true,
        dmOnModeration: true,
        ignoredChannelIds: '[]',
        ignoredRoleIds: '[]',
      },
      update: {
        language: 'pt-BR',
        timezone: 'America/Sao_Paulo',
        spamLimit: 5,
        spamWindowSeconds: 10,
        maxMentions: 5,
        maxLinks: 3,
        maxNewAccounts: 5,
        newAccountWindow: 300,
        retentionDays: 30,
        notifyDm: true,
        dmOnModeration: true,
        ignoredChannelIds: '[]',
        ignoredRoleIds: '[]',
      },
    });
  }
}
