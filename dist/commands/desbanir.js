"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.data = void 0;
const discord_js_1 = require("discord.js");
const responses_1 = require("../utils/responses");
const cooldown_1 = require("../utils/cooldown");
const case_service_1 = require("../services/case.service");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('desbanir')
    .setDescription('Remove o banimento de um usuário')
    .setDefaultMemberPermissions(['BanMembers'])
    .addStringOption((option) => option.setName('usuario_id').setDescription('ID do usuário').setRequired(true))
    .addStringOption((option) => option.setName('motivo').setDescription('Motivo').setRequired(true));
const handler = async (interaction, client, settings) => {
    const key = `desbanir_${interaction.user.id}`;
    const cd = (0, cooldown_1.checkCooldown)(key, 5, 60000);
    if (!cd.allowed) {
        return (0, responses_1.warningReply)(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
    }
    const guild = interaction.guild;
    const userId = interaction.options.getString('usuario_id');
    const reason = interaction.options.getString('motivo');
    const caseService = new case_service_1.CaseService(client.prisma);
    try {
        await guild.bans.remove(userId, reason);
        await caseService.create({
            guildId: guild.id,
            type: 'unban',
            moderatorId: interaction.user.id,
            targetId: userId,
            reason,
            result: 'success',
        });
        await (0, responses_1.successReply)(interaction, `Banimento removido para ${userId}.`);
    }
    catch (err) {
        return (0, responses_1.errorReply)(interaction, `Erro ao desbanir: ${err.message}`);
    }
};
exports.handler = handler;
exports.default = { data: exports.data, handler: exports.handler };
//# sourceMappingURL=desbanir.js.map