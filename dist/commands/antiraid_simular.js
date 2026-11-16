"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.data = void 0;
const discord_js_1 = require("discord.js");
const responses_1 = require("../utils/responses");
const cooldown_1 = require("../utils/cooldown");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('antiraid_simular')
    .setDescription('Simula um evento de raid com dados sintéticos')
    .setDefaultMemberPermissions(['ManageGuild'])
    .addStringOption((option) => option
    .setName('tipo')
    .setDescription('Tipo de simulação')
    .setRequired(true)
    .addChoices({ name: 'Entradas em massa', value: 'join_spike' }, { name: 'Contas novas', value: 'new_accounts' }, { name: 'Spam de mensagens', value: 'message_spam' }))
    .addIntegerOption((option) => option.setName('quantidade').setDescription('Quantidade de eventos').setRequired(true).setMinValue(1).setMaxValue(100));
const handler = async (interaction, client, settings) => {
    const key = `antiraid_simular_${interaction.user.id}`;
    const cd = (0, cooldown_1.checkCooldown)(key, 3, 300000);
    if (!cd.allowed) {
        return (0, responses_1.warningReply)(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
    }
    const type = interaction.options.getString('tipo');
    const quantity = interaction.options.getInteger('quantidade');
    const antiRaid = client.antiRaid;
    if (antiRaid) {
        const result = antiRaid.simulate(interaction.guild.id, type, quantity);
        await (0, responses_1.successReply)(interaction, `Simulação de **${type}** registrada: ${result.recorded} eventos sintéticos.`);
    }
    else {
        await (0, responses_1.warningReply)(interaction, 'Serviço antiraid não inicializado.');
    }
};
exports.handler = handler;
exports.default = { data: exports.data, handler: exports.handler };
//# sourceMappingURL=antiraid_simular.js.map