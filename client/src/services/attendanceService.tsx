import type { RequestPayload } from "@/lib/fetchHandler";
import type { AttendanceQuery, AttendanceList } from "@shared/validation";

export async function getAttendanceService({
  query,
}: RequestPayload<undefined, AttendanceQuery>): Promise<Response> {
  const params = new URLSearchParams(query);

  return fetch(`/api/attendance?${params.toString()}`);
}

export async function upsertAttendanceService({
  body,
}: RequestPayload<AttendanceList>): Promise<Response> {
  return await fetch("/api/attendance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
