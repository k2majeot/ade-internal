import { getPool } from "@/db";
import type { Contact } from "@shared/validation";
import type { ServiceResponse } from "@/types/server.types";
import { createSuccess, createFail } from "@/utils/service.util";

export async function submitContactService({
  fname,
  lname,
  email,
  phone,
  message,
}: Contact): Promise<ServiceResponse<undefined>> {
  const pool = await getPool();

  const query = `
    INSERT INTO contact (fname, lname, email, phone, message)
    VALUES ($1, $2, $3, $4, $5)
  `;

  await pool.query(query, [fname, lname, email, phone, message]);

  return createSuccess({ status: 204 });
}
