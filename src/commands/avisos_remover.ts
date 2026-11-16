import { PermissionFlagsBits } from 'discord.js';
import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';
import { CaseService, WarningService } from '../services/case.service';

export const data = new SlashCommandBuilder()
  .setName('avisos_remover')
  .setDescription('Remove um aviso pelo ID')
  .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
  .addStringOption((option: any) => option.setName('id').setDescription('ID do aviso').setRequired(true))
  .addStringOption((option: any) => option.setName('motivo').setDescription('Motivo da remoção').setRequired(true));

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `avisos_remover_${interaction.user.id}`;
  const cd = checkCooldown(key, 5, 60000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const id = interaction.options.getString('id')!;
  const motivo = interaction.options.getString('motivo')!;
  const warningService = new WarningService(client.prisma);

  const warning = await client.prisma.warning.findUnique({ where: { id } });
  if (!warning || warning.guildId !== interaction.guild!.id) {
    return errorReply(interaction, 'Aviso não encontrado.');
  }

  await warningService.remove(id);
  await successReply(interaction, `Aviso #${id} removido. Motivo: ${motivo}`);
};

export default { data, handler };
