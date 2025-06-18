import express from "express";
import session from "express-session";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "@/routes";
import {
  responseHandler,
  errorHandler,
} from "@/middleware/response.middleware";
import config from "@/config";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(responseHandler);

app.use("/api", router);

app.use(errorHandler);

app.listen(config.server.port, () => {
  console.log(`Server running on http://localhost:${config.server.port}`);
});
