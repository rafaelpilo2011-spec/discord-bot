import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';
import { CaseService } from '../services/case.service';

export const data = new SlashCommandBuilder()
  .setName('desbanir')
  .setDescription('Remove o banimento de um usuário')
  .setDefaultMemberPermissions(['BanMembers'] as any)
  .addStringOption((option: any) => option.setName('usuario_id').setDescription('ID do usuário').setRequired(true))
  .addStringOption((option: any) => option.setName('motivo').setDescription('Motivo').setRequired(true));

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `desbanir_${interaction.user.id}`;
  const cd = checkCooldown(key, 5, 60000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const guild = interaction.guild!;
  const userId = interaction.options.getString('usuario_id')!;
  const reason = interaction.options.getString('motivo')!;
  const caseService = new CaseService(client.prisma);

  try {
    await guild.bans.remove(userId, reason);
    await caseService.create({
      guildId: guild.id,
      type: 'unban',
      moderatorId: interaction.user.id,
      targetId: userId,
      reason,
      result: 'success',
    });
    await successReply(interaction, `Banimento removido para ${userId}.`);
  } catch (err: any) {
    return errorReply(interaction, `Erro ao desbanir: ${err.message}`);
  }
};

export default { data, handler };
