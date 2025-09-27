import nodemailer from 'nodemailer'

export async function sendConfirmationEmail(to, gift) {
  // Crie uma conta no SendGrid e gere sua API Key
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

  if (!SENDGRID_API_KEY) {
    throw new Error('SendGrid API Key não definida no .env')
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
      user: 'apikey', // isso é literal: "apikey"
      pass: SENDGRID_API_KEY, // sua chave do SendGrid
    },
  })

  await transporter.sendMail({
    from: '"Lista de Casamento" <no-reply@seusite.com>', // seu remetente
    to,
    subject: 'Confirmação de presente comprado',
    text: `Você marcou o presente "${gift.name}" como comprado. Obrigado!`,
  })
}