# TODOS daily

[Русская версия](README.md)

> A private offline-first task list for everyday use.

[![Open the app](https://img.shields.io/badge/Open_the_app-111827?style=for-the-badge)](https://danilchugaev.github.io/todos-daily/)

![TODOS daily interface](public/todos-daily.webp)

## About

TODOS daily is a Progressive Web App for managing personal tasks. It has no backend: task data is stored in the browser using IndexedDB and is never sent to third parties. Install it as a PWA and keep using it offline after the first load.

## Features

- create, edit, complete, and delete tasks;
- manage categories and their order;
- set high, medium, low, or no priority;
- split work into subtasks;
- filter tasks by category;
- choose light, dark, or system theme;
- get warnings before discarding unsaved changes;
- persist data locally with IndexedDB and request persistent storage;
- install as a Progressive Web App.

## Tech stack

- **React 19** and **TypeScript**;
- **Vite**;
- **Dexie** and **IndexedDB**;
- **PostCSS**;
- **vite-plugin-pwa**;
- **ESLint** and strict TypeScript checking.

## Project structure

- `src/components` — UI components and dialogs;
- `src/hooks` — reactive task and category data access;
- `src/utils/db` — Dexie schema and IndexedDB migrations;
- `src/styles` — global styles, design tokens, and themes;
- `public` — PWA icons and project imagery.

All task data stays on the user's device. Clearing browser or site data removes locally stored tasks.

## Run locally

```bash
git clone git@github.com:DanilChugaev/todos-daily.git
cd todos-daily
yarn install
yarn dev
```

For local development, open `http://localhost:5173/todos-daily/`.

## Quality checks and production build

```bash
yarn lint
yarn ts:check
yarn build
yarn preview
```

## Deployment

The project deploys automatically to GitHub Pages on pushes to `master`. See [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

## License

This project is available under the [MIT License](LICENSE).
