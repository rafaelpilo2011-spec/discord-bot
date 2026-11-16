export declare class ModerationService {
    private caseService;
    constructor(caseService: any);
    notifyTargetDM(guildId: string, userId: string, content: string, settings: any): Promise<void>;
    createCase(data: {
        guildId: string;
        type: string;
        moderatorId: string;
        targetId: string;
        reason: string;
        duration?: number;
        result: 'success' | 'failed' | 'partial';
        details?: string;
    }): Promise<any>;
}
