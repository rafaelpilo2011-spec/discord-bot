"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.data = void 0;
const discord_js_1 = require("discord.js");
const responses_1 = require("../utils/responses");
const cooldown_1 = require("../utils/cooldown");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName('denunciar')
    .setDescription('Denuncia um membro para a equipe de moderação')
    .addUserOption((option) => option.setName('membro').setDescription('Membro denunciado').setRequired(true))
    .addStringOption((option) => option.setName('motivo').setDescription('Motivo da denúncia').setRequired(true));
const handler = async (interaction, client, settings) => {
    const key = `denunciar_${interaction.user.id}`;
    const cd = (0, cooldown_1.checkCooldown)(key, 5, 300000);
    if (!cd.allowed) {
        return (0, responses_1.warningReply)(interaction, `Aguarde ${Math.ceil(cd.remainingMs / 1000)}s antes de usar novamente.`);
    }
    const guild = interaction.guild;
    const member = interaction.options.getMember('membro');
    const reason = interaction.options.getString('motivo');
    if (!member)
        return (0, responses_1.errorReply)(interaction, 'Membro não encontrado.');
    try {
        await client.prisma.report.create({
            data: {
                guildId: guild.id,
                reporterId: interaction.user.id,
                targetId: member.id,
                reason,
                channelId: interaction.channelId,
                messageId: interaction.message?.id,
            },
        });
        await (0, responses_1.successReply)(interaction, 'Denúncia enviada para a equipe de moderação.');
        if (settings.logChannelId) {
            const logChannel = guild.channels.cache.get(settings.logChannelId);
            if (logChannel && logChannel.isTextBased()) {
                await logChannel.send({
                    embeds: [
                        {
                            title: '🚨 Nova denúncia',
                            fields: [
                                { name: 'Denunciante', value: interaction.user.tag },
                                { name: 'Denunciado', value: member.user.tag },
                                { name: 'Motivo', value: reason },
                            ],
                            color: 0xff0000,
                        },
                    ],
                });
            }
        }
    }
    catch (err) {
        return (0, responses_1.errorReply)(interaction, `Erro ao denunciar: ${err.message}`);
    }
};
exports.handler = handler;
exports.default = { data: exports.data, handler: exports.handler };
//# sourceMappingURL=denunciar.js.map