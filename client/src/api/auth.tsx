import { fetchWithResponse, fetchNoResponse } from "@/lib/validation";
import type { Credentials, LoginResult, UserData } from "@shared/validation";
import {
  credentialsSchema,
  loginResultSchema,
  userDataSchema,
} from "@shared/validation";
import { loginService, registerService } from "@/services/authService";

export async function login(
  creds: Credentials
): Promise<ApiResult<LoginResult>> {
  const result: ApiResult<LoginResult> = fetchWithResponse(
    loginService,
    creds,
    credentialsSchema,
    loginResultSchema
  );
  return result;
}

export async function register(
  userData: UserData
): Promise<ApiResult<undefined>> {
  const result: ApiResult<undefined> = fetchNoResponse(
    registerService,
    userData,
    userDataSchema
  );
  return result;
}
