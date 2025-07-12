import { z } from "zod";
import { textQueryVal } from "../../../shared/validators.js";

export const getClientsSchema = z.object({
  name: textQueryVal.optional(),
});
