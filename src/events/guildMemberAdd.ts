import { Events, GuildMember } from 'discord.js';

export default {
  name: Events.GuildMemberAdd,
  async execute(member: GuildMember, client: any) {
    const antiRaid = client.antiRaid;
    if (!antiRaid) return;

    antiRaid.recordJoin(member.guild.id, member.id);

    const settings = await client.prisma.guildConfig.findUnique({ where: { guildId: member.guild.id } });
    if (!settings?.raidEnabled) return;

    if (member.user.createdTimestamp && Date.now() - member.user.createdTimestamp < 86400000) {
      // Conta criada há menos de 24h - apenas registra, não pune automaticamente
      try {
        await client.prisma.raidEvent.create({
          data: {
            guildId: member.guild.id,
            type: 'new_account',
            severity: 'low',
            signalScore: 5,
          },
        });
      } catch {}
    }
  },
};
