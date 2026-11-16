"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.data = void 0;
const discord_js_1 = require("discord.js");
const responses_1 = require("../utils/responses");
const cooldown_1 = require("../utils/cooldown");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('canal_clonar')
    .setDescription('Clona o canal atual')
    .setDefaultMemberPermissions(['ManageChannels']);
const handler = async (interaction, client, settings) => {
    const key = `canal_clonar_${interaction.user.id}`;
    const cd = (0, cooldown_1.checkCooldown)(key, 3, 60000);
    if (!cd.allowed) {
        return (0, responses_1.warningReply)(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
    }
    const channel = interaction.channel;
    if (!channel || !channel.isTextBased)
        return (0, responses_1.errorReply)(interaction, 'Canal inválido.');
    try {
        const cloned = await channel.clone();
        await (0, responses_1.successReply)(interaction, `Canal clonado: <#${cloned.id}>`);
    }
    catch (err) {
        return (0, responses_1.errorReply)(interaction, `Erro ao clonar: ${err.message}`);
    }
};
exports.handler = handler;
exports.default = { data: exports.data, handler: exports.handler };
//# sourceMappingURL=canal_clonar.js.map