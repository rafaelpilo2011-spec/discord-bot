import { PermissionFlagsBits } from 'discord.js';
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { RegisteredCommand } from '../types';
import { errorReply, successReply, warningReply } from '../utils/responses';
import { checkCooldown } from '../utils/cooldown';
import { GuildConfigService } from '../services/guildConfig.service';

export const data = new SlashCommandBuilder()
  .setName('antiraid_configurar')
  .setDescription('Configura as regras de proteção contra raids')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

export const handler: RegisteredCommand['handler'] = async (interaction: any, client: any, settings: any) => {
  const key = `antiraid_cfg_${interaction.user.id}`;
  const cd = checkCooldown(key, 3, 60000);
  if (!cd.allowed) {
    return warningReply(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
  }

  const guild = interaction.guild!;
  const configService = new GuildConfigService(client.prisma);
  let current = settings;
  try {
    current = await configService.getOrCreate(guild.id);
  } catch {}

  const modes = ['monitor', 'protect', 'emergency'].map((m: string) => ({
    label: m.charAt(0).toUpperCase() + m.slice(1),
    value: m,
    description: m === 'monitor' ? 'Apenas alerta' : m === 'protect' ? 'Proteção leve' : 'Contenção',
  }));

  const row = {
    type: 1,
    components: [
      {
        type: 3,
        custom_id: 'antiraid_mode_select',
        placeholder: 'Escolha o modo de proteção',
        options: modes,
      },
    ],
  };

  await interaction.reply({
    content: `Modo atual: **${current.raidMode}**\nLimite spam: ${current.spamLimit}/${current.spamWindowSeconds}s\nMáx menções: ${current.maxMentions}\nMáx links: ${current.maxLinks}\nSelecione abaixo para ajustar:`,
    components: [row],
    ephemeral: true,
  });

  const filter = (i: any) => i.user.id === interaction.user.id && i.customId === 'antiraid_mode_select';
  const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 60000 });
  if (!collector) return;

  collector.on('collect', async (i: any) => {
    const mode = i.values[0];
    try {
      await configService.update(guild.id, { raidMode: mode as any });
      await i.update({ content: `✅ Modo antiraid alterado para: **${mode}**`, components: [] });
    } catch (err: any) {
      await i.update({ content: `❌ Erro: ${err.message}`, components: [] });
    }
    collector.stop();
  });
};

export default { data, handler };
