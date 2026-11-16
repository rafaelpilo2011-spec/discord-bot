import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';

export const data = new SlashCommandBuilder()
  .setName('canal_slowmode')
  .setDescription('Define slowmode no canal')
  .setDefaultMemberPermissions(['ManageChannels'] as any)
  .addIntegerOption((option: any) =>
    option.setName('segundos').setDescription('Segundos de slowmode').setRequired(true).setMinValue(0).setMaxValue(21600)
  );

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `canal_slowmode_${interaction.user.id}`;
  const cd = checkCooldown(key, 3, 60000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const segundos = interaction.options.getInteger('segundos')!;
  const channel = interaction.channel as any;
  if (!channel || !channel.isTextBased) return errorReply(interaction, 'Canal inválido.');

  try {
    await channel.setRateLimitPerUser(segundos);
    await successReply(interaction, `Slowmode definido para ${segundos} segundo(s).`);
  } catch (err: any) {
    return errorReply(interaction, `Erro ao definir slowmode: ${err.message}`);
  }
};

export default { data, handler };
