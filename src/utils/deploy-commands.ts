import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import { CLIENT_ID, GUILD_ID, DISCORD_TOKEN } from '../utils/env';

async function main() {
  const commands: any[] = [];
  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN!);

  try {
    if (GUILD_ID) {
      await rest.put(Routes.applicationGuildCommands(CLIENT_ID as string, GUILD_ID as string), { body: commands });
      console.log('[DEPLOY] Comandos registrados no guild de testes.');
    } else {
      await rest.put(Routes.applicationCommands(CLIENT_ID as string), { body: commands });
      console.log('[DEPLOY] Comandos registrados globalmente.');
    }
  } catch (error) {
    console.error('[DEPLOY] Erro:', error);
    process.exit(1);
  }
}

main();
