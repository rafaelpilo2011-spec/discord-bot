import { PermissionFlagsBits } from 'discord.js';
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';
import { CaseService } from '../services/case.service';

export const data = new SlashCommandBuilder()
  .setName('caso_ver')
  .setDescription('Exibe detalhes de um caso de moderação')
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addStringOption((option: any) => option.setName('id').setDescription('ID do caso').setRequired(true));

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `caso_ver_${interaction.user.id}`;
  const cd = checkCooldown(key, 5, 60000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const id = interaction.options.getString('id')!;
  const caseService = new CaseService(client.prisma);

  const c = await caseService.getById(interaction.guild!.id, id);
  if (!c) return errorReply(interaction, 'Caso não encontrado.');

  const lines = [
    `**ID:** ${c.id}`,
    `**Tipo:** ${c.type}`,
    `**Moderador:** ${c.moderatorId}`,
    `**Alvo:** ${c.targetId}`,
    `**Motivo:** ${c.reason}`,
    `**Duração:** ${c.duration ? c.duration + ' min' : 'N/A'}`,
    `**Resultado:** ${c.result}`,
    `**Data:** ${c.createdAt.toLocaleString('pt-BR')}`,
  ];

  await interaction.reply({ content: lines.join('\n'), ephemeral: true });
};

export default { data, handler };
