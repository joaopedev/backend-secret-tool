import express, { json, Response, NextFunction, Request } from "express";
import createError from "http-errors";
import helmet from "helmet";
import cors from "cors";
import { HTTP_ERRORS } from "./models/model";
require("dotenv").config();
const consign = require("consign");

const app = express();
const port = process.env.PORT || 3000;
const AUTHORIZATION = process.env.AUTHORIZATION;

app.use(helmet());
app.use(cors());
app.use(json());

app.use("/private/*", (req: Request, res: Response, next: NextFunction) => {
  let authorization = req.header("authorization");
  if (authorization == AUTHORIZATION) {
    next();
  } else {
    next(
      createError(
        HTTP_ERRORS.ACESSO_NAO_AUTORIZADO,
        "login incorreto ao acessar rota privada"
      )
    );
  }
});

consign({ cwd: __dirname }).include("routers").into(app);

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  // Set HTTP Status Code
  res.status(error.status);
  // Send response
  res.json({ message: error.message });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
