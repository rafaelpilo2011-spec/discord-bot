import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';

export const data = new SlashCommandBuilder()
  .setName('canal_recriar')
  .setDescription('Recria o canal atual (desativado por padrão)')
  .setDefaultMemberPermissions(['Administrator'] as any);

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `canal_recriar_${interaction.user.id}`;
  const cd = checkCooldown(key, 3, 60000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const channel = interaction.channel as any;
  if (!channel || !channel.isTextBased) return errorReply(interaction, 'Canal inválido.');

  await interaction.reply({
    content: '⚠️ Recriar canal apaga o histórico e altera o ID. Confirme digitando o nome do canal abaixo.',
    ephemeral: true,
    components: [
      {
        type: 1,
        components: [
          { type: 2, style: 3, custom_id: 'confirm_recreate', label: 'Confirmar' },
          { type: 2, style: 2, custom_id: 'cancel_recreate', label: 'Cancelar' },
        ],
      },
    ],
  });

  const filter = (i: any) => i.user.id === interaction.user.id;
  const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 60000 });
  if (!collector) return;

  collector.on('collect', async (i: any) => {
    if (i.customId === 'cancel_recreate') {
      await i.update({ content: '❌ Cancelado.', components: [] });
      collector.stop();
      return;
    }
    if (i.customId === 'confirm_recreate') {
      try {
        const newChannel = await channel.clone();
        await channel.delete();
        await i.update({ content: `✅ Canal recriado: <#${newChannel.id}>`, components: [] });
      } catch (err: any) {
        await i.update({ content: `❌ Erro: ${err.message}`, components: [] });
      }
      collector.stop();
    }
  });
};

export default { data, handler };
