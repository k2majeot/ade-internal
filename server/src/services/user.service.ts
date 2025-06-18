import { getPool } from "@/db";
import type { UserData, UserList, SerialId } from "@shared/validation";
import type { ServiceResponse } from "@/types/server.types";
import { createSuccess, createFail } from "@/utils/service.util";

export async function getUsersService(): Promise<ServiceResponse<UserList>> {
  const pool = await getPool();

  let query = `SELECT id, fname, lname, username, role FROM users`;

  const result = await pool.query(query);
  const userList: UserList = result.rows ?? [];

  return createSuccess({ data: userList });
}

export async function updateUserService(
  id: SerialId,
  { username, fname, lname, role }: UserData
): Promise<ServiceResponse<undefined>> {
  const pool = await getPool();

  const result = await pool.query(
    `UPDATE users
   SET username = $1, fname = $2, lname = $3, role = $4
   WHERE id = $5;`,
    [username, fname, lname, role, id]
  );

  if (result.rowCount === 0) {
    return createFail({ status: 404, message: "User not found" });
  }

  return createSuccess({ status: 204 });
}
