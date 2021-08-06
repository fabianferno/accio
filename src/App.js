import { useState, useEffect } from "react";
import { supabase } from "./lib/api";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import BaseLayout from "./layouts/BaseLayout";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = supabase.auth.session();
    setUser(session?.user ?? null);

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user;
        setUser(currentUser ?? null);
      }
    );

    return () => {
      authListener?.unsubscribe();
    };
  }, [user]);

  return (
    <div>
      {!user ? (
        <Auth />
      ) : (
        <BaseLayout>
          <Home user={user} />
        </BaseLayout>
      )}
    </div>
  );
}

export default App;
