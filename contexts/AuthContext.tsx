import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ data: { session: Session | null }; error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error fetching session:', error);
        }
        if (isMounted) {
          setSession(data.session ?? null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const checkAdminStatus = async (user: User | null) => {
      if (!user) {
        if (isMounted) {
          setIsAdmin(false);
        }
        return;
      }

      setAdminLoading(true);
      try {
        const { data, error } = await supabase
          .from('admins')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking admin status:', error);
        }

        if (isMounted) {
          setIsAdmin(!!data);
        }
      } finally {
        if (isMounted) {
          setAdminLoading(false);
        }
      }
    };

    checkAdminStatus(session?.user ?? null);

    return () => {
      isMounted = false;
    };
  }, [session?.user]);

  const signIn = (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password });

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = useMemo<AuthContextValue>(() => ({
    user: session?.user ?? null,
    loading: loading || adminLoading,
    isAdmin,
    signIn,
    signOut,
  }), [session?.user, loading, adminLoading, isAdmin]);

  return (
    <AuthContext.Provider value={value}>
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
