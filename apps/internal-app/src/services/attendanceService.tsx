import type { RequestPayload } from "@/lib/fetchHandler";
import type { AttendanceQuery, AttendanceList } from "@shared/validation";

export async function getAttendanceService({
  query,
}: RequestPayload<undefined, AttendanceQuery>): Promise<Response> {
  const params = new URLSearchParams(query);
  return fetch(
    `https://api.adexperiences.com/api/attendance?${params.toString()}`,
    {
      credentials: "include",
    }
  );
}

export async function upsertAttendanceService({
  body,
}: RequestPayload<AttendanceList>): Promise<Response> {
  return await fetch("https://api.adexperiences.com/api/attendance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    credentials: "include",
  });
}
