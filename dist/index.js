"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordBot = void 0;
const discord_js_1 = require("discord.js");
const rest_1 = require("@discordjs/rest");
const discord_js_2 = require("discord.js");
const db_1 = require("./utils/db");
const env_1 = require("./utils/env");
const antiRaid_service_1 = require("./services/antiRaid.service");
const raid_service_1 = require("./services/raid.service");
const case_service_1 = require("./services/case.service");
const moderation_service_1 = require("./services/moderation.service");
const path_1 = require("path");
class DiscordBot extends discord_js_1.Client {
    commands = new discord_js_1.Collection();
    antiRaid;
    raidService;
    caseService;
    modService;
    prisma = null;
    constructor() {
        super({
            intents: env_1.REQUIRED_INTENTS.map((i) => discord_js_1.GatewayIntentBits[i]),
            partials: [discord_js_1.Partials.Message, discord_js_1.Partials.Channel, discord_js_1.Partials.Reaction, discord_js_1.Partials.User, discord_js_1.Partials.GuildMember],
        });
    }
    async start() {
        await (0, db_1.connectDb)();
        // Prisma será injetado externamente ou via require
        try {
            const { prisma } = require('./utils/db');
            this.prisma = prisma;
        }
        catch {
            this.prisma = { $connect: async () => { }, $disconnect: async () => { } };
        }
        this.raidService = new raid_service_1.RaidService(this.prisma);
        this.caseService = new case_service_1.CaseService(this.prisma);
        this.modService = new moderation_service_1.ModerationService(this.caseService);
        this.antiRaid = new antiRaid_service_1.AntiRaidService(this.prisma, this.raidService);
        await this.registerCommands();
        await this.registerEvents();
        await this.login(env_1.DISCORD_TOKEN);
        console.log(`[BOT] ${this.user?.tag} online!`);
    }
    async registerCommands() {
        const commands = [];
        const commandsPath = (0, path_1.join)(__dirname, 'commands');
        const { readdirSync } = await Promise.resolve().then(() => __importStar(require('fs')));
        const files = readdirSync(commandsPath).filter((f) => f.endsWith('.ts'));
        for (const file of files) {
            const mod = await Promise.resolve(`${(0, path_1.join)(commandsPath, file)}`).then(s => __importStar(require(s)));
            const cmd = mod.default || mod;
            if (cmd.data) {
                this.commands.set(cmd.data.name, cmd);
                commands.push(cmd.data.toJSON ? cmd.data.toJSON() : cmd.data);
            }
        }
        const rest = new rest_1.REST({ version: '10' }).setToken(env_1.DISCORD_TOKEN);
        try {
            if (env_1.GUILD_ID) {
                await rest.put(discord_js_2.Routes.applicationGuildCommands(env_1.CLIENT_ID, env_1.GUILD_ID), { body: commands });
                console.log('[CMD] Comandos registrados no guild de testes.');
            }
            else {
                await rest.put(discord_js_2.Routes.applicationCommands(env_1.CLIENT_ID), { body: commands });
                console.log('[CMD] Comandos registrados globalmente.');
            }
        }
        catch (error) {
            console.error('[CMD] Erro ao registrar comandos:', error);
        }
    }
    async registerEvents() {
        const eventsPath = (0, path_1.join)(__dirname, 'events');
        const { readdirSync } = await Promise.resolve().then(() => __importStar(require('fs')));
        const files = readdirSync(eventsPath).filter((f) => f.endsWith('.ts'));
        for (const file of files) {
            const mod = await Promise.resolve(`${(0, path_1.join)(eventsPath, file)}`).then(s => __importStar(require(s)));
            const evt = mod.default || mod;
            if (evt.once) {
                this.once(evt.name, (...args) => evt.execute(...args, this));
            }
            else {
                this.on(evt.name, (...args) => evt.execute(...args, this));
            }
        }
        console.log('[EVT] Eventos registrados.');
    }
    async stop() {
        await this.destroy();
        await (0, db_1.disconnectDb)();
        console.log('[BOT] Encerrado.');
    }
}
exports.DiscordBot = DiscordBot;
//# sourceMappingURL=index.js.map