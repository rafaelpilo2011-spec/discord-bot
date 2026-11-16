import { PermissionFlagsBits } from 'discord.js';
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';

export const data = new SlashCommandBuilder()
  .setName('canal_bloquear')
  .setDescription('Bloqueia o canal atual')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels);

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `canal_bloquear_${interaction.user.id}`;
  const cd = checkCooldown(key, 3, 60000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const channel = interaction.channel as any;
  if (!channel || !channel.isTextBased) return errorReply(interaction, 'Canal inválido.');

  try {
    await channel.permissionOverwrites.edit(interaction.guild!.id, { SendMessages: false });
    await successReply(interaction, 'Canal bloqueado.');
  } catch (err: any) {
    return errorReply(interaction, `Erro ao bloquear: ${err.message}`);
  }
};

export default { data, handler };
