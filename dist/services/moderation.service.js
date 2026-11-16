"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModerationService = void 0;
class ModerationService {
    caseService;
    constructor(caseService) {
        this.caseService = caseService;
    }
    async notifyTargetDM(guildId, userId, content, settings) {
        if (!settings.dmOnModeration)
            return;
        try {
            const client = globalThis.client;
            if (client) {
                const user = await client.users.fetch(userId);
                if (user)
                    await user.send(content);
            }
        }
        catch {
            // DM bloqueada, não impede a moderação
        }
    }
    async createCase(data) {
        return this.caseService.create(data);
    }
}
exports.ModerationService = ModerationService;
//# sourceMappingURL=moderation.service.js.map