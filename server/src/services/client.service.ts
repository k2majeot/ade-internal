import { getPool } from "@/db";
import type {
  Client,
  ClientData,
  ClientList,
  SerialId,
} from "@shared/validation";
import type { ServiceResponse } from "@/types/server.types";
import { createSuccess, createFail } from "@/utils/service.util";
import { Status } from "@shared/types";

export async function getClientService(
  id: SerialId
): Promise<ServiceResponse<Client>> {
  const pool = await getPool();
  const result = await pool.query(
    `SELECT id, fname, lname, side, status FROM clients WHERE id = $1`,
    [id]
  );
  const client = result.rows[0];
  if (!client) {
    return createFail({ status: 404, message: "Client not found" });
  }
  return createSuccess({ data: client });
}

export async function getClientsService(): Promise<
  ServiceResponse<ClientList>
> {
  const pool = await getPool();
  const result = await pool.query(
    `SELECT id, fname, lname, side, status FROM clients`
  );
  const clientList: ClientList = result.rows ?? [];
  return createSuccess({ data: clientList });
}

export async function updateClientService(
  id: SerialId,
  { fname, lname, side, status }: ClientData
): Promise<ServiceResponse<undefined>> {
  const pool = await getPool();
  const result = await pool.query(
    `UPDATE clients SET fname = $1, lname = $2, side = $3, status = $4 WHERE id = $5`,
    [fname, lname, side, status, id]
  );
  if (result.rowCount === 0) {
    return createFail({ status: 404, message: "Client not found" });
  }
  return createSuccess({ status: 204 });
}

export async function deactivateClientsService(
  ids: SerialId[]
): Promise<ServiceResponse<undefined>> {
  const pool = await getPool();
  const result = await pool.query(
    `UPDATE clients SET status = $1 WHERE id = ANY($2)`,
    [Status.Deactivated, ids]
  );
  if (result.rowCount === 0) {
    return createFail({
      status: 404,
      message: "No clients found to deactivate",
    });
  }
  if (result.rowCount < ids.length) {
    return createFail({
      status: 207,
      message: "Some clients were not found to deactivate",
    });
  }
  return createSuccess({ status: 204 });
}

export async function deleteClientsService(
  ids: SerialId[]
): Promise<ServiceResponse<undefined>> {
  const pool = await getPool();
  const result = await pool.query(`DELETE FROM clients WHERE id = ANY($1)`, [
    ids,
  ]);
  if (result.rowCount === 0) {
    return createFail({ status: 404, message: "No clients found to delete" });
  }
  if (result.rowCount < ids.length) {
    return createFail({
      status: 207,
      message: "Some clients were not found to delete",
    });
  }
  return createSuccess({ status: 204 });
}

export async function createClientService({
  fname,
  lname,
  side,
  status,
}: ClientData): Promise<ServiceResponse<undefined>> {
  const pool = await getPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const insertClientResult = await client.query(
      `INSERT INTO clients (fname, lname, side, status)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [fname, lname, side, status]
    );
    const cid = insertClientResult.rows[0]?.id;
    if (!cid) {
      throw new Error("Failed to retrieve new client ID.");
    }
    await client.query(
      `INSERT INTO client_roster (cid, start_date)
       VALUES ($1, CURRENT_DATE)`,
      [cid]
    );
    await client.query("COMMIT");
    return createSuccess({ status: 201 });
  } catch {
    await client.query("ROLLBACK");
    return createFail({
      status: 500,
      message: "Failed to create client and roster",
    });
  } finally {
    client.release();
  }
}
