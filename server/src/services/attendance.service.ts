import { getPool } from "@/db";
import type {
  AttendanceQuery,
  AttendanceList,
  AttendanceUpsert,
} from "@shared/validation";
import type { ServiceResponse } from "@/types/server.types";
import {
  createSuccess,
  createFail,
  getIdByCode,
} from "@/utils/service.util";

export async function getAttendanceService({
  date,
  side,
}: AttendanceQuery): Promise<ServiceResponse<AttendanceList>> {
  const pool = await getPool();
  const params = [date, await getIdByCode("side", side)];

  const query = `
    SELECT
      clients.id AS cid,
      clients.fname,
      clients.lname,
      attendance_statuses.code AS present
    FROM client_roster
    JOIN clients
      ON clients.id = client_roster.cid
    LEFT JOIN attendance
      ON attendance.cid = client_roster.cid
      AND attendance.attendance_date = $1
    LEFT JOIN attendance_statuses
      ON attendance_statuses.id = attendance.attendance_status_id
    WHERE client_roster.start_date <= $1
      AND (client_roster.end_date IS NULL OR client_roster.end_date >= $1)
      AND clients.side_id = $2
    ORDER BY clients.lname
  `;

  const result = await pool.query(query, params);
  const attendanceList: AttendanceList = result.rows ?? [];

  return createSuccess({ data: attendanceList });
}

export async function upsertAttendanceService(
  list: AttendanceUpsert
): Promise<ServiceResponse<undefined>> {
  const pool = await getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const { cid, attendance_date, present } of list) {
      await client.query(
        `
        INSERT INTO attendance (cid, attendance_date, attendance_status_id)
        VALUES ($1, $2, $3)
        ON CONFLICT (cid, attendance_date)
        DO UPDATE SET attendance_status_id = EXCLUDED.attendance_status_id
        `,
        [cid, attendance_date, await getIdByCode("attendance_status", present)]
      );
    }

    await client.query("COMMIT");
    return createSuccess({ status: 204 });
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
