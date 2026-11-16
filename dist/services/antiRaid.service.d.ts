export declare class AntiRaidService {
    private prisma;
    private raidService;
    private joinCache;
    private messageCache;
    constructor(prisma: any, raidService: any);
    recordJoin(guildId: string, userId: string): void;
    recordMessage(guildId: string, userId: string, content: string): void;
    analyze(guildId: string, settings: any): Promise<any>;
    recordRaidEvent(guildId: string, type: string, severity: string, score: number, action?: string): Promise<any>;
    applyProtectionAction(guild: any, action: string, settings: any): Promise<void>;
    simulate(guildId: string, type: string, count: number): Promise<{
        recorded: number;
        type: string;
    }>;
}
