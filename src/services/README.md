# Services

Business logic layer that handles data processing, API interactions, and complex operations. Services are independent of React components and can be used across the application.

## Philosophy

Services should:
- **Pure Functions**: No side effects, predictable outputs
- **Single Responsibility**: Each service handles one domain of functionality
- **Testable**: Easy to unit test in isolation
- **Framework Agnostic**: Not tied to React or any UI framework

## Current Services

### `CubemapConverter`
Handles the conversion of equirectangular HDRI images to cubemap faces.

**Methods:**

#### `generateCubemapFaces(imageData, width, height, onProgress?)`
Converts image data to 6 cubemap faces.

**Parameters:**
- `imageData` - Canvas ImageData object
- `width` - Source image width
- `height` - Source image height  
- `onProgress` - Optional progress callback function

**Returns:** Array of base64 image strings

#### `convertFile(file, onProgress?)`
Converts a File object to cubemap faces.

**Parameters:**
- `file` - File object to convert
- `onProgress` - Optional progress callback

**Returns:** Promise resolving to array of base64 images

**Usage:**
```typescript
import { CubemapConverter } from '@/services/cubemapService';

// Convert file
const faces = await CubemapConverter.convertFile(imageFile, (progress) => {
  console.log(`Progress: ${progress}%`);
});

// Convert image data directly
const faces = CubemapConverter.generateCubemapFaces(
  imageData, 
  width, 
  height,
  setProgress
);
```

---

### `PackageService`
Handles creation and download of Minecraft texture packs.

**Methods:**

#### `downloadTexturePack(options)`
Creates and downloads a complete texture pack.

**Parameters:**
- `options.isPanoramaMode` - Whether to create panorama or cubemap pack
- `options.imageName` - Original image filename  
- `options.cubemapFaces` - Array of face images

**Returns:** Promise (downloads file automatically)

#### `getDisplayFilename(index, isPanoramaMode)`
Gets the display filename for a cubemap face.

**Parameters:**
- `index` - Face index (0-5)
- `isPanoramaMode` - Current mode

**Returns:** Formatted filename string

**Usage:**
```typescript
import { PackageService } from '@/services/packageService';

// Download texture pack
await PackageService.downloadTexturePack({
  isPanoramaMode: false,
  imageName: 'sky.jpg',
  cubemapFaces: faceArray
});

// Get filename
const filename = PackageService.getDisplayFilename(0, false);
// Returns: "cubemap_0.png (left -x)"
```

---

### `manifestService`
Generates Minecraft Bedrock Edition manifest files.

**Functions:**

#### `generateManifest(imageName)`
Creates a complete manifest.json object.

**Parameters:**
- `imageName` - Name for the texture pack

**Returns:** ManifestObject with UUIDs and metadata

**Usage:**
```typescript
import { generateManifest } from '@/services/manifestService';

const manifest = generateManifest('My Sky Pack');
```

**Generated Structure:**
```json
{
  "format_version": 2,
  "header": {
    "description": "https://discord.gg/hXRBsvksRX",
    "name": "My Sky Pack",
    "uuid": "generated-uuid",
    "version": [1, 0, 0],
    "min_engine_version": [1, 16, 0]
  },
  "modules": [...]
}
```

## Service Architecture

### Dependency Injection
Services can depend on utilities but should avoid circular dependencies:

```typescript
// Good
import { generateUUID } from '@/utils/uuid';

export class SomeService {
  static method() {
    const id = generateUUID();
    // ...
  }
}

// Avoid
import { SomeOtherService } from './otherService';
```

### Error Handling
Services should throw meaningful errors:

```typescript
export class MyService {
  static async processData(data: unknown) {
    if (!data) {
      throw new Error('Data is required');
    }
    
    try {
      return await someOperation(data);
    } catch (error) {
      throw new Error(`Processing failed: ${error.message}`);
    }
  }
}
```

### Async Operations
Use proper async/await patterns:

```typescript
export class AsyncService {
  static async fetchData(): Promise<DataType> {
    const response = await fetch('/api/data');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }
}
```

## Testing Services

Services should be thoroughly unit tested:

```typescript
import { CubemapConverter } from './cubemapService';

describe('CubemapConverter', () => {
  test('should generate 6 faces', () => {
    const mockImageData = createMockImageData();
    const faces = CubemapConverter.generateCubemapFaces(
      mockImageData, 
      1024, 
      512
    );
    
    expect(faces).toHaveLength(6);
    expect(faces[0]).toMatch(/^data:image\/png;base64,/);
  });
});
```

## Guidelines for New Services

1. **Static Methods**: Prefer static methods for stateless operations
2. **Pure Functions**: Avoid side effects when possible
3. **Type Safety**: Use TypeScript interfaces and types
4. **Error Handling**: Provide meaningful error messages
5. **Documentation**: Include JSDoc comments with examples
6. **Testing**: Achieve high test coverage
7. **Performance**: Consider caching for expensive operations

## Integration with Components

Services should be called from hooks or components:

```typescript
// In a hook
export const useDataProcessor = () => {
  const processData = async (input) => {
    try {
      return await DataService.process(input);
    } catch (error) {
      toast({ title: 'Error', description: error.message });
    }
  };
  
  return { processData };
};

// In a component
const MyComponent = () => {
  const { processData } = useDataProcessor();
  
  const handleClick = () => {
    processData(inputData);
  };
  
  return <button onClick={handleClick}>Process</button>;
};
```
