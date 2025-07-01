# Molecules

Molecules are simple combinations of atoms that work together as a unit. They have a single, well-defined purpose and represent the smallest functional units of the interface.

## Philosophy

Molecules should:
- **Combine Atoms**: Group 2-3 atoms together for a specific purpose
- **Single Purpose**: Have one clear, focused responsibility
- **Minimal Logic**: Contain only presentation logic, no complex business rules
- **Reusable**: Be usable across different parts of the application

## Current Components

### `AppHeader`
The main application header containing the title, subtitle, and dark mode toggle.

**Usage:**
```tsx
<AppHeader 
  isDarkMode={isDarkMode} 
  onToggleDarkMode={handleToggle} 
/>
```

**Props:**
- `isDarkMode` - Current dark mode state
- `onToggleDarkMode` - Callback function to toggle dark mode

**Composition:**
- Uses `DarkModeToggle` molecule
- Contains app branding and description

---

### `CubemapFacePreview`
A single cubemap face preview with hover effects and filename display.

**Usage:**
```tsx
<CubemapFacePreview
  face={imageDataUrl}
  index={0}
  displayName="cubemap_0.png (left -x)"
  isPanoramaMode={false}
/>
```

**Props:**
- `face` - Base64 image data URL
- `index` - Face index number
- `displayName` - Formatted filename to display on hover
- `isPanoramaMode` - Whether in panorama or cubemap mode

---

### `DarkModeToggle`
A button component for toggling between light and dark modes.

**Usage:**
```tsx
<DarkModeToggle 
  isDarkMode={isDarkMode} 
  onToggle={handleToggle} 
/>
```

**Props:**
- `isDarkMode` - Current theme state
- `onToggle` - Function to call when toggle is clicked

**Features:**
- Animated icon transitions
- Glassmorphism styling
- Hover effects

---

### `PanoramaModeToggle`
A switch component for toggling between panorama and cubemap modes.

**Usage:**
```tsx
<PanoramaModeToggle 
  isPanoramaMode={isPanoramaMode} 
  onToggle={setIsPanoramaMode} 
/>
```

**Props:**
- `isPanoramaMode` - Current mode state
- `onToggle` - Callback function when switch is toggled

**Composition:**
- Uses `GlassCard` atom
- Uses shadcn `Switch` component
- Includes descriptive text

## Guidelines for New Molecules

1. **Focused Purpose**: Each molecule should serve one specific UI need
2. **Atom Composition**: Prefer combining existing atoms over creating new ones
3. **Event Handling**: Accept callback props for user interactions
4. **State Management**: Don't manage complex state internally
5. **Accessibility**: Ensure proper ARIA labels and keyboard navigation
