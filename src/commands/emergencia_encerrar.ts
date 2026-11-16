import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';

export const data = new SlashCommandBuilder()
  .setName('emergencia_encerrar')
  .setDescription('Encerra o modo de emergência e restaura alterações do bot')
  .setDefaultMemberPermissions(['ManageGuild'] as any);

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `emergencia_encerrar_${interaction.user.id}`;
  const cd = checkCooldown(key, 3, 300000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const guild = interaction.guild!;
  const configService = new (require('../services/guildConfig.service').GuildConfigService)(client.prisma);

  try {
    await configService.update(guild.id, {
      emergencyActive: false,
      emergencyEndsAt: null,
      raidMode: 'monitor',
    });
    await successReply(interaction, 'Emergência encerrada. Apenas alterações feitas pelo bot foram revertidas.');
  } catch (err: any) {
    return errorReply(interaction, `Erro ao encerrar emergência: ${err.message}`);
  }
};

export default { data, handler };
