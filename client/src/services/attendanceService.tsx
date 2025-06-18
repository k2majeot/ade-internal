import type { AttendanceQuery } from "@shared/validation";

export async function getAttendanceService({
  date,
}: AttendanceQuery): Promise<Response> {
  const params = new URLSearchParams();
  if (date) params.append("date", date);

  return fetch(`/api/attendance?${params.toString()}`);
}

export async function upsertAttendanceService(
  list: AttendanceList
): Promise<Response> {
  return await fetch("/api/attendance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(list),
  });
}
