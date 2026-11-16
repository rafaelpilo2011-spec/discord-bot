"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.data = void 0;
const discord_js_1 = require("discord.js");
const responses_1 = require("../utils/responses");
const cooldown_1 = require("../utils/cooldown");
const case_service_1 = require("../services/case.service");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('historico')
    .setDescription('Exibe o histórico de moderação de um membro')
    .setDefaultMemberPermissions(['ModerateMembers'])
    .addUserOption((option) => option.setName('membro').setDescription('Membro').setRequired(true));
const handler = async (interaction, client, settings) => {
    const key = `historico_${interaction.user.id}`;
    const cd = (0, cooldown_1.checkCooldown)(key, 5, 60000);
    if (!cd.allowed) {
        return (0, responses_1.warningReply)(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
    }
    const guild = interaction.guild;
    const member = interaction.options.getMember('membro');
    const caseService = new case_service_1.CaseService(client.prisma);
    if (!member)
        return (0, responses_1.errorReply)(interaction, 'Membro não encontrado.');
    const cases = await caseService.listByTarget(guild.id, member.id);
    if (cases.length === 0) {
        return (0, responses_1.successReply)(interaction, `${member.user.tag} não possui histórico de moderação.`);
    }
    const lines = cases.map((c) => `#${c.id} - ${c.type} - ${c.reason} - ${c.createdAt.toLocaleString('pt-BR')}`);
    await interaction.reply({ content: `Histórico de ${member.user.tag}:\n${lines.join('\n')}`, ephemeral: true });
};
exports.handler = handler;
exports.default = { data: exports.data, handler: exports.handler };
//# sourceMappingURL=historico.js.map