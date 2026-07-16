import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as api from './api';

const AuthContext = createContext(undefined);
const STORAGE_KEY = 'examforge_profile';

function normalizeProfile(user, role) {
  return {
    id: user.id,
    full_name: user.name,
    email: user.email,
    role,
  };
}

export function AuthProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the "session" (just the logged-in profile) from localStorage on
  // first load, since the Spring Boot backend has no session/JWT of its own.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProfile(JSON.parse(raw));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setLoading(false);
  }, []);

  function persist(nextProfile) {
    setProfile(nextProfile);
    if (nextProfile) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProfile));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  async function signUp(email, password, fullName, role) {
    try {
      const user =
        role === 'admin'
          ? await api.registerAdmin({ name: fullName, email, password })
          : await api.registerStudent({ name: fullName, email, password });
      persist(normalizeProfile(user, role));
      return { error: null };
    } catch (err) {
      return { error: err.message };
    }
  }

  async function signIn(email, password, role) {
    try {
      const user =
        role === 'admin'
          ? await api.loginAdmin({ email, password })
          : await api.loginStudent({ email, password });
      persist(normalizeProfile(user, role));
      return { error: null };
    } catch (err) {
      return { error: err.message };
    }
  }

  async function signOut() {
    persist(null);
  }

  return (
    <AuthContext.Provider
      value={{ session: profile, profile, loading, signUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
