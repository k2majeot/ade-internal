import {
  CognitoIdentityProviderClient,
  AdminDeleteUserCommand,
  AdminSetUserPasswordCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { getPool } from "@/db";
import type {
  UserData,
  UserList,
  SerialId,
  DeleteUsers,
  Username,
} from "@shared/validation";
import type { ServiceResponse } from "@/types/server.types";
import {
  createSuccess,
  createFail,
  getIdByCode,
  getCodeById,
} from "@/utils/service.util";
import config from "@/config";
import { Role } from "@shared/generated/lookup.types";

const cognitoClient = new CognitoIdentityProviderClient({
  region: config.cognito.region,
});

export async function getUserService(
  id: SerialId
): Promise<ServiceResponse<User>> {
  const pool = await getPool();

  const query = `
    SELECT id, fname, lname, username, side_id, role_id, status_id
    FROM users
    WHERE id = $1
  `;
  const params = [id];

  const result = await pool.query(query, params);
  const user = result.rows[0];

  if (!user) {
    return createFail({ status: 404, message: "User not found" });
  }

  return createSuccess({
    data: {
      ...user,
      role: getCodeById("role", user.role_id),
      status: getCodeById("status", user.status_id),
      side: getCodeById("side", user.side_id),
    },
  });
}

export async function getUsersService(): Promise<ServiceResponse<UserList>> {
  const pool = await getPool();

  const result = await pool.query(
    `SELECT id, fname, lname, username, side_id, role_id, status_id FROM users`
  );

  const userList: UserList = result.rows.map((user) => ({
    ...user,
    role: getCodeById("role", user.role_id),
    status: getCodeById("status", user.status_id),
    side: getCodeById("side", user.side_id),
  }));

  return createSuccess({ data: userList });
}

export async function updateUserService(
  id: SerialId,
  { username, fname, lname, side, role, status }: UserData
): Promise<ServiceResponse<undefined>> {
  const pool = await getPool();

  const result = await pool.query(
    `UPDATE users
     SET username = $1, fname = $2, lname = $3, side_id = $4, role_id = $5, status_id = $6
     WHERE id = $7;`,
    [
      username,
      fname,
      lname,
      getIdByCode("side", side),
      getIdByCode("role", role),
      getIdByCode("status", status),
      id,
    ]
  );

  if (result.rowCount === 0) {
    return createFail({ status: 404, message: "User not found" });
  }

  return createSuccess({ status: 204 });
}

export async function deleteUsersService(
  users: DeleteUsers
): Promise<ServiceResponse<undefined>> {
  const failures: DeleteUsers = [];
  const pool = await getPool();

  for (const user of users) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      await client.query(`DELETE FROM users WHERE id = $1`, [user.id]);

      await cognitoClient.send(
        new AdminDeleteUserCommand({
          UserPoolId: config.cognito.userPoolId,
          Username: user.username,
        })
      );

      await client.query("COMMIT");
    } catch (err: any) {
      await client.query("ROLLBACK");
      console.log(err);
      failures.push({
        id: user.id,
        username: user.username,
      });
    } finally {
      client.release();
    }
  }

  if (failures.length > 0) {
    return createFail({
      status: 207,
      message: "Some users failed to delete",
      errors: failures,
    });
  }

  return createSuccess({ status: 204 });
}

export async function resetPasswordService(
  username: Username
): Promise<ServiceResponse<undefined>> {
  try {
    const result = await cognitoClient.send(
      new AdminSetUserPasswordCommand({
        UserPoolId: config.cognito.userPoolId,
        Username: username,
        Password: config.cognito.tempPassword,
        Permanent: false,
      })
    );

    if (result.$metadata.httpStatusCode !== 200) {
      throw new Error("Failed to reset password");
    }
  } catch (err: any) {
    if (err.name === "UserNotFoundException") {
      return createFail({ status: 404, message: `User ${username} not found` });
    }

    console.error("Failed to reset password:", err);
    throw new Error("Internal server error");
  }

  return createSuccess({ status: 204 });
}
