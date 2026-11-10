// Run: npm test
import test from "node:test";
import assert from "node:assert/strict";
import { addTurn, leadPayload, seen, start } from "./agent.ts";
import { parseLead } from "../lib/lead.ts";

const reply = (over = {}) => ({ intencion: "servicios", respuesta: "Esto aplica a una plataforma con picos de demanda.", bloques: ["cap_operacion", "caso_tse", "respaldo"], sugerencias: ["calidad", "publico"], perfil_detectado: { sector: "publico", servicio: "cloud", nube: "" }, ...over });

test("a turn shows the picked blocks once, keeps the profile and offers follow-ups", () => {
  let s = addTurn(start("cloud"), "Tenemos un portal que se cae", reply());
  assert.deepEqual(s.turns[0].blocks, ["cap_operacion", "caso_tse", "respaldo"]);
  assert.deepEqual(s.suggestions, ["calidad", "publico", "especialista"]);
  assert.deepEqual(s.perfil, { sector: "publico", servicio: "cloud", nube: "" });
  // second turn: repeated and unknown blocks are dropped, at most three, an asked suggestion is not offered again
  s = addTurn(s, "¿Cómo garantizan la calidad?", reply({ intencion: "calidad", bloques: ["caso_tse", "umbrales", "inventado", "sector_publico", "cap_qa", "cap_apigee"], sugerencias: ["calidad", "casos"], perfil_detectado: { sector: "privado", servicio: "", nube: "aws" } }));
  assert.deepEqual(s.turns[1].blocks, ["umbrales", "sector_publico", "cap_qa"]);
  assert.deepEqual(s.suggestions, ["casos", "especialista"]);
  assert.deepEqual(s.perfil, { sector: "publico", servicio: "cloud", nube: "aws" }); // what was known is not overwritten
});

test("asking for a specialist or an outage both end in the contact block, and the lead fits the contract", () => {
  // no server and a keyword match: the stand-in still fills the canvas
  const offline = addTurn(start("cloud"), "Tenemos un portal que se cae cuando hay mucha gente", null);
  assert.deepEqual(offline.turns[0].blocks, ["cap_operacion", "caso_tse", "respaldo"]);

  let s = addTurn(start("software"), "¿Usan IA?", null); // /api/chat failed and nothing matches
  assert.equal(s.turns[0].agent, "No tengo ese dato, pero un especialista te lo puede responder.");
  assert.deepEqual(s.turns[0].blocks, ["contacto"]);
  assert.equal(s.suggestions.includes("especialista"), false); // contact already on screen

  s = addTurn(addTurn(start("cloud"), "Tenemos un portal que se cae", reply()), "Hablar con un especialista", reply()); // the reply is ignored
  assert.deepEqual(s.turns[1].blocks, ["contacto"]);
  assert.deepEqual(seen(s), ["cap_operacion", "caso_tse", "respaldo", "contacto"]);

  const { ok, lead } = parseLead(leadPayload(s, { nombre: "Ana", correo: "ana@institucion.gob.sv", consentFecha: "2026-11-09T10:00:00.000Z" }, true));
  assert.equal(ok, true);
  assert.equal(lead.modo, "chat");
  assert.deepEqual(lead.perfil, { sector: "publico", servicio: "cloud", situacion: "", nube: "", tipo_plataforma: [] });
  assert.deepEqual(lead.interes.casos_vistos, ["tse"]);
  assert.deepEqual(lead.interes.temas_vistos, ["cap_operacion", "respaldo"]);
  assert.deepEqual(lead.interes.preguntas_libres, ["Tenemos un portal que se cae", "Hablar con un especialista"]);
  assert.deepEqual(lead.ruta, ["servicios", "contacto", "L4"]);
});
