"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: discord_js_1.Events.InteractionCreate,
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand())
            return;
        const command = client.commands.get(interaction.commandName);
        if (!command)
            return;
        try {
            const settings = await client.prisma.guildConfig.findUnique({
                where: { guildId: interaction.guildId },
            });
            if (!settings) {
                return interaction.reply({
                    content: '⚠️ Configure o servidor primeiro com /configurar.',
                    ephemeral: true,
                });
            }
            await command.handler(interaction, client, settings);
        }
        catch (error) {
            console.error('[CMD] Erro:', error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: `❌ Erro: ${error.message}`, ephemeral: true });
            }
            else {
                await interaction.reply({ content: `❌ Erro: ${error.message}`, ephemeral: true });
            }
        }
    },
};
//# sourceMappingURL=interactionCreate.js.map