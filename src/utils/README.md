# Utilities

Pure utility functions and helper classes that provide common functionality across the application. Utilities are framework-agnostic and have no side effects.

## Philosophy

Utilities should be:
- **Pure Functions**: No side effects, same input always produces same output
- **Stateless**: Don't maintain internal state
- **Reusable**: Usable across different parts of the application
- **Framework Agnostic**: Not tied to React or any specific framework

## Current Utilities

### `uuid.ts`
UUID generation utility for creating unique identifiers.

#### `generateUUID()`
Generates a RFC 4122 version 4 compliant UUID string.

**Usage:**
```typescript
import { generateUUID } from '@/utils/uuid';

const id = generateUUID();
// Returns: "550e8400-e29b-41d4-a716-446655440000"
```

**Features:**
- RFC 4122 version 4 compliant
- Cryptographically random
- No dependencies
- Browser-compatible

---

### `darkMode.ts`
Dark mode management utility with localStorage persistence.

#### `DarkModeManager`
Static class for managing dark mode state and persistence.

**Methods:**

##### `getInitialMode()`
Gets the initial dark mode state from localStorage.

**Returns:** boolean (defaults to true if no saved state)

##### `toggleMode(currentMode)`
Toggles dark mode and persists to localStorage.

**Parameters:**
- `currentMode` - Current dark mode state

**Returns:** New dark mode state

##### `applyMode(isDark)`
Applies dark mode classes to the document.

**Parameters:**
- `isDark` - Whether to apply dark mode

**Usage:**
```typescript
import { DarkModeManager } from '@/utils/darkMode';

// Get initial state
const isDark = DarkModeManager.getInitialMode();

// Toggle mode
const newMode = DarkModeManager.toggleMode(isDark);

// Apply mode manually
DarkModeManager.applyMode(true);
```

## Utility Patterns

### Pure Functions
```typescript
// Good - pure function
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Avoid - has side effects
export const logAndFormat = (bytes: number): string => {
  console.log('Formatting bytes:', bytes); // Side effect
  return formatBytes(bytes);
};
```

### Type Safety
```typescript
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

### Error Handling
```typescript
export const parseJSON = <T>(jsonString: string): T | null => {
  try {
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
};

export const safeArray = <T>(value: unknown): T[] => {
  return Array.isArray(value) ? value : [];
};
```

## Testing Utilities

Utilities should be thoroughly tested:

```typescript
import { generateUUID } from './uuid';

describe('generateUUID', () => {
  test('should generate valid UUID format', () => {
    const uuid = generateUUID();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    expect(uuid).toMatch(uuidRegex);
  });
  
  test('should generate unique UUIDs', () => {
    const uuid1 = generateUUID();
    const uuid2 = generateUUID();
    
    expect(uuid1).not.toBe(uuid2);
  });
});
```

## Common Utility Categories

### String Utilities
```typescript
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
```

### Array Utilities
```typescript
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};
```

### Object Utilities
```typescript
export const pick = <T, K extends keyof T>(
  obj: T, 
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const omit = <T, K extends keyof T>(
  obj: T, 
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
};
```

### Validation Utilities
```typescript
export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

export const isEmpty = (value: unknown): boolean => {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};
```

## Guidelines for New Utilities

1. **Pure Functions**: No side effects or external dependencies
2. **Single Purpose**: Each function should do one thing well
3. **Type Safety**: Use TypeScript for all parameters and return types
4. **Documentation**: Include JSDoc comments with examples
5. **Testing**: Achieve 100% test coverage
6. **Performance**: Consider performance implications for frequently used utilities
7. **Naming**: Use clear, descriptive function names
8. **Exports**: Use named exports for better tree-shaking

## Integration Example

```typescript
// Using utilities in services
import { generateUUID } from '@/utils/uuid';
import { formatBytes } from '@/utils/format';

export class FileService {
  static processFile(file: File) {
    const id = generateUUID();
    const sizeDisplay = formatBytes(file.size);
    
    return {
      id,
      name: file.name,
      size: file.size,
      sizeDisplay,
      type: file.type
    };
  }
}
```
