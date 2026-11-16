import { PermissionFlagsBits } from 'discord.js';
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';
import { GuildConfigService } from '../services/guildConfig.service';

export const data = new SlashCommandBuilder()
  .setName('antiraid_status')
  .setDescription('Exibe o status da proteção contra raids')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `antiraid_status_${interaction.user.id}`;
  const cd = checkCooldown(key, 5, 60000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const guild = interaction.guild!;
  const configService = new GuildConfigService(client.prisma);
  let current = settings;
  try {
    current = await configService.getOrCreate(guild.id);
  } catch {}

  const activeRaids = await client.prisma.raidEvent.findMany({
    where: { guildId: guild.id, resolved: false },
    orderBy: { startedAt: 'desc' },
    take: 5,
  });

  const lines = [
    `**Modo:** ${current.raidMode}`,
    `**Ativado:** ${current.raidEnabled ? 'Sim' : 'Não'}`,
    `**Emergência:** ${current.emergencyActive ? 'ATIVA' : 'Inativa'}`,
    `**Limite spam:** ${current.spamLimit} msg / ${current.spamWindowSeconds}s`,
    `**Máx menções:** ${current.maxMentions}`,
    `**Máx links:** ${current.maxLinks}`,
    `**Máx contas novas:** ${current.maxNewAccounts} / ${current.newAccountWindow}s`,
    '',
    'Eventos ativos:',
  ];

  if (activeRaids.length === 0) lines.push('Nenhum evento ativo.');
  else {
    for (const r of activeRaids) {
      lines.push(`• ${r.type} - ${r.severity} - score ${r.signalScore}`);
    }
  }

  await interaction.reply({ content: lines.join('\n'), ephemeral: true });
};

export default { data, handler };
