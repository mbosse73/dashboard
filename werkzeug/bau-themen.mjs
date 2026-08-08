/* Erzeugt mockups/themen.html — fünf Entwürfe für ein drittes Thema.
   Aufruf: node werkzeug/bau-themen.mjs

   Jeder Entwurf zeigt denselben Ausschnitt: Kopf, Überfälliges, nächster
   Termin, angeheftete Plätze, Modulliste. Nur so lässt sich vergleichen.

   Die Kontrastwerte darunter sind gerechnet, nicht behauptet. */

import { writeFileSync } from "node:fs";

/* ---------- Kontrast, nach WCAG 2.1 ---------- */
const kanal = c => { c /= 255; return c <= .03928 ? c/12.92 : ((c+.055)/1.055)**2.4; };
function leucht(hex){
  const h = hex.replace("#","");
  const v = h.length === 3 ? [...h].map(x=>x+x) : h.match(/../g);
  const [r,g,b] = v.map(x=>parseInt(x,16));
  return .2126*kanal(r) + .7152*kanal(g) + .0722*kanal(b);
}
function kontrast(a,b){
  const [x,y] = [leucht(a), leucht(b)].sort((p,q)=>q-p);
  return (x + .05) / (y + .05);
}
const zwei = n => n.toFixed(2).replace(".", ",");

/* ---------- Die fünf Entwürfe ----------
   `t` sind die Tokens, die es heute schon gibt. `extra` ist alles, was
   heute **nicht** als Token existiert — jeder Eintrag dort ist ein
   Umbau an der Datei, kein Themenwechsel. Das ist der ehrliche Teil. */
const THEMEN = [

{ id:"nacht", nm:"A — Nacht", unter:"Dunkel, ruhig, für lange Sitzungen",
  radikal:"Ja. Kehrt Regel 4 aus CLAUDE.md um.",
  worum:`Der Bildschirm wird dunkel, der Text hell. Das ist nicht bloß eine
    andere Farbe: Die harte Regel <code>color-scheme: light</code> gibt es,
    damit Windows im Dunkelmodus nicht selbst schwarz einfärbt. Für dieses
    Thema müsste sie zu <code>dark</code> werden — und der Prüflauf, der sie
    heute erzwingt, müsste das erlauben.`,
  t:{ paper:"#16181d", sheet:"#1c1f26", raise:"#262a33",
      rule:"#2f343f", rule2:"#454c5b",
      ink:"#e8eaee", ink2:"#b3b9c4", ink3:"#949bab",
      tinte:"#8ab4f8", tinteS:"#232c3d",
      wegS:"#232c3d", wegI:"#8ab4f8", wegR:"#33405a",
      signal:"#f2846b", signalS:"#3a221c",
      gut:"#7fc99a", gutS:"#1e2f26",
      kUrlaub:"#2c4838", kSonst:"#2a3450" },
  extra:["color-scheme: dark statt light","Prüfpunkt in pruefen.mjs anpassen",
         "Schatten sind im Dunkeln unsichtbar — 15 Stellen bräuchten Ränder"] },

{ id:"zeitung", nm:"B — Zeitung", unter:"Schwarz auf Weiß, Linien statt Flächen",
  radikal:"Mittel. Fast alles über Tokens, drei Regeln daneben.",
  worum:`Nichts ist gefüllt. Es gibt keine grauen Kästen, keine abgerundeten
    Kacheln — nur Haarlinien und Weißraum. Die Überschriften stehen in der
    Serifenschrift, die die Datei schon kennt. Farbe kommt genau einmal vor:
    Rot für Überfälliges. Alles andere ist Schwarz, Weiß und eine Linie.`,
  t:{ paper:"#ffffff", sheet:"#ffffff", raise:"#f4f4f2",
      rule:"#dcdcda",  rule2:"#a8a8a4",
      ink:"#111111",   ink2:"#3d3d3b", ink3:"#5c5c58",
      tinte:"#111111", tinteS:"#ebebe9",
      wegS:"#f4f4f2",  wegI:"#3d3d3b", wegR:"#dcdcda",
      signal:"#b5241a",signalS:"#fbeceb",
      gut:"#2f2f2d",   gutS:"#efefed",
      kUrlaub:"#e4e4e0", kSonst:"#d2d2ce" },
  extra:["Serifenschrift in allen Überschriften, nicht nur im Dialogtitel",
         "Jahreskalender: die zwei Kategoriefarben werden hier zu Grau",
         "Radien auf 0 — 92 Stellen stehen hart in der Datei"] },

{ id:"akte", nm:"C — Akte", unter:"Neo-brutalistisch: harte Kanten, harte Schatten",
  radikal:"Ja. Die Form ändert sich, nicht nur die Farbe.",
  worum:`Kästen bekommen einen kräftigen schwarzen Rand und einen versetzten
    Schatten ohne Weichzeichnung — sie sehen aus wie aufgelegte Karteikarten.
    Nichts ist rund. Beschriftungen stehen in der Schreibmaschinenschrift.
    Das ist die auffälligste der fünf Fassungen und die einzige, die man
    quer durch den Raum erkennt.`,
  t:{ paper:"#f2efe6", sheet:"#fffdf7", raise:"#e6e1d2",
      rule:"#1a1a18",  rule2:"#1a1a18",
      ink:"#1a1a18",   ink2:"#403c34", ink3:"#5a554a",
      tinte:"#1f3fb8", tinteS:"#dfe4fa",
      wegS:"#dfe4fa",  wegI:"#1f3fb8", wegR:"#1a1a18",
      signal:"#c81e0f",signalS:"#ffe3df",
      gut:"#16743f",   gutS:"#d9f0e2",
      kUrlaub:"#bfe0cb", kSonst:"#c9d3f7" },
  extra:["Radien auf 0 — 92 Stellen","Ränder auf 2px — 54 Stellen",
         "Versetzte Schatten ohne Weichzeichnung — 15 Stellen",
         "Ohne neue Tokens für Radius, Rand und Schatten geht das nicht"] },

{ id:"klar", nm:"D — Klar", unter:"Höchster Kontrast, für schlechte Sicht",
  radikal:"Nein. Reiner Tokenwechsel.",
  worum:`Kein Stil, sondern eine Hilfe. Jede Textfarbe erreicht 7 : 1 statt
    der geforderten 4,5 : 1 — das ist die strengste Stufe der
    Zugänglichkeitsregeln. Grautöne verschwinden fast ganz: Was heute in
    <code>ink3</code> steht und schwer zu lesen ist, wird hier dunkel.
    Nützlich bei Sonnenlicht auf dem Bildschirm oder müden Augen.`,
  t:{ paper:"#ffffff", sheet:"#ffffff", raise:"#eeeeee",
      rule:"#767676",  rule2:"#494949",
      ink:"#000000",   ink2:"#1c1c1c", ink3:"#333333",
      tinte:"#00308f", tinteS:"#dde4f6",
      wegS:"#dde4f6",  wegI:"#00308f", wegR:"#8e9bc4",
      signal:"#a00000",signalS:"#ffe4e4",
      gut:"#125c32",   gutS:"#d9efe2",
      kUrlaub:"#bcdcc8", kSonst:"#c3cdea" },
  extra:["Fokusrahmen auf 3px — heute 2px, eine Stelle"] },

{ id:"daemmer", nm:"E — Dämmerung", unter:"Warm gedämpft, wenig Blendung",
  radikal:"Nein. Reiner Tokenwechsel, näher am Bestehenden.",
  worum:`Dasselbe Dashboard, nur ohne das helle Weiß. Der Grund ist die
    Blendung: Die heutige Fläche ist fast weiß, und wer stundenlang darauf
    sieht, merkt das. Diese Fassung nimmt die Helligkeit um ein Viertel
    zurück und behält alles andere. Von den fünf ist es die risikoärmste —
    und die, die man nach einer Woche nicht mehr bemerkt.`,
  t:{ paper:"#eee7d8", sheet:"#f7f2e5", raise:"#e2dac7",
      rule:"#d2c9b3",  rule2:"#b3a992",
      /* #6e6553 kam auf 4,13 : 1 auf `raise` und verfehlte die eigene
         Regel — derselbe Fehler wie einst bei --ink3 im Standardthema. */
      ink:"#40382c",   ink2:"#5c5343", ink3:"#645c4a",
      tinte:"#2b5f8c", tinteS:"#dfe8ef",
      wegS:"#dfe8ef",  wegI:"#2b5f8c", wegR:"#bccdd9",
      signal:"#9c3520",signalS:"#f6e2d9",
      gut:"#4a6b2f",   gutS:"#e6eddb",
      kUrlaub:"#cbdcbc", kSonst:"#c6d3de" },
  extra:[] }
];

/* Der Tippfehler oben wäre unbemerkt durchgegangen — deshalb prüfen. */
for(const th of THEMEN){
  for(const [k,v] of Object.entries(th.t)){
    if(!/^#[0-9a-f]{6}$/i.test(v))
      throw new Error(th.id+": "+k+" ist kein Farbwert: "+v);
  }
}

/* ---------- Die geprüften Paare ----------
   Tragender Text auf jeder Fläche, auf der er wirklich vorkommt. */
const PAARE = [
  ["ink",  "paper", "Text auf Fläche"],
  ["ink2", "sheet", "Nebentext auf Karte"],
  ["ink3", "paper", "Metazeile auf Fläche"],
  ["ink3", "raise", "Metazeile auf Leiste"],
  ["tinte","sheet", "Tinte auf Karte"],
  ["signal","signalS","Überfällig"]
];

const esc = s => String(s).replace(/[&<>]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));

function tokenBlock(t){
  return `
    --paper:${t.paper}; --sheet:${t.sheet}; --raise:${t.raise};
    --rule:${t.rule}; --rule2:${t.rule2};
    --ink:${t.ink}; --ink2:${t.ink2}; --ink3:${t.ink3};
    --tinte:${t.tinte}; --tinte-s:${t.tinteS};
    --weg-s:${t.wegS}; --weg-i:${t.wegI}; --weg-r:${t.wegR};
    --signal:${t.signal}; --signal-s:${t.signalS};
    --gut:${t.gut}; --gut-s:${t.gutS};
    --k-urlaub:${t.kUrlaub}; --k-sonst:${t.kSonst};`;
}

/* Was über Tokens hinausgeht, steht hier — bewusst getrennt, damit man
   sieht, wie viel ein Entwurf über den reinen Farbwechsel hinaus kostet. */
const FORM = {
  zeitung:`
    .p[data-t="zeitung"] .karte,.p[data-t="zeitung"] .kachel{border-radius:0}
    .p[data-t="zeitung"] .titel,.p[data-t="zeitung"] .naechst-t{
      font-family:Georgia,"Palatino Linotype",serif;font-weight:700;letter-spacing:0}
    .p[data-t="zeitung"] .kachel{box-shadow:none}`,
  akte:`
    .p[data-t="akte"] .karte,.p[data-t="akte"] .kachel,.p[data-t="akte"] .knopf,
    .p[data-t="akte"] .zeile{border-radius:0}
    .p[data-t="akte"] .karte,.p[data-t="akte"] .kachel{
      border:2px solid var(--ink);box-shadow:4px 4px 0 var(--ink)}
    .p[data-t="akte"] .abschn,.p[data-t="akte"] .kachel b{
      font-family:Consolas,"Cascadia Mono",monospace;text-transform:uppercase}
    .p[data-t="akte"] .knopf{border:2px solid var(--ink);box-shadow:3px 3px 0 var(--ink)}`,
  klar:`
    .p[data-t="klar"] .karte,.p[data-t="klar"] .kachel{border-color:var(--rule)}`,
  nacht:`
    .p[data-t="nacht"] .kachel,.p[data-t="nacht"] .karte{box-shadow:none}`
};

function platte(th){
  const t = th.t;
  const werte = PAARE.map(([a,b,nm])=>{
    const v = kontrast(t[a], t[b]);
    const gut = v >= 4.5;
    return `<tr class="${gut?"":"schlecht"}"><td>${esc(nm)}</td>
      <td class="z">${zwei(v)} : 1</td><td>${gut?"trägt":"zu schwach"}</td></tr>`;
  }).join("");

  const extra = th.extra.length
    ? `<ul class="extra">${th.extra.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`
    : `<p class="extra keine">Nichts. Dieser Entwurf ist ein reiner
        Tokenwechsel — er kommt mit demselben Bauteil aus wie Basecamp.</p>`;

  return `
<section class="entwurf">
  <header class="ek">
    <h2>${esc(th.nm)}</h2>
    <p class="unter">${esc(th.unter)}</p>
    <p class="rad"><b>Umbau nötig?</b> ${esc(th.radikal)}</p>
  </header>
  <div class="worum">${th.worum}</div>

  <div class="p" data-t="${th.id}" style="${tokenBlock(t)}">
    <div class="kopf">
      <span class="zeit">09:42</span><span class="dat">Fr · 8. August</span>
      <span class="sp"></span>
      <span class="wechsel"><b>Standard</b><i>Basecamp</i><i>${esc(th.nm.slice(4))}</i></span>
      <span class="akt">Sichern</span>
    </div>
    <div class="rumpf">
      <div class="spalte">
        <div class="abschn">Überfällig <em>3</em></div>
        <div class="karte spaet">
          <div class="zeile"><b>Angebot Meyer prüfen</b><span class="mark">überfällig</span></div>
          <div class="meta">Frist 6. August · Aufgabe</div>
        </div>
        <div class="karte spaet">
          <div class="zeile"><b>Rückruf Hansen</b><span class="mark">überfällig</span></div>
          <div class="meta">Frist 7. August · Nachverfolgen</div>
        </div>

        <div class="abschn">Als Nächstes</div>
        <div class="karte">
          <div class="naechst-t">Abstimmung Rollout</div>
          <div class="meta">10:30 – 11:15 · Raum 2 · in 48 Minuten</div>
        </div>

        <div class="abschn">Häufig benutzt <em>4 von 12</em></div>
        <div class="gitter">
          <span class="kachel"><b>01</b>Kontakte</span>
          <span class="kachel"><b>04</b>Aufgaben</span>
          <span class="kachel"><b>09</b>Outliner</span>
          <span class="kachel leer">frei</span>
        </div>
      </div>
      <div class="spalte">
        <div class="abschn">Module</div>
        <div class="liste">
          <span class="zeile ml"><b>07</b>Planner öffnen<em>Strg P</em></span>
          <span class="zeile ml"><b>16</b>Code-Beautifier<em></em></span>
          <span class="zeile ml"><b>17</b>Einstellungen<em></em></span>
        </div>
        <div class="abschn">Kalender</div>
        <div class="jahr">
          <span class="tag"></span><span class="tag u"></span><span class="tag u"></span>
          <span class="tag u"></span><span class="tag"></span><span class="tag we"></span>
          <span class="tag we"></span><span class="tag"></span><span class="tag s"></span>
          <span class="tag s"></span><span class="tag"></span><span class="tag"></span>
          <span class="tag we"></span><span class="tag we"></span>
        </div>
        <div class="legende">
          <span><i class="sw u"></i>Urlaub</span><span><i class="sw s"></i>Sonstiges</span>
        </div>
        <div class="knopfreihe">
          <span class="knopf">Speichern</span><span class="knopf still">Abbrechen</span>
        </div>
      </div>
    </div>
  </div>

  <div class="pruef">
    <table>
      <thead><tr><th>Geprüft</th><th class="z">Kontrast</th><th>Urteil</th></tr></thead>
      <tbody>${werte}</tbody>
    </table>
    <div class="kosten">
      <h3>Was über einen Tokenwechsel hinausgeht</h3>
      ${extra}
    </div>
  </div>
</section>`;
}

const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Entwürfe für ein drittes Thema</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{color-scheme:light;
  --ff:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
body{font-family:var(--ff);background:#e9e6df;color:#1a1a18;padding:26px;
  -webkit-font-smoothing:antialiased}
.hut{max-width:1080px;margin:0 auto 30px}
.hut h1{font-size:25px;letter-spacing:-.02em;margin-bottom:9px}
.hut p{font-size:14px;line-height:1.65;color:#54514b;max-width:74ch;margin-bottom:8px}
.hut code{font-family:Consolas,monospace;font-size:12.5px;background:#fffefb;
  padding:1px 5px;border-radius:4px;border:1px solid #d8d4ca}
.warnhut{background:#fbe9e5;border:1px solid #f0cfc7;border-radius:9px;
  padding:13px 15px;margin-top:14px}
.warnhut b{color:#a8321f}

.entwurf{max-width:1080px;margin:0 auto 34px;background:#fffefb;border:1px solid #d8d4ca;
  border-radius:13px;overflow:hidden}
.ek{padding:17px 20px 0}
.ek h2{font-size:19px;letter-spacing:-.01em}
.unter{font-size:13px;color:#6b675e;margin-top:3px}
.rad{font-size:12.5px;color:#54514b;margin-top:7px}
.worum{padding:12px 20px 16px;font-size:13.5px;line-height:1.7;color:#3d3a35;max-width:80ch}
.worum code{font-family:Consolas,monospace;font-size:12px;background:#f2efe8;
  padding:1px 5px;border-radius:4px}

/* ---------- Der Ausschnitt ---------- */
.p{background:var(--paper);border-top:1px solid #d8d4ca;border-bottom:1px solid #d8d4ca}
.p .kopf{display:flex;align-items:center;gap:11px;padding:10px 18px;
  background:var(--sheet);border-bottom:1px solid var(--rule);font-size:12px}
.p .zeit{color:var(--ink2);font-weight:600;letter-spacing:.06em}
.p .dat{color:var(--ink3);letter-spacing:.05em}
.p .sp{flex:1}
.p .wechsel{display:inline-flex;gap:2px;background:var(--raise);border-radius:8px;padding:3px}
.p .wechsel b,.p .wechsel i{font-style:normal;font-size:11.5px;padding:4px 10px;
  border-radius:6px;color:var(--ink2)}
.p .wechsel b{background:var(--sheet);color:var(--tinte);font-weight:600}
.p .akt{font-size:11.5px;color:var(--ink2);border:1px solid var(--rule2);
  border-radius:7px;padding:4px 10px;background:var(--paper)}
.p .rumpf{display:grid;grid-template-columns:1.35fr 1fr;gap:20px;padding:16px 18px 20px}
.p .spalte{min-width:0}
.p .abschn{font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;
  color:var(--ink3);font-weight:700;margin:14px 0 7px;display:flex;gap:8px}
.p .spalte>.abschn:first-child{margin-top:0}
.p .abschn em{font-style:normal;font-weight:500;letter-spacing:.04em}
.p .karte{background:var(--sheet);border:1px solid var(--rule);border-radius:9px;
  padding:9px 11px;margin-bottom:6px}
.p .karte.spaet{border-left:3px solid var(--signal)}
.p .zeile{display:flex;align-items:center;gap:9px;font-size:13px;color:var(--ink)}
.p .zeile b{font-weight:600}
.p .mark{margin-left:auto;font-size:10.5px;font-weight:700;color:var(--signal);
  background:var(--signal-s);padding:2px 7px;border-radius:5px;letter-spacing:.03em}
.p .meta{font-size:11.5px;color:var(--ink3);margin-top:3px}
.p .naechst-t{font-size:15px;font-weight:600;color:var(--ink);letter-spacing:-.01em}
.p .gitter{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}
.p .kachel{background:var(--sheet);border:1px solid var(--rule);border-radius:8px;
  padding:9px;font-size:11.5px;color:var(--ink2);display:block;
  box-shadow:0 1px 2px rgba(0,0,0,.05)}
.p .kachel b{display:block;font-size:10px;letter-spacing:.08em;color:var(--tinte);
  margin-bottom:3px}
.p .kachel.leer{background:var(--raise);color:var(--ink3);border-style:dashed}
.p .liste{display:flex;flex-direction:column;gap:3px}
.p .zeile.ml{background:var(--sheet);border:1px solid var(--rule);border-radius:8px;
  padding:7px 10px;font-size:12.5px;color:var(--ink2)}
.p .zeile.ml b{font-size:10.5px;letter-spacing:.07em;color:var(--tinte);min-width:20px}
.p .zeile.ml em{margin-left:auto;font-style:normal;font-size:10.5px;color:var(--ink3)}
.p .jahr{display:grid;grid-template-columns:repeat(14,1fr);gap:2px}
.p .tag{height:26px;background:var(--sheet);border:1px solid var(--rule);border-radius:3px}
.p .tag.we{background:var(--raise)}
.p .tag.u{background:var(--k-urlaub)}
.p .tag.s{background:var(--k-sonst)}
.p .legende{display:flex;gap:15px;margin-top:7px;font-size:11px;color:var(--ink3)}
.p .legende span{display:inline-flex;align-items:center;gap:5px}
.p .sw{width:12px;height:12px;border-radius:3px;border:1px solid var(--rule2);display:block}
.p .sw.u{background:var(--k-urlaub)} .p .sw.s{background:var(--k-sonst)}
.p .knopfreihe{display:flex;gap:8px;margin-top:16px}
.p .knopf{font-size:12px;font-weight:600;padding:7px 14px;border-radius:8px;
  background:var(--tinte-s);color:var(--tinte);border:1px solid var(--rule)}
.p .knopf.still{background:var(--paper);color:var(--ink2)}
${Object.values(FORM).join("\n")}

/* ---------- Prüfteil ---------- */
.pruef{display:grid;grid-template-columns:1fr 1fr;gap:20px;padding:16px 20px 19px}
.pruef table{border-collapse:collapse;width:100%;font-size:12.5px}
.pruef th{text-align:left;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;
  color:#6b675e;padding-bottom:5px;border-bottom:1px solid #e2ded4;font-weight:700}
.pruef td{padding:4px 0;border-bottom:1px solid #efece4;color:#3d3a35}
/* Ohne diesen Abstand stand „14,74 : 1" und „trägt" ohne Lücke
   nebeneinander und las sich als ein Wort. */
.pruef th+th,.pruef td+td{padding-left:14px}
.pruef .z{text-align:right;font-family:Consolas,monospace;font-variant-numeric:tabular-nums;
  white-space:nowrap}
.pruef th.z{text-align:right}
.pruef tr.schlecht td{color:#a8321f;font-weight:600}
.kosten h3{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#6b675e;
  margin-bottom:7px}
.extra{font-size:12.5px;line-height:1.6;color:#3d3a35;padding-left:17px}
.extra.keine{padding-left:0;color:#2b6b46}
@media(max-width:860px){.pruef{grid-template-columns:1fr}.p .rumpf{grid-template-columns:1fr}}
</style>
</head>
<body>

<div class="hut">
  <h1>Fünf Entwürfe für ein drittes Thema</h1>
  <p>Jeder Entwurf zeigt denselben Ausschnitt der Leiste, damit sich die
     Fassungen vergleichen lassen. Die Kontrastwerte darunter sind
     gerechnet, nicht geschätzt — <code>4,5 : 1</code> ist die Grenze aus
     <code>CLAUDE.md</code>.</p>
  <p>Wichtig ist die Zeile <b>„Umbau nötig?"</b> und die Liste rechts unten.
     Ein Thema ist heute nur ein Satz Farbwerte. Alles, was Form betrifft —
     Radius, Randstärke, Schatten —, steht hart in der Datei: 92 Radien,
     54 Ränder, 15 Schatten. Wer die Form ändern will, muss sie vorher zu
     Tokens machen.</p>
  <div class="warnhut">
    <p><b>Der Ausschnitt hier ist nachgebaut, nicht die echte Anwendung.</b>
       Er benutzt dieselben Tokennamen und dieselben Maße, ist aber eine
       eigene Datei. Wie ein Entwurf wirklich aussieht, zeigt sich erst,
       wenn seine Werte in <code>dashboard.html</code> stehen.</p>
  </div>
</div>

${THEMEN.map(platte).join("\n")}

</body>
</html>
`;

writeFileSync(new URL("../mockups/themen.html", import.meta.url), html);

/* Kurzbericht auf der Konsole — welcher Entwurf reißt die Grenze? */
let mies = 0;
for(const th of THEMEN){
  const schlecht = PAARE.filter(([a,b])=>kontrast(th.t[a], th.t[b]) < 4.5);
  if(schlecht.length){
    mies++;
    console.log(th.nm+": "+schlecht.length+" Paar(e) unter 4,5 : 1 — "
      + schlecht.map(([a,b])=>a+" auf "+b+" = "+zwei(kontrast(th.t[a],th.t[b]))).join(", "));
  } else console.log(th.nm+": alle Paare tragen");
}
console.log(mies ? "\n"+mies+" Entwurf/Entwürfe nachbessern" : "\nAlle fünf tragen");
console.log("mockups/themen.html geschrieben");
