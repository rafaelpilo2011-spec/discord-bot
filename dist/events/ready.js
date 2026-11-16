"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: discord_js_1.Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`[READY] Logado como ${client.user?.tag}`);
    },
};
//# sourceMappingURL=ready.js.map