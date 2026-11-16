"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.data = void 0;
const discord_js_1 = require("discord.js");
const responses_1 = require("../utils/responses");
const cooldown_1 = require("../utils/cooldown");
const guildConfig_service_1 = require("../services/guildConfig.service");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('configuracao_exportar')
    .setDescription('Exporta as configurações do servidor para JSON')
    .setDefaultMemberPermissions(['ManageGuild']);
const handler = async (interaction, client, settings) => {
    const key = `configexport_${interaction.user.id}`;
    const cd = (0, cooldown_1.checkCooldown)(key, 3, 300000);
    if (!cd.allowed) {
        return (0, responses_1.warningReply)(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
    }
    const guild = interaction.guild;
    const configService = new guildConfig_service_1.GuildConfigService(client.prisma);
    try {
        const data = await configService.exportConfig(guild.id);
        const json = JSON.stringify(data, null, 2);
        const buffer = Buffer.from(json, 'utf8');
        await interaction.reply({
            content: '📤 Configurações exportadas. Este arquivo não contém tokens ou segredos.',
            ephemeral: true,
            files: [new discord_js_1.AttachmentBuilder(buffer, { name: `config-${guild.id}.json` })],
        });
    }
    catch (err) {
        return (0, responses_1.errorReply)(interaction, `Erro ao exportar: ${err.message}`);
    }
};
exports.handler = handler;
exports.default = { data: exports.data, handler: exports.handler };
//# sourceMappingURL=configuracao_exportar.js.map