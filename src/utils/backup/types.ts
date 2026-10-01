import type { ICategory, ITask } from '../../types.ts';

export const BACKUP_FORMAT = 'todos-daily-backup';
export const BACKUP_VERSION = 1;

export interface BackupFile {
  format: typeof BACKUP_FORMAT;
  version: typeof BACKUP_VERSION;
  exportedAt: string;
  appVersion: string;
  data: {
    categories: ICategory[];
    tasks: ITask[];
  };
}

export type ImportMode = 'merge' | 'replace';

export interface BackupSummary {
  categories: number;
  tasks: number;
  subtasks: number;
}

export interface ImportResult extends BackupSummary {
  movedToNew: number;
}
