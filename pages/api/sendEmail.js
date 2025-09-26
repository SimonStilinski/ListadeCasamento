import nodemailer from "nodemailer"

export async function sendConfirmationEmail(to, gift) {
  const transporter = nodemailer.createTransport({
    host: "smtp.seuprovedor.com", // ex: smtp.gmail.com
    port: 587,
    auth: { user: "seuusuario", pass: "suasenha" }, // seu usuário e senha do SMTP
  })

  await transporter.sendMail({
    from: '"Lista de Casamento" <no-reply@seusite.com>',
    to,
    subject: "Confirmação de presente comprado",
    text: `Você marcou o presente "${gift.name}" como comprado. Obrigado!`,
  })
}