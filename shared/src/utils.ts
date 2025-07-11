import { Role, RoleDetails } from "./generated/lookup.types";

export function isChallenge(data: unknown): data is Challenge {
  return (
    typeof data === "object" &&
    data !== null &&
    "challenge" in data &&
    typeof (data as any).challenge === "string" &&
    "session" in data &&
    typeof (data as any).session === "string"
  );
}

export function hasRequiredRole(userRole: Role, requiredRole: Role): boolean {
  return RoleDetails[userRole].level >= RoleDetails[requiredRole].level;
}
