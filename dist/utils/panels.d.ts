export declare function registerPanel(panelId: string, ownerId: string, ttlMs: number): void;
export declare function getPanel(panelId: string): {
    ownerId: string;
    expiresAt: number;
    confirmed: boolean;
} | undefined;
export declare function confirmPanel(panelId: string): boolean;
export declare function isPanelOwner(panelId: string, userId: string): boolean;
export declare function isPanelExpired(panelId: string): boolean;
export declare function removePanel(panelId: string): void;
