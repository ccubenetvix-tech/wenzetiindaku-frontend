/**
 * Tailwind CSS Configuration
 * 
 * This file configures Tailwind CSS for the WENZE TII NDAKU marketplace.
 * It includes custom color palettes, animations, and design system tokens.
 * 
 * @author WENZE TII NDAKU Team
 * @version 1.0.0
 */

// Import Tailwind CSS configuration types
import type { Config } from "tailwindcss";
// Import tailwindcss-animate plugin for animations
import tailwindcssAnimate from "tailwindcss-animate";

// Export Tailwind CSS configuration
export default {
	// Enable class-based dark mode
	darkMode: ["class"],
	// Define content paths for Tailwind to scan for classes
	content: [
		"./pages/**/*.{ts,tsx}",      // Next.js pages directory
		"./components/**/*.{ts,tsx}", // Components directory
		"./app/**/*.{ts,tsx}",        // App directory
		"./src/**/*.{ts,tsx}",        // Source directory
	],
	// No prefix for utility classes
	prefix: "",
	// Theme configuration with custom design tokens
	theme: {
		// Container configuration for responsive layouts
		container: {
			center: true,              // Center container horizontally
			padding: '2rem',           // Default horizontal padding
			screens: {
				'2xl': '1400px'        // Max width for 2xl screens
			}
		},
		// Extended theme configuration
		extend: {
			// Custom box shadow utilities for premium effects
			boxShadow: {
				'3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',  // Large shadow
				'4xl': '0 45px 80px -12px rgba(0, 0, 0, 0.3)',   // Extra large shadow
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					hover: 'hsl(var(--primary-hover))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					hover: 'hsl(var(--secondary-hover))'
				},
				// Premium Dark Navy Blue palette
				navy: {
					50: 'hsl(231 100% 97%)',
					100: 'hsl(231 100% 94%)',
					200: 'hsl(231 100% 88%)',
					300: 'hsl(231 100% 80%)',
					400: 'hsl(231 100% 70%)',
					500: 'hsl(231 48% 30%)', // Primary Dark Navy
					600: 'hsl(231 48% 25%)', // Deeper Navy
					700: 'hsl(231 48% 20%)', // Deep Navy
					800: 'hsl(231 48% 15%)', // Very Deep Navy
					900: 'hsl(231 48% 10%)', // Darkest Navy
					950: 'hsl(231 48% 5%)',  // Ultra Dark Navy
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				// Premium Rich Orange palette
				orange: {
					50: 'hsl(32 100% 97%)',
					100: 'hsl(32 100% 94%)',
					200: 'hsl(32 100% 88%)',
					300: 'hsl(32 100% 80%)',
					400: 'hsl(32 100% 70%)',
					500: 'hsl(32 100% 50%)', // Primary Rich Orange
					600: 'hsl(24 100% 45%)', // Dark Orange
					700: 'hsl(24 100% 40%)', // Deeper Orange
					800: 'hsl(24 100% 35%)', // Deep Orange
					900: 'hsl(24 100% 30%)', // Very Deep Orange
					950: 'hsl(24 100% 25%)', // Darkest Orange
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
					hover: 'hsl(var(--card-hover))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'gradient-shift': 'gradientShift 15s ease infinite',
				'float': 'float 6s ease-in-out infinite',
				'pulse-glow': 'pulseGlow 2s ease-in-out infinite alternate',
				'loading-dots': 'loadingDots 1.5s infinite'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'gradientShift': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-20px)' }
				},
				'pulseGlow': {
					'from': { 
						boxShadow: '0 0 20px hsl(220 100% 25% / 0.3)' 
					},
					'to': { 
						boxShadow: '0 0 30px hsl(220 100% 25% / 0.6), 0 0 40px hsl(220 100% 25% / 0.4)' 
					}
				},
				'loadingDots': {
					'0%, 20%': { content: '""' },
					'40%': { content: '"."' },
					'60%': { content: '".."' },
					'80%, 100%': { content: '"..."' }
				}
			}
		}
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
