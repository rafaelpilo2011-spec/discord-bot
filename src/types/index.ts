export type Language = 'pt-BR';
export type Timezone = string;

export interface GuildSettings {
  id: string;
  guildId: string;
  language: Language;
  timezone: Timezone;
  logChannelId?: string | null;
  modRoleId?: string | null;
  adminRoleId?: string | null;
  welcomeChannelId?: string | null;
  defaultRoleId?: string | null;
  quarantineRoleId?: string | null;
  ignoredChannelIds: string[];
  ignoredRoleIds: string[];
  raidMode: 'monitor' | 'protect' | 'emergency';
  raidEnabled: boolean;
  spamLimit: number;
  spamWindowSeconds: number;
  maxMentions: number;
  maxLinks: number;
  maxNewAccounts: number;
  newAccountWindow: number;
  emergencyActive: boolean;
  emergencyEndsAt?: Date | null;
  retentionDays: number;
  notifyDm: boolean;
  dmOnModeration: boolean;
}

export interface ModActionResult {
  success: boolean;
  caseId?: string;
  targetId: string;
  moderatorId: string;
  reason: string;
  type: string;
  duration?: number;
  result: 'success' | 'failed' | 'partial';
  details?: string;
  error?: string;
}

export interface RaidSignal {
  type: string;
  score: number;
  threshold: number;
  triggered: boolean;
  details: Record<string, unknown>;
}

export interface ProtectionAction {
  type: 'alert' | 'slowmode' | 'restrict_channel' | 'timeout' | 'quarantine' | 'suspend_auto_roles';
  target?: string;
  duration?: number;
  reason: string;
}

export type CommandHandler = (interaction: any, client: any, settings: GuildSettings) => Promise<void>;

export interface RegisteredCommand {
  data: any;
  handler: CommandHandler;
  defaultMemberPermissions?: string[];
  dmPermission?: boolean;
  cooldownSeconds?: number;
}
