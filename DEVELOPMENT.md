# 🚀 Development Guide - WENZE TII NDAKU

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components
│   ├── Header.tsx      # Main navigation
│   ├── Footer.tsx      # Site footer
│   ├── CategoryCard.tsx # Category display card
│   └── ProductCard.tsx # Product display card
├── pages/              # Page components
│   ├── Index.tsx       # Home page
│   ├── Category.tsx    # Individual category page
│   ├── Stores.tsx      # Stores listing page
│   ├── Store.tsx       # Individual store page
│   └── ...             # Other pages
├── data/               # Centralized data files
│   ├── categories.ts   # Category data and functions
│   ├── products.ts     # Product data and functions
│   └── stores.ts       # Store data and functions
├── types/              # TypeScript type definitions
│   └── index.ts        # All interfaces and types
├── utils/              # Utility functions
│   └── index.ts        # Common utility functions
├── constants/          # Application constants
│   └── index.ts        # App config, routes, etc.
├── hooks/              # Custom React hooks (future)
├── services/           # API services (future)
├── styles/             # Global styles
│   └── index.css       # Tailwind CSS and custom styles
└── App.tsx             # Main application component
```

## 🎯 Coding Standards

### 1. **File Naming Convention**
- **Components**: PascalCase (e.g., `ProductCard.tsx`)
- **Utilities**: camelCase (e.g., `formatCurrency.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS`)
- **Types**: PascalCase (e.g., `Product`, `Store`)

### 2. **Component Structure**
```tsx
// 1. Imports (external libraries first, then internal)
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils';

// 2. Types/Interfaces
interface ComponentProps {
  title: string;
  onAction: () => void;
}

// 3. Component definition
export const ComponentName: React.FC<ComponentProps> = ({ title, onAction }) => {
  // 4. Hooks
  const { t } = useTranslation();
  
  // 5. Event handlers
  const handleClick = () => {
    onAction();
  };
  
  // 6. Render
  return (
    <div className="component-container">
      <h1>{title}</h1>
      <Button onClick={handleClick}>Action</Button>
    </div>
  );
};
```

### 3. **Data Management**
- **Centralized Data**: All data is stored in `src/data/` files
- **Type Safety**: Use TypeScript interfaces for all data structures
- **Helper Functions**: Export utility functions for data manipulation
- **No Duplication**: Avoid repeating data across components

### 4. **State Management**
- **Local State**: Use `useState` for component-specific state
- **Global State**: Use React Context for shared state (future)
- **Form State**: Use controlled components with local state
- **API State**: Use React Query for server state (future)

### 5. **Styling Guidelines**
- **Tailwind CSS**: Primary styling approach
- **Responsive Design**: Mobile-first approach with breakpoints
- **Custom CSS**: Only when Tailwind utilities are insufficient
- **CSS Variables**: Use CSS custom properties for theming

### 6. **Performance Best Practices**
- **Memoization**: Use `React.memo` for expensive components
- **Lazy Loading**: Implement code splitting for large components
- **Image Optimization**: Use proper image dimensions and formats
- **Bundle Size**: Keep dependencies minimal and tree-shakeable

## 🔧 Development Workflow

### 1. **Adding New Features**
1. **Plan**: Define requirements and data structure
2. **Types**: Add TypeScript interfaces in `src/types/`
3. **Data**: Create or update data files in `src/data/`
4. **Components**: Build UI components in `src/components/`
5. **Pages**: Create page components in `src/pages/`
6. **Routes**: Add routing in `src/App.tsx`
7. **Test**: Verify functionality and responsiveness

### 2. **Modifying Existing Features**
1. **Locate**: Find the relevant data file and component
2. **Update**: Modify data structure and component logic
3. **Test**: Ensure changes work across all screen sizes
4. **Document**: Update this guide if needed

### 3. **Data Updates**
- **Categories**: Edit `src/data/categories.ts`
- **Products**: Edit `src/data/products.ts`
- **Stores**: Edit `src/data/stores.ts`
- **Images**: Update Unsplash URLs with proper dimensions

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
.sm: 640px   /* Small devices */
.md: 768px   /* Medium devices */
.lg: 1024px  /* Large devices */
.xl: 1280px  /* Extra large devices */
```

### Responsive Classes
```tsx
// Example responsive grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* Content */}
</div>

// Example responsive text
<h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
  Responsive Title
</h1>
```

## 🎨 UI Component Guidelines

### 1. **Shadcn UI Components**
- Use existing Shadcn components when possible
- Extend with custom variants when needed
- Maintain consistent spacing and sizing

### 2. **Custom Components**
- Create reusable components for repeated patterns
- Use consistent prop interfaces
- Include proper TypeScript types

### 3. **Accessibility**
- Include `aria-label` for interactive elements
- Use semantic HTML elements
- Ensure keyboard navigation works
- Provide alt text for images

## 🚀 Future Enhancements

### 1. **Authentication System**
- User registration and login
- Role-based access control
- JWT token management

### 2. **API Integration**
- Replace synthetic data with real API calls
- Implement error handling and loading states
- Add data caching and optimization

### 3. **State Management**
- Implement React Context for global state
- Add Redux Toolkit for complex state
- Implement React Query for server state

### 4. **Performance**
- Add lazy loading for routes
- Implement virtual scrolling for large lists
- Add service worker for offline support

## 🐛 Troubleshooting

### Common Issues
1. **Type Errors**: Check TypeScript interfaces and prop types
2. **Styling Issues**: Verify Tailwind classes and CSS specificity
3. **Responsive Problems**: Test on different screen sizes
4. **Data Issues**: Check data files and component props

### Debug Tools
- React Developer Tools
- Tailwind CSS IntelliSense
- TypeScript language server
- Browser developer tools

## 📚 Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com/)
- [React Router](https://reactrouter.com/)

## 🤝 Contributing

1. **Follow** the coding standards outlined above
2. **Test** changes on multiple screen sizes
3. **Document** any new patterns or conventions
4. **Update** this guide when adding new features
5. **Maintain** code quality and readability

---

**Remember**: This is a demo version. When transitioning to production:
- Replace synthetic data with real API calls
- Implement proper error handling
- Add comprehensive testing
- Optimize for performance
- Implement security measures
