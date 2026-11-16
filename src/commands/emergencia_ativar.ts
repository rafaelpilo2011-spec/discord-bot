import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';

export const data = new SlashCommandBuilder()
  .setName('emergencia_ativar')
  .setDescription('Ativa o modo de contenção de emergência')
  .setDefaultMemberPermissions(['ManageGuild'] as any)
  .addIntegerOption((option: any) =>
    option.setName('duracao').setDescription('Duração em minutos').setRequired(false).setMinValue(1).setMaxValue(1440)
  );

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `emergencia_ativar_${interaction.user.id}`;
  const cd = checkCooldown(key, 3, 300000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const guild = interaction.guild!;
  const duration = interaction.options.getInteger('duracao') || 60;
  const configService = new (require('../services/guildConfig.service').GuildConfigService)(client.prisma);

  const endsAt = new Date(Date.now() + duration * 60000);

  try {
    await configService.update(guild.id, {
      emergencyActive: true,
      emergencyEndsAt: endsAt,
      raidMode: 'emergency',
    });
    await successReply(interaction, `Emergência ativada por ${duration} minuto(s).`);
  } catch (err: any) {
    return errorReply(interaction, `Erro ao ativar emergência: ${err.message}`);
  }
};

export default { data, handler };
