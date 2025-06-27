import { z } from "zod";

import { fetchHandler } from "@/lib/fetchHandler";
import type {
  SerialId,
  UserData,
  UserList,
  DeleteUsers,
} from "@shared/validation";
import {
  serialIdSchema,
  serialIdListSchema,
  userSchema,
  userListSchema,
  deleteUsersSchema,
} from "@shared/validation";
import {
  getUserService,
  getUsersService,
  updateUserService,
  deactivateUsersService,
  deleteUsersService,
} from "@/services/userService";
import type { ApiResult } from "@/types/apiTypes";

export async function getUser(id: SerialId): Promise<ApiResult<User>> {
  const result: ApiResult<User> = await fetchHandler({
    service: getUserService,
    outputSchema: userSchema,
    payload: { params: { id } },
    payloadSchemas: { params: serialIdSchema },
  });
  return result;
}

export async function getUsers(): Promise<ApiResult<UserList>> {
  const result = await fetchHandler({
    service: getUsersService,
    outputSchema: userListSchema,
  });
  return result;
}

export async function updateUser(
  id: SerialId,
  userData: UserData
): Promise<ApiResult<undefined>> {
  const result = await fetchHandler({
    service: updateUserService,
    payload: { params: { id }, body: userData },
    payloadSchemas: { params: serialIdSchema, body: userSchema },
  });
  return result;
}

export async function deactivateUsers(
  ids: SerialId[]
): Promise<ApiResult<undefined>> {
  const result = await fetchHandler({
    service: deactivateUsersService,
    payload: { body: { ids } },
    payloadSchemas: { body: serialIdListSchema },
  });
  console.log(result);
  return result;
}

export async function deleteUsers(
  users: DeleteUsers
): Promise<ApiResult<undefined>> {
  const result = await fetchHandler({
    service: deleteUsersService,
    payload: { body: users },
    payloadSchemas: { body: deleteUsersSchema },
  });
  return result;
}
