"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ephemeralReply = ephemeralReply;
exports.errorReply = errorReply;
exports.successReply = successReply;
exports.infoReply = infoReply;
exports.warningReply = warningReply;
exports.buildConfirmRow = buildConfirmRow;
exports.buildSelectMenu = buildSelectMenu;
exports.formatDuration = formatDuration;
exports.isTextChannel = isTextChannel;
exports.safeJsonParse = safeJsonParse;
const discord_js_1 = require("discord.js");
function ephemeralReply(interaction, content, options = {}) {
    return interaction.reply({
        content,
        ephemeral: true,
        ...options,
    });
}
function errorReply(interaction, message) {
    return interaction.reply({
        content: `❌ ${message}`,
        ephemeral: true,
    });
}
function successReply(interaction, message) {
    return interaction.reply({
        content: `✅ ${message}`,
        ephemeral: true,
    });
}
function infoReply(interaction, message) {
    return interaction.reply({
        content: `ℹ️ ${message}`,
        ephemeral: true,
    });
}
function warningReply(interaction, message) {
    return interaction.reply({
        content: `⚠️ ${message}`,
        ephemeral: true,
    });
}
function buildConfirmRow(customId, label = 'Confirmar') {
    return new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
        .setCustomId(customId)
        .setLabel(label)
        .setStyle(discord_js_1.ButtonStyle.Danger), new discord_js_1.ButtonBuilder()
        .setCustomId(`cancel_${customId}`)
        .setLabel('Cancelar')
        .setStyle(discord_js_1.ButtonStyle.Secondary));
}
function buildSelectMenu(customId, options, placeholder = 'Selecione uma opção') {
    return new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.StringSelectMenuBuilder()
        .setCustomId(customId)
        .setPlaceholder(placeholder)
        .addOptions(options));
}
function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0)
        return `${days} dia(s)`;
    if (hours > 0)
        return `${hours} hora(s)`;
    if (minutes > 0)
        return `${minutes} minuto(s)`;
    return `${seconds % 60} segundo(s)`;
}
function isTextChannel(channel) {
    return channel?.type === 0;
}
function safeJsonParse(value, fallback = {}) {
    try {
        return JSON.parse(value);
    }
    catch {
        return fallback;
    }
}
//# sourceMappingURL=responses.js.map