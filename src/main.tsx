// Import React DOM's createRoot function for React 18+ concurrent rendering
import { createRoot } from 'react-dom/client'
// Import the main App component that contains all routes and providers
import App from './App.tsx'
// Import global CSS styles including Tailwind CSS and custom design system
import './index.css'

// Create a React root and render the App component
// Uses the non-null assertion operator (!) since we know the root element exists
// This is the entry point of the React application
createRoot(document.getElementById("root")!).render(<App />);
