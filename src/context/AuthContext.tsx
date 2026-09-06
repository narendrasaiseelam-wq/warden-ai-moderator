'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'Trust & Safety Lead' | 'Community Moderator' | 'Security Engineer' | 'Creator Co-Pilot' | string;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface StoredAccount extends UserProfile {
  passwordHash: string;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, pass: string, role?: string) => Promise<{ success: boolean; message?: string }>;
  loginWithGoogle: () => void;
  loginAsDemoLead: () => void;
  loginAsDemoModerator: () => void;
  logout: () => void;
  isLoading: boolean;
}

const GOOGLE_DEMO_USER: UserProfile = {
  id: 'usr-google-creator',
  name: 'Demo Creator',
  email: 'creator@warden.ai',
  role: 'Creator Co-Pilot',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
};

const DEMO_LEAD_USER: UserProfile = {
  id: 'usr-lead-101',
  name: 'Alex Warden',
  email: 'alex.warden@trustsafety.io',
  role: 'Trust & Safety Lead',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};

const DEMO_MODERATOR_USER: UserProfile = {
  id: 'usr-mod-102',
  name: 'Sarah Chen',
  email: 'sarah.chen@trustsafety.io',
  role: 'Community Moderator',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedSession = localStorage.getItem('warden_current_user') || localStorage.getItem('warden_user_session');
      const isLoggedOut = localStorage.getItem('warden_logged_out') === 'true';

      if (storedSession) {
        setUser(JSON.parse(storedSession));
      } else if (isLoggedOut) {
        setUser(null);
      } else {
        // Default demo session for first-time visitors
        setUser(GOOGLE_DEMO_USER);
        localStorage.setItem('warden_current_user', JSON.stringify(GOOGLE_DEMO_USER));
      }
    } catch (e) {
      setUser(GOOGLE_DEMO_USER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveUserSession = (profile: UserProfile) => {
    setUser(profile);
    localStorage.removeItem('warden_logged_out');
    localStorage.setItem('warden_current_user', JSON.stringify(profile));
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const storedUsersRaw = localStorage.getItem('warden_users') || localStorage.getItem('warden_registered_users');
      const registeredUsers: StoredAccount[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      const match = registeredUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === pass
      );

      if (match) {
        const profile: UserProfile = {
          id: match.id,
          name: match.name,
          email: match.email,
          role: match.role || 'Creator Co-Pilot',
          avatarUrl: match.avatarUrl
        };
        saveUserSession(profile);
        return { success: true };
      }

      if (email.toLowerCase() === GOOGLE_DEMO_USER.email.toLowerCase()) {
        loginWithGoogle();
        return { success: true };
      }
      if (email.toLowerCase() === DEMO_LEAD_USER.email.toLowerCase()) {
        loginAsDemoLead();
        return { success: true };
      }
      if (email.toLowerCase() === DEMO_MODERATOR_USER.email.toLowerCase()) {
        loginAsDemoModerator();
        return { success: true };
      }

      // Allow fallback login for any user credential
      const fallbackUser: UserProfile = {
        id: `usr-${Date.now().toString(36)}`,
        name: email.split('@')[0].replace('.', ' ') || 'Demo User',
        email,
        role: 'Creator Co-Pilot',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      };
      saveUserSession(fallbackUser);
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const register = async (
    name: string,
    email: string,
    pass: string,
    role?: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const storedUsersRaw = localStorage.getItem('warden_users') || localStorage.getItem('warden_registered_users');
      const registeredUsers: StoredAccount[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      if (registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: 'An account with this email address already exists.' };
      }

      const newAccount: StoredAccount = {
        id: `usr-${Date.now().toString(36)}`,
        name,
        email,
        role: role || 'Creator Co-Pilot',
        passwordHash: pass,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      };

      registeredUsers.push(newAccount);
      localStorage.setItem('warden_users', JSON.stringify(registeredUsers));

      const profile: UserProfile = {
        id: newAccount.id,
        name: newAccount.name,
        email: newAccount.email,
        role: newAccount.role,
        avatarUrl: newAccount.avatarUrl
      };

      saveUserSession(profile);
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const loginWithGoogle = () => {
    saveUserSession(GOOGLE_DEMO_USER);
  };

  const loginAsDemoLead = () => {
    saveUserSession(DEMO_LEAD_USER);
  };

  const loginAsDemoModerator = () => {
    saveUserSession(DEMO_MODERATOR_USER);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('warden_current_user');
    localStorage.removeItem('warden_user_session');
    localStorage.setItem('warden_logged_out', 'true');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogle, loginAsDemoLead, loginAsDemoModerator, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
