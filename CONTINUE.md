# CONTINUE.md - TODOS Daily Application

## Project Overview

The TODOS Daily application is a modern, production-ready to-do list application built with React 19, TypeScript, and Vite. It features a clean, responsive design with Progressive Web App (PWA) capabilities, allowing users to manage their daily tasks efficiently across devices.

### Key Features

- **Type-Safe Development**: Built with TypeScript 5.9.3 in strict mode
- **Offline-First**: PWA support with service worker caching
- **Persistent Storage**: LocalStorage-based persistence with timestamp-based IDs
- **Responsive Design**: Mobile-first approach with CSS-in-JS using .pcss files
- **Component Architecture**: Reusable, modular components with clear separation of concerns
- **GitHub Pages Deployment**: Optimized for GitHub Pages with proper base path configuration

### Technical Architecture

The application follows a modern React architecture with:

1. **State Management**: React hooks (useState, useEffect, useCallback) for local state
2. **Data Persistence**: Custom storage utilities in `src/utils/storage.ts`
3. **Component Hierarchy**:
    - `App.tsx` - Main application component
    - `TaskList.tsx` - Task list management
    - `TaskItem.tsx` - Individual task display and interactions
    - `AddTaskForm.tsx` - Task creation interface
    - `TaskFilter.tsx` - Filtering and sorting functionality
4. **Type Safety**: Interfaces for task data structures (`ITask`)
5. **Styling**: CSS-in-JS with PostCSS (.pcss files) for consistent styling

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- Yarn 1.22.0 or higher
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/todos-daily.git
cd todos-daily

# Install dependencies
yarn install

# Set up environment variables
cp .env.example .env
```

### Development Setup

```bash
# Start development server
yarn dev

# Run tests
yarn test

# Build for production
yarn build
```

### Environment Variables

The application uses the following environment variables:

- `VITE_APP_TITLE` - Application title (default: "TODOS Daily")
- `VITE_GITHUB_REPO` - GitHub repository name for deployment (default: "todos-daily")
- `VITE_BASE_PATH` - Base path for GitHub Pages (default: "/todos-daily/")

## Project Structure

```
todos-daily/
├── .continue/
│   └── rules/
│       └── CONTINUE.md          # This file
├── public/
│   ├── icons/
│   │   ├── apple-touch-icon.png
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   ├── mask-icon.svg
│   │   └── web-app-manifest-192.png
│   └── index.html
├── src/
│   ├── App.tsx                  # Main application component
│   ├── components/
│   │   ├── AddTaskForm.tsx    # Task creation form
│   │   ├── TaskFilter.tsx      # Filtering and sorting
│   │   ├── TaskItem.tsx        # Individual task component
│   │   ├── TaskList.tsx        # Task list management
│   │   └── components/         # Reusable UI components
│   ├── styles/
│   │   ├── index.pcss         # Global styles
│   │   └── variables.pcss     # CSS variables
│   ├── utils/
│   │   └── storage.ts         # LocalStorage persistence
│   └── types/
│       └── index.ts           # TypeScript interfaces
├── tests/
│   ├── App.test.tsx
│   ├── components/
│   │   ├── AddTaskForm.test.tsx
│   │   ├── TaskItem.test.tsx
│   │   └── TaskList.test.tsx
│   └── utils/
│       └── storage.test.ts
├── .eslintrc.js                # ESLint configuration
├── .gitignore
├── package.json
├── tsconfig.app.json           # TypeScript configuration for app
├── tsconfig.json               # Root TypeScript configuration
├── vite.config.ts              # Vite configuration
├── postcss.config.mjs          # PostCSS configuration
└── README.md                   # Project overview and deployment
```

### Key Files and Directories

- **`src/App.tsx`**: Main application component managing state and component composition
- **`src/utils/storage.ts`**: Implements localStorage-based persistence with timestamp-based IDs
- **`src/types/index.ts`**: Defines TypeScript interfaces for task data structures
- **`vite.config.ts`**: Configured for GitHub Pages with proper base path and PWA support
- **`src/components/TaskList.tsx`**: Manages the list of tasks with filtering and sorting capabilities

## Project Structure Deep Dive

### Component Architecture

The application uses a component-based architecture with the following patterns:

1. **Container Components**: Manage state and data flow (e.g., `App.tsx`, `TaskList.tsx`)
2. **Presentational Components**: Handle UI rendering without business logic (e.g., `TaskItem.tsx`, `AddTaskForm.tsx`)
3. **Utility Components**: Reusable UI elements (e.g., `components/ui/Button.tsx`)

### State Management Flow

1. **Task Creation**: User inputs task details in `AddTaskForm`
2. **State Update**: `App.tsx` updates task state using `setTasks()`
3. **Persistence**: `saveTasksToStorage()` writes to localStorage
4. **Rendering**: `TaskList` renders tasks with `TaskItem` components
5. **Filtering**: `TaskFilter` applies filters to the task list

### Data Flow Diagram

```
User Input → AddTaskForm → App State → TaskList → TaskItem
          ↓
        TaskFilter → Filtered Tasks
          ↓
        TaskList (re-renders)
          ↓
        TaskItem (displays task)
```

## Development Workflow

### Code Style and Linting

The project uses ESLint with React-specific configurations:

```bash
# Check for linting issues
yarn lint

# Auto-fix linting issues
yarn lint --fix

# Run pre-commit hooks
yarn commit
```

### Testing Strategy

The application uses Vitest for unit testing:

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test --coverage

# Watch mode for tests
yarn test:watch
```

### Component Testing

Each component has dedicated tests:

- **`App.test.tsx`**: Tests main application functionality
- **`AddTaskForm.test.tsx`**: Tests task creation form
- **`TaskItem.test.tsx`**: Tests individual task display and interactions
- **`TaskList.test.tsx`**: Tests task list management
- **`storage.test.ts`**: Tests localStorage persistence

### Testing Best Practices

1. **Arrange-Act-Assert**: Follow this pattern in all tests
2. **Mock Dependencies**: Use vitest.mock() for external dependencies
3. **Test Edge Cases**: Test empty states, invalid inputs, and error conditions
4. **Coverage**: Maintain 90%+ code coverage

## Task Management Features

### Current Implementation

1. **Create Tasks**: Add new tasks with title, description, and due date
2. **Read Tasks**: Display all tasks in a list with filtering options
3. **Update Tasks**: Edit task details (partially implemented)
4. **Delete Tasks**: Remove tasks from the list (partially implemented)
5. **Filter Tasks**: Filter by status (completed/pending) and due date

### Implementation Status

| Feature | Status | Notes |
|---------|--------|-------|
| Create Tasks | ✅ Complete | Fully implemented |
| Read Tasks | ✅ Complete | Fully implemented |
| Update Tasks | ⚠️ Partial | Edit functionality needs implementation |
| Delete Tasks | ⚠️ Partial | Remove functionality needs implementation |
| Filter Tasks | ✅ Complete | Filtering by status and due date works |
| Search Tasks | ⚠️ Partial | Search functionality needs implementation |

### Task Data Structure

```typescript
interface ITask {
  id: string;           // Unique identifier (timestamp-based)
  title: string;        // Task title
  description?: string; // Optional description
  dueDate?: string;     // Due date in ISO format
  completed: boolean;   // Task completion status
  category?: string;    // Task category (work, personal, etc.)
  createdAt: string;    // Creation timestamp
  updatedAt: string;    // Last update timestamp
  subTasks?: ITask[];   // Children tasks
}
```

## PWA Configuration

### Service Worker

The application uses Workbox for service worker generation with proper caching strategies:

- **Static Assets**: Cached with CacheFirst strategy
- **API Requests**: Cached with NetworkFirst strategy
- **HTML**: Cached with StaleWhileRevalidate strategy

### Manifest Configuration

The PWA manifest includes:

- Application name: "TODOS Daily"
- Icons: 192x192, 512x512, and Apple Touch Icon
- Start URL: `/todos-daily/`
- Display: "standalone"
- Theme: "minimal"

### GitHub Pages Configuration

The `vite.config.ts` is configured for GitHub Pages with:

```typescript
export default defineConfig({
  base: '/todos-daily/',
  plugins: [
    react(),
    vitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: import.meta.env.VITE_APP_TITLE,
        short_name: 'TODOS',
        start_url: '/todos-daily/',
        display: 'standalone',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/todos-daily/icons/web-app-manifest-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/todos-daily/icons/web-app-manifest-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      icons: {
        app: 'icons/app'
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        cleanupOutdatedCaches: true
      }
    })
  ]
})
```

## Deployment

### GitHub Pages

1. **Push to GitHub**: Commit and push changes to the main branch
2. **Deploy**: GitHub Actions will automatically deploy to GitHub Pages
3. **Verify**: Visit `https://yourusername.github.io/todos-daily/`

### Environment Variables for Deployment

```bash
# Set these in GitHub repository settings
VITE_GITHUB_REPO: yourusername/todos-daily
VITE_BASE_PATH: /todos-daily/
```

### Manual Deployment

```bash
# Build for production
yarn build

# Deploy to GitHub Pages
yarn deploy
```

## Troubleshooting

### Common Issues

1. **PWA Not Working Locally**
    - Solution: Use `yarn dev --host` to allow network access
    - Ensure you're accessing via `http://localhost:5173` not `file://`

2. **GitHub Pages Base Path Issues**
    - Solution: Verify `VITE_BASE_PATH` is set to `/todos-daily/`
    - Check `vite.config.ts` for correct base configuration

3. **LocalStorage Quota Exceeded**
    - Solution: Implement task archiving to reduce storage size
    - Consider using IndexedDB for larger datasets

4. **TypeScript Errors**
    - Solution: Run `yarn type-check` to identify issues
    - Ensure all interfaces are properly imported and used

### Debugging Tips

1. **Check Storage**: Open browser dev tools → Application → Local Storage
2. **Service Worker**: Dev tools → Application → Service Workers
3. **Network**: Check caching headers and service worker updates
4. **Console**: Look for PWA-related errors in browser console

## Future Enhancements

### Short-term (Next Sprint)

1. **Complete Task Management**
    - Implement edit task functionality
    - Implement delete task functionality
    - Add task archiving

2. **Improve UX**
    - Add task search functionality
    - Implement drag-and-drop reordering
    - Add task templates

3. **Code Quality**
    - Add type guards for task data
    - Implement comprehensive error handling
    - Add input validation

### Medium-term (Next Quarter)

1. **Backend Integration**
    - Add REST API integration
    - Implement user authentication
    - Add task synchronization across devices

2. **Advanced Features**
    - Add task dependencies
    - Implement recurring tasks
    - Add task analytics

3. **Performance**
    - Implement virtual scrolling for long task lists
    - Add code splitting for better load times
    - Implement service worker pre-caching

### Long-term Vision

1. **Cross-Platform Support**
    - Native mobile app with React Native
    - Desktop app with Electron

2. **Collaboration**
    - Real-time task collaboration
    - Shared task lists

3. **AI Integration**
    - Smart task suggestions
    - Natural language task creation

## Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Make your changes**
4. **Run tests**: `yarn test`
5. **Commit with clear messages**: `git commit -m "feat: add task search functionality"`
6. **Push to your fork**: `git push origin feature/your-feature`
7. **Submit a pull request**

### Code Standards

1. **TypeScript**: Use strict mode, avoid `any` type
2. **Component Structure**: Follow the container/presentational pattern
3. **Error Handling**: Use try-catch blocks for async operations
4. **Performance**: Use React.memo for expensive components
5. **Accessibility**: Follow WCAG 2.1 AA guidelines

### Pull Request Checklist

- [ ] Code follows the project's style guide
- [ ] Tests pass (`yarn test`)
- [ ] Linting passes (`yarn lint`)
- [ ] Documentation updated if needed
- [ ] All new code is covered by tests
- [ ] No new linting warnings

### Issue Reporting

When reporting issues, please include:

1. **Environment**: Node.js version, browser, OS
2. **Steps to Reproduce**: Clear, numbered steps
3. **Expected Behavior**: What you expected to happen
4. **Actual Behavior**: What actually happened
5. **Screenshots/Video**: Visual representation of the issue

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with React 19, TypeScript, and Vite
- PWA support via vite-plugin-pwa
- Icons from [Simple Icons](https://simpleicons.org/)
- Deployment on GitHub Pages

---

*This guide was created to ensure smooth onboarding and development for the TODOS Daily application. Please refer to this document for all development-related questions and decisions.*