import { SlashCommandBuilder, ChatInputCommandInteraction, AttachmentBuilder } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';
import { GuildConfigService } from '../services/guildConfig.service';

export const data = new SlashCommandBuilder()
  .setName('configuracao_importar')
  .setDescription('Importa configurações de um arquivo JSON')
  .setDefaultMemberPermissions(['ManageGuild'] as any)
  .addAttachmentOption((option: any) =>
    option
      .setName('arquivo')
      .setDescription('Arquivo JSON com as configurações')
      .setRequired(true)
  );

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `configimport_${interaction.user.id}`;
  const cd = checkCooldown(key, 3, 300000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const guild = interaction.guild!;
  const configService = new GuildConfigService(client.prisma);

  const attachment = interaction.options.getAttachment('arquivo');
  if (!attachment) return errorReply(interaction, 'Arquivo não encontrado.');
  if (attachment.size > 1024 * 1024) return errorReply(interaction, 'Arquivo muito grande (máx 1MB).');
  if (!attachment.name.endsWith('.json')) return errorReply(interaction, 'Envie um arquivo .json válido.');

  try {
    const response = await fetch(attachment.url);
    const text = await response.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      return errorReply(interaction, 'JSON inválido.');
    }

    const preview: string[] = [];
    const allowed = [
      'language', 'timezone', 'logChannelId', 'modRoleId', 'adminRoleId', 'welcomeChannelId',
      'defaultRoleId', 'quarantineRoleId', 'ignoredChannelIds', 'ignoredRoleIds', 'raidMode',
      'raidEnabled', 'spamLimit', 'spamWindowSeconds', 'maxMentions', 'maxLinks',
      'maxNewAccounts', 'newAccountWindow', 'retentionDays', 'notifyDm', 'dmOnModeration',
    ];
    for (const key of allowed) {
      if (key in data) preview.push(`${key}: ${JSON.stringify(data[key])}`);
    }

    await interaction.reply({
      content: `Prévia das mudanças:\n${preview.slice(0, 10).join('\n')}${preview.length > 10 ? '\n...' : ''}`,
      ephemeral: true,
      components: [
        {
          type: 1,
          components: [
            { type: 2, style: 3, custom_id: 'confirm_import', label: 'Confirmar importação' },
            { type: 2, style: 2, custom_id: 'cancel_import', label: 'Cancelar' },
          ],
        },
      ],
    });

    const filter = (i: any) => i.user.id === interaction.user.id;
    const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 60000 });

    if (!collector) return;

    collector.on('collect', async (i: any) => {
      if (i.customId === 'confirm_import') {
        await configService.importConfig(guild.id, data, interaction.user.id);
        await i.update({ content: '✅ Configurações importadas com sucesso.', components: [] });
        collector.stop();
      } else if (i.customId === 'cancel_import') {
        await i.update({ content: '❌ Importação cancelada.', components: [] });
        collector.stop();
      }
    });
  } catch (err: any) {
    return errorReply(interaction, `Erro ao importar: ${err.message}`);
  }
};

export default { data, handler };
