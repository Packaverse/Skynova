# Components

This directory contains all the UI components organized using the **Atomic Design** methodology. This approach creates a hierarchical system that promotes reusability, maintainability, and consistency across the application.

## Structure

```
components/
├── atoms/          # Basic building blocks (buttons, inputs, etc.)
├── molecules/      # Simple combinations of atoms
├── organisms/      # Complex UI components with business logic
└── ui/            # Shadcn/ui components (auto-generated)
```

## Atomic Design Principles

### 🔹 Atoms
The smallest, most basic components that can't be broken down further. These are highly reusable and have no dependencies on other components.

### 🔸 Molecules
Simple combinations of atoms that work together as a unit. They have a single, well-defined purpose.

### 🔺 Organisms
Complex components that combine molecules and atoms to form distinct sections of an interface. These often contain business logic.

## Guidelines

- **Atoms** should be pure, stateless, and highly reusable
- **Molecules** should have a single responsibility
- **Organisms** can contain state and business logic
- Each component should have clear props interfaces
- Use TypeScript for all components
- Include JSDoc comments for complex components

## Import Pattern

```typescript
// Atoms
import { GlassCard } from '@/components/atoms/GlassCard';

// Molecules  
import { AppHeader } from '@/components/molecules/AppHeader';

// Organisms
import { FileUploadZone } from '@/components/organisms/FileUploadZone';
```
