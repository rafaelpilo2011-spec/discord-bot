import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';

export const data = new SlashCommandBuilder()
  .setName('denunciar')
  .setDescription('Denuncia um membro para a equipe de moderação')
  .addUserOption((option: any) => option.setName('membro').setDescription('Membro denunciado').setRequired(true))
  .addStringOption((option: any) => option.setName('motivo').setDescription('Motivo da denúncia').setRequired(true));

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `denunciar_${interaction.user.id}`;
  const cd = checkCooldown(key, 5, 300000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const guild = interaction.guild!;
  const member = interaction.options.getMember('membro') as GuildMember;
  const reason = interaction.options.getString('motivo')!;

  if (!member) return errorReply(interaction, 'Membro não encontrado.');

  try {
    await client.prisma.report.create({
      data: {
        guildId: guild.id,
        reporterId: interaction.user.id,
        targetId: member.id,
        reason,
        channelId: interaction.channelId,
        messageId: (interaction as any).message?.id,
      },
    });

    await successReply(interaction, 'Denúncia enviada para a equipe de moderação.');

    if (settings.logChannelId) {
      const logChannel = guild.channels.cache.get(settings.logChannelId);
      if (logChannel && logChannel.isTextBased()) {
        await logChannel.send({
          embeds: [
            {
              title: '🚨 Nova denúncia',
              fields: [
                { name: 'Denunciante', value: interaction.user.tag },
                { name: 'Denunciado', value: member.user.tag },
                { name: 'Motivo', value: reason },
              ],
              color: 0xff0000,
            },
          ],
        });
      }
    }
  } catch (err: any) {
    return errorReply(interaction, `Erro ao denunciar: ${err.message}`);
  }
};

export default { data, handler };
