// Run: npm test
import test from "node:test";
import assert from "node:assert/strict";
import { isCorporate, parseLead } from "./lead.ts";

const base = { nombre: " Ana ", correo: "Ana@institucion.gob.sv", consentimiento: true };

test("personal mailboxes are rejected, corporate pass", () => {
  for (const e of ["a@gmail.com", "a@yahoo.com.mx", "a@hotmail.es", "a@OUTLOOK.com"]) assert.equal(isCorporate(e), false, e);
  for (const e of ["a@elaniin.com", "a@institucion.gob.sv"]) assert.equal(isCorporate(e), true, e);
});

test("required fields", () => {
  assert.equal(parseLead({ ...base, nombre: "" }).error, "nombre");
  assert.equal(parseLead({ ...base, correo: "nope" }).error, "correo");
  assert.equal(parseLead({ ...base, correo: "a@gmail.com" }).error, "correo_personal");
  assert.equal(parseLead({ ...base, consentimiento: "true" }).error, "consentimiento");
});

test("form lead: empty profile, unknown fields dropped, enums whitelisted", () => {
  const { lead } = parseLead({ ...base, variante: "cloud", empresa: "x", perfil: { sector: "otro", tipo_plataforma: ["web", "hack"] }, utm: { utm_source: "ads", evil: "1" } }, new Date("2026-11-09T16:42:00Z"));
  assert.equal(lead.evento, "lead_creado");
  assert.equal(lead.modo, "formulario");
  assert.equal(lead.variante, "cloud");
  assert.equal(lead.nombre, "Ana");
  assert.equal(lead.correo, "ana@institucion.gob.sv");
  assert.equal(lead.fecha, "2026-11-09T16:42:00.000Z");
  assert.equal(lead.consentimiento_fecha, lead.fecha);
  assert.equal("empresa" in lead, false);
  assert.deepEqual(lead.perfil, { sector: "", servicio: "", situacion: "", nube: "", tipo_plataforma: ["web"] });
  assert.deepEqual(lead.utm, { utm_source: "ads", utm_medium: "", utm_campaign: "", utm_term: "", utm_content: "" });
  assert.deepEqual(lead.ruta, []);
});
