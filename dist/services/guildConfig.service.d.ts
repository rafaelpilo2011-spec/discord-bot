export declare class GuildConfigService {
    private prisma;
    constructor(prisma: any);
    getOrCreate(guildId: string): Promise<any>;
    update(guildId: string, data: any): Promise<any>;
    exportConfig(guildId: string): Promise<Record<string, unknown>>;
    importConfig(guildId: string, data: Record<string, unknown>, actorId: string): Promise<any>;
    restoreDefaults(guildId: string, actorId: string): Promise<any>;
}
