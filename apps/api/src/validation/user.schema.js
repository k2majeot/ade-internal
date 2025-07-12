import { z } from "zod";
import { usernameVal } from "../../../shared/validators.js";

export const getUidByUsernameSchema = z.object({
  username: usernameVal,
});
