import { z } from "zod";

import {
  serialIdVal,
  dateVal,
  activityVal,
  promptLevelVal,
  initialVal,
  commentsVal,
} from "../../../shared/validators.js";

export const getGoalDataSchema = z.object({
  gid: serialIdVal,
  date: dateVal,
});

export const upsertGoalDataSchema = z.object({
  gid: serialIdVal,
  date: dateVal,
  activity: activityVal,
  prompt_level: promptLevelVal,
  initial: initialVal,
  comments: commentsVal,
});
