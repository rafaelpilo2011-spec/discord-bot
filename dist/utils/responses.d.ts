import { ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, TextChannel } from 'discord.js';
export declare function ephemeralReply(interaction: any, content: string, options?: any): any;
export declare function errorReply(interaction: any, message: string): any;
export declare function successReply(interaction: any, message: string): any;
export declare function infoReply(interaction: any, message: string): any;
export declare function warningReply(interaction: any, message: string): any;
export declare function buildConfirmRow(customId: string, label?: string): ActionRowBuilder<ButtonBuilder>;
export declare function buildSelectMenu(customId: string, options: {
    label: string;
    value: string;
    description?: string;
}[], placeholder?: string): ActionRowBuilder<StringSelectMenuBuilder>;
export declare function formatDuration(ms: number): string;
export declare function isTextChannel(channel: any): channel is TextChannel;
export declare function safeJsonParse(value: string, fallback?: any): any;
