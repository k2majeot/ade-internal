import {
  getClientService,
  getClientsService,
  updateClientService,
  createClientService,
  deactivateClientsService,
  deleteClientsService,
} from "@/services/client.service";

import type {
  SerialId,
  Client,
  ClientList,
  ClientData,
  SerialIdList,
} from "@shared/validation";
import type { ServiceResponse } from "@/types/server.types";
import { isServiceSuccess } from "@/utils/controller.util";

export async function getClient(req, res) {
  const { id }: SerialId = req.validatedParams;
  const serviceResponse: ServiceResponse<Client> = await getClientService(id);

  if (!isServiceSuccess(serviceResponse)) {
    return res.fail({
      status: serviceResponse.status,
      errors: serviceResponse.errors,
      message: serviceResponse.message,
    });
  }

  return res.success({
    status: serviceResponse.status,
    data: serviceResponse.data,
    message: serviceResponse.message,
  });
}

export async function getClients(req, res) {
  const serviceResponse: ServiceResponse<ClientList> =
    await getClientsService();

  if (!isServiceSuccess(serviceResponse)) {
    return res.fail({
      status: serviceResponse.status,
      errors: serviceResponse.errors,
      message: serviceResponse.message,
    });
  }

  return res.success({
    status: serviceResponse.status,
    data: serviceResponse.data,
    message: serviceResponse.message,
  });
}

export async function deactivateClients(req, res) {
  const { ids }: SerialIdList = req.validatedBody;

  const serviceResponse: ServiceResponse<undefined> =
    await deactivateClientsService(ids);

  if (!isServiceSuccess(serviceResponse)) {
    return res.fail({
      status: serviceResponse.status,
      errors: serviceResponse.errors,
      message: serviceResponse.message,
    });
  }

  return res.status(serviceResponse.status).end();
}

export async function deleteClients(req, res) {
  const { ids }: SerialIdList = req.validatedBody;

  const serviceResponse: ServiceResponse<undefined> =
    await deleteClientsService(ids);

  if (!isServiceSuccess(serviceResponse)) {
    return res.fail({
      status: serviceResponse.status,
      errors: serviceResponse.errors,
      message: serviceResponse.message,
    });
  }

  return res.status(serviceResponse.status).end();
}

export async function updateClient(req, res) {
  const { id }: SerialId = req.validatedParams;
  const clientData: ClientData = req.validatedBody;
  const serviceResponse: ServiceResponse<undefined> = await updateClientService(
    id,
    clientData
  );

  if (!isServiceSuccess(serviceResponse)) {
    return res.fail({
      status: serviceResponse.status,
      errors: serviceResponse.errors,
      message: serviceResponse.message,
    });
  }

  return res.status(serviceResponse.status).end();
}

export async function createClient(req, res) {
  const clientData: ClientData = req.validatedBody;
  const serviceResponse: ServiceResponse<undefined> = await createClientService(
    clientData
  );

  if (!isServiceSuccess(serviceResponse)) {
    return res.fail({
      status: serviceResponse.status,
      errors: serviceResponse.errors,
      message: serviceResponse.message,
    });
  }

  return res.status(serviceResponse.status).end();
}
