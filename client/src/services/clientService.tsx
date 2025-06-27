import type { RequestPayload } from "@/lib/fetchHandler";
import type { ClientData, Client } from "@shared/validation";
import type { SerialId } from "@/types/apiTypes";

export async function getClientService({
  params: { id },
}: RequestPayload<undefined, undefined, { id: SerialId }>): Promise<Response> {
  return fetch(`/api/client/${id}`);
}

export async function getClientsService(): Promise<Response> {
  return fetch("/api/clients");
}

export async function updateClientService({
  params: { id },
  body,
}: RequestPayload<ClientData, undefined, { id: SerialId }>): Promise<Response> {
  return fetch(`/api/client/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function createClientService({
  body,
}: RequestPayload<ClientData>): Promise<Response> {
  return fetch("/api/client", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
