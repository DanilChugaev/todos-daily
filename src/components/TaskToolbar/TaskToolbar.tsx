import './task-toolbar.pcss';
import type { SortOption } from '../../utils/tasks.ts';
import { SORT_OPTIONS } from '../../utils/tasks.ts';
import { Input } from '../Form/Input/Input.tsx';
import { Select } from '../Form/Select/Select.tsx';

interface TaskToolbarProps {
  query: string;
  sortBy: SortOption;
  onQueryChange: (query: string) => void;
  onSortChange: (sortBy: SortOption) => void;
}

export function TaskToolbar({ query, sortBy, onQueryChange, onSortChange }: TaskToolbarProps) {
  return (
    <section className="task-toolbar" aria-label="Поиск и сортировка задач">
      <Input
        id="tasks-search"
        type="search"
        value={query}
        placeholder="Поиск задач"
        ariaLabel="Поиск задач"
        size="small"
        onChange={(event) => onQueryChange(event.target.value)}
      />

      <Select
        id="tasks-sort"
        placeholder="Сортировка"
        value={sortBy}
        options={SORT_OPTIONS.map(({ value, label }) => ({ id: value, name: label }))}
        ariaLabel="Сортировка задач"
        size="small"
        onChange={onSortChange}
      />
    </section>
  );
}
