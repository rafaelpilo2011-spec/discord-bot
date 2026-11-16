"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.data = void 0;
const discord_js_1 = require("discord.js");
const responses_1 = require("../utils/responses");
const cooldown_1 = require("../utils/cooldown");
const case_service_1 = require("../services/case.service");
const moderation_service_1 = require("../services/moderation.service");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('timeout_aplicar')
    .setDescription('Aplica timeout a um membro')
    .setDefaultMemberPermissions(['ModerateMembers'])
    .addUserOption((option) => option.setName('membro').setDescription('Membro').setRequired(true))
    .addIntegerOption((option) => option.setName('duracao').setDescription('Duração em minutos').setRequired(true).setMinValue(1).setMaxValue(40320))
    .addStringOption((option) => option.setName('motivo').setDescription('Motivo').setRequired(true));
const handler = async (interaction, client, settings) => {
    const key = `timeout_aplicar_${interaction.user.id}`;
    const cd = (0, cooldown_1.checkCooldown)(key, 5, 60000);
    if (!cd.allowed) {
        return (0, responses_1.warningReply)(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
    }
    const guild = interaction.guild;
    const member = interaction.options.getMember('membro');
    const duration = interaction.options.getInteger('duracao');
    const reason = interaction.options.getString('motivo');
    const executor = interaction.member;
    const caseService = new case_service_1.CaseService(client.prisma);
    const modService = new moderation_service_1.ModerationService(caseService);
    if (!member)
        return (0, responses_1.errorReply)(interaction, 'Membro não encontrado.');
    if (member.id === guild.ownerId)
        return (0, responses_1.errorReply)(interaction, 'Não é possível punir o proprietário.');
    if (member.id === client.user?.id)
        return (0, responses_1.errorReply)(interaction, 'Não é possível punir o bot.');
    if (member.roles.highest.position >= executor.roles.highest.position && member.id !== guild.ownerId) {
        return (0, responses_1.errorReply)(interaction, 'Cargo igual ou superior ao seu.');
    }
    if (!guild.members.me?.permissions.has('ModerateMembers'))
        return (0, responses_1.errorReply)(interaction, 'Bot sem permissão de moderar.');
    try {
        await member.timeout(duration * 60 * 1000, reason);
        await caseService.create({
            guildId: guild.id,
            type: 'timeout',
            moderatorId: interaction.user.id,
            targetId: member.id,
            reason,
            duration,
            result: 'success',
        });
        await modService.notifyTargetDM(guild.id, member.id, `⏱️ Timeout aplicado em **${guild.name}** por ${duration} minuto(s).\nMotivo: ${reason}`, settings);
        await (0, responses_1.successReply)(interaction, `Timeout aplicado a ${member.user.tag} por ${duration} minuto(s).`);
    }
    catch (err) {
        return (0, responses_1.errorReply)(interaction, `Erro ao aplicar timeout: ${err.message}`);
    }
};
exports.handler = handler;
exports.default = { data: exports.data, handler: exports.handler };
//# sourceMappingURL=timeout_aplicar.js.map