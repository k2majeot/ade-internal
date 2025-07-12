import { fetchHandler } from "@/lib/fetchHandler";
import type {
  SerialId,
  Client,
  ClientData,
  ClientList,
} from "@shared/validation";
import {
  serialIdSchema,
  serialIdListSchema,
  clientSchema,
  clientListSchema,
} from "@shared/validation";
import {
  getClientService,
  getClientsService,
  updateClientService,
  deactivateClientsService,
  deleteClientsService,
  createClientService,
} from "@/services/clientService";
import type { ApiResult } from "@/types/apiTypes";

export async function getClient(id: SerialId): Promise<ApiResult<Client>> {
  return await fetchHandler({
    service: getClientService,
    outputSchema: clientSchema,
    payload: { params: { id } },
    payloadSchemas: { params: serialIdSchema },
  });
}

export async function getClients(): Promise<ApiResult<ClientList>> {
  return await fetchHandler({
    service: getClientsService,
    outputSchema: clientListSchema,
  });
}

export async function updateClient(
  id: SerialId,
  clientData: ClientData
): Promise<ApiResult<undefined>> {
  return await fetchHandler({
    service: updateClientService,
    payload: { params: { id }, body: clientData },
    payloadSchemas: { params: serialIdSchema, body: clientSchema },
  });
}

export async function deactivateClients(
  ids: SerialId[]
): Promise<ApiResult<undefined>> {
  const result = await fetchHandler({
    service: deactivateClientsService,
    payload: { body: { ids } },
    payloadSchemas: { body: serialIdListSchema },
  });
  return result;
}

export async function deleteClients(
  ids: SerialIdList
): Promise<ApiResult<undefined>> {
  const result = await fetchHandler({
    service: deleteClientsService,
    payload: { body: ids },
    payloadSchemas: { body: serialIdListSchema },
  });
  return result;
}

export async function createClient(
  clientData: ClientData
): Promise<ApiResult<undefined>> {
  return await fetchHandler({
    service: createClientService,
    payload: { body: clientData },
    payloadSchemas: { body: clientSchema },
  });
}
