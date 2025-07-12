import type { RequestPayload } from "@/lib/fetchHandler";
import type {
  Credentials,
  CompleteChallenge,
  UserData,
} from "@shared/validation";

export async function loginService({
  body,
}: RequestPayload<Credentials>): Promise<Response> {
  return await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function logoutService(): Promise<Response> {
  return fetch("/api/auth/logout", {
    method: "POST",
  });
}

export async function completeChallengeService({
  body,
}: RequestPayload<CompleteChallenge>): Promise<Response> {
  return await fetch("/api/auth/challenge", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function registerService({
  body,
}: RequestPayload<UserData>): Promise<Response> {
  return await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function getSessionUserService(): Promise<Response> {
  return fetch("/api/auth/me");
}

export async function resetPasswordService({
  body,
}: RequestPayload<Username>): Promise<Response> {
  return await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
