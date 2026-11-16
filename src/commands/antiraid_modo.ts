import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';
import { GuildConfigService } from '../services/guildConfig.service';

export const data = new SlashCommandBuilder()
  .setName('antiraid_modo')
  .setDescription('Define o modo de proteção contra raids')
  .setDefaultMemberPermissions(['ManageGuild'] as any)
  .addStringOption((option: any) =>
    option
      .setName('modo')
      .setDescription('Modo de proteção')
      .setRequired(true)
      .addChoices(
        { name: 'Monitoramento', value: 'monitor' },
        { name: 'Proteção', value: 'protect' },
        { name: 'Emergência', value: 'emergency' }
      )
  );

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `antiraid_modo_${interaction.user.id}`;
  const cd = checkCooldown(key, 3, 60000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const guild = interaction.guild!;
  const mode = interaction.options.getString('modo')!;
  const configService = new GuildConfigService(client.prisma);

  try {
    await configService.update(guild.id, { raidMode: mode as any });
    await successReply(interaction, `Modo antiraid alterado para: **${mode}**`);
  } catch (err: any) {
    return errorReply(interaction, `Erro ao alterar modo: ${err.message}`);
  }
};

export default { data, handler };
