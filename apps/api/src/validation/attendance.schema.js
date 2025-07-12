import { z } from "zod";
import {
  dateVal,
  textQueryVal,
  serialIdVal,
} from "../../../shared/validators.js";

export const getAttendanceSchema = z.object({
  date: textQueryVal,
  name: textQueryVal.optional(),
});

export const upsertAttendanceSchema = z.object({
  id: serialIdVal,
  attendance_date: dateVal,
  attendance_status: z.string(),
});

export const upsertAttendanceArraySchema = z.array(upsertAttendanceSchema);
