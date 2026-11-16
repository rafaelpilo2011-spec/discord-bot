import { PermissionFlagsBits } from 'discord.js';
import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';
import { CaseService } from '../services/case.service';
import { ModerationService } from '../services/moderation.service';

export const data = new SlashCommandBuilder()
  .setName('banir')
  .setDescription('Bane um membro do servidor')
  .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
  .addUserOption((option: any) => option.setName('membro').setDescription('Membro').setRequired(true))
  .addStringOption((option: any) => option.setName('motivo').setDescription('Motivo').setRequired(true))
  .addIntegerOption((option: any) => option.setName('dias').setDescription('Dias de histórico para apagar').setMinValue(0).setMaxValue(7));

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `banir_${interaction.user.id}`;
  const cd = checkCooldown(key, 5, 60000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const guild = interaction.guild!;
  const member = interaction.options.getMember('membro') as GuildMember;
  const reason = interaction.options.getString('motivo')!;
  const days = interaction.options.getInteger('dias') || 0;
  const executor = interaction.member as GuildMember;
  const caseService = new CaseService(client.prisma);
  const modService = new ModerationService(caseService);

  if (!member) return errorReply(interaction, 'Membro não encontrado.');
  if (member.id === guild.ownerId) return errorReply(interaction, 'Não é possível punir o proprietário.');
  if (member.id === client.user?.id) return errorReply(interaction, 'Não é possível punir o bot.');
  if (member.roles.highest.position >= executor.roles.highest.position && member.id !== guild.ownerId) {
    return errorReply(interaction, 'Cargo igual ou superior ao seu.');
  }
  if (!guild.members.me?.permissions.has('BanMembers')) return errorReply(interaction, 'Bot sem permissão de banir.');

  try {
    await member.ban({ reason, deleteMessageSeconds: days * 86400 });
    await caseService.create({
      guildId: guild.id,
      type: 'ban',
      moderatorId: interaction.user.id,
      targetId: member.id,
      reason,
      result: 'success',
    });
    await modService.notifyTargetDM(guild.id, member.id, `🔨 Você foi banido de **${guild.name}**.\nMotivo: ${reason}`, settings);
    await successReply(interaction, `${member.user.tag} foi banido.`);
  } catch (err: any) {
    return errorReply(interaction, `Erro ao banir: ${err.message}`);
  }
};

export default { data, handler };
