import { PermissionFlagsBits } from 'discord.js';
import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, infoReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';
import { CaseService, WarningService } from '../services/case.service';

export const data = new SlashCommandBuilder()
  .setName('avisos_listar')
  .setDescription('Lista avisos de um membro')
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addUserOption((option: any) => option.setName('membro').setDescription('Membro').setRequired(true));

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `avisos_listar_${interaction.user.id}`;
  const cd = checkCooldown(key, 5, 60000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const guild = interaction.guild!;
  const member = interaction.options.getMember('membro') as GuildMember;
  const warningService = new WarningService(client.prisma);

  if (!member) return errorReply(interaction, 'Membro não encontrado.');

  const warnings = await warningService.listByUser(guild.id, member.id);

  if (warnings.length === 0) {
    return infoReply(interaction, `${member.user.tag} não possui avisos.`);
  }

  const lines = warnings.map((w: any) => `#${w.id} - ${w.reason} - ${w.createdAt.toLocaleString('pt-BR')}`);
  await interaction.reply({ content: `Avisos de ${member.user.tag}:\n${lines.join('\n')}`, ephemeral: true });
};

export default { data, handler };
