import { z } from "zod";
import { Role, Present } from "./types";
import { format } from "date-fns";

const _ = {
  serialId: z.number().int().positive(),
  date: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof Date) {
      const parsed = new Date(val);
      if (isNaN(parsed.getTime())) return undefined;
      return format(parsed, "yyyy-MM-dd");
    }
    return undefined;
  }, z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  fname: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be 50 characters or fewer"),
  lname: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be 50 characters or fewer"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    )
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter"),
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: "Role is required" }),
  }),
  present: z.nativeEnum(Present),
} as const;

export const serialIdSchema = _.serialId;
export type SerialId = z.infer<typeof serialIdSchema>;

export const credentialsSchema = z.object({
  username: _.username,
  password: _.password,
});
export type Credentials = z.infer<typeof credentialsSchema>;

export const loginResultSchema = z.object({
  role: _.role,
});
export type LoginResult = z.infer<typeof loginResultSchema>;

export const userSchema = z.object({
  id: _.serialId,
  fname: _.fname,
  lname: _.lname,
  username: _.username,
  role: _.role,
});
export type User = z.infer<typeof userSchema>;

export const userDataSchema = userSchema.omit({ id: true });
export type UserData = z.infer<typeof userDataSchema>;

export const userListSchema = z.array(userSchema);
export type UserList = z.infer<typeof userListSchema>;

export const attendanceQuerySchema = z.object({
  date: _.date,
});
export type AttendaneQuery = z.infer<typeof attendanceQuerySchema>;

export const attendanceSchema = z.object({
  cid: _.serialId,
  fname: _.fname,
  lname: _.lname,
  present: _.present.nullable(),
});
export type Attendance = z.infer<typeof attendanceSchema>;

export const attendanceListSchema = z.array(attendanceSchema);
export type AttendanceList = z.infer<typeof attendanceListSchema>;

export const attendanceUpsertSchema = z.array(
  z.object({
    cid: _.serialId,
    attendance_date: _.date,
    present: _.present,
  })
);
export type AttendanceUpsert = z.infer<typeof upsertAttendanceReqSchema>;

export const clientsQuerySchema = z.object({
  name: z.string(),
});
export type ClientsQuery = z.infer<typeof getClientsSchema>;

export const goalsQuerySchema = z.object({
  cid: _.serialId,
  title: z.string().optional(),
});
export type GoalsQuery = z.infer<typeof getGoalsSchema>;

export const goalUpdateSchema = z.object({
  id: _.serialId,
  title: z.string().min(1),
  instructions: z.string().optional(),
  objective: z.string().optional(),
  reinforcer: z.string().optional(),
});
export type GoalUpdate = z.infer<typeof updateGoalSchema>;

export const goalDataQuerySchema = z.object({
  gid: _.serialId,
  date: _.date,
});
export type GoalQuery = z.infer<typeof getGoalDataSchema>;

export const upsertGoalDataSchema = z.object({
  gid: _.serialId,
  date: _.date,
  activity: z.string().min(1),
  prompt_level: z.string().length(2),
  initial: z.string().length(2),
  comments: z.string().optional(),
});
export type UpsertGoalDataReq = z.infer<typeof upsertGoalDataSchema>;

export const getUsersSchema = z.object({
  username: _.username,
});
export type GetUsersReq = z.infer<typeof getUsersSchema>;

export const apiResponseSchema = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    data: z.any(),
  }),
  z.object({
    success: z.literal(false),
    message: z.string(),
    errors: z.string().optional(),
  }),
]);

export type ApiResponse<T> = z.infer<typeof ApiResponseSchema>;
