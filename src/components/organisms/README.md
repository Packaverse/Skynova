# Organisms

Organisms are complex UI components that combine molecules and atoms to form distinct sections of an interface. They often contain business logic and manage their own state.

## Philosophy

Organisms should:
- **Complex Functionality**: Handle complete user workflows or sections
- **Business Logic**: Can contain application-specific logic and state
- **Self-Contained**: Manage their own internal state and side effects
- **Feature-Complete**: Provide a complete piece of functionality

## Current Components

### `CubemapPreview`
A comprehensive preview component that displays all generated cubemap faces with download functionality.

**Usage:**
```tsx
<CubemapPreview
  cubemapFaces={facesArray}
  isPanoramaMode={false}
  uploadedImage={file}
  onDownload={handleDownload}
/>
```

**Props:**
- `cubemapFaces` - Array of base64 image data URLs
- `isPanoramaMode` - Current conversion mode
- `uploadedImage` - Original uploaded file
- `onDownload` - Callback function for download action

**Features:**
- Grid layout of face previews
- Download button with styling
- Conditional rendering based on faces availability
- Integration with `PackageService` for filename display

**Composition:**
- Uses `GlassCard` atom
- Uses `CubemapFacePreview` molecules
- Uses shadcn `Button` component

---

### `FileUploadZone`
A complete file upload interface with drag-and-drop, file selection, and progress tracking.

**Usage:**
```tsx
<FileUploadZone
  uploadedImage={uploadedFile}
  isProcessing={isConverting}
  progress={conversionProgress}
  onFileSelect={handleFileSelect}
/>
```

**Props:**
- `uploadedImage` - Currently uploaded file (or null)
- `isProcessing` - Whether conversion is in progress
- `progress` - Conversion progress (0-100)
- `onFileSelect` - Callback when file is selected

**Features:**
- Drag and drop functionality
- File browser integration
- Real-time progress tracking
- Visual feedback for drag states
- File validation

**Composition:**
- Uses `GlassCard` atom
- Uses `ProgressBar` atom
- Uses `useDragAndDrop` hook
- Uses shadcn `Button` component

---

### `InfoPanel`
An informational component that explains how the application works and provides usage instructions.

**Usage:**
```tsx
<InfoPanel />
```

**Props:**
- None (static content)

**Features:**
- Formatted instruction list
- Application description
- Legal disclaimer
- Consistent glassmorphism styling

**Composition:**
- Uses `GlassCard` atom
- Static content with semantic HTML

## Guidelines for New Organisms

1. **Complete Features**: Each organism should provide a complete piece of functionality
2. **State Management**: Can use hooks and manage complex state
3. **Business Logic**: Appropriate place for application-specific logic
4. **Error Handling**: Should handle their own error states
5. **Performance**: Consider memoization for expensive operations
6. **Testing**: Should have comprehensive unit tests
7. **Accessibility**: Ensure complete keyboard navigation and screen reader support

## State Management Patterns

Organisms can use various state management approaches:

- **Local State**: `useState` for simple internal state
- **Custom Hooks**: Extract complex logic into reusable hooks
- **Context**: For sharing state across multiple organisms
- **External Libraries**: Redux, Zustand, etc. for global state

## Example Structure

```typescript
export const MyOrganism: React.FC<Props> = ({ ...props }) => {
  // State management
  const [localState, setLocalState] = useState();
  const { customHook } = useCustomHook();
  
  // Event handlers
  const handleAction = () => {
    // Business logic here
  };
  
  // Render
  return (
    <GlassCard>
      <SomeMolecule onAction={handleAction} />
      <AnotherMolecule data={localState} />
    </GlassCard>
  );
};
```
