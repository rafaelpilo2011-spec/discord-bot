import { PermissionFlagsBits } from 'discord.js';
import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, infoReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';
import { GuildConfigService } from '../services/guildConfig.service';

export const data = new SlashCommandBuilder()
  .setName('configuracao_ver')
  .setDescription('Exibe as configurações atuais do servidor')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `configver_${interaction.user.id}`;
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

  const embed = new EmbedBuilder()
    .setTitle('📋 Configurações do Servidor')
    .setColor(0x0099ff)
    .setTimestamp()
    .addFields(
      { name: 'ID do servidor', value: guild.id, inline: true },
      { name: 'Idioma', value: current.language, inline: true },
      { name: 'Fuso horário', value: current.timezone, inline: true },
      { name: 'Canal de logs', value: current.logChannelId || 'Não definido', inline: true },
      { name: 'Cargo moderação', value: current.modRoleId || 'Não definido', inline: true },
      { name: 'Cargo admin', value: current.adminRoleId || 'Não definido', inline: true },
      { name: 'Cargo inicial', value: current.defaultRoleId || 'Não definido', inline: true },
      { name: 'Cargo quarentena', value: current.quarantineRoleId || 'Não definido', inline: true },
      { name: 'Canal boas-vindas', value: current.welcomeChannelId || 'Não definido', inline: true },
      { name: 'Modo antiraid', value: current.raidMode, inline: true },
      { name: 'Antiraid ativado', value: current.raidEnabled ? 'Sim' : 'Não', inline: true },
      { name: 'Limite spam', value: String(current.spamLimit), inline: true },
      { name: 'Janela spam (s)', value: String(current.spamWindowSeconds), inline: true },
      { name: 'Máx menções', value: String(current.maxMentions), inline: true },
      { name: 'Máx links', value: String(current.maxLinks), inline: true },
      { name: 'Máx contas novas', value: String(current.maxNewAccounts), inline: true },
      { name: 'Retenção (dias)', value: String(current.retentionDays), inline: true },
      { name: 'Notificar DM', value: current.notifyDm ? 'Sim' : 'Não', inline: true },
      { name: 'DM moderação', value: current.dmOnModeration ? 'Sim' : 'Não', inline: true },
    );

  await interaction.reply({ embeds: [embed], ephemeral: true });
};

export default { data, handler };
