import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, TextChannel } from 'discord.js';

export function ephemeralReply(interaction: any, content: string, options: any = {}) {
  return interaction.reply({
    content,
    ephemeral: true,
    ...options,
  });
}

export function errorReply(interaction: any, message: string) {
  return interaction.reply({
    content: `❌ ${message}`,
    ephemeral: true,
  });
}

export function successReply(interaction: any, message: string) {
  return interaction.reply({
    content: `✅ ${message}`,
    ephemeral: true,
  });
}

export function infoReply(interaction: any, message: string) {
  return interaction.reply({
    content: `ℹ️ ${message}`,
    ephemeral: true,
  });
}

export function warningReply(interaction: any, message: string) {
  return interaction.reply({
    content: `⚠️ ${message}`,
    ephemeral: true,
  });
}

export function buildConfirmRow(customId: string, label = 'Confirmar') {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(customId)
      .setLabel(label)
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId(`cancel_${customId}`)
      .setLabel('Cancelar')
      .setStyle(ButtonStyle.Secondary)
  );
}

export function buildSelectMenu(
  customId: string,
  options: { label: string; value: string; description?: string }[],
  placeholder = 'Selecione uma opção'
) {
  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(customId)
      .setPlaceholder(placeholder)
      .addOptions(options)
  );
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} dia(s)`;
  if (hours > 0) return `${hours} hora(s)`;
  if (minutes > 0) return `${minutes} minuto(s)`;
  return `${seconds % 60} segundo(s)`;
}

export function isTextChannel(channel: any): channel is TextChannel {
  return channel?.type === 0;
}

export function safeJsonParse(value: string, fallback: any = {}) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}
