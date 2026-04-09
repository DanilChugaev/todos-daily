import './categories.pcss';
import { Button } from '../Button/Button.tsx';
import type { ICategory } from '../../utils/db/db.ts';
import { useState } from 'react';

interface CategoriesProps {
  items: ICategory[];
  onSelect: (item: number) => void;
}

export function Categories({ items, onSelect }: CategoriesProps) {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  // todo: выбранную категорию сохранять в localStorage
  // todo: добавить иконки для категорий
  function getClassName(id: number) {
    return `categories__button ${selectedCategory === id ? 'categories__button--active' : ''}`;
  }

  function handleSelect(id: number) {
    setSelectedCategory(id);
    onSelect(id);
  }

  return (
    <div className="categories">
      <Button
        className={getClassName(0)}
        onClick={() => handleSelect(0)}
      >
        Все
      </Button>

      {items.map(category => {
        return (
          <Button
            className={getClassName(category.id)}
            onClick={() => handleSelect(category.id)}
          >
            {category.name}
          </Button>
        );
      })}
    </div>
  );
}