import { fetchWithResponse, fetchNoResponse } from "@/lib/validation";
import {
  type AttendanceQuery,
  attendanceQuerySchema,
  type AttendanceList,
  attendanceListSchema,
  type AttendanceUpsert,
  attendanceUpsertSchema,
} from "@shared/validation";
import {
  getAttendanceService,
  upsertAttendanceService,
} from "@/services/attendanceService";

export async function getAttendance(
  query: AttendanceQuery
): Promise<ApiResult<AttendanceList>> {
  const result: ApiResult<AttendanceList> = fetchWithResponse(
    getAttendanceService,
    query,
    attendanceQuerySchema,
    attendanceListSchema
  );
  return result;
}

export async function upsertAttendance(
  list: AttendanceUpsert
): Promise<ApiResult<undefined>> {
  const result: ApiResult<undefined> = fetchNoResponse(
    upsertAttendanceService,
    list,
    attendanceUpsertSchema
  );
  return result;
}
