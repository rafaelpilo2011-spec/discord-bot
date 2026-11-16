import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';
import { CaseService } from '../services/case.service';
import { ModerationService } from '../services/moderation.service';

export const data = new SlashCommandBuilder()
  .setName('timeout_aplicar')
  .setDescription('Aplica timeout a um membro')
  .setDefaultMemberPermissions(['ModerateMembers'] as any)
  .addUserOption((option: any) => option.setName('membro').setDescription('Membro').setRequired(true))
  .addIntegerOption((option: any) => option.setName('duracao').setDescription('Duração em minutos').setRequired(true).setMinValue(1).setMaxValue(40320))
  .addStringOption((option: any) => option.setName('motivo').setDescription('Motivo').setRequired(true));

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `timeout_aplicar_${interaction.user.id}`;
  const cd = checkCooldown(key, 5, 60000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const guild = interaction.guild!;
  const member = interaction.options.getMember('membro') as GuildMember;
  const duration = interaction.options.getInteger('duracao')!;
  const reason = interaction.options.getString('motivo')!;
  const executor = interaction.member as GuildMember;
  const caseService = new CaseService(client.prisma);
  const modService = new ModerationService(caseService);

  if (!member) return errorReply(interaction, 'Membro não encontrado.');
  if (member.id === guild.ownerId) return errorReply(interaction, 'Não é possível punir o proprietário.');
  if (member.id === client.user?.id) return errorReply(interaction, 'Não é possível punir o bot.');
  if (member.roles.highest.position >= executor.roles.highest.position && member.id !== guild.ownerId) {
    return errorReply(interaction, 'Cargo igual ou superior ao seu.');
  }
  if (!guild.members.me?.permissions.has('ModerateMembers')) return errorReply(interaction, 'Bot sem permissão de moderar.');

  try {
    await member.timeout(duration * 60 * 1000, reason);
    await caseService.create({
      guildId: guild.id,
      type: 'timeout',
      moderatorId: interaction.user.id,
      targetId: member.id,
      reason,
      duration,
      result: 'success',
    });
    await modService.notifyTargetDM(guild.id, member.id, `⏱️ Timeout aplicado em **${guild.name}** por ${duration} minuto(s).\nMotivo: ${reason}`, settings);
    await successReply(interaction, `Timeout aplicado a ${member.user.tag} por ${duration} minuto(s).`);
  } catch (err: any) {
    return errorReply(interaction, `Erro ao aplicar timeout: ${err.message}`);
  }
};

export default { data, handler };
