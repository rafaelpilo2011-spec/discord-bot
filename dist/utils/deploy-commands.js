"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("@discordjs/rest");
const discord_js_1 = require("discord.js");
const env_1 = require("../utils/env");
async function main() {
    const commands = [];
    const rest = new rest_1.REST({ version: '10' }).setToken(env_1.DISCORD_TOKEN);
    try {
        if (env_1.GUILD_ID) {
            await rest.put(discord_js_1.Routes.applicationGuildCommands(env_1.CLIENT_ID, env_1.GUILD_ID), { body: commands });
            console.log('[DEPLOY] Comandos registrados no guild de testes.');
        }
        else {
            await rest.put(discord_js_1.Routes.applicationCommands(env_1.CLIENT_ID), { body: commands });
            console.log('[DEPLOY] Comandos registrados globalmente.');
        }
    }
    catch (error) {
        console.error('[DEPLOY] Erro:', error);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=deploy-commands.js.map