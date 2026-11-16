import { PermissionFlagsBits } from 'discord.js';
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';

export const data = new SlashCommandBuilder()
  .setName('limpar_bots')
  .setDescription('Limpa mensagens de bots')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addIntegerOption((option: any) =>
    option.setName('quantidade').setDescription('Quantidade a analisar').setRequired(true).setMinValue(1).setMaxValue(100)
  );

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `limpar_bots_${interaction.user.id}`;
  const cd = checkCooldown(key, 3, 60000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const quantidade = interaction.options.getInteger('quantidade')!;
  const channel = interaction.channel;
  if (!channel || !channel.isTextBased()) return errorReply(interaction, 'Canal inválido.');

  try {
    const messages = await channel.messages.fetch({ limit: 100 });
    const botMessages = messages.filter((m: any) => m.author.bot).first(quantidade);
    const deleted = await channel.bulkDelete(botMessages, true);
    await successReply(interaction, `✅ ${deleted.size} mensagens de bots excluídas.`);
  } catch (err: any) {
    return errorReply(interaction, `Erro ao limpar: ${err.message}`);
  }
};

export default { data, handler };
