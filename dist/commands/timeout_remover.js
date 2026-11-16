"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.data = void 0;
const discord_js_1 = require("discord.js");
const responses_1 = require("../utils/responses");
const cooldown_1 = require("../utils/cooldown");
const case_service_1 = require("../services/case.service");
const moderation_service_1 = require("../services/moderation.service");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('timeout_remover')
    .setDescription('Remove timeout de um membro')
    .setDefaultMemberPermissions(['ModerateMembers'])
    .addUserOption((option) => option.setName('membro').setDescription('Membro').setRequired(true))
    .addStringOption((option) => option.setName('motivo').setDescription('Motivo').setRequired(true));
const handler = async (interaction, client, settings) => {
    const key = `timeout_remover_${interaction.user.id}`;
    const cd = (0, cooldown_1.checkCooldown)(key, 5, 60000);
    if (!cd.allowed) {
        return (0, responses_1.warningReply)(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
    }
    const guild = interaction.guild;
    const member = interaction.options.getMember('membro');
    const reason = interaction.options.getString('motivo');
    const executor = interaction.member;
    const caseService = new case_service_1.CaseService(client.prisma);
    const modService = new moderation_service_1.ModerationService(caseService);
    if (!member)
        return (0, responses_1.errorReply)(interaction, 'Membro não encontrado.');
    if (member.roles.highest.position >= executor.roles.highest.position && member.id !== guild.ownerId) {
        return (0, responses_1.errorReply)(interaction, 'Cargo igual ou superior ao seu.');
    }
    try {
        await member.timeout(null, reason);
        await caseService.create({
            guildId: guild.id,
            type: 'timeout_remove',
            moderatorId: interaction.user.id,
            targetId: member.id,
            reason,
            result: 'success',
        });
        await modService.notifyTargetDM(guild.id, member.id, `✅ Seu timeout foi removido em **${guild.name}**.\nMotivo: ${reason}`, settings);
        await (0, responses_1.successReply)(interaction, `Timeout removido de ${member.user.tag}.`);
    }
    catch (err) {
        return (0, responses_1.errorReply)(interaction, `Erro ao remover timeout: ${err.message}`);
    }
};
exports.handler = handler;
exports.default = { data: exports.data, handler: exports.handler };
//# sourceMappingURL=timeout_remover.js.map