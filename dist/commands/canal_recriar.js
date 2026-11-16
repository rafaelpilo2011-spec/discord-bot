"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.data = void 0;
const discord_js_1 = require("discord.js");
const responses_1 = require("../utils/responses");
const cooldown_1 = require("../utils/cooldown");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('canal_recriar')
    .setDescription('Recria o canal atual (desativado por padrão)')
    .setDefaultMemberPermissions(['Administrator']);
const handler = async (interaction, client, settings) => {
    const key = `canal_recriar_${interaction.user.id}`;
    const cd = (0, cooldown_1.checkCooldown)(key, 3, 60000);
    if (!cd.allowed) {
        return (0, responses_1.warningReply)(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
    }
    const channel = interaction.channel;
    if (!channel || !channel.isTextBased)
        return (0, responses_1.errorReply)(interaction, 'Canal inválido.');
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
    const filter = (i) => i.user.id === interaction.user.id;
    const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 60000 });
    if (!collector)
        return;
    collector.on('collect', async (i) => {
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
            }
            catch (err) {
                await i.update({ content: `❌ Erro: ${err.message}`, components: [] });
            }
            collector.stop();
        }
    });
};
exports.handler = handler;
exports.default = { data: exports.data, handler: exports.handler };
//# sourceMappingURL=canal_recriar.js.map