import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';
import { CaseService } from '../services/case.service';
import { ModerationService } from '../services/moderation.service';

export const data = new SlashCommandBuilder()
  .setName('timeout_remover')
  .setDescription('Remove timeout de um membro')
  .setDefaultMemberPermissions(['ModerateMembers'] as any)
  .addUserOption((option: any) => option.setName('membro').setDescription('Membro').setRequired(true))
  .addStringOption((option: any) => option.setName('motivo').setDescription('Motivo').setRequired(true));

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `timeout_remover_${interaction.user.id}`;
  const cd = checkCooldown(key, 5, 60000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const guild = interaction.guild!;
  const member = interaction.options.getMember('membro') as GuildMember;
  const reason = interaction.options.getString('motivo')!;
  const executor = interaction.member as GuildMember;
  const caseService = new CaseService(client.prisma);
  const modService = new ModerationService(caseService);

  if (!member) return errorReply(interaction, 'Membro não encontrado.');
  if (member.roles.highest.position >= executor.roles.highest.position && member.id !== guild.ownerId) {
    return errorReply(interaction, 'Cargo igual ou superior ao seu.');
  }

  try {
    await member.timeout(null, reason);
    await caseService.create({
      guildId: guild.id,
      type: 'timeout_remove',
      moderatorId: interaction.user.id,
      targetId: member.id,
      reason,
      result: 'success',
    });
    await modService.notifyTargetDM(guild.id, member.id, `✅ Seu timeout foi removido em **${guild.name}**.\nMotivo: ${reason}`, settings);
    await successReply(interaction, `Timeout removido de ${member.user.tag}.`);
  } catch (err: any) {
    return errorReply(interaction, `Erro ao remover timeout: ${err.message}`);
  }
};

export default { data, handler };
