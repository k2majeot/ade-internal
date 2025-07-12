import { z } from "zod";
import {
  uuidVal,
  usernameVal,
  passwordVal,
  serialIdVal,
  userRoleVal,
  sessionDurationVal,
  dateVal,
} from "../../../shared/validators.js";

export const authorizationSchema = z.object({
  sid: uuidVal,
});

export const loginSchema = z.object({
  username: usernameVal,
  password: passwordVal,
});

export const sessionSchema = z.object({
  uid: serialIdVal,
  username: usernameVal,
  role: userRoleVal,
  duration: sessionDurationVal,
  expiresAt: dateVal,
});
