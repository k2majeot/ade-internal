import { getPool } from "@/db";
import connectPgSimple from "connect-pg-simple";
import express from "express";
import session from "express-session";
import cors from "cors";
import router from "@/routes";
import { requestLogger } from "@/middleware/logger.middleware";
import {
  responseHandler,
  errorHandler,
} from "@/middleware/response.middleware";
import config from "@/config";

const pool = await getPool();
const PgSession = connectPgSimple(session);

const isProd = process.env.NODE_ENV === "production";
const env = process.env.NODE_ENV || "development";
const url = isProd
  ? `https://internal.adexperiences.com`
  : `http://localhost:${config.server.port}`;

const app = express();

if (isProd) {
  app.set("trust proxy", 1);
}

app.use(requestLogger);

app.use(
  cors({
    origin: url,
    credentials: true,
  })
);

app.use(express.json());

app.use(
  session({
    store: new PgSession({
      pool: pool,
      tableName: "session",
      pruneSessionInterval: 86400,
    }),
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: config.session.duration,
      secure: isProd,
      httpOnly: true,
      sameSite: isProd ? "lax" : "strict",
    },
  })
);

app.use(responseHandler);

app.use("/api", router);

app.use((req, res) => {
  res.fail({
    status: 404,
    message: "Not found",
  });
});

app.use(errorHandler);

app.listen(config.server.port, () => {
  console.log(
    `[${new Date().toISOString()}] Server running in ${env} mode at ${url}`
  );
});
