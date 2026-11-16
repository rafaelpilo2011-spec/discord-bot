import { Events } from 'discord.js';

export default {
  name: Events.Error,
  execute(error: Error, client: any) {
    console.error('[ERR] Erro do cliente:', error);
  },
};
