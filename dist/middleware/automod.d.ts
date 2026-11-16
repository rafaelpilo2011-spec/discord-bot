import { Message } from 'discord.js';
export interface AutomodConfig {
    maxMentions: number;
    maxLinks: number;
    blockedDomains: string[];
    blockedExtensions: string[];
    maxCaps: number;
    maxEmojis: number;
    ignoredChannelIds: string[];
    ignoredRoleIds: string[];
}
export declare class AutomoderationMiddleware {
    private config;
    constructor(config?: Partial<AutomodConfig>);
    analyze(message: Message): Promise<{
        allowed: boolean;
        reason?: string;
    }>;
}
