import type { Request, Response, NextFunction } from "express";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from"helmet";
import api from "./routes/api.ts";

import session from "express-session";
import { passport, config } from "./routes/auth/passport.ts";

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

const allowedOrigins = process.env.ORIGIN_WHITELIST?.split(",") || [];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

const COOKIE_KEYS = (() => {
  const k1 = config.COOKIE_KEY_1;
  const k2 = config.COOKIE_KEY_2;
  if (!k1 || !k2) {
    throw new Error("Missing COOKIE_KEY_1 or COOKIE_KEY_2 in config");
  }
  return [k1, k2];
})();

app.use(
  session({
    name: "ironpeak.sid",
    secret: COOKIE_KEYS,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: config.COOKIE_MAX_AGE,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(morgan("combined"));

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  next();
  const delta = Date.now() - start;
  console.log(`${req.method} ${req.baseUrl}${req.url} ${delta}ms`);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from BluePrint Barbers!");
});

app.use("/", api);

export default app;