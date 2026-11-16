import { Events, Interaction } from 'discord.js';

export default {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction, client: any) {
    if (!interaction.isChatInputCommand()) return;

    if (!interaction.inGuild()) return interaction.reply({ content: 'Use este comando em um servidor.', ephemeral: true });

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      const required = command.data.toJSON().default_member_permissions;
      if (required && !interaction.memberPermissions?.has(BigInt(required))) {
        return interaction.reply({ content: 'Você não tem permissão para este comando.', ephemeral: true });
      }
      const settings = await client.prisma.guildConfig.findUnique({
        where: { guildId: interaction.guildId! },
      });
      if (!settings && interaction.commandName !== 'configurar') {
        return interaction.reply({
          content: '⚠️ Configure o servidor primeiro com /configurar.',
          ephemeral: true,
        });
      }

      await command.handler(interaction, client, settings);
    } catch (error: any) {
      console.error('[CMD] Erro:', error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: `❌ Erro: ${error.message}`, ephemeral: true });
      } else {
        await interaction.reply({ content: `❌ Erro: ${error.message}`, ephemeral: true });
      }
    }
  },
};
