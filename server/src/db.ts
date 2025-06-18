import fs from "fs";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import pkg from "pg";
const { Pool } = pkg;
import config from "@/config";

const client = new SecretsManagerClient({ region: config.database.region });
let creds;

async function getDbSecret() {
  if (creds) return creds;

  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: config.database.secretId,
      VersionStage: "AWSCURRENT",
    })
  );
  creds = JSON.parse(response.SecretString);
  return creds;
}

let pool;

export async function getPool() {
  if (pool) return pool;

  const creds = await getDbSecret();
  pool = new Pool({
    host: config.database.host,
    user: creds.username,
    password: creds.password,
    database: config.database.name,
    port: config.database.port,
    ssl: {
      ca: fs.readFileSync(config.database.caCertPath).toString(),
    },
  });

  return pool;
}
