import { useUser } from "@/context/UserContext";
import { useEffect } from "react";

export function useAuthRedirect() {
  const { setUser } = useUser();

  useEffect(() => {
    function handle() {
      setUser(null);
    }

    window.addEventListener("unauthorized", handle);
    return () => window.removeEventListener("unauthorized", handle);
  }, []);
}
