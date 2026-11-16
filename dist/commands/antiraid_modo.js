"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.data = void 0;
const discord_js_1 = require("discord.js");
const responses_1 = require("../utils/responses");
const cooldown_1 = require("../utils/cooldown");
const guildConfig_service_1 = require("../services/guildConfig.service");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('antiraid_modo')
    .setDescription('Define o modo de proteção contra raids')
    .setDefaultMemberPermissions(['ManageGuild'])
    .addStringOption((option) => option
    .setName('modo')
    .setDescription('Modo de proteção')
    .setRequired(true)
    .addChoices({ name: 'Monitoramento', value: 'monitor' }, { name: 'Proteção', value: 'protect' }, { name: 'Emergência', value: 'emergency' }));
const handler = async (interaction, client, settings) => {
    const key = `antiraid_modo_${interaction.user.id}`;
    const cd = (0, cooldown_1.checkCooldown)(key, 3, 60000);
    if (!cd.allowed) {
        return (0, responses_1.warningReply)(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
    }
    const guild = interaction.guild;
    const mode = interaction.options.getString('modo');
    const configService = new guildConfig_service_1.GuildConfigService(client.prisma);
    try {
        await configService.update(guild.id, { raidMode: mode });
        await (0, responses_1.successReply)(interaction, `Modo antiraid alterado para: **${mode}**`);
    }
    catch (err) {
        return (0, responses_1.errorReply)(interaction, `Erro ao alterar modo: ${err.message}`);
    }
};
exports.handler = handler;
exports.default = { data: exports.data, handler: exports.handler };
//# sourceMappingURL=antiraid_modo.js.map