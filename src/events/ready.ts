import { Events } from 'discord.js';

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: any) {
    console.log(`[READY] Logado como ${client.user?.tag}`);
  },
};
