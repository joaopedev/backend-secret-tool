import { Application, NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import nodemailer from "nodemailer";

export = (app: Application) => {
  app.post(
    "private/enviar-email",
    async (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { usuario, valorDeSaque, modeloSaque, contaDeSaque } = req.body;
  
      const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "e63d09da76de0b",
          pass: "52e156bbd3c328"
        }
      });
  
      const mailOptions = {
        from: "webb-general@hotmail.com",
        to: "joaopedev@gmail.com",
        subject: "Solicitação de Saque",
        html: `
          <p>Solicitação de saque</p>
          <p>Usuário: ${usuario}</p>
          <p>Valor de Saque: ${valorDeSaque}</p>
          <p>Modelo de Saque: ${modeloSaque}</p>
          <p>Conta de Saque: ${contaDeSaque}</p>
        `,
      };
  
      transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).send(error.toString());
        }
        res.status(200).send("E-mail enviado: " + info.response);
      });
    }
  );
};