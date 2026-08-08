/* Erzeugt mockups/thema-clickup.html — ein sechster Entwurf fürs dritte
   Thema, im Oberflächenstil von ClickUp.
   Aufruf: node werkzeug/bau-clickup.mjs

   Gezeigt wird derselbe Ausschnitt wie in `mockups/themen.html`, damit
   sich der Entwurf mit den fünf anderen vergleichen lässt — nur darf er
   hier Bauteile benutzen, die das Dashboard heute nicht hat: gefüllte
   Statuspillen, Prioritätsfähnchen, Personenkreise, Farbpunkte. Genau
   die machen den Stil aus; ohne sie wäre es nur ein Farbwechsel.

   **Zwei Fassungen nebeneinander, und das ist der Kern.** Links die
   echten ClickUp-Farbwerte, rechts dieselbe Gestaltung mit Farben, die
   die 4,5 : 1 aus CLAUDE.md einhalten. Die Rechnung darunter zeigt,
   warum es zwei sein müssen. */

import { writeFileSync } from "node:fs";

/* ---------- Kontrast, nach WCAG 2.1 ---------- */
const kanal = c => { c /= 255; return c <= .03928 ? c/12.92 : ((c+.055)/1.055)**2.4; };
function leucht(hex){
  const [r,g,b] = hex.slice(1).match(/../g).map(x=>parseInt(x,16));
  return .2126*kanal(r) + .7152*kanal(g) + .0722*kanal(b);
}
function kontrast(a,b){
  const [x,y] = [leucht(a), leucht(b)].sort((p,q)=>q-p);
  return (x + .05) / (y + .05);
}
const zwei = n => n.toFixed(2).replace(".", ",");

/* ---------- Die beiden Fassungen ----------
   `echt` sind die Werte, wie ClickUp sie benutzt. `treu` ist derselbe
   Entwurf, nur so weit nachgedunkelt, dass jeder Text seine 4,5 : 1
   erreicht. Die Sättigung bleibt, die Helligkeit nicht. */
const FASSUNG = {
  echt: {
    nm:"ClickUp, wie es wirklich aussieht",
    unter:"Die Originalfarbwerte. Hell, bunt, freundlich — und unter der Grenze.",
    paper:"#f7f8f9", sheet:"#ffffff", raise:"#eef0f2",
    rule:"#e4e7ea", rule2:"#c3c9d0",
    ink:"#292d34", ink2:"#4f5762", ink3:"#656f7d",
    tinte:"#7b68ee", tinteS:"#f0edfe",
    /* Die Kategoriefarben. In ClickUp trägt jede Statusstufe, jede
       Priorität und jede Liste ihre eigene — davon lebt der Stil. */
    kat:{ offen:"#c3c9d0", arbeit:"#0091ff", warte:"#f0b429",
          fertig:"#2ea043", spaet:"#e5484d" },
    prio:{ hoch:"#e5484d", mittel:"#f0b429", niedrig:"#0091ff", keine:"#c3c9d0" },
    wer:{ a:"#8b5cf6", b:"#0ea5e9", c:"#f43f5e" },
    kopf:{ a:"#7b68ee", b:"#fd71af", c:"#49ccf9" }
  },
  treu: {
    nm:"Derselbe Entwurf, regelkonform",
    unter:"Gleiche Formen, gleiche Sättigung — nur dunkel genug für 4,5 : 1.",
    paper:"#f7f8f9", sheet:"#ffffff", raise:"#eef0f2",
    rule:"#e4e7ea", rule2:"#c3c9d0",
    ink:"#292d34", ink2:"#4f5762", ink3:"#5f6b7a",
    tinte:"#6451d6", tinteS:"#eeebfd",
    kat:{ offen:"#5f6b7a", arbeit:"#0069c2", warte:"#946200",
          fertig:"#1a7f37", spaet:"#c62a2f" },
    prio:{ hoch:"#c62a2f", mittel:"#946200", niedrig:"#0069c2", keine:"#5f6b7a" },
    wer:{ a:"#6d28d9", b:"#0369a1", c:"#be123c" },
    kopf:{ a:"#6451d6", b:"#b3387a", c:"#00688c" }
  }
};

/* ---------- Was geprüft wird ----------
   Weißer Text auf einer gefüllten Pille ist der wunde Punkt dieses
   Stils: Er kommt in jeder Zeile mehrfach vor. */
const PAARE = [
  ["Text auf Fläche",        t=>[t.ink,  t.paper]],
  ["Nebentext auf Karte",    t=>[t.ink2, t.sheet]],
  ["Metazeile auf Karte",    t=>[t.ink3, t.sheet]],
  ["Akzentfarbe auf Karte",  t=>[t.tinte, t.sheet]],
  ["Weiß auf „In Arbeit“",   t=>["#ffffff", t.kat.arbeit]],
  ["Weiß auf „Wartet“",      t=>["#ffffff", t.kat.warte]],
  ["Weiß auf „Fertig“",      t=>["#ffffff", t.kat.fertig]],
  ["Weiß auf „Überfällig“",  t=>["#ffffff", t.kat.spaet]],
  ["Weiß auf dem Knopf",     t=>["#ffffff", t.tinte]],
  /* Die Personenkreise standen zuerst hart im Markup und fehlten
     deshalb hier. Weiße Initialen auf dem hellen Blau kamen auf
     2,77 : 1 — der schlechteste Wert der ganzen Seite, und er wäre
     ungeprüft durchgegangen. */
  ["Initialen im Kreis (blau)",  t=>["#ffffff", t.wer.b]],
  ["Initialen im Kreis (lila)",  t=>["#ffffff", t.wer.a]],
  ["Initialen im Kreis (rot)",   t=>["#ffffff", t.wer.c]]
];

const esc = s => String(s).replace(/[&<>]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));

/* Ein Fähnchen als Inline-SVG. Regel 6 aus CLAUDE.md verbietet gefüllte
   Schriftzeichen als Symbole — sie heißen im Standard „BLACK FLAG" und
   rendern als dunkle Blöcke. Ein SVG darf gefüllt sein; hier ist die
   Füllung der Sinn der Sache, denn die Farbe trägt die Bedeutung. */
const fahne = farbe => '<svg class="fahne" viewBox="0 0 12 14" aria-hidden="true">'
  + '<path d="M2.2 1v12" stroke="'+farbe+'" stroke-width="1.6" stroke-linecap="round"/>'
  + '<path d="M3.4 1.8h6.4L8.2 4.6l1.6 2.8H3.4z" fill="'+farbe+'"/></svg>';

const kreis = (kuerzel, farbe) =>
  '<span class="wer" style="background:'+farbe+'">'+esc(kuerzel)+'</span>';

const pille = (text, farbe) =>
  '<span class="pille" style="background:'+farbe+'">'+esc(text)+'</span>';

/* ---------- Der Ausschnitt ----------
   Inhaltlich derselbe wie in `mockups/themen.html`: Kopf, Überfälliges,
   nächster Termin, angeheftete Plätze, Modulliste, Jahresraster. */
function ausschnitt(t){
  const zeile = (fahnenFarbe, titel, meta, statusText, statusFarbe, wer, werFarbe, frist, spaet) => `
    <div class="zeile">
      ${fahne(fahnenFarbe)}
      <span class="zt">
        <b>${esc(titel)}</b>
        <em>${esc(meta)}</em>
      </span>
      ${pille(statusText, statusFarbe)}
      ${kreis(wer, werFarbe)}
      <span class="frist${spaet?" spaet":""}">${esc(frist)}</span>
    </div>`;

  return `
<div class="p">
  <div class="kopf">
    <span class="marke" style="background:linear-gradient(135deg,${t.kopf.a},${t.kopf.b})">D</span>
    <span class="zeit">09:42</span><span class="dat">Fr · 8. August</span>
    <span class="sp"></span>
    <span class="wechsel"><i>Standard</i><i>Basecamp</i><b>ClickUp</b></span>
    <span class="knopf voll">+ Neu</span>
  </div>

  <div class="rumpf">
    <div class="spalte">
      <div class="abschn"><span class="pfeil">▾</span> Überfällig
        <span class="zahl">3</span></div>
      <div class="karte liste">
        ${zeile(t.prio.hoch,"Angebot Meyer prüfen","Aufgabe · Nordstern GmbH",
          "Überfällig",t.kat.spaet,"EB",t.wer.a,"6. Aug",true)}
        ${zeile(t.prio.hoch,"Rückruf Hansen","Nachverfolgen · Kanzlei Bergmann",
          "Wartet",t.kat.warte,"MB",t.wer.b,"7. Aug",true)}
        ${zeile(t.prio.mittel,"Vertrag Meinhardt IT","Workflow · Schritt 4 von 8",
          "In Arbeit",t.kat.arbeit,"TM",t.wer.c,"7. Aug",true)}
      </div>

      <div class="abschn"><span class="pfeil">▾</span> Als Nächstes</div>
      <div class="karte gross">
        <div class="termin">
          <span class="balken" style="background:${t.tinte}"></span>
          <span class="txt">
            <b>Abstimmung Rollout</b>
            <em>10:30 – 11:15 · Raum 2 · in 48 Minuten</em>
          </span>
          ${kreis("JK",t.wer.b)}
        </div>
      </div>

      <div class="abschn"><span class="pfeil">▾</span> Häufig benutzt
        <span class="zahl">4 von 12</span></div>
      <div class="gitter">
        <span class="kachel"><i style="background:${t.kat.arbeit}"></i>Kontakte<em>Strg+1</em></span>
        <span class="kachel"><i style="background:${t.kat.fertig}"></i>Aufgaben<em>Strg+2</em></span>
        <span class="kachel"><i style="background:${t.tinte}"></i>Outliner<em>Strg+3</em></span>
        <span class="kachel leer">+ frei</span>
      </div>
    </div>

    <div class="spalte">
      <div class="abschn"><span class="pfeil">▾</span> Module</div>
      <div class="karte liste eng">
        <div class="ml"><i style="background:${t.kat.arbeit}"></i>Planner<em>Strg+P</em></div>
        <div class="ml"><i style="background:${t.kat.warte}"></i>Code-Beautifier<em></em></div>
        <div class="ml"><i style="background:${t.kat.fertig}"></i>Einstellungen<em></em></div>
      </div>

      <div class="abschn"><span class="pfeil">▾</span> Kalender</div>
      <div class="jahr">
        <span class="tag"></span><span class="tag u"></span><span class="tag u"></span>
        <span class="tag u"></span><span class="tag"></span><span class="tag we"></span>
        <span class="tag we"></span><span class="tag"></span><span class="tag s"></span>
        <span class="tag s"></span><span class="tag"></span><span class="tag"></span>
        <span class="tag we"></span><span class="tag we"></span>
      </div>
      <div class="legende">
        <span>${pille("Urlaub", t.kat.fertig)}</span>
        <span>${pille("Sonstiges", t.kat.arbeit)}</span>
      </div>

      <div class="knopfreihe">
        <span class="knopf voll">Speichern</span>
        <span class="knopf">Abbrechen</span>
      </div>
    </div>
  </div>
</div>`;
}

function stil(id, t){
  return `
.f-${id} .p{background:${t.paper};--kn:${t.tinte}}
.f-${id} .kopf{background:${t.sheet};border-bottom:1px solid ${t.rule}}
.f-${id} .marke{background:${t.tinte}}
.f-${id} .zeit{color:${t.ink2}} .f-${id} .dat{color:${t.ink3}}
.f-${id} .wechsel{background:${t.raise}}
.f-${id} .wechsel i{color:${t.ink2}}
.f-${id} .wechsel b{background:${t.sheet};color:${t.tinte}}
.f-${id} .abschn{color:${t.ink2}}
.f-${id} .abschn .pfeil{color:${t.ink3}}
.f-${id} .abschn .zahl{background:${t.raise};color:${t.ink3}}
.f-${id} .karte{background:${t.sheet};border:1px solid ${t.rule}}
.f-${id} .zeile{border-bottom:1px solid ${t.rule}}
.f-${id} .zeile:last-child{border-bottom:0}
.f-${id} .zt b{color:${t.ink}} .f-${id} .zt em{color:${t.ink3}}
.f-${id} .frist{color:${t.ink3}}
.f-${id} .frist.spaet{color:${t.kat.spaet};font-weight:600}
.f-${id} .termin b{color:${t.ink}} .f-${id} .termin em{color:${t.ink3}}
.f-${id} .kachel{background:${t.sheet};border:1px solid ${t.rule};color:${t.ink2}}
.f-${id} .kachel em{color:${t.ink3}}
.f-${id} .kachel.leer{background:${t.raise};color:${t.ink3};border-style:dashed}
.f-${id} .ml{color:${t.ink2};border-bottom:1px solid ${t.rule}}
.f-${id} .ml:last-child{border-bottom:0}
.f-${id} .ml em{color:${t.ink3}}
.f-${id} .tag{background:${t.sheet};border:1px solid ${t.rule}}
.f-${id} .tag.we{background:${t.raise}}
.f-${id} .tag.u{background:${t.kat.fertig};border-color:${t.kat.fertig}}
.f-${id} .tag.s{background:${t.kat.arbeit};border-color:${t.kat.arbeit}}
.f-${id} .knopf{background:${t.sheet};border:1px solid ${t.rule2};color:${t.ink2}}
.f-${id} .knopf.voll{background:${t.tinte};border-color:${t.tinte};color:#fff}
`;
}

function tabelle(){
  const zeilen = PAARE.map(([nm, hol])=>{
    const [ve,he] = hol(FASSUNG.echt), [vt,ht] = hol(FASSUNG.treu);
    const e = kontrast(ve,he), t = kontrast(vt,ht);
    return `<tr>
      <td>${esc(nm)}</td>
      <td class="z ${e<4.5?"schlecht":"gut"}">${zwei(e)}</td>
      <td class="pr"><span class="probe" style="background:${he};color:${ve}">Aa</span></td>
      <td class="z ${t<4.5?"schlecht":"gut"}">${zwei(t)}</td>
      <td class="pr"><span class="probe" style="background:${ht};color:${vt}">Aa</span></td>
    </tr>`;
  }).join("");
  const durch = a => PAARE.filter(([,h])=>{ const [v,hg]=h(FASSUNG[a]); return kontrast(v,hg)<4.5; }).length;
  return { zeilen, miesEcht:durch("echt"), miesTreu:durch("treu") };
}

const tab = tabelle();

const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Entwurf F — Thema im Stil von ClickUp</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{color-scheme:light;
  --ff:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
  --mono:ui-monospace,"Cascadia Mono",Consolas,monospace}
body{font-family:var(--ff);background:#e9e6df;color:#1a1a18;padding:26px;
  -webkit-font-smoothing:antialiased}
.hut{max-width:1180px;margin:0 auto 26px}
.hut h1{font-size:25px;letter-spacing:-.02em;margin-bottom:9px}
.hut p{font-size:14px;line-height:1.65;color:#54514b;max-width:76ch;margin-bottom:9px}
.hut code{font-family:var(--mono);font-size:12.5px;background:#fffefb;padding:1px 5px;
  border-radius:4px;border:1px solid #d8d4ca}
.warnhut{background:#fbe9e5;border:1px solid #f0cfc7;border-radius:9px;padding:13px 15px;
  margin-top:14px;font-size:13.5px;line-height:1.6;color:#54514b}
.warnhut b{color:#a8321f}

.rahmen{max-width:1180px;margin:0 auto 22px;background:#fffefb;border:1px solid #d8d4ca;
  border-radius:13px;overflow:hidden}
.rk{padding:15px 20px 13px}
.rk h2{font-size:18px;letter-spacing:-.01em}
.rk .unter{font-size:13px;color:#6b675e;margin-top:3px}
.rk .stempel{display:inline-block;margin-top:9px;font-size:11.5px;font-weight:700;
  padding:3px 10px;border-radius:20px}
.stempel.nein{background:#fbe9e5;color:#a8321f}
.stempel.ja{background:#e3f0e8;color:#2b6b46}

/* ---------- Der Ausschnitt, in beiden Fassungen gleich gebaut ---------- */
.p{border-top:1px solid #d8d4ca}
.p .kopf{display:flex;align-items:center;gap:11px;padding:10px 18px;font-size:12px}
.p .marke{width:24px;height:24px;border-radius:7px;color:#fff;font-weight:800;font-size:13px;
  display:grid;place-items:center;flex-shrink:0}
.p .zeit{font-weight:600;letter-spacing:.04em}
.p .sp{flex:1}
.p .wechsel{display:inline-flex;gap:2px;border-radius:9px;padding:3px}
.p .wechsel b,.p .wechsel i{font-style:normal;font-size:11.5px;padding:4px 11px;
  border-radius:7px;font-weight:500}
.p .wechsel b{font-weight:700}
.p .rumpf{display:grid;grid-template-columns:1.5fr 1fr;gap:20px;padding:15px 18px 20px}
.p .spalte{min-width:0}

.p .abschn{display:flex;align-items:center;gap:7px;font-size:12.5px;font-weight:700;
  margin:16px 0 8px;letter-spacing:-.01em}
.p .spalte>.abschn:first-child{margin-top:0}
.p .abschn .pfeil{font-size:10px}
.p .abschn .zahl{font-size:10.5px;font-weight:600;padding:1px 7px;border-radius:20px;
  font-family:var(--mono)}

/* Runde Karten, dichte Zeilen — das ist die Grundform dieses Stils. */
.p .karte{border-radius:11px;overflow:hidden}
.p .karte.gross{padding:12px 14px}
.p .zeile{display:flex;align-items:center;gap:11px;padding:9px 13px}
.p .fahne{width:12px;height:14px;flex-shrink:0}
.p .zt{flex:1;min-width:0}
.p .zt b{display:block;font-size:13.5px;font-weight:600;letter-spacing:-.01em;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.p .zt em{font-style:normal;display:block;font-size:11.5px;margin-top:1px;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* Die gefüllte Pille. Sie ist das Erkennungszeichen — und die Stelle,
   an der die Farbwahl über den Kontrast entscheidet. */
.p .pille{font-size:9.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;
  color:#fff;padding:3px 9px;border-radius:20px;white-space:nowrap;flex-shrink:0}
.p .wer{width:23px;height:23px;border-radius:50%;color:#fff;font-size:9.5px;font-weight:700;
  display:grid;place-items:center;flex-shrink:0;letter-spacing:.02em}
.p .frist{font-size:11.5px;width:52px;text-align:right;flex-shrink:0;font-variant-numeric:tabular-nums}

.p .termin{display:flex;align-items:center;gap:11px}
.p .termin .balken{width:4px;align-self:stretch;border-radius:3px;min-height:34px}
.p .termin .txt{flex:1;min-width:0}
.p .termin b{display:block;font-size:15px;font-weight:700;letter-spacing:-.015em}
.p .termin em{font-style:normal;display:block;font-size:11.5px;margin-top:2px}

.p .gitter{display:grid;grid-template-columns:repeat(2,1fr);gap:7px}
.p .kachel{display:flex;align-items:center;gap:8px;border-radius:10px;padding:9px 11px;
  font-size:12.5px;font-weight:500}
.p .kachel i{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.p .kachel em{font-style:normal;margin-left:auto;font-family:var(--mono);font-size:10px}
.p .kachel.leer{justify-content:center;font-size:12px}

.p .karte.eng .ml{display:flex;align-items:center;gap:9px;padding:8px 13px;font-size:12.5px}
.p .ml i{width:8px;height:8px;border-radius:50%;flex-shrink:0}
.p .ml em{font-style:normal;margin-left:auto;font-family:var(--mono);font-size:10px}

.p .jahr{display:grid;grid-template-columns:repeat(14,1fr);gap:3px}
.p .tag{height:26px;border-radius:5px}
.p .legende{display:flex;gap:8px;margin-top:9px}
.p .knopfreihe{display:flex;gap:8px;margin-top:18px}
.p .knopf{font-size:12.5px;font-weight:600;padding:8px 16px;border-radius:9px}

${stil("echt", FASSUNG.echt)}
${stil("treu", FASSUNG.treu)}

/* ---------- Die Rechnung ---------- */
.rechnung{max-width:1180px;margin:0 auto 22px;background:#fffefb;border:1px solid #d8d4ca;
  border-radius:13px;padding:18px 20px}
.rechnung h2{font-size:17px;margin-bottom:5px}
.rechnung .vor{font-size:13.5px;color:#54514b;line-height:1.65;max-width:76ch;
  margin-bottom:14px}
table{border-collapse:collapse;width:100%;font-size:13px}
th{text-align:left;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:#6b675e;
  padding:0 10px 6px 0;border-bottom:1px solid #e2ded4;font-weight:700}
th.z,td.z{text-align:right;font-family:var(--mono);font-variant-numeric:tabular-nums;
  padding-right:8px}
td{padding:5px 10px 5px 0;border-bottom:1px solid #efece4;color:#3d3a35}
td.gut{color:#2b6b46} td.schlecht{color:#a8321f;font-weight:700}
td.pr{width:34px;padding-right:20px}
.probe{display:inline-grid;place-items:center;width:26px;height:20px;border-radius:5px;
  font-size:11px;font-weight:700}
.summe{margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:14px}
.summe div{border-radius:10px;padding:11px 14px;font-size:13px;line-height:1.55}
.summe .s-nein{background:#fbe9e5;border:1px solid #f0cfc7}
.summe .s-ja{background:#e3f0e8;border:1px solid #bcd9c8}
.summe b{display:block;margin-bottom:3px}

.was{max-width:1180px;margin:0 auto;background:#fffefb;border:1px solid #d8d4ca;
  border-radius:13px;padding:18px 20px 20px}
.was h2{font-size:17px;margin-bottom:11px}
.was h3{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#6b675e;
  margin:14px 0 6px}
.was ul{padding-left:18px;font-size:13.5px;line-height:1.7;color:#3d3a35;max-width:80ch}
.was li{margin-bottom:3px}
.was p{font-size:13.5px;line-height:1.7;color:#3d3a35;max-width:80ch}
.was code{font-family:var(--mono);font-size:12px;background:#f2efe8;padding:1px 5px;
  border-radius:4px}
@media(max-width:900px){
  .p .rumpf{grid-template-columns:1fr}
  .summe{grid-template-columns:1fr}
}
</style>
</head>
<body>

<div class="hut">
  <h1>Entwurf F — ein Thema im Stil von ClickUp</h1>
  <p>Sechster Vorschlag fürs dritte Thema, neben den fünf in
     <code>mockups/themen.html</code>. Gezeigt wird derselbe Ausschnitt,
     damit er sich vergleichen lässt — hier aber mit den Bauteilen, die
     den Stil ausmachen: gefüllte Statuspillen, Prioritätsfähnchen,
     Personenkreise, Farbpunkte, runde Karten.</p>
  <p><b>Zweimal derselbe Entwurf.</b> Oben mit den echten Farbwerten,
     darunter mit Farben, die die Regel aus <code>CLAUDE.md</code>
     einhalten. Die Rechnung dazwischen sagt, warum es zwei sein
     müssen.</p>
  <div class="warnhut">
    <p><b>Dieser Entwurf bricht die zentrale Gestaltungsregel des
       Projekts.</b> In <code>CLAUDE.md</code> steht: „Farbe codiert
       Dringlichkeit, nicht Kategorie." ClickUp ist die reinste
       Gegenposition dazu — dort trägt jede Statusstufe, jede Priorität
       und jede Liste ihre eigene Farbe. Das ist kein Nebeneffekt des
       Stils, das <i>ist</i> der Stil. Wer ihn will, streicht die Regel;
       beides zugleich geht nicht.</p>
  </div>
</div>

<div class="rahmen f-echt">
  <div class="rk">
    <h2>${esc(FASSUNG.echt.nm)}</h2>
    <p class="unter">${esc(FASSUNG.echt.unter)}</p>
    <span class="stempel nein">${tab.miesEcht} von ${PAARE.length} Paaren unter 4,5 : 1</span>
  </div>
  ${ausschnitt(FASSUNG.echt)}
</div>

<div class="rahmen f-treu">
  <div class="rk">
    <h2>${esc(FASSUNG.treu.nm)}</h2>
    <p class="unter">${esc(FASSUNG.treu.unter)}</p>
    <span class="stempel ${tab.miesTreu?"nein":"ja"}">${
      tab.miesTreu ? tab.miesTreu+" Paare unter 4,5 : 1" : "alle "+PAARE.length+" Paare tragen"}</span>
  </div>
  ${ausschnitt(FASSUNG.treu)}
</div>

<div class="rechnung">
  <h2>Die Rechnung</h2>
  <p class="vor">Gerechnet nach WCAG, dieselbe Formel wie im Prüflauf.
     Die kleinen Felder zeigen die Paarung so, wie sie wirklich
     aussieht — Zahlen allein überzeugen bei Farbe niemanden.</p>
  <table>
    <thead><tr>
      <th>Geprüft</th>
      <th class="z">Echt</th><th></th>
      <th class="z">Regelkonform</th><th></th>
    </tr></thead>
    <tbody>${tab.zeilen}</tbody>
  </table>
  <div class="summe">
    <div class="s-nein"><b>Mit den echten Farben</b>
      ${tab.miesEcht} von ${PAARE.length} Paaren reißen die Grenze. Betroffen ist
      nicht der Fließtext, sondern <b>fast jede gefüllte Pille</b> — und
      die steht in jeder Zeile mehrfach. Das Gelb für „Wartet" kommt auf
      ${zwei(kontrast("#ffffff", FASSUNG.echt.kat.warte))} : 1.</div>
    <div class="s-ja"><b>Nachgedunkelt</b>
      Alle ${PAARE.length} Paare tragen. Die Formen sind unverändert, die
      Sättigung auch — es fehlt die Helligkeit. Ob das noch nach ClickUp
      aussieht, entscheiden Sie beim Hinsehen, nicht die Zahl.</div>
  </div>
</div>

<div class="was">
  <h2>Was das kosten würde</h2>

  <h3>Neue Bauteile — kein Tokenwechsel</h3>
  <ul>
    <li><b>Statuspillen.</b> Es gibt heute keinen Status im Dashboard.
      Aufgaben sind <code>fertig</code> oder nicht, Workflows haben
      einen aktiven Schritt. Eine Pille „In Arbeit" bräuchte ein Feld,
      das es nicht gibt.</li>
    <li><b>Prioritätsfähnchen.</b> Ebenso: keine Priorität in den Daten.</li>
    <li><b>Personenkreise.</b> Setzen voraus, dass Einträge jemandem
      zugewiesen sind. Das Dashboard ist für <i>eine</i> Person — die
      Zuweisung wäre immer dieselbe.</li>
    <li><b>Runde Karten und Punkte</b> berühren die 92 Radien und 54
      Ränder, die hart in der Datei stehen.</li>
  </ul>

  <h3>Und der Bruch mit der Regel</h3>
  <p>Der eigentliche Preis ist nicht die Arbeit, sondern die
     Entscheidung. Heute heißt Rot im Dashboard genau eine Sache:
     überfällig. In diesem Entwurf heißt Rot „hohe Priorität" <i>und</i>
     „überfällig", Gelb heißt „wartet", Blau heißt „in Arbeit" und die
     Modulpunkte heißen gar nichts. Der Blick lernt nicht mehr, dass
     Farbe Dringlichkeit bedeutet — er muss jede Farbe einzeln
     nachschlagen. Das ist bei ClickUp vertretbar, weil dort zwanzig
     Menschen an zweihundert Vorgängen arbeiten und Sortierbarkeit vor
     Ruhe geht. Bei einem Dashboard für eine Person, das morgens sagen
     soll „das hier ist dran", ist es ein Verlust.</p>

  <h3>Mein Rat</h3>
  <p><b>Nicht als drittes Thema.</b> Ein Thema ist ein Satz Farbwerte
     für dieselbe Anwendung; dieser Entwurf ist eine andere Anwendung mit
     anderen Daten und einer anderen Gestaltungsregel. Er ließe sich
     nicht neben „Standard" und „Basecamp" in denselben Umschalter
     hängen, ohne dass die Hälfte der Pillen leer bliebe.</p>
  <p>Was sich <b>herausnehmen</b> ließe, ohne die Regel zu brechen: die
     dichteren Zeilen mit rechtsbündiger Frist, die runderen Karten, der
     gefüllte Hauptknopf. Das wäre eine Gestaltungsanpassung am
     Standardthema — kein neues Thema und kein ClickUp, aber der Teil,
     der hier wirklich besser ist.</p>
</div>

</body>
</html>
`;

writeFileSync(new URL("../mockups/thema-clickup.html", import.meta.url), html);

for(const [id, t] of Object.entries(FASSUNG)){
  const mies = PAARE.filter(([,h])=>{ const [v,hg]=h(t); return kontrast(v,hg)<4.5; });
  console.log(t.nm + ": " + (mies.length
    ? mies.length + " von " + PAARE.length + " unter 4,5 : 1 — "
      + mies.map(([nm,h])=>{ const [v,hg]=h(t); return nm+" "+zwei(kontrast(v,hg)); }).join(" · ")
    : "alle " + PAARE.length + " Paare tragen"));
}
console.log("\nmockups/thema-clickup.html geschrieben");
