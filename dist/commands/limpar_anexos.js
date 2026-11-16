"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.data = void 0;
const discord_js_1 = require("discord.js");
const responses_1 = require("../utils/responses");
const cooldown_1 = require("../utils/cooldown");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('limpar_anexos')
    .setDescription('Limpa mensagens com anexos')
    .setDefaultMemberPermissions(['ManageMessages'])
    .addIntegerOption((option) => option.setName('quantidade').setDescription('Quantidade a analisar').setRequired(true).setMinValue(1).setMaxValue(100));
const handler = async (interaction, client, settings) => {
    const key = `limpar_anexos_${interaction.user.id}`;
    const cd = (0, cooldown_1.checkCooldown)(key, 3, 60000);
    if (!cd.allowed) {
        return (0, responses_1.warningReply)(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
    }
    const quantidade = interaction.options.getInteger('quantidade');
    const channel = interaction.channel;
    if (!channel || !channel.isTextBased())
        return (0, responses_1.errorReply)(interaction, 'Canal inválido.');
    try {
        const messages = await channel.messages.fetch({ limit: 100 });
        const attachmentMessages = messages.filter((m) => m.attachments.size > 0).first(quantidade);
        const deleted = await channel.bulkDelete(attachmentMessages, true);
        await (0, responses_1.successReply)(interaction, `✅ ${deleted.size} mensagens com anexos excluídas.`);
    }
    catch (err) {
        return (0, responses_1.errorReply)(interaction, `Erro ao limpar: ${err.message}`);
    }
};
exports.handler = handler;
exports.default = { data: exports.data, handler: exports.handler };
//# sourceMappingURL=limpar_anexos.js.map