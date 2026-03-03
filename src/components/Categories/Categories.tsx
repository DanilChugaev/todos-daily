import './categories.pcss';
import { Button } from '../Button/Button.tsx';

interface CategoriesProps {
  items: string[];
  onSelect: (item: string) => void;
}

export function Categories({ items, onSelect }: CategoriesProps) {
  return (
    <div className="categories">
      <Button onClick={() => onSelect('all')}>Все</Button>
      {items}
    </div>
  );
}