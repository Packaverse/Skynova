# Atoms

Atoms are the most basic building blocks of the UI. They are the smallest possible components that can't be broken down any further without losing their functionality. 

## Philosophy

Atoms should be:
- **Pure**: No side effects or external dependencies
- **Reusable**: Can be used anywhere in the application
- **Simple**: Have a single, clear purpose
- **Stateless**: Don't manage their own state (props only)

## Current Components

### `GlassCard`
A reusable glassmorphism card component with backdrop blur effects.

**Usage:**
```tsx
<GlassCard className="max-w-md">
  <p>Content goes here</p>
</GlassCard>
```

**Props:**
- `children` - React nodes to render inside the card
- `className` - Additional CSS classes for customization

---

### `GlassmorphismBackground`
A full-screen background component with gradient effects and glassmorphism styling.

**Usage:**
```tsx
<GlassmorphismBackground isDarkMode={true}>
  <YourContent />
</GlassmorphismBackground>
```

**Props:**
- `children` - Content to render over the background
- `isDarkMode` - Whether to apply dark mode styling

---

### `ProgressBar`
An animated progress bar with percentage display.

**Usage:**
```tsx
<ProgressBar progress={75} label="Converting..." />
```

**Props:**
- `progress` - Number between 0-100 representing completion percentage
- `label` - Optional label text (defaults to "Processing...")

## Guidelines for New Atoms

1. **Single Responsibility**: Each atom should do one thing well
2. **No Business Logic**: Atoms should not contain application-specific logic
3. **Prop Validation**: Use TypeScript interfaces for all props
4. **Styling**: Use Tailwind classes for consistent styling
5. **Documentation**: Include JSDoc comments for complex props
