import './app-loader.pcss';

export function AppLoader() {
  return (
    <section className="app-loader" role="status" aria-live="polite" aria-label="Загружаем задачи">
      <svg className="app-loader__icon" viewBox="0 0 120 120" fill="none" aria-hidden="true">
        <path
          className="app-loader__outline"
          pathLength="1"
          d="M77 31H45c-10 0-17 8-17 18v27c0 10 7 17 17 17h25c10 0 17-7 17-17v-8"
        />
        <path
          className="app-loader__check"
          pathLength="1"
          d="m45 58 15 15 40-45"
        />
      </svg>
      <div>
        <strong>TODOS daily</strong>
        <span>Загружаем ваши задачи…</span>
      </div>
    </section>
  );
}
