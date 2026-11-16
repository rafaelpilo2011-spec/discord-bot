import { PermissionFlagsBits } from 'discord.js';
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';
import { GuildConfigService } from '../services/guildConfig.service';

export const data = new SlashCommandBuilder()
  .setName('antiraid_desativar')
  .setDescription('Desativa a proteção contra raids')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `antiraid_desativar_${interaction.user.id}`;
  const cd = checkCooldown(key, 3, 60000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const guild = interaction.guild!;
  const configService = new GuildConfigService(client.prisma);

  try {
    await configService.update(guild.id, { raidEnabled: false });
    await successReply(interaction, 'Proteção contra raids desativada.');
  } catch (err: any) {
    return errorReply(interaction, `Erro ao desativar: ${err.message}`);
  }
};

export default { data, handler };
