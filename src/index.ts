import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';
import { connectDb, disconnectDb } from './utils/db';
import { DISCORD_TOKEN, CLIENT_ID, GUILD_ID, REQUIRED_INTENTS } from './utils/env';
import { AntiRaidService } from './services/antiRaid.service';
import { RaidService } from './services/raid.service';
import { CaseService } from './services/case.service';
import { ModerationService } from './services/moderation.service';
import { join as pathJoin } from 'path';

export class DiscordBot extends Client {
  public commands: Collection<string, any> = new Collection();
  public antiRaid?: AntiRaidService;
  public raidService?: RaidService;
  public caseService?: CaseService;
  public modService?: ModerationService;
  public prisma: any = null;

  constructor() {
    super({
      intents: REQUIRED_INTENTS.map((i) => GatewayIntentBits[i as keyof typeof GatewayIntentBits]),
      partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User, Partials.GuildMember],
    });
  }

  async start() {
    await connectDb();

    // Prisma será injetado externamente ou via require
    try {
      const { prisma } = require('./utils/db');
      this.prisma = prisma;
    } catch {
      this.prisma = { $connect: async () => {}, $disconnect: async () => {} };
    }

    this.raidService = new RaidService(this.prisma);
    this.caseService = new CaseService(this.prisma);
    this.modService = new ModerationService(this.caseService);
    this.antiRaid = new AntiRaidService(this.prisma, this.raidService);

    await this.registerCommands();
    await this.registerEvents();

    await this.login(DISCORD_TOKEN!);
    console.log(`[BOT] ${this.user?.tag} online!`);
  }

  async registerCommands() {
    const commands: any[] = [];
    const commandsPath = pathJoin(__dirname, 'commands');
    const { readdirSync } = await import('fs');
    const files = readdirSync(commandsPath).filter((f: string) => f.endsWith('.ts'));

    for (const file of files) {
      const mod = await import(pathJoin(commandsPath, file));
      const cmd = mod.default || mod;
      if (cmd.data) {
        this.commands.set(cmd.data.name, cmd);
        commands.push(cmd.data.toJSON ? cmd.data.toJSON() : cmd.data);
      }
    }

    const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN!);

    try {
      if (GUILD_ID) {
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID!, GUILD_ID), { body: commands });
        console.log('[CMD] Comandos registrados no guild de testes.');
      } else {
        await rest.put(Routes.applicationCommands(CLIENT_ID!), { body: commands });
        console.log('[CMD] Comandos registrados globalmente.');
      }
    } catch (error) {
      console.error('[CMD] Erro ao registrar comandos:', error);
    }
  }

  async registerEvents() {
    const eventsPath = pathJoin(__dirname, 'events');
    const { readdirSync } = await import('fs');
    const files = readdirSync(eventsPath).filter((f: string) => f.endsWith('.ts'));

    for (const file of files) {
      const mod = await import(pathJoin(eventsPath, file));
      const evt = mod.default || mod;
      if (evt.once) {
        this.once(evt.name, (...args: any[]) => evt.execute(...args, this));
      } else {
        this.on(evt.name, (...args: any[]) => evt.execute(...args, this));
      }
    }
    console.log('[EVT] Eventos registrados.');
  }

  async stop() {
    await this.destroy();
    await disconnectDb();
    console.log('[BOT] Encerrado.');
  }
}
