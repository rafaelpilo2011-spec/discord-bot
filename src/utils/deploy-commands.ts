import { DiscordBot } from '../index';
const bot = new DiscordBot();
bot.registerCommands().catch(() => {
  console.error('[DEPLOY] Falha ao registrar comandos.');
  process.exitCode = 1;
}).finally(() => bot.destroy());
