/* ============================================================
   Prüfung der Regeln aus CLAUDE.md

   Aufruf:  node werkzeug/pruefen.mjs
   Läuft unter Windows, Linux und in Claude Code on the web.
   Keine Abhängigkeiten, kein npm install.

   Rückgabewert 0 = alles in Ordnung, 1 = mindestens ein Fehler.
   ============================================================ */
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";

const DATEIEN = ["dashboard.html",
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

/* Der Skriptteil wird von hinten aufgetrennt: Steht das öffnende Tag
   irgendwo vorher wörtlich im Text — in einem Kommentar etwa —, begänne
   der Ausschnitt sonst dort, und der Syntaxcheck läse Prosa als Code. */
function teile(html) {
  const c = html.match(/<style>([\s\S]*?)<\/style>/);
  const zu = html.lastIndexOf("</scr" + "ipt>");
  const auf = zu < 0 ? -1 : html.lastIndexOf("<scr" + "ipt>", zu);
  return { js: auf < 0 ? "" : html.slice(auf + 8, zu), css: c ? c[1] : "" };
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
/* U+2605 BLACK STAR und U+2606 WHITE STAR liegen knapp oberhalb des
   gepr\u00fcften Bereichs und sind trotzdem genau der Fall, den Regel 6
   meint: Ein Stern als Favoritenzeichen ist auf 16 Pixeln ein Klecks. */
const EXTRA = "\u2691\u2690\u2b1b\u2b1c\u26ab\u26aa\u2605\u2606";
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
  /* Jeder Schlüssel der obersten Ebene, nicht nur die Arrays. Ein
     einzelner Text — der Schmierzettel etwa — stünde sonst zwar in der
     Sicherung, käme beim Laden aber nie zurück, und diese Prüfung
     hätte ihn gar nicht erst bemerkt. `format` wird eigens behandelt. */
  const bereiche = [...v[1].matchAll(/^ (\w+)\s*:/gm)]      /* genau ein Einzug */
    .map(m => m[1]).filter(k => k !== "format");
  /* Der ganze Ladeblock, gleich wie viele Listen er enthält. */
  const l = js.match(/\$\("#laden"\)\.onchange[\s\S]*?bewahre\(\); male\(\);/);
  if (!l) { warn(name + ": Ladevorgang nicht gefunden"); return; }
  const geladen = [...l[0].matchAll(/"(\w+)"/g)].map(m => m[1]);
  const fehlt = bereiche.filter(b => !geladen.includes(b));
  if (fehlt.length)
    bad(name + ": Bereich wird gesichert, aber nicht geladen \u2014 " + fehlt.join(", "));
  else ok(name + ": alle " + bereiche.length + " Datenbereiche werden geladen");
}

/* ---------- Hilfetexte: vorhanden, und lesbar ----------
   Ein Modul mit eigener Fläche muss sich selbst erklären. Ohne diese
   Prüfung erschiene ein neues Modul in der Hilfe ohne Erklärung, und die
   Hilfe verfiele still — Modul für Modul.

   Dazu drei Regeln an den Stil. Sie prüfen die Form, nicht den Inhalt:
   ob ein Satz verständlich ist, sieht nur ein Mensch. Aber ein Satz mit
   dreiunddreißig Wörtern und vier Kommas ist es sicher nicht. */
const HILF_WORT = 20;   /* Wörter je Satz */
const HILF_KOMMA = 1;   /* Kommas je Satz */
const HILF_KURZ = 40;   /* Zeichen insgesamt — gegen hilfe:"TODO" */

function pruefeHilfe(name, txt){
  /* Jeder registrierte Block mit `flaeche` braucht ein `hilfe`. */
  const bloecke = [...txt.matchAll(/registriere\(\{([\s\S]*?)\n\}\);/g)]
    .map(m => m[1]);
  const fehlt = [], schlecht = [];
  bloecke.forEach(b => {
    const id = (b.match(/id:"([a-z]+)"/) || [])[1] || "?";
    if(!/\n\s*flaeche\s*[({]/.test(b)) return;      /* ohne Fläche: frei */
    const h = b.match(/hilfe:\s*((?:"(?:[^"\\]|\\.)*"\s*\+?\s*)+)/);
    if(!h){ fehlt.push(id); return; }
    /* Die Zeichenketten zusammensetzen, ohne sie auszuwerten. */
    const t = [...h[1].matchAll(/"((?:[^"\\]|\\.)*)"/g)]
      .map(x => x[1].replace(/\\"/g,'"')).join("");
    if(t.trim().length < HILF_KURZ){ schlecht.push(id+": nur "+t.trim().length+" Zeichen"); return; }
    t.split(/(?<=[.!?])\s+/).filter(x=>x.trim()).forEach(sz => {
      const w = sz.trim().split(/\s+/).length;
      const k = (sz.match(/,/g) || []).length;
      if(w > HILF_WORT) schlecht.push(id+": "+w+" Wörter — «"+sz.trim().slice(0,40)+"…»");
      if(k > HILF_KOMMA) schlecht.push(id+": "+k+" Kommas — «"+sz.trim().slice(0,40)+"…»");
    });
  });
  if(fehlt.length)
    bad(name + ": ohne Hilfetext — " + fehlt.join(", "));
  else if(schlecht.length)
    bad(name + ": Hilfetext zu verschachtelt — " + schlecht.join(" · "));
  else
    ok(name + ": alle Hilfetexte vorhanden und kurz gebaut");
}

/* ---------- 9 Ein Klassenname gehört einem Bereich ----------
   In einer einzigen Datei ohne Geltungsbereiche ist der Name die einzige
   Trennung. Wird dieselbe Klasse an zwei weit auseinanderliegenden Stellen
   beschrieben, sind es fast immer zwei verschiedene Dinge, und die
   spätere Regel überschreibt die frühere still.

   Genau so ist es passiert: Der Dialog aus Schritt 1b nannte seine
   Eingaben .feld und sein Gitter .raster. Beide Namen gehörten längst
   der Leiste und dem Planner. Das Ergebnis war ein Planner mit
   Spaltenraster und Eingabefelder in 27 Pixeln — bei grünem Prüflauf. */
function pruefeNamen(name, css) {
  const wo = {};
  css.split("\n").forEach((z, i) => {
    const m = z.match(/^([.#][^{]*)\{/);
    if (!m) return;
    m[1].split(",").forEach(s => {
      s = s.trim();
      /* Erste Klasse der Kette. Am Punkt zu zerlegen liefert einen
         leeren Namen, weil der Selektor mit einem Punkt beginnt. */
      const k = s.match(/^\.([\w-]+)/);
      if (!k) return;
      /* Nur zählen, wenn die Klasse selbst gestaltet wird. Bei
         `.note code` ist `code` das Ziel und `.note` nur die Umgebung —
         so eine Regel darf überall stehen. */
      if (/[\s>+~]/.test(s.slice(k[0].length))) return;
      (wo["." + k[1]] = wo["." + k[1]] || []).push(i + 1);
    });
  });
  const doppelt = Object.entries(wo)
    .map(([k, l]) => [k, l[l.length - 1] - l[0], l])
    .filter(([, spanne]) => spanne > 25);
  if (doppelt.length)
    bad(name + ": Klassenname in zwei Bereichen — "
        + doppelt.map(([k, , l]) => k + " (Zeilen " + l[0] + " und " + l[l.length - 1] + ")")
                 .join(", ") + "  (umbenennen, die spätere Regel gewinnt still)");
  else ok(name + ": jeder Klassenname gehört einem Bereich");
}

/* ---------- 10 README gegen die Anwendung ----------
   Eine Zahl im README veraltet lautlos. Schlimmer: Eine Ersetzung, die
   den Text nicht trifft, tut nichts und meldet nichts — genau so stand
   dort nach Schritt 2 weiter „zehn Fehler" und „neun Module als Gerüst",
   während im Schrittbericht „README nachgezogen" abgehakt war.
   Deshalb zählt der Prüfer die drei Zahlen selbst nach. ---------- */
function pruefeReadme() {
  if (!existsSync("README.md") || !existsSync("dashboard.html")) return;
  /* Zeilenumbrüche glätten: Der Satz darf im Dokument umbrechen, wo er will. */
  const rm = readFileSync("README.md", "utf8").replace(/\s+/g, " ");
  const js = teile(readFileSync("dashboard.html", "utf8")).js;

  const abw = [];
  const vgl = (was, ist, muster) => {
    const t = rm.match(muster);
    if (!t) abw.push(was + ": Angabe im README nicht gefunden");
    else if (Number(t[1]) !== ist)
      abw.push(was + ": README sagt " + t[1] + ", tatsächlich " + ist);
  };

  if (existsSync("doku/FEHLERBUCH.md")) {
    const fb = readFileSync("doku/FEHLERBUCH.md", "utf8");
    vgl("Fehlerbuch", (fb.match(/^## \d+ \u2014 /gm) || []).length,
        /(\d+) Fehler, die schon passiert sind/);
  }
  const module = (js.match(/registriere\(\{/g) || []).length;
  const geruest = (js.match(/^\s*geruest\s*:/gm) || []).length;
  vgl("Module",  module,           /(\d+) Module angemeldet/);
  vgl("fertig",  module - geruest, /Module angemeldet, davon (\d+) fertig/);
  vgl("Gerüst",  geruest,          /davon \d+ fertig und (\d+) als Ger/);

  if (abw.length) bad("README: " + abw.join(" \u00b7 "));
  else ok("README: Zahlen stimmen mit der Anwendung überein");
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
  pruefeNamen(f, css);
  pruefeMarker(f, js);
  if (f === "dashboard.html") pruefeSicherung(f, js);
  if (f === "dashboard.html") pruefeHilfe(f, js);
}
console.log("\nÜbergreifend");
pruefeReadme();

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
