"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPanel = registerPanel;
exports.getPanel = getPanel;
exports.confirmPanel = confirmPanel;
exports.isPanelOwner = isPanelOwner;
exports.isPanelExpired = isPanelExpired;
exports.removePanel = removePanel;
const discord_js_1 = require("discord.js");
const panels = new discord_js_1.Collection();
function registerPanel(panelId, ownerId, ttlMs) {
    panels.set(panelId, {
        ownerId,
        expiresAt: Date.now() + ttlMs,
        confirmed: false,
    });
}
function getPanel(panelId) {
    return panels.get(panelId);
}
function confirmPanel(panelId) {
    const panel = panels.get(panelId);
    if (!panel || panel.confirmed)
        return false;
    panel.confirmed = true;
    return true;
}
function isPanelOwner(panelId, userId) {
    const panel = panels.get(panelId);
    return !!panel && panel.ownerId === userId;
}
function isPanelExpired(panelId) {
    const panel = panels.get(panelId);
    if (!panel)
        return true;
    return Date.now() > panel.expiresAt;
}
function removePanel(panelId) {
    panels.delete(panelId);
}
//# sourceMappingURL=panels.js.map