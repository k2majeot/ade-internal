import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  AdminCreateUserCommand,
  AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";

import { getPool } from "@/db";
import config from "@/config";
import { Role } from "@shared/types";
import type { Credentials, AuthResult, UserData } from "@shared/validation";
import { createUserService } from "@/services/user.service";
import { type ServiceResponse } from "@/types/server.types";
import { createSuccess, createFail } from "@/utils/service.util";

const cognitoClient = new CognitoIdentityProviderClient({
  region: config.cognito.region,
});

async function decodeJwtPayload(token: string): any {
  const base64Url = token.split(".")[1];
  const payloadJson = Buffer.from(base64Url, "base64").toString("utf8");
  return JSON.parse(payloadJson);
}

export async function loginService({
  username,
  password,
}: Credentials): Promise<ServiceResponse<AuthResult>> {
  const input = {
    AuthFlow: "USER_PASSWORD_AUTH" as const,
    ClientId: config.cognito.clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
    },
  };

  const command = new InitiateAuthCommand(input);
  const response = await cognitoClient.send(command);

  const idToken = response.AuthenticationResult?.IdToken;
  if (!idToken) {
    return createFail({ status: 401, message: "Invalid credentials" });
  }

  const payload = await decodeJwtPayload(idToken);
  const groups = payload["cognito:groups"];

  return createSuccess({
    data: {
      role:
        Array.isArray(groups) && groups.includes("Admin")
          ? Role.Admin
          : Role.User,
    },
  });
}

export async function registerService(
  userData: UserData
): Promise<ServiceResponse<undefined>> {
  const { username, fname, lname, role } = userData;
  const pool = await getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      `INSERT INTO users (username, fname, lname, role)
       VALUES ($1, $2, $3, $4)`,
      [username, fname, lname, role]
    );

    const createCommand = new AdminCreateUserCommand({
      UserPoolId: config.cognito.userPoolId,
      Username: username,
      TemporaryPassword: config.cognito.tempPassword,
      MessageAction: "SUPPRESS",
    });

    const createResponse = await cognitoClient.send(createCommand);
    if (!createResponse.User) {
      throw new Error("Cognito user creation failed");
    }

    const groupCommand = new AdminAddUserToGroupCommand({
      UserPoolId: config.cognito.userPoolId,
      Username: username,
      GroupName: role,
    });

    const groupResponse = await cognitoClient.send(groupCommand);
    if (groupResponse.$metadata.httpStatusCode !== 200) {
      throw new Error("Cognito group assignment failed");
    }

    await client.query("COMMIT");
    return createSuccess({ status: 201 });
  } catch (err) {
    await client.query("ROLLBACK");

    if (err.code === "23505") {
      return createFail({ status: 409, message: "Username already exists" });
    }

    throw err;
  } finally {
    client.release();
  }
}
