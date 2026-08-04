/* ============================================================
   Prüfung der Regeln aus CLAUDE.md

   Aufruf:  node werkzeug/pruefen.mjs
   Läuft unter Windows, Linux und in Claude Code on the web.
   Keine Abhängigkeiten, kein npm install.

   Rückgabewert 0 = alles in Ordnung, 1 = mindestens ein Fehler.
   ============================================================ */
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";

const DATEIEN = ["dashboard.html", "referenz/theme-notion.html",
                 "referenz/workflow-dialog.html", "browsertest.html"];

/* Fehlt eine Datei aus dieser Liste, ist das ein Fehler und kein Hinweis.
   Sonst läuft die Prüfung grün durch, ohne die Anwendung angesehen zu
   haben — ein Prüflauf, der nichts geprüft hat, ist schlimmer als keiner.
   Genau das ist passiert, als dashboard.html vorübergehend index.html hieß. */
const PFLICHT = ["dashboard.html"];

let fehler = 0, warnungen = 0;
const ok   = (t) => console.log("  \u2713 " + t);
const bad  = (t) => { console.log("  \u2717 " + t); fehler++; };
const warn = (t) => { console.log("  ! " + t); warnungen++; };

function teile(html) {
  const s = html.match(/<script>([\s\S]*?)<\/script>/);
  const c = html.match(/<style>([\s\S]*?)<\/style>/);
  return { js: s ? s[1] : "", css: c ? c[1] : "" };
}

/* ---------- 1 Syntax ---------- */
function pruefeSyntax(name, js) {
  if (!js.trim()) { warn(name + ": kein Skript gefunden"); return; }
  try { new vm.Script(js, { filename: name }); ok(name + ": Syntax"); }
  catch (e) { bad(name + ": Syntaxfehler \u2014 " + e.message); }
}

/* ---------- 2 Keine externen Abhängigkeiten ---------- */
function pruefeExtern(name, html) {
  const treffer = [];
  const muster = [
    [/<script[^>]+src=/i,        "<script src>"],
    [/<link[^>]+rel=["']?stylesheet/i, "<link stylesheet>"],
    [/@import\s/i,               "@import"],
    [/https?:\/\/cdn\./i,        "CDN-Adresse"],
    [/\bfetch\s*\(/,             "fetch()"],
    [/new\s+XMLHttpRequest/,     "XMLHttpRequest"],
    [/@font-face/i,              "@font-face"]
  ];
  muster.forEach(([re, was]) => { if (re.test(html)) treffer.push(was); });
  if (treffer.length) bad(name + ": externe Abhängigkeit \u2014 " + treffer.join(", "));
  else ok(name + ": keine externen Abhängigkeiten");
}

/* ---------- 3 Keine gefüllten Block- und Formzeichen als Icons ----------
   U+2580–U+259F Blockelemente, U+25A0–U+25FF geometrische Formen.
   Keines davon eignet sich als Symbol; sie rendern als dunkle Flächen.
   Dazu eine kurze Liste einzelner Ausreißer aus anderen Blöcken.       */
const EXTRA = "\u2691\u2690\u2b1b\u2b1c\u26ab\u26aa";
function pruefeGlyphen(name, html) {
  const schlecht = new Set();
  for (const c of html) {
    const p = c.codePointAt(0);
    if ((p >= 0x2580 && p <= 0x25ff) || EXTRA.includes(c)) schlecht.add(c);
  }
  if (schlecht.size)
    bad(name + ": gefüllte Zeichen als Symbol \u2014 " + [...schlecht].join(" ")
        + "  (Inline-SVG verwenden)");
  else ok(name + ": keine gefüllten Zeichen");
}

/* ---------- 4 Farbschema ---------- */
function pruefeSchema(name, css) {
  if (/color-scheme\s*:\s*light/.test(css)) ok(name + ": color-scheme gesetzt");
  else bad(name + ": color-scheme: light fehlt \u2014 Dunkelmodus färbt selbst ein");
}

/* ---------- 5 display gehört nicht in eine ID-Regel ---------- */
function pruefeSpezifitaet(name, css) {
  const treffer = [...css.matchAll(/#[\w-]+\s*\{[^}]*\bdisplay\s*:/g)].map(m => m[0].slice(0, 30));
  if (treffer.length)
    bad(name + ": display in ID-Regel \u2014 " + treffer.join(" | ")
        + "  (bricht das Umschalten)");
  else ok(name + ": kein display in ID-Regeln");
}

/* ---------- 6 Flächen bemalt ---------- */
function pruefeFlaechen(name, css) {
  const fehlend = [];
  if (!/html\s*,\s*body\s*\{[^}]*background[^}]*!important/.test(css))
    fehlend.push("html,body ohne !important-Hintergrund");
  [".app"].forEach(k => {
    const re = new RegExp("\\" + k + "\\s*\\{[^}]*background");
    if (css.includes(k + "{") && !re.test(css)) fehlend.push(k + " ohne background");
  });
  if (fehlend.length) warn(name + ": " + fehlend.join(", "));
  else ok(name + ": Flächen bemalt");
}

/* ---------- 7 Modulmarker paarweise ---------- */
function pruefeMarker(name, js) {
  const auf = [...js.matchAll(/\/\* ===== MODUL (\w+) ===== \*\//g)].map(m => m[1]);
  const zu  = [...js.matchAll(/\/\* ===== ENDE (\w+) ===== \*\//g)].map(m => m[1]);
  const fehlt = auf.filter(x => !zu.includes(x)).concat(zu.filter(x => !auf.includes(x)));
  if (fehlt.length) bad(name + ": Marker unpaarig \u2014 " + fehlt.join(", "));
  else if (auf.length) ok(name + ": " + auf.length + " Modulmarker paarig");
}

/* ---------- 8 Jeder Datenbereich wird auch geladen ----------
   Der häufigste Fehler beim Anlegen eines Moduls: Bereich in vorgabe()
   ergänzt, aber in der Liste im Ladevorgang vergessen. Dann funktioniert
   das Modul, seine Daten überleben aber kein Laden einer Sicherung.   */
function pruefeSicherung(name, js) {
  const v = js.match(/function vorgabe\(\)\s*\{\s*return\s*\{([\s\S]*?)\n\};\}/);
  if (!v) { warn(name + ": vorgabe() nicht gefunden"); return; }
  const bereiche = [...v[1].matchAll(/^\s*(\w+)\s*:\s*\[/gm)].map(m => m[1]);
  const l = js.match(/\[([^\]]*?)\]\.forEach\(k=>\{\s*if\(Array\.isArray\(neu\[k\]\)\)/);
  if (!l) { warn(name + ": Liste im Ladevorgang nicht gefunden"); return; }
  const geladen = [...l[1].matchAll(/"(\w+)"/g)].map(m => m[1]);
  const fehlt = bereiche.filter(b => !geladen.includes(b));
  if (fehlt.length)
    bad(name + ": Bereich wird gesichert, aber nicht geladen \u2014 " + fehlt.join(", "));
  else ok(name + ": alle " + bereiche.length + " Datenbereiche werden geladen");
}

/* ---------- 9 Notion-Fassung deckungsgleich ---------- */
function pruefeFassungen() {
  if (!existsSync("dashboard.html") || !existsSync("referenz/theme-notion.html")) return;
  const a = teile(readFileSync("dashboard.html", "utf8"));
  const b = teile(readFileSync("referenz/theme-notion.html", "utf8"));
  if (a.js !== b.js)
    bad("Notion-Fassung: Logik weicht ab \u2014 Stylesheet neu übertragen");
  else ok("Notion-Fassung: Logik deckungsgleich");
  const klassen = (css) => new Set([...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map(m => m[1]));
  const fehlt = [...klassen(a.css)].filter(k => !klassen(b.css).has(k));
  if (fehlt.length) warn("Notion-Fassung: Regeln fehlen \u2014 " + fehlt.join(", "));
}

/* ============================================================ */
console.log("\nPrüfung nach CLAUDE.md\n" + "\u2500".repeat(52));
let gesehen = 0;
for (const f of DATEIEN) {
  if (!existsSync(f)) {
    (PFLICHT.includes(f) ? bad : warn)(f + " nicht vorhanden");
    continue;
  }
  gesehen++;
  const html = readFileSync(f, "utf8");
  const { js, css } = teile(html);
  console.log("\n" + f);
  pruefeSyntax(f, js);
  pruefeExtern(f, html);
  pruefeGlyphen(f, html);
  pruefeSchema(f, css);
  pruefeSpezifitaet(f, css);
  pruefeFlaechen(f, css);
  pruefeMarker(f, js);
  if (f === "dashboard.html") pruefeSicherung(f, js);
}
console.log("\nÜbergreifend");
pruefeFassungen();

console.log("\n" + "\u2500".repeat(52));
if (fehler) {
  console.log(fehler + " Fehler, " + warnungen + " Hinweise\n");
  console.log("Nicht committen, bevor die Fehler behoben sind.\n");
  process.exit(1);
}
console.log("Keine Fehler" + (warnungen ? ", " + warnungen + " Hinweise" : "")
            + " — " + gesehen + " von " + DATEIEN.length + " Dateien angesehen\n");
console.log("Achtung: Das ersetzt nicht das Hinsehen. Sämtliche schwarzen");
console.log("Flächen aus dem Fehlerbuch haben diese Prüfung bestanden.");
console.log("dashboard.html im Browser öffnen und die geänderte Stelle ansehen.\n");
