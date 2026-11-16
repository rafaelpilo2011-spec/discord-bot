import { GuildSettings } from '../types';
export declare const DEFAULT_SETTINGS: Partial<GuildSettings>;
export declare function mergeSettings(db: any, overrides?: Partial<GuildSettings>): GuildSettings;
