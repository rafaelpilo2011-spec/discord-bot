import { PermissionFlagsBits } from 'discord.js';
import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';
import { CaseService } from '../services/case.service';
import { ModerationService } from '../services/moderation.service';

export const data = new SlashCommandBuilder()
  .setName('avisar')
  .setDescription('Adiciona um aviso a um membro')
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption((option: any) => option.setName('membro').setDescription('Membro a ser avisado').setRequired(true))
  .addStringOption((option: any) => option.setName('motivo').setDescription('Motivo do aviso').setRequired(true));

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `avisar_${interaction.user.id}`;
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
  if (member.id === guild.ownerId) return errorReply(interaction, 'Não é possível punir o proprietário.');
  if (member.id === client.user?.id) return errorReply(interaction, 'Não é possível punir o bot.');
  if (member.roles.highest.position >= executor.roles.highest.position && member.id !== guild.ownerId) {
    return errorReply(interaction, 'Este membro tem cargo igual ou superior ao seu.');
  }
  if (!guild.members.me?.permissions.has('ModerateMembers')) return errorReply(interaction, 'O bot não tem permissão de moderar.');

  try {
    const modMember = await guild.members.fetch(member.id);
    if (modMember.roles.highest.position >= guild.members.me!.roles.highest.position && modMember.id !== guild.ownerId) {
      return errorReply(interaction, 'Este membro tem cargo igual ou superior ao bot.');
    }
  } catch {}

  const c = await caseService.create({
    guildId: guild.id,
    type: 'warn',
    moderatorId: interaction.user.id,
    targetId: member.id,
    reason,
    result: 'success',
  });

  await modService.notifyTargetDM(guild.id, member.id, `⚠️ Você recebeu um aviso no servidor **${guild.name}**.\nMotivo: ${reason}`, settings);

  await successReply(interaction, `Aviso aplicado a ${member.user.tag}. Caso #${c.id}`);
};

export default { data, handler };
