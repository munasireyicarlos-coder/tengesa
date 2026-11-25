const nodemailer = require("nodemailer");

function transporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
}
const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));

async function sendInquiryEmails(inquiry) {
  const mailer = transporter();
  if (!mailer) return false;
  const support = process.env.SUPPORT_EMAIL || "support@tengesamarketplace.com";
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const body = `<div style="font-family:Arial,sans-serif;color:#0A192F;max-width:640px;margin:auto;border:1px solid #e5e7eb"><div style="background:#0A192F;padding:24px;color:white"><h1 style="margin:0">Tengesa Marketplace</h1><p style="color:#10B981;margin-bottom:0">Connecting Buyers &amp; Sellers Seamlessly</p></div><div style="padding:24px"><h2 style="color:#0A192F">New ${esc(inquiry.inquiryType)} inquiry</h2><p><b>Name:</b> ${esc(inquiry.name)}</p><p><b>Email:</b> ${esc(inquiry.email)}</p><p><b>Phone:</b> ${esc(inquiry.phone)}</p><p><b>Message:</b><br>${esc(inquiry.message).replace(/\n/g,"<br>")}</p><p style="color:#059669">Tengesa Marketplace • Harare, Zimbabwe</p></div></div>`;
  await mailer.sendMail({ from, to: support, subject: `New Tengesa inquiry: ${inquiry.inquiryType}`, html: body });
  await mailer.sendMail({ from, to: inquiry.email, subject: "We received your message — Tengesa Marketplace", html: `<div style="font-family:Arial,sans-serif;color:#0A192F;padding:24px"><h2>Thank you for contacting Tengesa.</h2><p>Hello ${esc(inquiry.name)},</p><p>We have received your message and our team will get back to you as soon as possible.</p><p style="color:#10B981">Tengesa Marketplace — Buy, Sell &amp; Grow with Confidence.</p></div>` });
  return true;
}
module.exports = { sendInquiryEmails };
