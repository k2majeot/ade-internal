import { z } from "zod";

import { fetchWithResponse, fetchNoResponse } from "@/lib/validation";
import { type UserList, userListSchema } from "@shared/validation";
import { getUsersService } from "@/services/userService";

export async function getUsers(): Promise<ApiResult<UserList>> {
  const result: ApiResult<UserList> = await fetchWithResponse(
    getUsersService,
    undefined,
    z.undefined(),
    userListSchema
  );
  return result;
}
