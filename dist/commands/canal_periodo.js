"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.data = void 0;
const discord_js_1 = require("discord.js");
const responses_1 = require("../utils/responses");
const cooldown_1 = require("../utils/cooldown");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('canal_periodo')
    .setDescription('Limpa mensagens em um período')
    .setDefaultMemberPermissions(['ManageMessages'])
    .addStringOption((option) => option.setName('inicio').setDescription('Início (YYYY-MM-DD)').setRequired(true))
    .addStringOption((option) => option.setName('fim').setDescription('Fim (YYYY-MM-DD)').setRequired(true));
const handler = async (interaction, client, settings) => {
    const key = `canal_periodo_${interaction.user.id}`;
    const cd = (0, cooldown_1.checkCooldown)(key, 3, 60000);
    if (!cd.allowed) {
        return (0, responses_1.warningReply)(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
    }
    const inicio = interaction.options.getString('inicio');
    const fim = interaction.options.getString('fim');
    const channel = interaction.channel;
    if (!channel || !channel.isTextBased())
        return (0, responses_1.errorReply)(interaction, 'Canal inválido.');
    const inicioTs = new Date(inicio).getTime();
    const fimTs = new Date(fim).getTime();
    if (isNaN(inicioTs) || isNaN(fimTs))
        return (0, responses_1.errorReply)(interaction, 'Datas inválidas.');
    try {
        let totalDeleted = 0;
        let fetched = await channel.messages.fetch({ limit: 100 });
        while (fetched.size > 0) {
            const toDelete = fetched.filter((m) => {
                const ts = m.createdTimestamp;
                return ts >= inicioTs && ts <= fimTs;
            });
            if (toDelete.size > 0) {
                await channel.bulkDelete(toDelete, true);
                totalDeleted += toDelete.size;
            }
            const oldest = fetched.last();
            if (oldest.createdTimestamp < inicioTs)
                break;
            fetched = await channel.messages.fetch({ limit: 100, before: oldest.id });
        }
        await (0, responses_1.successReply)(interaction, `✅ ${totalDeleted} mensagens excluídas no período.`);
    }
    catch (err) {
        return (0, responses_1.errorReply)(interaction, `Erro ao limpar: ${err.message}`);
    }
};
exports.handler = handler;
exports.default = { data: exports.data, handler: exports.handler };
//# sourceMappingURL=canal_periodo.js.map