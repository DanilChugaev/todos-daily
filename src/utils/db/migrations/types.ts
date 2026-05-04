import type { Transaction } from 'dexie';

export interface MigrationConfig {
  version: number;
  stores: Record<string, string>;
  upgrade?: (tx: Transaction) => Promise<void>;
}