// Static admin authentication utility
// This provides a simple way to authenticate admin users based on a static email

export const ADMIN_CONFIG = {
  // Static admin email - this should be provided by the system administrator
  ADMIN_EMAIL: 'admin@wenzetiindaku.com',
  // You can add more admin emails here if needed
  ADMIN_EMAILS: ['admin@wenzetiindaku.com', 'superadmin@wenzetiindaku.com']
} as const;

export interface AdminUser {
  email: string;
  name: string;
  role: 'admin' | 'superadmin';
  permissions: string[];
}

// Mock admin user data - in a real app, this would come from a database
const ADMIN_USERS: Record<string, AdminUser> = {
  'admin@wenzetiindaku.com': {
    email: 'admin@wenzetiindaku.com',
    name: 'System Administrator',
    role: 'admin',
    permissions: ['manage_vendors', 'manage_products', 'view_analytics', 'manage_disputes']
  },
  'superadmin@wenzetiindaku.com': {
    email: 'superadmin@wenzetiindaku.com',
    name: 'Super Administrator',
    role: 'superadmin',
    permissions: ['*'] // All permissions
  }
};

/**
 * Check if an email is a valid admin email
 */
export const isAdminEmail = (email: string): boolean => {
  return ADMIN_CONFIG.ADMIN_EMAILS.includes(email.toLowerCase());
};

/**
 * Get admin user data by email
 */
export const getAdminUser = (email: string): AdminUser | null => {
  const normalizedEmail = email.toLowerCase();
  return ADMIN_USERS[normalizedEmail] || null;
};

/**
 * Authenticate admin user - in a real app, this would verify credentials
 * For now, we just check if the email is in our admin list
 */
export const authenticateAdmin = (email: string, password?: string): AdminUser | null => {
  if (!isAdminEmail(email)) {
    return null;
  }
  
  // In a real application, you would verify the password here
  // For now, we just return the admin user if the email is valid
  return getAdminUser(email);
};

/**
 * Check if admin has specific permission
 */
export const hasAdminPermission = (admin: AdminUser, permission: string): boolean => {
  return admin.permissions.includes('*') || admin.permissions.includes(permission);
};

/**
 * Get admin session from localStorage
 */
export const getAdminSession = (): AdminUser | null => {
  try {
    const sessionData = localStorage.getItem('admin_session');
    if (!sessionData) return null;
    
    const session = JSON.parse(sessionData);
    const admin = getAdminUser(session.email);
    
    // Verify the session is still valid
    if (admin && isAdminEmail(session.email)) {
      return admin;
    }
    
    // Clear invalid session
    clearAdminSession();
    return null;
  } catch (error) {
    console.error('Error getting admin session:', error);
    clearAdminSession();
    return null;
  }
};

/**
 * Set admin session in localStorage
 */
export const setAdminSession = (admin: AdminUser): void => {
  try {
    const sessionData = {
      email: admin.email,
      timestamp: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    localStorage.setItem('admin_session', JSON.stringify(sessionData));
  } catch (error) {
    console.error('Error setting admin session:', error);
  }
};

/**
 * Clear admin session from localStorage
 */
export const clearAdminSession = (): void => {
  try {
    localStorage.removeItem('admin_session');
  } catch (error) {
    console.error('Error clearing admin session:', error);
  }
};

/**
 * Check if admin session is expired
 */
export const isAdminSessionExpired = (): boolean => {
  try {
    const sessionData = localStorage.getItem('admin_session');
    if (!sessionData) return true;
    
    const session = JSON.parse(sessionData);
    return Date.now() > session.expiresAt;
  } catch (error) {
    console.error('Error checking session expiry:', error);
    return true;
  }
};
