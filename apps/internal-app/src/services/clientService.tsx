import type { RequestPayload } from "@/lib/fetchHandler";
import type { ClientData, Client } from "@shared/validation";
import type { SerialId } from "@shared/types/apiResult.types";

export async function getClientService({
  params: { id },
}: RequestPayload<undefined, undefined, { id: SerialId }>): Promise<Response> {
  return fetch(`/api/clients/${id}`);
}

export async function getClientsService(): Promise<Response> {
  return fetch("/api/clients");
}

export async function updateClientService({
  params: { id },
  body,
}: RequestPayload<ClientData, undefined, { id: SerialId }>): Promise<Response> {
  return fetch(`/api/clients/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function deactivateClientsService({
  body,
}: RequestPayload<{ ids: SerialId[] }>): Promise<Response> {
  return fetch(`/api/clients/deactivate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function deleteClientsService({
  body,
}: RequestPayload<DeleteClients>): Promise<Response> {
  return fetch(`/api/clients`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function createClientService({
  body,
}: RequestPayload<ClientData>): Promise<Response> {
  return fetch("/api/clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
