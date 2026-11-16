export declare class RaidService {
    private prisma;
    constructor(prisma: any);
    create(data: {
        guildId: string;
        type: string;
        severity: string;
        signalScore: number;
        actionTaken?: string;
    }): Promise<any>;
    resolve(raidId: string): Promise<any>;
    listActive(guildId: string): Promise<any>;
}
