import { PermissionFlagsBits } from 'discord.js';
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';

export const data = new SlashCommandBuilder()
  .setName('limpar')
  .setDescription('Limpa mensagens do canal')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addIntegerOption((option: any) =>
    option.setName('quantidade').setDescription('Quantidade de mensagens').setRequired(true).setMinValue(1).setMaxValue(100)
  );

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `limpar_${interaction.user.id}`;
  const cd = checkCooldown(key, 3, 60000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const quantidade = interaction.options.getInteger('quantidade')!;
  const channel = interaction.channel;

  if (!channel || !channel.isTextBased()) return errorReply(interaction, 'Canal inválido.');

  try {
    const deleted = await channel.bulkDelete(quantidade, true);
    await successReply(interaction, `✅ ${deleted.size} mensagens excluídas.`);
  } catch (err: any) {
    return errorReply(interaction, `Erro ao limpar: ${err.message}`);
  }
};

export default { data, handler };
