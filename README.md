# TODOS daily

To-do list for daily use

[USE HERE](https://danilchugaev.github.io/todos-daily/)

## Features

- **Task Management**: Full CRUD functionality for tasks (create, read, update, delete).
- **Task Prioritization**: Set priority levels (High, Medium, Low, Other) to focus on what's important.
- **Custom Categories**: Organize tasks into categories with the ability to manage and edit them.
- **Checklists/Subtasks**: Break down large tasks into smaller, manageable subtasks.
- **Due Dates**: Set deadlines for tasks to keep track of your schedule (coming soon).
- **Local Persistence**: Data is stored locally in the browser using IndexedDB (Dexie), so your tasks are safe even after a page refresh.
- **Theming**: Built-in support for Light and Dark modes for comfortable use at any time of day.
- **PWA Ready**: Installed as a progressive web app for a native-like experience.

## Run Locally

Clone the project

```bash
  git clone git@github.com:DanilChugaev/todos-daily.git
```

Go to the project directory

```bash
  cd todos-daily
```

Install dependencies

```bash
  yarn install
```

Start the development server

```bash
  yarn dev
```

Open http://localhost:5173/todos-daily/ in your browser (note: the /todos-daily/ base path is for GitHub Pages; adjust if needed locally)

## Lint project

To lint code in project

```bash
 yarn lint:fix
```

## Build For Production

To generate production build

```bash
 yarn build
```

Preview build

```bash
 yarn preview
```

## Deployment

This project is deployed to GitHub Pages using GitHub Actions. See `.github/workflows/deploy.yml` for the workflow configuration

## Technologies Used

- React: A JavaScript library for building user interfaces
- TypeScript: For type-safe JavaScript
- Vite: Fast build tool and dev server
- Dexie.js: Wrapper for IndexedDB for efficient local data storage
- PostCSS: For advanced styling and theme management
- ESLint: For code linting and formatting

## Contributing

Contributions are welcome! Fork the repository, create a branch, and submit a pull request

- Fork the project
- Create your feature branch (git checkout -b feature/AmazingFeature)
- Commit your changes (git commit -m 'Add some AmazingFeature')
- Push to the branch (git push origin feature/AmazingFeature)
- Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/DanilChugaev/todos-daily/blob/master/LICENSE) file for details
