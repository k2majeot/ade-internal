import {
  loginService,
  completeChallengeService,
  registerService,
} from "@/services/internal/auth.service";
import { getUserService } from "@/services/internal/user.service";
import type {
  Credentials,
  User,
  Challenge,
  UserData,
  SerialId,
} from "@shared/validation";
import { isChallenge } from "@shared/utils/auth.util";
import { type ServiceResponse } from "@/types/server.types";
import { isServiceSuccess } from "@/utils/controller.util";

export async function login(req, res) {
  const creds: Credentials = req.validatedBody;
  const serviceResponse: ServiceResponse<LoginResult> = await loginService(
    creds
  );

  if (!isServiceSuccess(serviceResponse)) {
    const { status, errors, message } = serviceResponse;
    return res.fail({ status, errors, message });
  }
  const { status, data, message } = serviceResponse;

  if (isChallenge(data)) {
    return res.success({ status, data, message });
  }

  req.session.uid = serviceResponse.data.id;

  return res.success({ status, data, message });
}

export async function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout failed:", err);
      return res.fail({ status: 500, message: "Failed to logout" });
    }

    res.clearCookie("connect.sid");

    return res.success({ status: 200, message: "Logged out successfully" });
  });
}

export async function completeChallenge(req, res) {
  const data: CompleteChallenge = req.validatedBody;

  const serviceResponse: ServiceResponse<User> = await completeChallengeService(
    data
  );

  if (!isServiceSuccess(serviceResponse)) {
    const { status, errors, message } = serviceResponse;
    return res.fail({ status, errors, message });
  }

  return res.status(serviceResponse.status).end();
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

export async function getSessionUser(req, res) {
  const id: SerialId = req.session.uid;
  const serviceResponse: ServiceResponse<User> = await getUserService(id);

  if (!isServiceSuccess(serviceResponse)) {
    const { status, errors, message } = serviceResponse;
    return res.fail({ status, errors, message });
  }

  const { status, data, message } = serviceResponse;
  return res.success({ status, data, message });
}
