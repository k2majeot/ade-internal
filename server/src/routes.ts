import express from "express";
import asyncHandler from "express-async-handler";
import { z } from "zod";

import validationHandler from "@/middleware/validation.middleware";
import { requireAuth, requireAtLeast } from "@/middleware/auth.middleware";

import {
  login,
  logout,
  register,
  completeChallenge,
  getSessionUser,
} from "@/controllers/auth.controller";
import {
  getUser,
  getUsers,
  updateUser,
  deactivateUsers,
  deleteUsers,
  resetPassword,
} from "@/controllers/user.controller";
import {
  getClient,
  getClients,
  updateClient,
  createClient,
  deactivateClients,
  deleteClients,
} from "@/controllers/client.controller";
import {
  getAttendance,
  upsertAttendance,
} from "@/controllers/attendance.controller";

import {
  credentialsSchema,
  completeChallengeSchema,
  userDataSchema,
  serialIdSchema,
  serialIdListSchema,
  deleteUsersSchema,
  attendanceQuerySchema,
  attendanceUpsertSchema,
  clientDataSchema,
  usernameSchema,
} from "@shared/validation";

import { Role } from "@shared/types";

const router = express.Router();

router.post(
  "/auth/login",
  validationHandler({ body: credentialsSchema }),
  asyncHandler(login)
);

router.post("/auth/logout", asyncHandler(requireAuth), asyncHandler(logout));

router.post(
  "/auth/challenge",
  validationHandler({ body: completeChallengeSchema }),
  asyncHandler(completeChallenge)
);

router.post(
  "/auth/register",
  validationHandler({ body: userDataSchema }),
  asyncHandler(requireAuth),
  requireAtLeast(Role.Admin),
  asyncHandler(register)
);

router.get("/auth/me", asyncHandler(requireAuth), asyncHandler(getSessionUser));

router.post(
  "/auth/reset-password",
  asyncHandler(requireAuth),
  requireAtLeast(Role.Admin),
  validationHandler({ body: usernameSchema }),
  asyncHandler(resetPassword)
);

router.get(
  "/users/:id",
  asyncHandler(requireAuth),
  requireAtLeast(Role.Admin),
  validationHandler({ params: z.object({ id: serialIdSchema }) }),
  asyncHandler(getUser)
);

router.get(
  "/users",
  asyncHandler(requireAuth),
  requireAtLeast(Role.Admin),
  asyncHandler(getUsers)
);

router.post(
  "/users/deactivate",
  asyncHandler(requireAuth),
  requireAtLeast(Role.Admin),
  validationHandler({ body: serialIdListSchema }),
  asyncHandler(deactivateUsers)
);

router.delete(
  "/users",
  asyncHandler(requireAuth),
  requireAtLeast(Role.Admin),
  validationHandler({ body: deleteUsersSchema }),
  asyncHandler(deleteUsers)
);

router.put(
  "/users/:id",
  asyncHandler(requireAuth),
  requireAtLeast(Role.Admin),
  validationHandler({
    params: z.object({ id: serialIdSchema }),
    body: userDataSchema,
  }),
  asyncHandler(updateUser)
);

router.get(
  "/clients/:id",
  asyncHandler(requireAuth),
  validationHandler({ params: z.object({ id: serialIdSchema }) }),
  asyncHandler(getClient)
);

router.get("/clients", asyncHandler(requireAuth), asyncHandler(getClients));

router.post(
  "/clients/deactivate",
  asyncHandler(requireAuth),
  requireAtLeast(Role.Admin),
  validationHandler({ body: serialIdListSchema }),
  asyncHandler(deactivateClients)
);

router.delete(
  "/clients",
  asyncHandler(requireAuth),
  requireAtLeast(Role.Admin),
  validationHandler({ body: serialIdListSchema }),
  asyncHandler(deleteClients)
);

router.put(
  "/clients/:id",
  asyncHandler(requireAuth),
  validationHandler({
    params: z.object({ id: serialIdSchema }),
    body: clientDataSchema,
  }),
  asyncHandler(updateClient)
);

router.post(
  "/clients",
  asyncHandler(requireAuth),
  validationHandler({ body: clientDataSchema }),
  asyncHandler(createClient)
);

router.get(
  "/attendance",
  asyncHandler(requireAuth),
  validationHandler({ query: attendanceQuerySchema }),
  asyncHandler(getAttendance)
);

router.post(
  "/attendance",
  asyncHandler(requireAuth),
  validationHandler({ body: attendanceUpsertSchema }),
  asyncHandler(upsertAttendance)
);

export default router;
