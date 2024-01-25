import { body, validationResult } from "express-validator";
import { HTTP_ERRORS, UserModel } from "../../models/model";
import createError from "http-errors";
import { UserLogin } from "../../database/users";
import { Application, NextFunction, Request, Response } from "express";
import { tratarErro } from "../../utils/error";
import { Usuario } from "../../database/dbAccounts";

export = (app: Application) => {
  app.post(
    "/registerUsers",
    body("email").isEmail(),
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (errors.isEmpty()) {
        const { email }: UserModel = req.body;
        if (email) {
          await UserLogin.createUser(email)
            .then(() => {
              res.json({ message: "Usuário cadastrado com sucesso" });
            })
            .catch((erro) => {
              console.error(erro);
              next(createError(HTTP_ERRORS.BAD_REQUEST, tratarErro(erro)));
            });
        } else {
          next(createError(HTTP_ERRORS.BAD_REQUEST, "Email inválido"));
        }
      } else {
        next(
          createError(
            HTTP_ERRORS.VALIDACAO_DE_DADOS,
            JSON.stringify(errors.array())
          )
        );
      }
    }
  );
  app.get(
    "/accountByEmail/:email",
    async (req: Request, res: Response, next: NextFunction) => {
      let email_usuario = req.params.email;

      await Usuario.getUserByEmail(email_usuario)
        .then((conta) => {
          res.json({
            conta,
          });
        })
        .catch((erro) => {
          next(createError(HTTP_ERRORS.VALIDACAO_DE_DADOS, erro));
        });
    }
  );

  app.post("/add-bonus", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res
          .status(400)
          .json({ message: 'O campo "email" é obrigatório.' });
      }

      const success = await Usuario.addBonusByEmail(email, 40);

      if (success) {
        return res
          .status(200)
          .json({ message: "Bônus adicionado com sucesso!" });
      } else {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }
    } catch (error) {
      console.error("Erro ao adicionar bônus:", error);
      return res.status(500).json({ message: "Erro interno do servidor." });
    }
  });
};
