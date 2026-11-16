"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.data = void 0;
const discord_js_1 = require("discord.js");
const responses_1 = require("../utils/responses");
const cooldown_1 = require("../utils/cooldown");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('emergencia_encerrar')
    .setDescription('Encerra o modo de emergência e restaura alterações do bot')
    .setDefaultMemberPermissions(['ManageGuild']);
const handler = async (interaction, client, settings) => {
    const key = `emergencia_encerrar_${interaction.user.id}`;
    const cd = (0, cooldown_1.checkCooldown)(key, 3, 300000);
    if (!cd.allowed) {
        return (0, responses_1.warningReply)(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
    }
    const guild = interaction.guild;
    const configService = new (require('../services/guildConfig.service').GuildConfigService)(client.prisma);
    try {
        await configService.update(guild.id, {
            emergencyActive: false,
            emergencyEndsAt: null,
            raidMode: 'monitor',
        });
        await (0, responses_1.successReply)(interaction, 'Emergência encerrada. Apenas alterações feitas pelo bot foram revertidas.');
    }
    catch (err) {
        return (0, responses_1.errorReply)(interaction, `Erro ao encerrar emergência: ${err.message}`);
    }
};
exports.handler = handler;
exports.default = { data: exports.data, handler: exports.handler };
//# sourceMappingURL=emergencia_encerrar.js.map