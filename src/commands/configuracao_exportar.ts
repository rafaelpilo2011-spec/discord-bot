import { PermissionFlagsBits } from 'discord.js';
import { SlashCommandBuilder, ChatInputCommandInteraction, AttachmentBuilder } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';
import { GuildConfigService } from '../services/guildConfig.service';

export const data = new SlashCommandBuilder()
  .setName('configuracao_exportar')
  .setDescription('Exporta as configurações do servidor para JSON')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `configexport_${interaction.user.id}`;
  const cd = checkCooldown(key, 3, 300000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const guild = interaction.guild!;
  const configService = new GuildConfigService(client.prisma);

  try {
    const data = await configService.exportConfig(guild.id);
    const json = JSON.stringify(data, null, 2);
    const buffer = Buffer.from(json, 'utf8');

    await interaction.reply({
      content: '📤 Configurações exportadas. Este arquivo não contém tokens ou segredos.',
      ephemeral: true,
      files: [new AttachmentBuilder(buffer, { name: `config-${guild.id}.json` })],
    });
  } catch (err: any) {
    return errorReply(interaction, `Erro ao exportar: ${err.message}`);
  }
};

export default { data, handler };
