"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.data = void 0;
const discord_js_1 = require("discord.js");
const responses_1 = require("../utils/responses");
const cooldown_1 = require("../utils/cooldown");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('canal_slowmode')
    .setDescription('Define slowmode no canal')
    .setDefaultMemberPermissions(['ManageChannels'])
    .addIntegerOption((option) => option.setName('segundos').setDescription('Segundos de slowmode').setRequired(true).setMinValue(0).setMaxValue(21600));
const handler = async (interaction, client, settings) => {
    const key = `canal_slowmode_${interaction.user.id}`;
    const cd = (0, cooldown_1.checkCooldown)(key, 3, 60000);
    if (!cd.allowed) {
        return (0, responses_1.warningReply)(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
    }
    const segundos = interaction.options.getInteger('segundos');
    const channel = interaction.channel;
    if (!channel || !channel.isTextBased)
        return (0, responses_1.errorReply)(interaction, 'Canal inválido.');
    try {
        await channel.setRateLimitPerUser(segundos);
        await (0, responses_1.successReply)(interaction, `Slowmode definido para ${segundos} segundo(s).`);
    }
    catch (err) {
        return (0, responses_1.errorReply)(interaction, `Erro ao definir slowmode: ${err.message}`);
    }
};
exports.handler = handler;
exports.default = { data: exports.data, handler: exports.handler };
//# sourceMappingURL=canal_slowmode.js.map