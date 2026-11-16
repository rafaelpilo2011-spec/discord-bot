import { Collection } from 'discord.js';

const panels = new Collection<string, { ownerId: string; expiresAt: number; confirmed: boolean }>();

export function registerPanel(
  panelId: string,
  ownerId: string,
  ttlMs: number
) {
  panels.set(panelId, {
    ownerId,
    expiresAt: Date.now() + ttlMs,
    confirmed: false,
  });
}

export function getPanel(panelId: string) {
  return panels.get(panelId);
}

export function confirmPanel(panelId: string) {
  const panel = panels.get(panelId);
  if (!panel || panel.confirmed) return false;
  panel.confirmed = true;
  return true;
}

export function isPanelOwner(panelId: string, userId: string): boolean {
  const panel = panels.get(panelId);
  return !!panel && panel.ownerId === userId;
}

export function isPanelExpired(panelId: string): boolean {
  const panel = panels.get(panelId);
  if (!panel) return true;
  return Date.now() > panel.expiresAt;
}

export function removePanel(panelId: string) {
  panels.delete(panelId);
}
