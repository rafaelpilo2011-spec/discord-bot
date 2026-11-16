import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, infoReply, warningReply, buildConfirmRow } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';
import { GuildConfigService } from '../services/guildConfig.service';

export const data = new SlashCommandBuilder()
  .setName('configurar')
  .setDescription('Abre o painel de configuração do servidor')
  .setDefaultMemberPermissions(['ManageGuild'] as any);

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `config_${interaction.user.id}`;
  const cd = checkCooldown(key, 3, 60000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const guild = interaction.guild!;
  const member = interaction.member as GuildMember;
  const configService = new GuildConfigService(client.prisma);

  let current = settings;
  try {
    current = await configService.getOrCreate(guild.id);
  } catch {}

  const embed = {
    title: '⚙️ Painel de Configuração',
    description: 'Selecione uma opção abaixo para configurar o servidor.',
    color: 0x0099ff,
    fields: [
      { name: 'Canal de logs', value: current.logChannelId || 'Não definido', inline: true },
      { name: 'Cargo moderação', value: current.modRoleId || 'Não definido', inline: true },
      { name: 'Cargo admin', value: current.adminRoleId || 'Não definido', inline: true },
      { name: 'Modo antiraid', value: current.raidMode, inline: true },
      { name: 'Idioma', value: current.language, inline: true },
      { name: 'Fuso horário', value: current.timezone, inline: true },
    ],
  };

  const row = buildConfirmRow('config_main', 'Abrir painel');

  await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
};

export default { data, handler };
