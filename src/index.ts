import express from 'express';
import nodemailer from 'nodemailer';

const app = express();
const port = process.env.PORT || 3000;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'seu_email@gmail.com',
    pass: 'sua_senha',
  },
});

app.get('/enviar-email', (req, res) => {
  const mailOptions = {
    from: 'seu_email@gmail.com',
    to: 'destinatario@gmail.com',
    subject: 'Assunto do E-mail',
    text: 'Corpo do E-mail',
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('E-mail enviado: ' + info.response);
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});