"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.data = void 0;
const discord_js_1 = require("discord.js");
const responses_1 = require("../utils/responses");
const cooldown_1 = require("../utils/cooldown");
const case_service_1 = require("../services/case.service");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('avisos_remover')
    .setDescription('Remove um aviso pelo ID')
    .setDefaultMemberPermissions(['ModerateMembers'])
    .addStringOption((option) => option.setName('id').setDescription('ID do aviso').setRequired(true))
    .addStringOption((option) => option.setName('motivo').setDescription('Motivo da remoção').setRequired(true));
const handler = async (interaction, client, settings) => {
    const key = `avisos_remover_${interaction.user.id}`;
    const cd = (0, cooldown_1.checkCooldown)(key, 5, 60000);
    if (!cd.allowed) {
        return (0, responses_1.warningReply)(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
    }
    const id = interaction.options.getString('id');
    const motivo = interaction.options.getString('motivo');
    const warningService = new case_service_1.WarningService(client.prisma);
    const warning = await client.prisma.warning.findUnique({ where: { id } });
    if (!warning || warning.guildId !== interaction.guild.id) {
        return (0, responses_1.errorReply)(interaction, 'Aviso não encontrado.');
    }
    await warningService.remove(id);
    await (0, responses_1.successReply)(interaction, `Aviso #${id} removido. Motivo: ${motivo}`);
};
exports.handler = handler;
exports.default = { data: exports.data, handler: exports.handler };
//# sourceMappingURL=avisos_remover.js.map