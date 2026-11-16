import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';
import { CaseService } from '../services/case.service';

export const data = new SlashCommandBuilder()
  .setName('historico')
  .setDescription('Exibe o histórico de moderação de um membro')
  .setDefaultMemberPermissions(['ModerateMembers'] as any)
  .addUserOption((option: any) => option.setName('membro').setDescription('Membro').setRequired(true));

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `historico_${interaction.user.id}`;
  const cd = checkCooldown(key, 5, 60000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const guild = interaction.guild!;
  const member = interaction.options.getMember('membro') as GuildMember;
  const caseService = new CaseService(client.prisma);

  if (!member) return errorReply(interaction, 'Membro não encontrado.');

  const cases = await caseService.listByTarget(guild.id, member.id);

  if (cases.length === 0) {
    return successReply(interaction, `${member.user.tag} não possui histórico de moderação.`);
  }

  const lines = cases.map(
    (c: any) => `#${c.id} - ${c.type} - ${c.reason} - ${c.createdAt.toLocaleString('pt-BR')}`
  );

  await interaction.reply({ content: `Histórico de ${member.user.tag}:\n${lines.join('\n')}`, ephemeral: true });
};

export default { data, handler };
