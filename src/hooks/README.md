# Hooks

Custom React hooks for managing state, side effects, and reusable logic. Hooks follow the principle of separation of concerns and help keep components clean and focused.

## Philosophy

Custom hooks should:
- **Single Responsibility**: Each hook should manage one aspect of functionality
- **Reusable**: Be usable across multiple components
- **Testable**: Have clear inputs and outputs for easy testing
- **Composable**: Work well together with other hooks

## Current Hooks

### `useCubemapConverter`
Manages the entire cubemap conversion process including file validation, conversion, and progress tracking.

**Usage:**
```tsx
const { isProcessing, progress, cubemapFaces, convertFile } = useCubemapConverter();

// Convert a file
convertFile(selectedFile);
```

**Returns:**
- `isProcessing` - Whether conversion is in progress
- `progress` - Conversion progress (0-100)
- `cubemapFaces` - Array of generated face images (base64)
- `convertFile` - Function to start conversion

**Features:**
- File type validation
- Progress tracking
- Error handling with toast notifications
- Integration with `CubemapConverter` service

---

### `useDarkMode`
Manages dark mode state with localStorage persistence and DOM class application.

**Usage:**
```tsx
const { isDarkMode, toggleDarkMode } = useDarkMode();

// Toggle mode
toggleDarkMode();
```

**Returns:**
- `isDarkMode` - Current dark mode state
- `toggleDarkMode` - Function to toggle dark mode

**Features:**
- Automatic localStorage persistence
- DOM class management
- Initial state from localStorage

---

### `useDragAndDrop`
Handles drag and drop functionality for file uploads.

**Usage:**
```tsx
const { dragActive, handleDrag, handleDrop } = useDragAndDrop(onFileDrop);

<div
  onDragEnter={handleDrag}
  onDragLeave={handleDrag}
  onDragOver={handleDrag}
  onDrop={handleDrop}
>
  Drop files here
</div>
```

**Parameters:**
- `onDrop` - Callback function when file is dropped

**Returns:**
- `dragActive` - Whether drag is currently active
- `handleDrag` - Event handler for drag events
- `handleDrop` - Event handler for drop events

**Features:**
- Visual feedback for drag states
- File extraction from drop events
- Proper event handling and cleanup

## Built-in Hooks Used

### `use-toast` (from shadcn/ui)
Used throughout the application for user notifications.

**Usage:**
```tsx
import { toast } from '@/hooks/use-toast';

toast({
  title: "Success!",
  description: "Operation completed successfully.",
});

// For errors
toast({
  title: "Error",
  description: "Something went wrong.",
  variant: "destructive"
});
```

### `use-mobile` 
Detects mobile devices for responsive behavior.

**Usage:**
```tsx
import { useMobile } from '@/hooks/use-mobile';

const isMobile = useMobile();
```

## Hook Patterns

### State Management Hook
```typescript
export const useFeature = () => {
  const [state, setState] = useState(initialState);
  
  const updateState = (newValue) => {
    setState(newValue);
  };
  
  return { state, updateState };
};
```

### Effect Hook
```typescript
export const useAsyncOperation = (dependency) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const performOperation = async () => {
      setLoading(true);
      try {
        const result = await someAsyncOperation(dependency);
        setData(result);
      } finally {
        setLoading(false);
      }
    };
    
    if (dependency) {
      performOperation();
    }
  }, [dependency]);
  
  return { loading, data };
};
```

### Event Handler Hook
```typescript
export const useEventHandler = (callback) => {
  const handleEvent = useCallback((event) => {
    // Process event
    callback(processedData);
  }, [callback]);
  
  return handleEvent;
};
```

## Testing Hooks

Use `@testing-library/react-hooks` for testing custom hooks:

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useDarkMode } from './useDarkMode';

test('should toggle dark mode', () => {
  const { result } = renderHook(() => useDarkMode());
  
  act(() => {
    result.current.toggleDarkMode();
  });
  
  expect(result.current.isDarkMode).toBe(false);
});
```

## Guidelines for New Hooks

1. **Naming**: Always prefix with "use" (React convention)
2. **Single Purpose**: Each hook should manage one piece of functionality
3. **Dependencies**: Minimize external dependencies
4. **Error Handling**: Include proper error handling and cleanup
5. **Documentation**: Document parameters, return values, and usage examples
6. **Testing**: Write comprehensive tests for all hook functionality
