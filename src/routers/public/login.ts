import { HTTP_ERRORS } from "../../models/model";
import createError from "http-errors";
import { UserLogin } from "../../database/users";
import { Application, NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
require("dotenv").config();

export = (app: Application) => {
  app.post(
    "/login",
    body("email").notEmpty(),
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const email: string = req.body.email;

        if (email) {
          try {
            const usuario = await UserLogin.loginUser(email);

            if (usuario) {
              // Usuário autenticado com sucesso, gerar token
              const token = jwt.sign({ email: usuario.email }, process.env.JWT_SECRET || 'sua-chave-secreta-super-segura', {
                expiresIn: '1h', // Defina a expiração do token conforme necessário
              });

              res.json({ token });
            } else {
              res.status(401).json({ message: "Credenciais inválidas" });
            }
          } catch (erro) {
            console.error(erro);
            next(createError(HTTP_ERRORS.ROTA_NAO_ENCONTRADA, "Rota não encontrada"));
          }
        } else {
          next(createError(HTTP_ERRORS.BAD_REQUEST, "Email não pode ser nulo"));
        }
      } else {
        const message = errors.array().map((erro) => erro.msg);
        next(createError(HTTP_ERRORS.SUCESSO, message[0]));
      }
    }
  );
};
