"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.data = void 0;
const discord_js_1 = require("discord.js");
const responses_1 = require("../utils/responses");
const cooldown_1 = require("../utils/cooldown");
const guildConfig_service_1 = require("../services/guildConfig.service");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('configurar')
    .setDescription('Abre o painel de configuração do servidor')
    .setDefaultMemberPermissions(['ManageGuild']);
const handler = async (interaction, client, settings) => {
    const key = `config_${interaction.user.id}`;
    const cd = (0, cooldown_1.checkCooldown)(key, 3, 60000);
    if (!cd.allowed) {
        return (0, responses_1.warningReply)(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
    }
    const guild = interaction.guild;
    const member = interaction.member;
    const configService = new guildConfig_service_1.GuildConfigService(client.prisma);
    let current = settings;
    try {
        current = await configService.getOrCreate(guild.id);
    }
    catch { }
    const embed = {
        title: '⚙️ Painel de Configuração',
        description: 'Selecione uma opção abaixo para configurar o servidor.',
        color: 0x0099ff,
        fields: [
            { name: 'Canal de logs', value: current.logChannelId || 'Não definido', inline: true },
            { name: 'Cargo moderação', value: current.modRoleId || 'Não definido', inline: true },
            { name: 'Cargo admin', value: current.adminRoleId || 'Não definido', inline: true },
            { name: 'Modo antiraid', value: current.raidMode, inline: true },
            { name: 'Idioma', value: current.language, inline: true },
            { name: 'Fuso horário', value: current.timezone, inline: true },
        ],
    };
    const row = (0, responses_1.buildConfirmRow)('config_main', 'Abrir painel');
    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
};
exports.handler = handler;
exports.default = { data: exports.data, handler: exports.handler };
//# sourceMappingURL=configurar.js.map