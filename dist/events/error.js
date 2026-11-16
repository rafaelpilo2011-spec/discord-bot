"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    name: discord_js_1.Events.Error,
    execute(error, client) {
        console.error('[ERR] Erro do cliente:', error);
    },
};
//# sourceMappingURL=error.js.map