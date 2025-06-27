import type { RequestPayload } from "@/lib/fetchHandler";
import type { UserData, User, SerialId, DeleteUsers } from "@shared/validation";

export async function getUserService({
  params: { id },
}: RequestPayload<undefined, undefined, { id: SerialId }>): Promise<Response> {
  return fetch(`/api/user/${id}`);
}

export async function getUsersService(): Promise<Response> {
  return fetch("/api/users");
}

export async function updateUserService({
  params: { id },
  body,
}: RequestPayload<UserData, undefined, { id: SerialId }>): Promise<Response> {
  return fetch(`/api/user/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function deactivateUsersService({
  body,
}: RequestPayload<{ ids: SerialId[] }>): Promise<Response> {
  return fetch(`/api/users/deactivate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function deleteUsersService({
  body,
}: RequestPayload<DeleteUsers>): Promise<Response> {
  return fetch(`/api/users`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
