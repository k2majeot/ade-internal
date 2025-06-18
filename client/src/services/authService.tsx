import type { Credentials, UserData } from "@shared/validation";

export async function loginService(creds: Credentials): Promise<Response> {
  return await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(creds),
  });
}

export async function registerService(userData: UserData): Promise<Response> {
  return await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
}
