import { Resend } from "resend";
import { Reserva } from "@/types";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { formatPrecio } from "./pricing";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || "placeholder");
}
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "patomoni29@gmail.com";
const FROM_EMAIL = "Reservas Pádel <onboarding@resend.dev>";

function formatFecha(fecha: string) {
  return format(parseISO(fecha), "EEEE d 'de' MMMM yyyy", { locale: es });
}

function formatDuracion(min: number) {
  if (min === 60) return "1 hora";
  if (min === 90) return "1 hora 30 minutos";
  return "2 horas";
}

function emailBase(titulo: string, cuerpo: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;max-width:600px;width:100%;">
        <tr>
          <td style="background:#2d6a4f;padding:24px 32px;">
            <h1 style="margin:0;color:#fff;font-size:22px;">🎾 Cancha de Pádel</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <h2 style="color:#1b4332;margin-top:0;">${titulo}</h2>
            ${cuerpo}
          </td>
        </tr>
        <tr>
          <td style="background:#f9f9f9;padding:16px 32px;border-top:1px solid #eee;">
            <p style="margin:0;color:#888;font-size:12px;">Cancha de Pádel — Sistema de reservas</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function datosReserva(r: Reserva): string {
  return `
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#555;">Nombre</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:bold;">${r.nombre} ${r.apellido}</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#555;">Fecha</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:bold;">${formatFecha(r.fecha)}</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#555;">Hora</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:bold;">${r.hora_inicio.substring(0, 5)} hs</td></tr>
      <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#555;">Duración</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:bold;">${formatDuracion(r.duracion_min)}</td></tr>
      <tr><td style="padding:8px 0;color:#555;">Precio</td><td style="padding:8px 0;font-weight:bold;color:#2d6a4f;">${formatPrecio(r.precio)}</td></tr>
    </table>`;
}

export async function emailReciboSolicitud(reserva: Reserva) {
  const cuerpo = `
    <p>Hola <strong>${reserva.nombre}</strong>, recibimos tu solicitud de reserva.</p>
    <p>Revisaremos tu pedido y te confirmaremos a la brevedad.</p>
    ${datosReserva(reserva)}
    <p style="color:#888;font-size:13px;">Si tenés alguna consulta, respondé este email.</p>`;

  const adminCuerpo = `
    <p>Nueva solicitud de reserva recibida.</p>
    ${datosReserva(reserva)}
    <p><strong>Email del solicitante:</strong> ${reserva.email}<br><strong>Teléfono:</strong> ${reserva.telefono}</p>`;

  await Promise.all([
    getResend().emails.send({
      from: FROM_EMAIL,
      to: reserva.email,
      subject: "Solicitud de reserva recibida",
      html: emailBase("Solicitud recibida", cuerpo),
    }),
    getResend().emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `Nueva reserva: ${reserva.nombre} ${reserva.apellido} — ${formatFecha(reserva.fecha)}`,
      html: emailBase("Nueva solicitud de reserva", adminCuerpo),
    }),
  ]);
}

export async function emailConfirmacion(reserva: Reserva) {
  const cuerpo = `
    <p>Hola <strong>${reserva.nombre}</strong>, tu reserva fue <strong style="color:#2d6a4f;">confirmada</strong> ✅</p>
    <p>Te esperamos en la cancha:</p>
    ${datosReserva(reserva)}
    <p style="color:#888;font-size:13px;">Si necesitás cancelar, comunicáte con anticipación.</p>`;

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: reserva.email,
    subject: "Tu reserva fue confirmada ✅",
    html: emailBase("Reserva confirmada", cuerpo),
  });
}

export async function emailCancelacion(reserva: Reserva) {
  const cuerpo = `
    <p>Hola <strong>${reserva.nombre}</strong>, lamentablemente tu reserva fue <strong style="color:#dc2626;">cancelada</strong>.</p>
    ${datosReserva(reserva)}
    <p>Podés realizar una nueva reserva ingresando a nuestro sistema.</p>`;

  await getResend().emails.send({
    from: FROM_EMAIL,
    to: reserva.email,
    subject: "Tu reserva fue cancelada",
    html: emailBase("Reserva cancelada", cuerpo),
  });
}
