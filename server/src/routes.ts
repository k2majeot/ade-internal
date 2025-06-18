import express from "express";
import asyncHandler from "express-async-handler";
import { z } from "zod";

import validationHandler from "@/middleware/validation.middleware";
import { login, register } from "@/controllers/auth.controller";
import { getUsers, updateUser } from "@/controllers/user.controller";
import {
  getAttendance,
  upsertAttendance,
} from "@/controllers/attendance.controller";

import {
  credentialsSchema,
  userDataSchema,
  serialIdSchema,
  attendanceQuerySchema,
  attendanceUpsertSchema,
} from "@shared/validation";

const router = express.Router();

router.post(
  "/auth/login",
  validationHandler({ body: credentialsSchema }),
  asyncHandler(login)
);

router.post(
  "/auth/register",
  validationHandler({ body: userDataSchema }),
  asyncHandler(register)
);

router.get("/users", asyncHandler(getUsers));

router.put(
  "/user/:id",
  validationHandler({
    params: z.object({ id: serialIdSchema }),
    body: userDataSchema,
  }),
  asyncHandler(updateUser)
);

router.get(
  "/attendance",
  validationHandler({ query: attendanceQuerySchema }),
  asyncHandler(getAttendance)
);

router.post(
  "/attendance",
  validationHandler({ body: attendanceUpsertSchema }),
  asyncHandler(upsertAttendance)
);

export default router;
