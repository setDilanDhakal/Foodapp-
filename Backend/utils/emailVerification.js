import crypto from 'crypto'
import nodemailer from 'nodemailer'

const OTP_EXPIRY_MINUTES = 10

export const createEmailOtp = () => {
  const code = crypto.randomInt(100000, 1000000).toString()
  return {
    code,
    hash: crypto.createHash('sha256').update(code).digest('hex'),
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
  }
}

export const hashEmailOtp = (code) => crypto.createHash('sha256').update(code).digest('hex')

export const sendVerificationEmail = async ({ email, name, code }) => {
  const smtpUser = process.env.EMAIL_USERNAME || process.env.SMTP_USER
  const smtpPassword = process.env.EMAIL_PASSWORD || process.env.SMTP_PASS
  if (!smtpUser || !smtpPassword) {
    throw new Error('Email delivery is not configured. Add EMAIL_USERNAME and EMAIL_PASSWORD to the server environment.')
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: (process.env.SMTP_SECURE || 'true') === 'true',
    auth: { user: smtpUser, pass: smtpPassword },
  })

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || `Bhoj Express <${smtpUser}>`,
    to: email,
    subject: `${code} is your Bhoj Express verification code`,
    text: `Hi ${name}, your Bhoj Express verification code is ${code}. It expires in ${OTP_EXPIRY_MINUTES} minutes.`,
    html: `<!doctype html><html><body style="margin:0;background:#fff7ed;font-family:Arial,sans-serif;color:#431407"><div style="max-width:560px;margin:32px auto;background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid #fed7aa"><div style="background:#ea580c;padding:28px 36px;color:white"><div style="font-size:12px;letter-spacing:2px;font-weight:bold;text-transform:uppercase">Bhoj Express</div><h1 style="margin:10px 0 0;font-size:28px">Verify your email</h1></div><div style="padding:36px"><p style="font-size:16px;line-height:1.6">Hi ${name}, welcome to Bhoj Express. Use this code to finish creating your account:</p><div style="margin:28px 0;padding:20px;text-align:center;background:#fff7ed;border:1px dashed #fb923c;border-radius:16px;font-size:32px;letter-spacing:10px;font-weight:800;color:#c2410c">${code}</div><p style="font-size:14px;color:#7c2d12;line-height:1.6">This code expires in ${OTP_EXPIRY_MINUTES} minutes. Do not share it with anyone.</p></div><div style="padding:18px 36px;background:#fff7ed;font-size:12px;color:#9a3412">Fresh food, delivered with care.</div></div></body></html>`,
  })
}
