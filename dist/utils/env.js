"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOT_DESCRIPTION = exports.REQUIRED_INTENTS = exports.LOG_LEVEL = exports.PREFIX = exports.DATABASE_URL = exports.GUILD_ID = exports.CLIENT_ID = exports.DISCORD_TOKEN = void 0;
const dotenv_expand_1 = require("dotenv-expand");
const dotenv_1 = require("dotenv");
(0, dotenv_expand_1.expand)((0, dotenv_1.config)());
exports.DISCORD_TOKEN = process.env.DISCORD_TOKEN;
exports.CLIENT_ID = process.env.CLIENT_ID;
exports.GUILD_ID = process.env.GUILD_ID;
exports.DATABASE_URL = process.env.DATABASE_URL;
exports.PREFIX = process.env.PREFIX || '!';
exports.LOG_LEVEL = process.env.LOG_LEVEL || 'info';
if (!exports.DISCORD_TOKEN) {
    throw new Error('DISCORD_TOKEN não definido no .env');
}
if (!exports.CLIENT_ID) {
    throw new Error('CLIENT_ID não definido no .env');
}
if (!exports.DATABASE_URL) {
    throw new Error('DATABASE_URL não definido no .env');
}
exports.REQUIRED_INTENTS = [
    'Guilds',
    'GuildMembers',
    'GuildMessages',
    'MessageContent',
    'GuildModeration',
    'GuildBans',
    'GuildEmojisAndStickers',
    'GuildVoiceStates',
    'DirectMessages',
    'GuildScheduledEvents',
];
exports.BOT_DESCRIPTION = 'Bot completo de administração, moderação e proteção contra raids para servidores Discord.';
//# sourceMappingURL=env.js.map