# Pages

Top-level page components that represent complete application routes or views. Pages orchestrate organisms, molecules, and atoms to create full user experiences.

## Philosophy

Pages should:
- **Orchestrate Components**: Combine organisms to create complete experiences
- **Handle Routing**: Serve as route entry points
- **Manage Global State**: Handle application-level state management
- **Coordinate Data Flow**: Pass data between components and manage side effects

## Current Pages

### `Index.tsx`
The main application page that provides the complete HDRI to cubemap conversion experience.

**Features:**
- Dark mode management
- File upload and conversion workflow
- Panorama/cubemap mode switching
- Progress tracking and user feedback
- Download functionality
- Informational content

**Component Composition:**
```tsx
<GlassmorphismBackground isDarkMode={isDarkMode}>
  <AppHeader isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
  <PanoramaModeToggle isPanoramaMode={isPanoramaMode} onToggle={setIsPanoramaMode} />
  <FileUploadZone {...uploadProps} />
  <CubemapPreview {...previewProps} />
  <InfoPanel />
</GlassmorphismBackground>
```

**State Management:**
- Uses `useDarkMode` hook for theme management
- Uses `useCubemapConverter` hook for conversion logic
- Local state for file and mode management

**Data Flow:**
1. User uploads file via `FileUploadZone`
2. `useCubemapConverter` processes the file
3. `CubemapPreview` displays results
4. `PackageService` handles download

---

### `NotFound.tsx`
404 error page for handling invalid routes.

**Features:**
- Consistent styling with main application
- Navigation back to home
- Clear error messaging

## Page Architecture

### State Management
Pages can use various state management approaches:

```typescript
const MyPage = () => {
  // Local state
  const [localState, setLocalState] = useState();
  
  // Custom hooks
  const { data, loading } = useDataFetching();
  
  // Global state (if using context/redux)
  const globalState = useGlobalState();
  
  return (
    <PageLayout>
      <MyOrganism data={data} loading={loading} />
    </PageLayout>
  );
};
```

### Error Boundaries
Pages should handle errors gracefully:

```typescript
const MyPage = () => {
  try {
    return <PageContent />;
  } catch (error) {
    return <ErrorFallback error={error} />;
  }
};
```

### Loading States
Handle loading and async operations:

```typescript
const MyPage = () => {
  const { data, loading, error } = useAsyncData();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <PageContent data={data} />;
};
```

## SEO and Meta Tags

For production applications, pages should include proper meta tags:

```typescript
import { Helmet } from 'react-helmet-async';

const MyPage = () => {
  return (
    <>
      <Helmet>
        <title>Page Title - Skynova</title>
        <meta name="description" content="Page description" />
        <meta property="og:title" content="Page Title" />
        <meta property="og:description" content="Page description" />
      </Helmet>
      <PageContent />
    </>
  );
};
```

## Responsive Design

Pages should be responsive and work across all device sizes:

```typescript
const MyPage = () => {
  const isMobile = useMobile();
  
  return (
    <div className={`page-container ${isMobile ? 'mobile' : 'desktop'}`}>
      <ResponsiveLayout>
        <PageContent />
      </ResponsiveLayout>
    </div>
  );
};
```

## Testing Pages

Pages should be tested with integration tests:

```typescript
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Index from './Index';

test('renders main application page', () => {
  render(
    <BrowserRouter>
      <Index />
    </BrowserRouter>
  );
  
  expect(screen.getByText('Skynova')).toBeInTheDocument();
  expect(screen.getByText('Upload your HDRI image')).toBeInTheDocument();
});
```

## Guidelines for New Pages

1. **Single Responsibility**: Each page should represent one main user flow
2. **Component Composition**: Use existing organisms and molecules
3. **State Management**: Choose appropriate state management strategy
4. **Error Handling**: Include comprehensive error boundaries
5. **Loading States**: Handle async operations gracefully
6. **Accessibility**: Ensure proper heading hierarchy and navigation
7. **Performance**: Use code splitting for large pages
8. **SEO**: Include proper meta tags and structured data

## Routing Integration

When using React Router:

```typescript
// App.tsx
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

## Performance Considerations

### Code Splitting
```typescript
import { lazy, Suspense } from 'react';

const LazyPage = lazy(() => import('./LazyPage'));

const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <LazyPage />
  </Suspense>
);
```

### Memoization
```typescript
import { memo } from 'react';

const ExpensivePage = memo(() => {
  // Expensive rendering logic
  return <PageContent />;
});
```

### Resource Management
```typescript
const MyPage = () => {
  useEffect(() => {
    // Setup resources
    const subscription = subscribeToData();
    
    return () => {
      // Cleanup resources
      subscription.unsubscribe();
    };
  }, []);
  
  return <PageContent />;
};
```
