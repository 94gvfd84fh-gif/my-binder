import { createContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function getCurrentSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!error) {
        setSession(data.session || null);
        setUser(data.session?.user || null);
      }

      setAuthLoading(false);
    }

    getCurrentSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession || null);
      setUser(currentSession?.user || null);
      setAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;