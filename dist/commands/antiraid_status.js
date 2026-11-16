"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.data = void 0;
const discord_js_1 = require("discord.js");
const responses_1 = require("../utils/responses");
const cooldown_1 = require("../utils/cooldown");
const guildConfig_service_1 = require("../services/guildConfig.service");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('antiraid_status')
    .setDescription('Exibe o status da proteção contra raids')
    .setDefaultMemberPermissions(['ManageGuild']);
const handler = async (interaction, client, settings) => {
    const key = `antiraid_status_${interaction.user.id}`;
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
    const activeRaids = await client.prisma.raidEvent.findMany({
        where: { guildId: guild.id, resolved: false },
        orderBy: { startedAt: 'desc' },
        take: 5,
    });
    const lines = [
        `**Modo:** ${current.raidMode}`,
        `**Ativado:** ${current.raidEnabled ? 'Sim' : 'Não'}`,
        `**Emergência:** ${current.emergencyActive ? 'ATIVA' : 'Inativa'}`,
        `**Limite spam:** ${current.spamLimit} msg / ${current.spamWindowSeconds}s`,
        `**Máx menções:** ${current.maxMentions}`,
        `**Máx links:** ${current.maxLinks}`,
        `**Máx contas novas:** ${current.maxNewAccounts} / ${current.newAccountWindow}s`,
        '',
        'Eventos ativos:',
    ];
    if (activeRaids.length === 0)
        lines.push('Nenhum evento ativo.');
    else {
        for (const r of activeRaids) {
            lines.push(`• ${r.type} - ${r.severity} - score ${r.signalScore}`);
        }
    }
    await interaction.reply({ content: lines.join('\n'), ephemeral: true });
};
exports.handler = handler;
exports.default = { data: exports.data, handler: exports.handler };
//# sourceMappingURL=antiraid_status.js.map