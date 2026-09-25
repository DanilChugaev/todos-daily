import { type ChangeEvent } from 'react';
import './task-toolbar.pcss';
import type { SortOption } from '../../utils/tasks.ts';
import { SORT_OPTIONS } from '../../utils/tasks.ts';

interface TaskToolbarProps {
  query: string;
  sortBy: SortOption;
  onQueryChange: (query: string) => void;
  onSortChange: (sortBy: SortOption) => void;
}

export function TaskToolbar({ query, sortBy, onQueryChange, onSortChange }: TaskToolbarProps) {
  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    onQueryChange(event.target.value);
  }

  function handleSortChange(event: ChangeEvent<HTMLSelectElement>) {
    onSortChange(event.target.value as SortOption);
  }

  return (
    <section className="task-toolbar" aria-label="Поиск и сортировка задач">
      <label className="task-toolbar__search">
        <span className="visually-hidden">Поиск задач</span>
        <input
          type="search"
          value={query}
          onChange={handleQueryChange}
          placeholder="Поиск задач"
        />
      </label>

      <label className="task-toolbar__sort">
        <span className="visually-hidden">Сортировка задач</span>
        <select value={sortBy} onChange={handleSortChange}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </label>
    </section>
  );
}
