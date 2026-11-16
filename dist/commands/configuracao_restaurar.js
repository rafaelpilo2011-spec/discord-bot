"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.data = void 0;
const discord_js_1 = require("discord.js");
const responses_1 = require("../utils/responses");
const cooldown_1 = require("../utils/cooldown");
const guildConfig_service_1 = require("../services/guildConfig.service");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('configuracao_restaurar')
    .setDescription('Restaura as configurações padrão do servidor')
    .setDefaultMemberPermissions(['ManageGuild']);
const handler = async (interaction, client, settings) => {
    const key = `configrestore_${interaction.user.id}`;
    const cd = (0, cooldown_1.checkCooldown)(key, 3, 300000);
    if (!cd.allowed) {
        return (0, responses_1.warningReply)(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
    }
    const guild = interaction.guild;
    const configService = new guildConfig_service_1.GuildConfigService(client.prisma);
    await interaction.reply({
        content: '⚠️ Isso restaurará todas as configurações para os valores padrão. Deseja continuar?',
        ephemeral: true,
        components: [
            {
                type: 1,
                components: [
                    { type: 2, style: 4, custom_id: 'confirm_restore', label: 'Restaurar' },
                    { type: 2, style: 2, custom_id: 'cancel_restore', label: 'Cancelar' },
                ],
            },
        ],
    });
    const filter = (i) => i.user.id === interaction.user.id;
    const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 60000 });
    if (!collector)
        return;
    collector.on('collect', async (i) => {
        if (i.customId === 'confirm_restore') {
            try {
                await configService.restoreDefaults(guild.id, interaction.user.id);
                await i.update({ content: '✅ Configurações restauradas ao padrão.', components: [] });
            }
            catch (err) {
                await i.update({ content: `❌ Erro: ${err.message}`, components: [] });
            }
            collector.stop();
        }
        else if (i.customId === 'cancel_restore') {
            await i.update({ content: '❌ Restauração cancelada.', components: [] });
            collector.stop();
        }
    });
};
exports.handler = handler;
exports.default = { data: exports.data, handler: exports.handler };
//# sourceMappingURL=configuracao_restaurar.js.map