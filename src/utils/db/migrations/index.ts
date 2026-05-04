import type { MigrationConfig } from './types';
import { v1Migration } from './v1';
import { v2Migration } from './v2';
import { v3Migration } from './v3';
import { v4Migration } from './v4';
import { v5Migration } from './v5';
import { v6Migration } from './v6';
import { v7Migration } from './v7';

export const MIGRATIONS: MigrationConfig[] = [
  v1Migration,
  v2Migration,
  v3Migration,
  v4Migration,
  v5Migration,
  v6Migration,
  v7Migration,
];