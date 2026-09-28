import './category-progress.pcss';

interface CategoryProgressProps {
  completedCount: number;
  totalCount: number;
}

export function CategoryProgress({ completedCount, totalCount }: CategoryProgressProps) {
  const progress = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <section className="category-progress" aria-label={`Выполнено ${completedCount} из ${totalCount} задач`}>
      <div className="category-progress__label">Выполнено {completedCount} из {totalCount}</div>
      <strong>{progress}%</strong>
      <div className="category-progress__bar"><i style={{ width: `${progress}%` }} /></div>
    </section>
  );
}
