"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.data = void 0;
const discord_js_1 = require("discord.js");
const responses_1 = require("../utils/responses");
const cooldown_1 = require("../utils/cooldown");
const guildConfig_service_1 = require("../services/guildConfig.service");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('configuracao_ver')
    .setDescription('Exibe as configurações atuais do servidor')
    .setDefaultMemberPermissions(['ManageGuild']);
const handler = async (interaction, client, settings) => {
    const key = `configver_${interaction.user.id}`;
    const cd = (0, cooldown_1.checkCooldown)(key, 5, 60000);
    if (!cd.allowed) {
        return (0, responses_1.warningReply)(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
    }
    const guild = interaction.guild;
    const configService = new guildConfig_service_1.GuildConfigService(client.prisma);
    let current = settings;
    try {
        current = await configService.getOrCreate(guild.id);
    }
    catch { }
    const embed = new discord_js_1.EmbedBuilder()
        .setTitle('📋 Configurações do Servidor')
        .setColor(0x0099ff)
        .setTimestamp()
        .addFields({ name: 'ID do servidor', value: guild.id, inline: true }, { name: 'Idioma', value: current.language, inline: true }, { name: 'Fuso horário', value: current.timezone, inline: true }, { name: 'Canal de logs', value: current.logChannelId || 'Não definido', inline: true }, { name: 'Cargo moderação', value: current.modRoleId || 'Não definido', inline: true }, { name: 'Cargo admin', value: current.adminRoleId || 'Não definido', inline: true }, { name: 'Cargo inicial', value: current.defaultRoleId || 'Não definido', inline: true }, { name: 'Cargo quarentena', value: current.quarantineRoleId || 'Não definido', inline: true }, { name: 'Canal boas-vindas', value: current.welcomeChannelId || 'Não definido', inline: true }, { name: 'Modo antiraid', value: current.raidMode, inline: true }, { name: 'Antiraid ativado', value: current.raidEnabled ? 'Sim' : 'Não', inline: true }, { name: 'Limite spam', value: String(current.spamLimit), inline: true }, { name: 'Janela spam (s)', value: String(current.spamWindowSeconds), inline: true }, { name: 'Máx menções', value: String(current.maxMentions), inline: true }, { name: 'Máx links', value: String(current.maxLinks), inline: true }, { name: 'Máx contas novas', value: String(current.maxNewAccounts), inline: true }, { name: 'Retenção (dias)', value: String(current.retentionDays), inline: true }, { name: 'Notificar DM', value: current.notifyDm ? 'Sim' : 'Não', inline: true }, { name: 'DM moderação', value: current.dmOnModeration ? 'Sim' : 'Não', inline: true });
    await interaction.reply({ embeds: [embed], ephemeral: true });
};
exports.handler = handler;
exports.default = { data: exports.data, handler: exports.handler };
//# sourceMappingURL=configuracao_ver.js.map