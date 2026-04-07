import type { Request, Response, NextFunction } from "express";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from"helmet";
import api from "./routes/api.ts";

import cookieSession from "cookie-session";
// import { passport, config } from "./routes/auth/passport.ts";

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://iron-peak-services.com",
      "https://beta.iron-peak-services.com",
    ],
    credentials: true,
  }),
);

// app.use(
//   cookieSession({
//     name: "session",
//     maxAge: config.COOKIE_MAX_AGE,
//     keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
//     sameSite: false,
//     // secure: true // enable in HTTPS
//   }),
// );

// app.use(passport.initialize());
// app.use(passport.session());

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