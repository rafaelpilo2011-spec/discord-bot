import { expand } from 'dotenv-expand';
import { config } from 'dotenv';

expand(config());

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
export const CLIENT_ID = process.env.CLIENT_ID;
export const GUILD_ID = process.env.GUILD_ID;
export const DATABASE_URL = process.env.DATABASE_URL;
export const PREFIX = process.env.PREFIX || '!';
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

if (!DISCORD_TOKEN) {
  throw new Error('DISCORD_TOKEN não definido no .env');
}
if (!CLIENT_ID) {
  throw new Error('CLIENT_ID não definido no .env');
}
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL não definido no .env');
}

export const REQUIRED_INTENTS = [
  'Guilds',
  'GuildMembers',
  'GuildMessages',
  'MessageContent',
  'GuildModeration',
  'GuildEmojisAndStickers',
  'GuildVoiceStates',
  'DirectMessages',
  'GuildScheduledEvents',
];

export const BOT_DESCRIPTION =
  'Bot completo de administração, moderação e proteção contra raids para servidores Discord.';
