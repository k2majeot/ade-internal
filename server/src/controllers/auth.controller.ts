import { loginService, registerService } from "@/services/auth.service";
import type { Credentials, AuthResult, UserData } from "@shared/validation";
import { type ServiceResponse } from "@/types/server.types";
import { isServiceSuccess } from "@/utils/controller.util";

export async function login(req, res) {
  const creds: Credentials = req.validatedBody;
  const serviceResponse: ServiceResponse<AuthResult> = await loginService(
    creds
  );

  if (!isServiceSuccess(serviceResponse)) {
    const { status, errors, message } = serviceResponse;
    return res.fail({ status, errors, message });
  }

  req.session.role = serviceResponse.data.role;

  const { status, data, message } = serviceResponse;
  return res.success({ status, data, message });
}

export async function register(req, res) {
  const userData: UserData = req.validatedBody;
  const serviceResponse: ServiceResponse<undefined> = await registerService(
    userData
  );

  if (!isServiceSuccess(serviceResponse)) {
    const { status, errors, message } = serviceResponse;
    return res.fail({ status, errors, message });
  }

  return res.status(serviceResponse.status).end();
}
