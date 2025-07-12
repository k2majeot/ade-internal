import { z } from "zod";
import {
  serialIdVal,
  textQueryVal,
  goalTitleVal,
  goalInstructionsVal,
  goalObjectiveVal,
  goalReinforcerVal,
} from "../../../shared/validators.js";

export const getGoalsSchema = z.object({
  cid: serialIdVal,
  title: textQueryVal.optional(),
});

export const updateGoalSchema = z.object({
  id: serialIdVal,
  title: goalTitleVal,
  instructions: goalInstructionsVal,
  objective: goalObjectiveVal,
  reinforcer: goalReinforcerVal,
});
