import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';

export const data = new SlashCommandBuilder()
  .setName('limpar_usuario')
  .setDescription('Limpa mensagens de um usuário específico')
  .setDefaultMemberPermissions(['ManageMessages'] as any)
  .addUserOption((option: any) => option.setName('membro').setDescription('Membro').setRequired(true))
  .addIntegerOption((option: any) =>
    option.setName('quantidade').setDescription('Quantidade a analisar').setRequired(true).setMinValue(1).setMaxValue(100)
  );

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `limpar_usuario_${interaction.user.id}`;
  const cd = checkCooldown(key, 3, 60000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const member = interaction.options.getMember('membro') as GuildMember;
  const quantidade = interaction.options.getInteger('quantidade')!;
  const channel = interaction.channel;

  if (!member) return errorReply(interaction, 'Membro não encontrado.');
  if (!channel || !channel.isTextBased()) return errorReply(interaction, 'Canal inválido.');

  try {
    const messages = await channel.messages.fetch({ limit: 100 });
    const targetMessages = messages.filter((m: any) => m.author.id === member.id).first(quantidade);
    const deleted = await channel.bulkDelete(targetMessages, true);
    await successReply(interaction, `✅ ${deleted.size} mensagens de ${member.user.tag} excluídas.`);
  } catch (err: any) {
    return errorReply(interaction, `Erro ao limpar: ${err.message}`);
  }
};

export default { data, handler };
