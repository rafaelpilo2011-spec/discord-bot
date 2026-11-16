"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.data = void 0;
const discord_js_1 = require("discord.js");
const responses_1 = require("../utils/responses");
const cooldown_1 = require("../utils/cooldown");
const case_service_1 = require("../services/case.service");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('caso_ver')
    .setDescription('Exibe detalhes de um caso de moderação')
    .setDefaultMemberPermissions(['ModerateMembers'])
    .addStringOption((option) => option.setName('id').setDescription('ID do caso').setRequired(true));
const handler = async (interaction, client, settings) => {
    const key = `caso_ver_${interaction.user.id}`;
    const cd = (0, cooldown_1.checkCooldown)(key, 5, 60000);
    if (!cd.allowed) {
        return (0, responses_1.warningReply)(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
    }
    const id = interaction.options.getString('id');
    const caseService = new case_service_1.CaseService(client.prisma);
    const c = await caseService.getById(interaction.guild.id, id);
    if (!c)
        return (0, responses_1.errorReply)(interaction, 'Caso não encontrado.');
    const lines = [
        `**ID:** ${c.id}`,
        `**Tipo:** ${c.type}`,
        `**Moderador:** ${c.moderatorId}`,
        `**Alvo:** ${c.targetId}`,
        `**Motivo:** ${c.reason}`,
        `**Duração:** ${c.duration ? c.duration + ' min' : 'N/A'}`,
        `**Resultado:** ${c.result}`,
        `**Data:** ${c.createdAt.toLocaleString('pt-BR')}`,
    ];
    await interaction.reply({ content: lines.join('\n'), ephemeral: true });
};
exports.handler = handler;
exports.default = { data: exports.data, handler: exports.handler };
//# sourceMappingURL=caso_ver.js.map