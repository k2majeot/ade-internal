import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@shared/validation";
import { getSessionUser } from "@/api/auth";
import type { ApiResponse } from "@/types/apiTypes";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export const UserContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}>({
  user: null,
  setUser: () => {},
  loading: true,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useAuthRedirect();

  useEffect(() => {
    (async () => {
      try {
        const result: ApiResponse<User> = await getSessionUser();
        if (result.success) {
          setUser(result.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Session user fetch failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
