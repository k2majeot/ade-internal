import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.env"),
});

function required(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

const config = {
  server: {
    port: required("SERVER_PORT"),
  },

  session: {
    duration: Number(required("SESSION_DURATION")),
    secret: required("SESSION_SECRET"),
  },

  database: {
    host: required("DB_HOST"),
    name: required("DB_NAME"),
    port: Number(required("DB_PORT")),
    region: required("RDS_REGION"),
    secretId: required("RDS_SECRET_ID"),
    caCertPath: required("DB_CA_PATH"),
  },

  cognito: {
    clientId: required("COGNITO_CLIENT_ID"),
    userPoolId: required("COGNITO_USER_POOL_ID"),
    region: required("COGNITO_REGION"),
    tempPassword: required("COGNITO_TEMP_PASSWORD"),
  },
};

export default config;
