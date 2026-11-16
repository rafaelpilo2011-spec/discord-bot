"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.data = void 0;
const discord_js_1 = require("discord.js");
const responses_1 = require("../utils/responses");
const cooldown_1 = require("../utils/cooldown");
const guildConfig_service_1 = require("../services/guildConfig.service");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('antiraid_configurar')
    .setDescription('Configura as regras de proteção contra raids')
    .setDefaultMemberPermissions(['ManageGuild']);
const handler = async (interaction, client, settings) => {
    const key = `antiraid_cfg_${interaction.user.id}`;
    const cd = (0, cooldown_1.checkCooldown)(key, 3, 60000);
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
    const modes = ['monitor', 'protect', 'emergency'].map((m) => ({
        label: m.charAt(0).toUpperCase() + m.slice(1),
        value: m,
        description: m === 'monitor' ? 'Apenas alerta' : m === 'protect' ? 'Proteção leve' : 'Contenção',
    }));
    const row = {
        type: 1,
        components: [
            {
                type: 3,
                custom_id: 'antiraid_mode_select',
                placeholder: 'Escolha o modo de proteção',
                options: modes,
            },
        ],
    };
    await interaction.reply({
        content: `Modo atual: **${current.raidMode}**\nLimite spam: ${current.spamLimit}/${current.spamWindowSeconds}s\nMáx menções: ${current.maxMentions}\nMáx links: ${current.maxLinks}\nSelecione abaixo para ajustar:`,
        components: [row],
        ephemeral: true,
    });
    const filter = (i) => i.user.id === interaction.user.id && i.customId === 'antiraid_mode_select';
    const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 60000 });
    if (!collector)
        return;
    collector.on('collect', async (i) => {
        const mode = i.values[0];
        try {
            await configService.update(guild.id, { raidMode: mode });
            await i.update({ content: `✅ Modo antiraid alterado para: **${mode}**`, components: [] });
        }
        catch (err) {
            await i.update({ content: `❌ Erro: ${err.message}`, components: [] });
        }
        collector.stop();
    });
};
exports.handler = handler;
exports.default = { data: exports.data, handler: exports.handler };
//# sourceMappingURL=antiraid_configurar.js.map