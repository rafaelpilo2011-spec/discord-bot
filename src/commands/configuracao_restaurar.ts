import { PermissionFlagsBits } from 'discord.js';
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';
import { GuildConfigService } from '../services/guildConfig.service';

export const data = new SlashCommandBuilder()
  .setName('configuracao_restaurar')
  .setDescription('Restaura as configurações padrão do servidor')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `configrestore_${interaction.user.id}`;
  const cd = checkCooldown(key, 3, 300000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const guild = interaction.guild!;
  const configService = new GuildConfigService(client.prisma);

  await interaction.reply({
    content: '⚠️ Isso restaurará todas as configurações para os valores padrão. Deseja continuar?',
    ephemeral: true,
    components: [
      {
        type: 1,
        components: [
          { type: 2, style: 4, custom_id: 'confirm_restore', label: 'Restaurar' },
          { type: 2, style: 2, custom_id: 'cancel_restore', label: 'Cancelar' },
        ],
      },
    ],
  });

  const filter = (i: any) => i.user.id === interaction.user.id;
  const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 60000 });
  if (!collector) return;

  collector.on('collect', async (i: any) => {
    if (i.customId === 'confirm_restore') {
      try {
        await configService.restoreDefaults(guild.id, interaction.user.id);
        await i.update({ content: '✅ Configurações restauradas ao padrão.', components: [] });
      } catch (err: any) {
        await i.update({ content: `❌ Erro: ${err.message}`, components: [] });
      }
      collector.stop();
    } else if (i.customId === 'cancel_restore') {
      await i.update({ content: '❌ Restauração cancelada.', components: [] });
      collector.stop();
    }
  });
};

export default { data, handler };
