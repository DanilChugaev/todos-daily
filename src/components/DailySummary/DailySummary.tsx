import './daily-summary.pcss';

interface DailySummaryProps {
  activeCount: number;
  completedCount: number;
}

export function DailySummary({ activeCount, completedCount }: DailySummaryProps) {
  const totalCount = activeCount + completedCount;
  const progress = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <section className="daily-summary" aria-labelledby="daily-summary-title">
      <div>
        <p className="daily-summary__eyebrow">Сегодня</p>
        <h1 id="daily-summary-title">Ваш фокус на день</h1>
        <p className="daily-summary__description">
          {totalCount ? `Выполнено ${completedCount} из ${totalCount} задач.` : 'Добавьте первую задачу и начните свой день спокойно.'}
        </p>
      </div>
      <div className="daily-summary__progress" aria-label={`Выполнено ${progress}% задач`}>
        <strong>{progress}%</strong>
        <span><i style={{ width: `${progress}%` }} /></span>
      </div>
    </section>
  );
}
