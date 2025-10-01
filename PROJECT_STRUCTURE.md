# 🏗️ Project Structure Overview - WENZE TII NDAKU

## 📁 Complete Directory Structure and Overview

```
WENZE-TII-NDAKU/
├── 📁 src/                          # Source code directory
│   ├── 📁 components/               # Reusable UI components
│   │   ├── 📁 ui/                   # Shadcn UI components
│   │   │   ├── button.tsx          # Button component
│   │   │   ├── input.tsx           # Input component
│   │   │   ├── card.tsx            # Card component
│   │   │   ├── dropdown-menu.tsx   # Dropdown menu
│   │   │   ├── sheet.tsx           # Sheet/modal component
│   │   │   ├── label.tsx           # Form label
│   │   │   ├── toaster.tsx         # Toast notifications
│   │   │   ├── tooltip-provider.tsx # Tooltip wrapper
│   │   │   ├── select.tsx          # Select dropdown
│   │   │   └── ...                 # Other UI components
│   │   ├── Header.tsx              # Main navigation header
│   │   ├── Footer.tsx              # Site footer
│   │   ├── CategoryCard.tsx        # Category display card
│   │   └── ProductCard.tsx         # Product display card
│   │
│   ├── 📁 pages/                   # Page components
│   │   ├── Index.tsx               # Home/landing page
│   │   ├── Category.tsx            # Individual category page
│   │   ├── Stores.tsx              # Stores listing page
│   │   ├── Store.tsx               # Individual store page
│   │   ├── ProductDetail.tsx       # Product detail page
│   │   ├── Cart.tsx                # Shopping cart page
│   │   ├── Checkout.tsx            # Checkout process page
│   │   ├── Profile.tsx             # User profile page
│   │   └── NotFound.tsx            # 404 error page
│   │
│   ├── 📁 data/                    # Centralized data files
│   │   ├── categories.ts           # Category data and functions
│   │   ├── products.ts             # Product data and functions
│   │   └── stores.ts               # Store data and functions
│   │
│   ├── 📁 types/                   # TypeScript type definitions
│   │   └── index.ts                # All interfaces and types
│   │
│   ├── 📁 utils/                   # Utility functions
│   │   └── index.ts                # Common utility functions
│   │
│   ├── 📁 constants/               # Application constants
│   │   └── index.ts                # App config, routes, etc.
│   │
│   ├── 📁 hooks/                   # Custom React hooks (future)
│   │   └── README.md               # Hooks documentation
│   │
│   ├── 📁 services/                # API services (future)
│   │   └── README.md               # Services documentation
│   │
│   ├── 📁 styles/                  # Global styles
│   │   └── index.css               # Tailwind CSS and custom styles
│   │
│   ├── 📁 assets/                  # Static assets
│   │   ├── images/                 # Image files
│   │   ├── icons/                  # Icon files
│   │   └── hero-marketplace.jpg    # Hero background image
│   │
│   ├── App.tsx                     # Main application component
│   ├── main.tsx                    # Application entry point
│   └── index.css                   # Global CSS imports
│
├── 📁 public/                      # Public static files
│   ├── favicon.ico                 # Site favicon
│   ├── marketplace.jpeg           # Main marketplace logo
│   └── ...                         # Other public assets
│
├── 📁 node_modules/                # Dependencies (auto-generated)
├── 📁 dist/                        # Build output (auto-generated)
│
├── 📄 package.json                 # Project dependencies and scripts
├── 📄 package-lock.json            # Locked dependency versions
├── 📄 bun.lockb                    # Bun lock file
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 tsconfig.app.json            # App-specific TS config
├── 📄 tsconfig.node.json           # Node-specific TS config
├── 📄 vite.config.ts               # Vite build configuration
├── 📄 tailwind.config.ts           # Tailwind CSS configuration
├── 📄 postcss.config.js            # PostCSS configuration
├── 📄 eslint.config.js             # ESLint configuration
├── 📄 components.json              # Shadcn UI configuration
├── 📄 index.html                   # Main HTML template
├── 📄 README.md                    # Project overview
├── 📄 DEVELOPMENT.md               # Development guide
├── 📄 PROJECT_STRUCTURE.md         # This file
└── 📄 .gitignore                   # Git ignore rules
```

## 🔧 Key Configuration Files

### **Package Management**
- `package.json` - Dependencies, scripts, and project metadata
- `bun.lockb` - Bun package manager lock file
- `package-lock.json` - NPM lock file (alternative)

### **Build Configuration**
- `vite.config.ts` - Vite bundler configuration
- `tsconfig.json` - TypeScript compiler settings
- `tailwind.config.ts` - Tailwind CSS customization
- `postcss.config.js` - CSS processing pipeline

### **Code Quality**
- `eslint.config.js` - JavaScript/TypeScript linting rules
- `components.json` - Shadcn UI component configuration

## 📱 Component Architecture

### **Component Hierarchy**
```
App.tsx (Router)
├── Header.tsx (Navigation)
├── Page Components
│   ├── Index.tsx (Home)
│   ├── Category.tsx (Category View)
│   ├── Stores.tsx (Store Listing)
│   ├── Store.tsx (Store Detail)
│   └── ... (Other Pages)
├── Footer.tsx (Site Footer)
└── UI Components
    ├── CategoryCard.tsx
    ├── ProductCard.tsx
    └── Shadcn UI Components
```

### **Data Flow**
```
Data Files (src/data/)
    ↓
Page Components (src/pages/)
    ↓
UI Components (src/components/)
    ↓
User Interface
```

## 🎨 Styling Architecture

### **CSS Framework Stack**
1. **Tailwind CSS** - Utility-first CSS framework
2. **CSS Custom Properties** - Theme variables
3. **Custom CSS** - Component-specific styles
4. **Responsive Design** - Mobile-first approach

### **Breakpoint System**
```css
/* Mobile First */
.sm: 640px   /* Small tablets */
.md: 768px   /* Tablets */
.lg: 1024px  /* Laptops */
.xl: 1280px  /* Desktops */
.2xl: 1536px /* Large screens */
```

## 🔄 State Management

### **Current Implementation**
- **Local State**: `useState` for component-specific data
- **Props**: Data passed down component tree
- **Context**: Ready for future global state needs

### **Future Enhancements**
- **React Context**: For shared application state
- **React Query**: For server state management
- **Redux Toolkit**: For complex state logic

## 📊 Data Management

### **Data Structure**
```
src/data/
├── categories.ts     # Category definitions
├── products.ts       # Product catalog
└── stores.ts         # Vendor/store information
```

### **Data Functions**
- **Getters**: Retrieve specific data subsets
- **Filters**: Search and filter data
- **Sorters**: Organize data by criteria
- **Validators**: Ensure data integrity

## 🚀 Development Workflow

### **File Creation Process**
1. **Types**: Define interfaces in `src/types/`
2. **Data**: Create data files in `src/data/`
3. **Components**: Build UI in `src/components/`
4. **Pages**: Create pages in `src/pages/`
5. **Routes**: Add routing in `App.tsx`
6. **Styling**: Apply Tailwind classes
7. **Testing**: Verify functionality

### **Code Organization Rules**
- **Single Responsibility**: Each file has one clear purpose
- **Import Order**: External → Internal → Relative
- **Naming Convention**: Consistent file and variable naming
- **Type Safety**: Full TypeScript implementation

## 🔍 File Naming Conventions

### **Components**
- **PascalCase**: `ProductCard.tsx`, `Header.tsx`
- **Descriptive**: Clear, purpose-indicating names
- **Consistent**: Similar components use similar patterns

### **Utilities**
- **camelCase**: `formatCurrency.ts`, `generateId.ts`
- **Action-oriented**: Function names describe what they do
- **Generic**: Reusable across the application

### **Constants**
- **UPPER_SNAKE_CASE**: `API_ENDPOINTS`, `ROUTES`
- **Grouped**: Related constants in single files
- **Documented**: Clear descriptions of each constant

## 📚 Documentation Files

### **Developer Guides**
- `README.md` - Project overview and setup
- `DEVELOPMENT.md` - Coding standards and workflow
- `PROJECT_STRUCTURE.md` - This detailed structure guide

### **Future Documentation**
- **API Documentation**: When backend is implemented
- **Component Library**: UI component documentation
- **Testing Guide**: Unit and integration testing
- **Deployment Guide**: Production deployment steps

## 🎯 Key Benefits of This Structure

### **Maintainability**
- **Centralized Data**: Easy to update and manage
- **Clear Separation**: Components, data, and logic are separated
- **Consistent Patterns**: Similar functionality follows same structure

### **Scalability**
- **Modular Design**: Easy to add new features
- **Type Safety**: TypeScript prevents common errors
- **Component Reusability**: Shared components reduce duplication

### **Developer Experience**
- **Clear File Locations**: Easy to find what you need
- **Standardized Patterns**: Consistent coding approach
- **Comprehensive Documentation**: Clear guidance for development

## 🚧 Future Expansion Areas

### **Immediate Additions**
- **Authentication Pages**: Login/register components
- **User Dashboard**: Profile and settings management
- **Admin Panel**: Store and user management

### **Long-term Enhancements**
- **API Integration**: Replace synthetic data
- **Real-time Features**: Chat, notifications
- **Advanced Search**: Filters, sorting, pagination
- **Mobile App**: React Native implementation

---

**Remember**: This structure is designed for **easy maintenance** and **future growth**. When adding new features, follow the established patterns and update documentation accordingly.
