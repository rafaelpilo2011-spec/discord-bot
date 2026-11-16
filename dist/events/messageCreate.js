"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot)
            return;
        if (!message.guild || !message.channel.isTextBased())
            return;
        const antiRaid = client.antiRaid;
        if (!antiRaid)
            return;
        antiRaid.recordMessage(message.guild.id, message.author.id, message.content);
        const settings = await client.prisma.guildConfig.findUnique({ where: { guildId: message.guild.id } });
        if (!settings?.raidEnabled)
            return;
        const mentionCount = message.mentions.users.size + message.mentions.roles.size;
        if (mentionCount > settings.maxMentions) {
            try {
                await message.delete();
                await message.channel.send(`⚠️ ${message.author}, sua mensagem foi removida por excesso de menções.`, { replyTo: message.id });
            }
            catch { }
        }
        const linkCount = (message.content.match(/https?:\/\//g) || []).length;
        if (linkCount > settings.maxLinks) {
            try {
                await message.delete();
                await message.channel.send(`⚠️ ${message.author}, sua mensagem foi removida por excesso de links.`, { replyTo: message.id });
            }
            catch { }
        }
    },
};
//# sourceMappingURL=messageCreate.js.map