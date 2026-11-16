export declare class CaseService {
    private prisma;
    constructor(prisma: any);
    create(data: {
        guildId: string;
        type: string;
        moderatorId: string;
        targetId: string;
        reason: string;
        duration?: number;
        result: 'success' | 'failed' | 'partial';
        details?: string;
    }): Promise<any>;
    getById(guildId: string, caseId: string): Promise<any>;
    listByTarget(guildId: string, targetId: string): Promise<any>;
    listByGuild(guildId: string, limit?: number): Promise<any>;
}
export declare class WarningService {
    private prisma;
    constructor(prisma: any);
    create(data: {
        guildId: string;
        caseId: string;
        userId: string;
        moderatorId: string;
        reason: string;
    }): Promise<any>;
    listByUser(guildId: string, userId: string): Promise<any>;
    remove(id: string): Promise<any>;
}
