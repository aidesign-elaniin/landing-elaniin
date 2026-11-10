/**
 * Landing Elaniin: recibe cada lead que envía n8n, lo guarda en la hoja y manda los correos.
 * Los correos salen de la cuenta de Google que publica este script (CAMBIA_ESTE_CORREO@elaniin.com).
 *
 * Instalación:
 *  1. Abre la hoja de Google donde quieres los leads → Extensiones → Apps Script.
 *  2. Borra el contenido de Código.gs y pega este archivo completo.
 *  3. Cambia TOKEN por una clave larga y pega la misma en el nodo "Enviar a Apps Script" de n8n.
 *  4. Implementar → Nueva implementación → tipo "Aplicación web".
 *     Ejecutar como: "Yo". Quién tiene acceso: "Cualquier persona".
 *  5. Copia la URL que termina en /exec y pégala en el nodo "Enviar a Apps Script" de n8n.
 * Tras cada cambio al código: Implementar → Gestionar implementaciones → editar → versión nueva.
 */

// ---------- ajustes ----------
var TOKEN = "CAMBIA_ESTE_TOKEN"; // clave compartida con n8n: sin ella cualquiera con la URL podría escribir en la hoja
var CORREO_EQUIPO = "CAMBIA_ESTE_CORREO@elaniin.com"; // quién recibe el aviso de cada lead (varios: separados por coma)
var CONFIRMAR_AL_LEAD = false; // true = el lead recibe un correo de confirmación desde tu cuenta
var PESTANA = "Leads";

// Columnas de la hoja, en orden. Deben llamarse igual que los campos que manda n8n.
var COLUMNAS = [
  "fecha", "modo", "variante", "nombre", "correo", "empresa_dominio",
  "sector", "servicio", "situacion", "nube", "tipo_plataforma",
  "casos_vistos", "temas_vistos", "preguntas_libres", "mensaje",
  "ruta", "chat_completo", "consentimiento_fecha",
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "referrer", "page"
];

function doPost(e) {
  try {
    var lead = JSON.parse(e.postData.contents);
    if (TOKEN === "CAMBIA_ESTE_TOKEN" || lead.token !== TOKEN) return responder({ ok: false, error: "token" });
    if (!lead.nombre || !lead.correo) return responder({ ok: false, error: "datos" });

    guardar(lead);
    // El lead ya está en la hoja: un fallo de correo no debe hacer que el sitio muestre error ni que se duplique la fila.
    var correos = "enviados";
    try {
      avisarAlEquipo(lead);
      if (CONFIRMAR_AL_LEAD) confirmarAlLead(lead);
    } catch (err) {
      correos = "fallo: " + err.message;
    }
    return responder({ ok: true, correos: correos });
  } catch (err) {
    return responder({ ok: false, error: String(err.message || err) });
  }
}

function guardar(lead) {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = libro.getSheetByName(PESTANA) || libro.insertSheet(PESTANA);
  if (hoja.getLastRow() === 0) hoja.appendRow(COLUMNAS); // primera vez: escribe los encabezados
  hoja.appendRow(COLUMNAS.map(function (c) { return texto(lead[c]); }));
}

// Una celda que empieza con = + - @ se interpretaría como fórmula: se guarda como texto.
function texto(v) {
  var s = v === undefined || v === null ? "" : String(v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

// ---------- correos (HTML con el logo oficial de Elaniin incrustado) ----------
// Colores de marca: Excellence Blue #000040, Inspire Blue #023BFD, Elaniin Black #0C0C0C, Elevate Grey #4E4C4C.
// DM Sans e Inter no existen en los clientes de correo: se usa Arial/Helvetica como reemplazo.

/** Los datos del lead los escribió un visitante: se escapan antes de entrar al HTML. */
function esc(v) {
  return String(v === undefined || v === null ? "" : v)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Marco común: franja azul con logo, cuerpo blanco y pie. Tablas y estilos en línea, como exigen Gmail y Outlook. */
function plantilla(titulo, contenidoHtml, pie) {
  var fuente = "font-family:Arial,Helvetica,sans-serif;";
  return '<!doctype html><html lang="es"><body style="margin:0;padding:0;background:#F2F5FF;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2F5FF;"><tr><td align="center" style="padding:32px 16px;">' +
    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#FFFFFF;border:1px solid #D8D8D8;border-radius:12px;overflow:hidden;">' +
    '<tr><td style="background:#000040;padding:28px 32px;"><img src="cid:logo" width="200" height="31" alt="Elaniin Tech Company" style="display:block;border:0;width:200px;height:auto;"></td></tr>' +
    '<tr><td style="padding:32px 32px 8px 32px;' + fuente + '"><h1 style="margin:0;font-size:24px;line-height:30px;font-weight:700;color:#0C0C0C;">' + titulo + '</h1></td></tr>' +
    '<tr><td style="padding:8px 32px 32px 32px;' + fuente + 'font-size:15px;line-height:24px;color:#4E4C4C;">' + contenidoHtml + '</td></tr>' +
    '<tr><td style="padding:20px 32px;border-top:1px solid #D8D8D8;' + fuente + 'font-size:12px;line-height:18px;color:#636363;">' + pie + '</td></tr>' +
    '</table></td></tr></table></body></html>';
}

function fila(etiqueta, valor) {
  if (!valor) return "";
  return '<tr><td width="150" valign="top" style="padding:10px 0;border-bottom:1px solid #D8D8D8;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:20px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#636363;">' + etiqueta + '</td>' +
    '<td valign="top" style="padding:10px 0;border-bottom:1px solid #D8D8D8;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:22px;color:#0C0C0C;">' + esc(valor) + '</td></tr>';
}

function logo() {
  return Utilities.newBlob(Utilities.base64Decode(LOGO_PNG), "image/png", "elaniin.png");
}

function avisarAlEquipo(lead) {
  var d = function (v, vacio) { return v ? v : vacio; };
  var filas = [
    fila("Correo", lead.correo), fila("Sector", lead.sector), fila("Servicio", lead.servicio), fila("Situación", lead.situacion),
    fila("Nube", lead.nube), fila("Plataforma", lead.tipo_plataforma), fila("Casos vistos", lead.casos_vistos), fila("Temas vistos", lead.temas_vistos),
    fila("Preguntas", lead.preguntas_libres), fila("Mensaje", lead.mensaje), fila("Ruta", lead.ruta), fila("Chat completo", lead.chat_completo),
    fila("Origen", d(lead.utm_source, "directo") + " / " + d(lead.utm_campaign, "sin campaña"))
  ].join("");
  var html = plantilla(
    esc(lead.nombre),
    '<p style="margin:0 0 20px 0;">Nuevo lead desde la landing de <strong style="color:#0C0C0C;">' + esc(lead.variante) + '</strong>, por <strong style="color:#0C0C0C;">' + esc(lead.modo) + '</strong>.</p>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #D8D8D8;">' + filas + '</table>' +
    '<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px;"><tr><td style="background:#023BFD;border-radius:8px;">' +
    '<a href="mailto:' + encodeURIComponent(lead.correo) + '" style="display:inline-block;padding:13px 22px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:700;color:#FFFFFF;text-decoration:none;">Responder a ' + esc(lead.nombre) + '</a></td></tr></table>',
    "Aviso automático de la landing de Elaniin. Recibido el " + esc(d(lead.fecha, "")) + "."
  );
  MailApp.sendEmail({
    to: CORREO_EQUIPO,
    replyTo: lead.correo, // "Responder" le escribe directo al lead
    name: "Landing Elaniin",
    subject: "Nuevo lead: " + lead.nombre + " (" + d(lead.empresa_dominio, "sin dominio") + ")",
    // versión de texto para clientes sin HTML
    body: "Nuevo lead: " + lead.nombre + " <" + lead.correo + ">\nServicio: " + d(lead.servicio, "sin dato") + "\nSector: " + d(lead.sector, "sin dato") + "\nMensaje: " + d(lead.mensaje, "sin mensaje") + "\nRuta: " + d(lead.ruta, "sin ruta"),
    htmlBody: html,
    inlineImages: { logo: logo() }
  });
}

function confirmarAlLead(lead) {
  var html = plantilla(
    "Recibimos tus datos, " + esc(lead.nombre) + ".",
    '<p style="margin:0;">Un especialista revisará tu proyecto y te contactará para una conversación técnica inicial, sin compromiso.</p>',
    "Elaniin Tech Company"
  );
  MailApp.sendEmail({
    to: lead.correo,
    name: "Elaniin",
    subject: "Recibimos tus datos",
    body: "Hola, " + lead.nombre + ".\n\nRecibimos tus datos. Un especialista revisará tu proyecto y te contactará para una conversación técnica inicial, sin compromiso.\n\nElaniin",
    htmlBody: html,
    inlineImages: { logo: logo() }
  });
}

function responder(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Prueba manual: elige "probar" arriba y pulsa Ejecutar. Autoriza permisos, agrega una fila y te manda los dos correos de muestra. */
function probar() {
  var lead = { token: TOKEN, fecha: new Date().toISOString(), modo: "chat", variante: "software", nombre: "Prueba interna", correo: "prueba@elaniin.com", empresa_dominio: "elaniin.com", sector: "privado", servicio: "software", mensaje: "Mensaje de prueba.", ruta: "N0 > N1", chat_completo: "no" };
  guardar(lead);
  avisarAlEquipo(lead);
  confirmarAlLead({ nombre: lead.nombre, correo: CORREO_EQUIPO.split(",")[0] }); // la confirmación de muestra te llega a ti, no a un cliente
}

// Logo oficial de Elaniin (versión blanca, PNG 400x61) incrustado, para que el correo no dependa de un servidor de imágenes.
var LOGO_PNG = "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";
