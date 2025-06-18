import { createContext, useContext, useState } from "react";
import { Role } from "@shared/types";

export const UserContext = createContext<{
  role: Role | null;
  setRole: (role: Role | null) => void;
}>({
  role: null,
  setRole: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);

  return (
    <UserContext.Provider value={{ role, setRole }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
