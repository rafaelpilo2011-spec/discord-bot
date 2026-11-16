import { Client, Collection } from 'discord.js';
import { AntiRaidService } from './services/antiRaid.service';
import { RaidService } from './services/raid.service';
import { CaseService } from './services/case.service';
import { ModerationService } from './services/moderation.service';
export declare class DiscordBot extends Client {
    commands: Collection<string, any>;
    antiRaid?: AntiRaidService;
    raidService?: RaidService;
    caseService?: CaseService;
    modService?: ModerationService;
    prisma: any;
    constructor();
    start(): Promise<void>;
    registerCommands(): Promise<void>;
    registerEvents(): Promise<void>;
    stop(): Promise<void>;
}
