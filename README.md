# GMB Reviews Manager

A React-based web application for managing Google My Business reviews, featuring advanced filtering, real-time search, and automated reply functionality with a modern, responsive interface.

## 🚀 Features

### Core Functionality
- **Review Management**: Browse, filter, and reply to customer reviews
- **Advanced Filtering**: Filter by star rating, date range, and sort order
- **Real-time Search**: Instant search with debounced input for performance
- **Reply System**: Quick reply interface with modal dialog
- **Metrics Dashboard**: Real-time KPI tracking (average rating, response rate, response time)

### Technical Features
- **Type-Safe API Integration**: Fully typed API calls with auto-generated TypeScript definitions
- **Optimistic Updates**: Instant UI feedback with rollback on errors
- **Error Boundaries**: Graceful error handling with fallback UI
- **Responsive Design**: Desktop-optimized layout with sidebar navigation
- **Performance Optimized**: Debounced search, pagination, and efficient re-renders

## 🛠️ Tech Stack

### Frontend Framework
- **React 19.1** - Latest React with improved performance
- **TypeScript 5.8** - Type-safe JavaScript with strict mode
- **Vite 7.1** - Next-gen frontend tooling with instant HMR

### UI Components & Styling
- **React Bootstrap 2.10** - Bootstrap components for React
- **Bootstrap 5.3** - CSS framework for responsive design
- **Tailwind CSS 4.1** - Utility-first CSS with Vite integration
- **Lucide React** - Beautiful icon library
- **clsx & tailwind-merge** - Utility for conditional classes

### State Management & API
- **TanStack React Query 5** - Powerful asynchronous state management
- **Axios 1.6** - HTTP client with request/response interceptors
- **React Router DOM 6** - Client-side routing

### Form & Validation
- **React Hook Form 7.48** - Performant forms with easy validation
- **Zod 3.22** - TypeScript-first schema validation
- **@hookform/resolvers** - Validation resolvers for React Hook Form

### Code Generation
- **Kubb 4.1** - OpenAPI to TypeScript code generator
  - Generates types, Zod schemas, and React Query hooks
  - Ensures 100% type safety between frontend and API

### Testing Infrastructure
- **Vitest 1.0** - Fast unit testing framework
- **Playwright 1.40** - E2E testing and browser automation
- **Testing Library** - Simple and complete testing utilities
- **MSW 2.0** - API mocking for development and testing

### Development Tools
- **ESLint 9.36** - Linting with React-specific rules
- **Prettier 3.0** - Code formatting
- **TypeScript ESLint 8.44** - TypeScript linting rules

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+ or pnpm 8+
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd gmb-fe-react-exercise
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   pnpm install
   ```

3. Set up environment variables:

   ```bash
   cp env.example .env
   ```

4. Configure your `.env` file:

   ```env
   # Required: GMBapi Bearer Token
   VITE_GMBAPI_TOKEN=your_bearer_token_here

   # Optional: API Base URL (defaults to proxy)
   VITE_API_BASE_URL=https://gmbapi-external-api-800414123378.europe-west4.run.app
   ```

### Development

1. Generate API client from OpenAPI spec:

   ```bash
   npm run generate:api
   ```

   This creates TypeScript types, Zod schemas, and React Query hooks in `src/services/`

2. Start the development server:

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000)

3. Run development with API mocking (optional):
   ```bash
   npm run dev:mock
   ```

## Code Generation with Kubb

This project uses [Kubb](https://kubb.dev/) to automatically generate TypeScript code from the OpenAPI specification (`api-schema.yaml`). This ensures type safety and eliminates manual API integration work.

### How It Works

1. **Input**: OpenAPI specification file (`api-schema.yaml`)
2. **Process**: Run `npm run generate:api`
3. **Output**: Auto-generated code in `src/services/`

### What Gets Generated

```
src/services/
├── client.ts              # Configured Axios instance with auth
├── types/                 # TypeScript type definitions
│   ├── Review.ts
│   ├── ReviewFilters.ts
│   ├── ReviewReplyRequest.ts
│   └── [30+ more types]
├── schemas/               # Zod validation schemas
│   ├── reviewSchema.ts
│   ├── reviewFiltersSchema.ts
│   └── [30+ more schemas]
└── hooks/                 # React Query hooks
    ├── usePostReviews.ts
    ├── usePostReviewsReply.ts
    └── [15+ more hooks]
```

### Kubb Plugins Used

- **@kubb/plugin-oas**: Parses OpenAPI specification
- **@kubb/plugin-ts**: Generates TypeScript types
- **@kubb/plugin-zod**: Creates Zod schemas for runtime validation
- **@kubb/plugin-react-query**: Generates TanStack Query hooks with:
  - Automatic query key management
  - Type-safe parameters and responses
  - Built-in error handling
  - Optimistic updates support

### Configuration

The Kubb configuration is defined in `kubb.config.ts`:
```typescript
export default defineConfig({
  input: { path: './api-schema.yaml' },
  output: { path: './src/services', clean: true },
  plugins: [
    pluginOas({ output: { path: './types' } }),      // Parse OpenAPI spec
    pluginTs({ output: { path: './types' } }),       // Generate TypeScript types
    pluginZod({ output: { path: './schemas' } }),    // Generate Zod schemas
    pluginReactQuery({                                // Generate React Query hooks
      output: { path: './hooks' },
      client: { importPath: '@/services/client' }
    })
  ],
  hooks: {
    done: [
      'prettier --write "src/services/**/*.{ts,tsx}"',  // Format generated code
      'eslint --fix "src/services/**/*.{ts,tsx}"'       // Lint generated code
    ]
  }
})
```

### Why Code Generation?

1. **Zero Manual API Integration**: Never write API calls manually
2. **100% Type Safety**: Full TypeScript coverage from API to UI
3. **Single Source of Truth**: OpenAPI spec defines everything
4. **Runtime Validation**: Automatic validation of API responses
5. **Developer Experience**: Full IntelliSense and auto-completion
6. **Consistency**: All API calls follow the same pattern
7. **Maintainability**: Update the spec, regenerate, done!

### API Schema

The OpenAPI specification is defined in `api-schema.yaml` and includes:

- **Locations**: List, profile, labels, and hygiene data
- **Reviews**: Fetch, filter, reply, and suggestion endpoints
- **Analytics**: KPI metrics and performance data

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run generate:api # Generate API client from OpenAPI spec
npm run test         # Run unit tests with Vitest
npm run test:ui      # Run tests with Vitest UI
npm run test:e2e     # Run E2E tests with Playwright
```

## Testing

### Unit & Integration Tests

```bash
# Run all tests
npm run test

# Run in watch mode
npm run test -- --watch

# Run with coverage
npm run test -- --coverage

# Open Vitest UI
npm run test:ui
```

### E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npm run test:e2e tests/e2e/reviews.spec.ts

# Run in debug mode
npm run test:e2e -- --debug

# Run with UI mode
npx playwright test --ui
```

### Test Coverage

- Unit tests for utilities, hooks, and components
- Integration tests for API interactions
- E2E tests for critical user workflows
- Accessibility testing with Playwright

## Project Structure

```
gmb-fe-react-exercise/
├── src/
│   ├── components/
│   │   ├── common/          # Shared components
│   │   │   └── ErrorBoundary.tsx
│   │   ├── layout/          # Layout components
│   │   │   └── Sidebar.tsx # Navigation sidebar
│   │   ├── reviews/         # Review components
│   │   │   ├── ReviewCard.tsx       # Individual review display
│   │   │   ├── ReviewFilters.tsx    # Filter controls
│   │   │   ├── ReviewList.tsx       # Reviews container
│   │   │   ├── ReviewPagination.tsx # Pagination controls
│   │   │   └── ReviewReply.tsx      # Reply modal
│   │   └── ui/              # Base UI components
│   │       └── button.tsx
│   ├── hooks/
│   │   ├── useDebounce.ts   # Debounce hook for search
│   │   └── useReviews.ts    # Review data management
│   ├── pages/
│   │   └── ReviewsPage.tsx  # Main reviews page
│   ├── services/            # Auto-generated API layer
│   │   ├── client.ts        # Axios configuration
│   │   ├── hooks/           # React Query hooks (generated)
│   │   ├── schemas/         # Zod schemas (generated)
│   │   └── types/           # TypeScript types (generated)
│   ├── stores/
│   │   └── queryClient.ts   # React Query configuration
│   ├── test/                # Test utilities
│   │   └── mocks/
│   ├── utils/
│   │   ├── constants.ts     # App constants
│   │   └── formatting.ts    # Formatting utilities
│   ├── App.tsx              # App root with routing
│   ├── main.tsx             # Application entry
│   └── index.css            # Global styles
├── tests/e2e/               # Playwright tests
├── api-schema.yaml          # OpenAPI specification
├── kubb.config.ts           # Code generation config
├── vite.config.ts           # Vite configuration
├── vitest.config.ts         # Test configuration
└── package.json             # Dependencies & scripts
```

## 📊 Application Architecture

### Data Flow
1. **API Schema** (api-schema.yaml) defines all endpoints
2. **Code Generation** (Kubb) creates types, schemas, and hooks
3. **React Query** manages server state and caching
4. **Components** consume data via custom hooks
5. **UI Updates** trigger optimistic updates with rollback

### Key Design Decisions
- **Server State**: TanStack Query for caching and synchronization
- **Local State**: React useState for UI-only state
- **Forms**: React Hook Form for performance
- **Validation**: Zod for runtime type checking
- **Styling**: Hybrid approach with Bootstrap + Tailwind
- **Error Handling**: Error boundaries + React Query error states

## 🔌 API Integration

### Endpoints Used

#### Reviews Management
```typescript
POST /reviews                    // Fetch reviews with filters
POST /reviews/{id}/reply         // Reply to a review
POST /reviews/suggestions        // Get AI suggestions (if enabled)
```

### Request/Response Flow
1. User triggers action (filter, search, reply)
2. React Query hook is called with parameters
3. Axios client adds auth headers automatically
4. Response is validated with Zod schema
5. Data is cached and UI updates
6. Optimistic updates for reply actions

## 🏗️ Development Workflow

### Making API Changes
1. Update `api-schema.yaml` with new endpoints/types
2. Run `npm run generate:api` to regenerate code
3. New hooks and types are automatically available
4. TypeScript will guide you through any breaking changes

### Adding Features
1. Check if API support exists in `api-schema.yaml`
2. Generate latest API client code
3. Create/update components using generated hooks
4. Add tests for new functionality
5. Run `npm run lint` before committing

### Code Style
- TypeScript strict mode is enabled
- ESLint enforces consistent code style
- Prettier formats on save (configure your editor)
- Follow existing patterns in the codebase

## 📝 Notes

- This is a technical exercise showcasing modern React development
- The app is optimized for desktop viewing
- API endpoints require valid GMBapi token
- Some features may be mocked for demonstration purposes
