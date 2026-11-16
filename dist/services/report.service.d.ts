export declare class ReportService {
    private prisma;
    constructor(prisma: any);
    create(data: {
        guildId: string;
        reporterId: string;
        targetId: string;
        reason: string;
        channelId?: string;
        messageId?: string;
    }): Promise<any>;
    listOpen(guildId: string): Promise<any>;
    close(id: string): Promise<any>;
}
