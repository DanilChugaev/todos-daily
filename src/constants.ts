import { type IPriority, PriorityEnum } from './types.ts';

export const ICON_SIZE = 24;
export const ANIMATION_MS = 300;

export const DEFAULT_CATEGORIES = [
  'Работа',
  'Дом',
  'Покупки',
  'Другое',
];

export const PRIORITIES_OPTIONS: IPriority[] = [
  { id: PriorityEnum.HIGH, name: 'Высокий приоритет' },
  { id: PriorityEnum.MEDIUM, name: 'Средний приоритет' },
  { id: PriorityEnum.LOW, name: 'Низкий приоритет' },
  { id: PriorityEnum.OTHER, name: 'Приоритет не определен' },
];

export const PRIORITY: Record<PriorityEnum, string> = {
  [PriorityEnum.HIGH]: 'Высокий',
  [PriorityEnum.MEDIUM]: 'Средний',
  [PriorityEnum.LOW]: 'Низкий',
  [PriorityEnum.OTHER]: 'Приоритет не определен',
};

export const PRIORITIES_COLOR_MAP: Record<PriorityEnum, string> = {
  [PriorityEnum.HIGH]: '#B95757',
  [PriorityEnum.MEDIUM]: '#D49B54',
  [PriorityEnum.LOW]: '#7A9BBD',
  [PriorityEnum.OTHER]: '#999999',
};

