"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.data = void 0;
const discord_js_1 = require("discord.js");
const responses_1 = require("../utils/responses");
const cooldown_1 = require("../utils/cooldown");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('emergencia_ativar')
    .setDescription('Ativa o modo de contenção de emergência')
    .setDefaultMemberPermissions(['ManageGuild'])
    .addIntegerOption((option) => option.setName('duracao').setDescription('Duração em minutos').setRequired(false).setMinValue(1).setMaxValue(1440));
const handler = async (interaction, client, settings) => {
    const key = `emergencia_ativar_${interaction.user.id}`;
    const cd = (0, cooldown_1.checkCooldown)(key, 3, 300000);
    if (!cd.allowed) {
        return (0, responses_1.warningReply)(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
    }
    const guild = interaction.guild;
    const duration = interaction.options.getInteger('duracao') || 60;
    const configService = new (require('../services/guildConfig.service').GuildConfigService)(client.prisma);
    const endsAt = new Date(Date.now() + duration * 60000);
    try {
        await configService.update(guild.id, {
            emergencyActive: true,
            emergencyEndsAt: endsAt,
            raidMode: 'emergency',
        });
        await (0, responses_1.successReply)(interaction, `Emergência ativada por ${duration} minuto(s).`);
    }
    catch (err) {
        return (0, responses_1.errorReply)(interaction, `Erro ao ativar emergência: ${err.message}`);
    }
};
exports.handler = handler;
exports.default = { data: exports.data, handler: exports.handler };
//# sourceMappingURL=emergencia_ativar.js.map