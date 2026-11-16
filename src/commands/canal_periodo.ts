import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';

export const data = new SlashCommandBuilder()
  .setName('canal_periodo')
  .setDescription('Limpa mensagens em um período')
  .setDefaultMemberPermissions(['ManageMessages'] as any)
  .addStringOption((option: any) => option.setName('inicio').setDescription('Início (YYYY-MM-DD)').setRequired(true))
  .addStringOption((option: any) => option.setName('fim').setDescription('Fim (YYYY-MM-DD)').setRequired(true));

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `canal_periodo_${interaction.user.id}`;
  const cd = checkCooldown(key, 3, 60000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const inicio = interaction.options.getString('inicio')!;
  const fim = interaction.options.getString('fim')!;
  const channel = interaction.channel;
  if (!channel || !channel.isTextBased()) return errorReply(interaction, 'Canal inválido.');

  const inicioTs = new Date(inicio).getTime();
  const fimTs = new Date(fim).getTime();
  if (isNaN(inicioTs) || isNaN(fimTs)) return errorReply(interaction, 'Datas inválidas.');

  try {
    let totalDeleted = 0;
    let fetched = await channel.messages.fetch({ limit: 100 });
    while (fetched.size > 0) {
      const toDelete = fetched.filter((m: any) => {
        const ts = m.createdTimestamp;
        return ts >= inicioTs && ts <= fimTs;
      });
      if (toDelete.size > 0) {
        await channel.bulkDelete(toDelete, true);
        totalDeleted += toDelete.size;
      }
      const oldest = fetched.last()!;
      if (oldest.createdTimestamp < inicioTs) break;
      fetched = await channel.messages.fetch({ limit: 100, before: oldest.id });
    }
    await successReply(interaction, `✅ ${totalDeleted} mensagens excluídas no período.`);
  } catch (err: any) {
    return errorReply(interaction, `Erro ao limpar: ${err.message}`);
  }
};

export default { data, handler };
