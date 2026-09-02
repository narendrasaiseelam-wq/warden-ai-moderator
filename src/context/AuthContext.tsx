'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'Trust & Safety Lead' | 'Community Moderator' | 'Security Engineer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole | string;
  avatarUrl?: string;
}

export interface StoredAccount extends UserProfile {
  passwordHash: string;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, pass: string, role: UserRole | string) => Promise<{ success: boolean; message?: string }>;
  loginAsDemoLead: () => void;
  loginAsDemoModerator: () => void;
  logout: () => void;
  isLoading: boolean;
}

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
      const storedSession = localStorage.getItem('warden_user_session');
      if (storedSession) {
        setUser(JSON.parse(storedSession));
      } else {
        // Default to active demo session for instant studio access
        setUser(DEMO_LEAD_USER);
        localStorage.setItem('warden_user_session', JSON.stringify(DEMO_LEAD_USER));
      }
    } catch (e) {
      setUser(DEMO_LEAD_USER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const storedUsersRaw = localStorage.getItem('warden_registered_users');
      const registeredUsers: StoredAccount[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      const match = registeredUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === pass
      );

      if (match) {
        const profile: UserProfile = {
          id: match.id,
          name: match.name,
          email: match.email,
          role: match.role,
          avatarUrl: match.avatarUrl
        };
        setUser(profile);
        localStorage.setItem('warden_user_session', JSON.stringify(profile));
        return { success: true };
      }

      // Check if matching demo email or fallback demo login
      if (email.toLowerCase() === DEMO_LEAD_USER.email.toLowerCase()) {
        loginAsDemoLead();
        return { success: true };
      }
      if (email.toLowerCase() === DEMO_MODERATOR_USER.email.toLowerCase()) {
        loginAsDemoModerator();
        return { success: true };
      }

      // Allow login for any valid email format in studio demo mode
      const fallbackUser: UserProfile = {
        id: `usr-${Date.now().toString(36)}`,
        name: email.split('@')[0].replace('.', ' ') || 'Trust Lead',
        email,
        role: 'Trust & Safety Lead',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
      };
      setUser(fallbackUser);
      localStorage.setItem('warden_user_session', JSON.stringify(fallbackUser));
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const register = async (
    name: string,
    email: string,
    pass: string,
    role: UserRole | string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const storedUsersRaw = localStorage.getItem('warden_registered_users');
      const registeredUsers: StoredAccount[] = storedUsersRaw ? JSON.parse(storedUsersRaw) : [];

      if (registeredUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: 'An account with this email address already exists.' };
      }

      const newAccount: StoredAccount = {
        id: `usr-${Date.now().toString(36)}`,
        name,
        email,
        role: role || 'Trust & Safety Lead',
        passwordHash: pass,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      };

      registeredUsers.push(newAccount);
      localStorage.setItem('warden_registered_users', JSON.stringify(registeredUsers));

      const profile: UserProfile = {
        id: newAccount.id,
        name: newAccount.name,
        email: newAccount.email,
        role: newAccount.role,
        avatarUrl: newAccount.avatarUrl
      };

      setUser(profile);
      localStorage.setItem('warden_user_session', JSON.stringify(profile));
      return { success: true };
    } catch (err) {
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const loginAsDemoLead = () => {
    setUser(DEMO_LEAD_USER);
    localStorage.setItem('warden_user_session', JSON.stringify(DEMO_LEAD_USER));
  };

  const loginAsDemoModerator = () => {
    setUser(DEMO_MODERATOR_USER);
    localStorage.setItem('warden_user_session', JSON.stringify(DEMO_MODERATOR_USER));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('warden_user_session');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginAsDemoLead, loginAsDemoModerator, logout, isLoading }}>
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
