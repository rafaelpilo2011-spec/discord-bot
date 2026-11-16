"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.data = void 0;
const discord_js_1 = require("discord.js");
const responses_1 = require("../utils/responses");
const cooldown_1 = require("../utils/cooldown");
const guildConfig_service_1 = require("../services/guildConfig.service");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('configuracao_importar')
    .setDescription('Importa configurações de um arquivo JSON')
    .setDefaultMemberPermissions(['ManageGuild'])
    .addAttachmentOption((option) => option
    .setName('arquivo')
    .setDescription('Arquivo JSON com as configurações')
    .setRequired(true));
const handler = async (interaction, client, settings) => {
    const key = `configimport_${interaction.user.id}`;
    const cd = (0, cooldown_1.checkCooldown)(key, 3, 300000);
    if (!cd.allowed) {
        return (0, responses_1.warningReply)(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
    }
    const guild = interaction.guild;
    const configService = new guildConfig_service_1.GuildConfigService(client.prisma);
    const attachment = interaction.options.getAttachment('arquivo');
    if (!attachment)
        return (0, responses_1.errorReply)(interaction, 'Arquivo não encontrado.');
    if (attachment.size > 1024 * 1024)
        return (0, responses_1.errorReply)(interaction, 'Arquivo muito grande (máx 1MB).');
    if (!attachment.name.endsWith('.json'))
        return (0, responses_1.errorReply)(interaction, 'Envie um arquivo .json válido.');
    try {
        const response = await fetch(attachment.url);
        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        }
        catch {
            return (0, responses_1.errorReply)(interaction, 'JSON inválido.');
        }
        const preview = [];
        const allowed = [
            'language', 'timezone', 'logChannelId', 'modRoleId', 'adminRoleId', 'welcomeChannelId',
            'defaultRoleId', 'quarantineRoleId', 'ignoredChannelIds', 'ignoredRoleIds', 'raidMode',
            'raidEnabled', 'spamLimit', 'spamWindowSeconds', 'maxMentions', 'maxLinks',
            'maxNewAccounts', 'newAccountWindow', 'retentionDays', 'notifyDm', 'dmOnModeration',
        ];
        for (const key of allowed) {
            if (key in data)
                preview.push(`${key}: ${JSON.stringify(data[key])}`);
        }
        await interaction.reply({
            content: `Prévia das mudanças:\n${preview.slice(0, 10).join('\n')}${preview.length > 10 ? '\n...' : ''}`,
            ephemeral: true,
            components: [
                {
                    type: 1,
                    components: [
                        { type: 2, style: 3, custom_id: 'confirm_import', label: 'Confirmar importação' },
                        { type: 2, style: 2, custom_id: 'cancel_import', label: 'Cancelar' },
                    ],
                },
            ],
        });
        const filter = (i) => i.user.id === interaction.user.id;
        const collector = interaction.channel?.createMessageComponentCollector({ filter, time: 60000 });
        if (!collector)
            return;
        collector.on('collect', async (i) => {
            if (i.customId === 'confirm_import') {
                await configService.importConfig(guild.id, data, interaction.user.id);
                await i.update({ content: '✅ Configurações importadas com sucesso.', components: [] });
                collector.stop();
            }
            else if (i.customId === 'cancel_import') {
                await i.update({ content: '❌ Importação cancelada.', components: [] });
                collector.stop();
            }
        });
    }
    catch (err) {
        return (0, responses_1.errorReply)(interaction, `Erro ao importar: ${err.message}`);
    }
};
exports.handler = handler;
exports.default = { data: exports.data, handler: exports.handler };
//# sourceMappingURL=configuracao_importar.js.map