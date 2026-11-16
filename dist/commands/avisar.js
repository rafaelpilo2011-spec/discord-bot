"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.data = void 0;
const discord_js_1 = require("discord.js");
const responses_1 = require("../utils/responses");
const cooldown_1 = require("../utils/cooldown");
const case_service_1 = require("../services/case.service");
const moderation_service_1 = require("../services/moderation.service");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('avisar')
    .setDescription('Adiciona um aviso a um membro')
    .setDefaultMemberPermissions(['ModerateMembers'])
    .addUserOption((option) => option.setName('membro').setDescription('Membro a ser avisado').setRequired(true))
    .addStringOption((option) => option.setName('motivo').setDescription('Motivo do aviso').setRequired(true));
const handler = async (interaction, client, settings) => {
    const key = `avisar_${interaction.user.id}`;
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
    if (member.id === guild.ownerId)
        return (0, responses_1.errorReply)(interaction, 'Não é possível punir o proprietário.');
    if (member.id === client.user?.id)
        return (0, responses_1.errorReply)(interaction, 'Não é possível punir o bot.');
    if (member.roles.highest.position >= executor.roles.highest.position && member.id !== guild.ownerId) {
        return (0, responses_1.errorReply)(interaction, 'Este membro tem cargo igual ou superior ao seu.');
    }
    if (!guild.members.me?.permissions.has('ModerateMembers'))
        return (0, responses_1.errorReply)(interaction, 'O bot não tem permissão de moderar.');
    try {
        const modMember = await guild.members.fetch(member.id);
        if (modMember.roles.highest.position >= guild.members.me.roles.highest.position && modMember.id !== guild.ownerId) {
            return (0, responses_1.errorReply)(interaction, 'Este membro tem cargo igual ou superior ao bot.');
        }
    }
    catch { }
    const c = await caseService.create({
        guildId: guild.id,
        type: 'warn',
        moderatorId: interaction.user.id,
        targetId: member.id,
        reason,
        result: 'success',
    });
    await modService.notifyTargetDM(guild.id, member.id, `⚠️ Você recebeu um aviso no servidor **${guild.name}**.\nMotivo: ${reason}`, settings);
    await (0, responses_1.successReply)(interaction, `Aviso aplicado a ${member.user.tag}. Caso #${c.id}`);
};
exports.handler = handler;
exports.default = { data: exports.data, handler: exports.handler };
//# sourceMappingURL=avisar.js.map