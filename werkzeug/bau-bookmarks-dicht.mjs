/* Erzeugt mockups/schritt-bookmarks-dicht.html — drei Fassungen im
   Vergleich. 24 Bookmarks mal vier Darstellungen sind 96 Elemente; von
   Hand waeren sie weder zu schreiben noch gleichmaessig zu halten. */
import {writeFileSync} from "node:fs";

const M=[
 ["MDN Web Docs","developer.mozilla.org","Dev"],["GitHub","github.com","Dev"],
 ["Can I Use","caniuse.com","Dev"],["Linear Docs","linear.app/docs","Dev"],
 ["Node.js Doku","nodejs.org/docs","Dev"],["Obsidian API","docs.obsidian.md/api","Dev"],
 ["Excalidraw","excalidraw.com","Werkzeug"],["Raycast","raycast.com/store","Werkzeug"],
 ["Hoppscotch","hoppscotch.io","Werkzeug"],["Notion","notion.so","Werkzeug"],
 ["Figma Shortcuts","figma.com/shortcuts","Gestaltung"],["Tailwind Docs","tailwindcss.com/docs","Gestaltung"],
 ["Radix UI","radix-ui.com","Gestaltung"],["Coolors","coolors.co","Gestaltung"],
 ["Stratechery","stratechery.com","Lesen"],["Paul Graham","paulgraham.com/articles","Lesen"],
 ["Hacker News","news.ycombinator.com","Lesen"],["Refactoring Guru","refactoring.guru","Lesen"],
 ["Fireship","youtube.com/@fireship","Video"],["Kevin Powell","youtube.com/@KevinPowell","Video"],
 ["Baremetrics","baremetrics.com","Zahlen"],["ChartMogul","chartmogul.com","Zahlen"],
 ["Intranet","intranet.example.com","Intern"],["Confluence","confluence.example.com","Intern"]
].map(([t,u,g])=>({t,u,g}));
const PIN=["MDN Web Docs","GitHub","Excalidraw","Linear Docs"];
const platz=t=>PIN.indexOf(t)>=0 ? PIN.indexOf(t)+1 : 0;
const GR=[...new Set(M.map(m=>m.g))];
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

/* Stift und Nadel als Inline-SVG. Gefuellte Unicode-Zeichen sind
   verboten — sie rendern als dunkle Bloecke. */
const IST='<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M11.5 2.5l2 2L6 12l-2.6.6L4 10z"/></svg>';
const INA='<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 2h4M8 2v5M4.5 7h7l-1 3h-5zM8 10v4"/></svg>';

/* ---------- Schnellzugriff, allen Fassungen gemeinsam ---------- */
const schnell = () => `
<div class="abs"><h2 class="jetzt">Schnellzugriff</h2><span class="r"></span>
  <span class="n">${PIN.length} von 8 Plätzen</span></div>
<div class="sz">${PIN.map((t,i)=>{const m=M.find(x=>x.t===t);
  return `<button class="szk"><b>⌘${i+1}</b><span>${esc(t)}</span></button>`;}).join("")}
  ${Array.from({length:8-PIN.length},()=>'<span class="szk frei"><b>·</b><span>frei</span></span>').join("")}
</div>`;

/* ---------- A — Dichte Liste ---------- */
const fassungA = () => GR.map(g=>`
<div class="abs"><h2>${esc(g)}</h2><span class="r"></span>
  <span class="n">${M.filter(m=>m.g===g).length}</span></div>
<div class="dl">${M.filter(m=>m.g===g).map(m=>`
  <button class="dz"><span class="dt">${esc(m.t)}</span>
    <span class="du">${esc(m.u)}</span>
    ${platz(m.t)?`<b class="pl">⌘${platz(m.t)}</b>`:'<b class="pl leer"></b>'}</button>`).join("")}
</div>`).join("");

/* ---------- B — Gruppenkarten ---------- */
const fassungB = () => `<div class="kr">${GR.map(g=>`
  <div class="kk">
    <div class="kkk"><h3>${esc(g)}</h3><span>${M.filter(m=>m.g===g).length}</span></div>
    ${M.filter(m=>m.g===g).map(m=>`
    <button class="kz"><span>${esc(m.t)}</span>
      ${platz(m.t)?`<b>⌘${platz(m.t)}</b>`:""}</button>`).join("")}
  </div>`).join("")}</div>`;

/* ---------- C — Gruppenzeilen mit Chips ---------- */
const fassungC = () => `<div class="gz">${GR.map(g=>`
  <div class="gzz"><div class="gzn">${esc(g)}<em>${M.filter(m=>m.g===g).length}</em></div>
  <div class="gzc">${M.filter(m=>m.g===g).map(m=>
    `<button class="ch${platz(m.t)?" an":""}">${platz(m.t)?`<b>⌘${platz(m.t)}</b>`:""}${esc(m.t)}</button>`
  ).join("")}</div></div>`).join("")}</div>`;

/* ---------- C im Zustand „Ordnen“ ---------- */
const fassungCord = () => `<div class="gz ord">${GR.slice(0,3).map(g=>`
  <div class="gzz"><div class="gzn">${esc(g)}<em>${M.filter(m=>m.g===g).length}</em>
    <button class="mini">umbenennen</button></div>
  <div class="gzc">${M.filter(m=>m.g===g).map(m=>`
    <span class="chp${platz(m.t)?" an":""}"><button class="cht">${esc(m.t)}</button>
      <button class="chb" title="anheften">${INA}</button>
      <button class="chb" title="bearbeiten">${IST}</button></span>`).join("")}
    <button class="ch neu">+ neues Bookmark</button></div></div>`).join("")}</div>`;

/* ---------- Ist-Zustand zum Vergleich ---------- */
const istZustand = () => GR.slice(0,2).map(g=>`
<div class="abs"><h2>${esc(g)}</h2><span class="r"></span>
  <span class="n">${M.filter(m=>m.g===g).length}</span>
  <span class="n">umbenennen</span></div>
${M.filter(m=>m.g===g).map(m=>`
<div class="z"><span class="zb"><span class="zt">${esc(m.t)}</span>
  <span class="zm">${esc(m.u)}</span></span>
  <span class="tat${platz(m.t)?"":" still"}">${platz(m.t)?"⌘"+platz(m.t):"anheften"}</span>
  <span class="tat still">bearbeiten</span></div>`).join("")}`).join("");

const html=`<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Mockup — Bookmarks dichter darstellen</title>
<style>
:root{
  color-scheme:light;
  --ff:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
  --serif:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,ui-serif,serif;
  --mono:ui-monospace,"SF Mono","Cascadia Mono","Fira Code",Consolas,monospace;
  --paper:#f7f5f0; --sheet:#fffefb; --raise:#efece4;
  --rule:#e2ded4;  --rule2:#cbc6ba;
  --ink:#1a1a18;   --ink2:#54514b;  --ink3:#6b675e;
  --tinte:#2f3a8c; --tinte-s:#e7eaf6; --tinte-hauch:#d9dff1;
  --signal:#a8321f;
  --etikett:var(--mono);
}
*{box-sizing:border-box}
html,body{background:var(--paper);color:var(--ink);margin:0}
body{font-family:var(--ff);-webkit-font-smoothing:antialiased;padding:0 0 90px}
button{font:inherit;border:0;background:transparent;cursor:pointer;color:inherit;text-align:left}
.ic{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:1.4;
  stroke-linecap:round;stroke-linejoin:round}

.blatt{max-width:1000px;margin:0 auto;padding:0 26px}
.titel{font-family:var(--serif);font-size:31px;letter-spacing:-.02em;margin:44px 0 6px}
.unter{font-size:14px;color:var(--ink2);line-height:1.6;max-width:70ch}
.unter code{font-family:var(--mono);font-size:12.5px;background:var(--raise);
  padding:1px 5px;border-radius:4px}

.stufe{margin:52px 0 0;padding:26px 0 0;border-top:2px solid var(--rule2)}
.stufe h2.gross{font-family:var(--etikett);font-size:11.5px;letter-spacing:.16em;
  text-transform:uppercase;color:var(--ink3);margin:0 0 4px}
.stufe h3.gross{font-family:var(--serif);font-size:23px;font-weight:400;margin:0 0 8px;
  letter-spacing:-.01em}
.mass{display:inline-flex;gap:9px;align-items:baseline;margin:0 0 16px;
  font-family:var(--etikett);font-size:11px;letter-spacing:.06em;color:var(--ink3)}
.mass b{color:var(--tinte);font-size:13px}
.mass.warn b{color:var(--signal)}
.buehne{background:var(--paper);border:1px solid var(--rule);border-radius:12px;
  padding:16px 22px 26px}

/* --- Bausteine aus der Anwendung --- */
.abs{display:flex;align-items:center;gap:13px;padding:26px 0 10px}
.abs h2{font-family:var(--etikett);font-size:11px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--ink3);margin:0;font-weight:700}
.abs h2.jetzt{color:var(--tinte)}
.abs .r{flex:1;height:1px;background:var(--rule)}
.abs .n{font-family:var(--etikett);font-size:11px;color:var(--ink3)}
.z{display:flex;align-items:flex-start;gap:12px;padding:10px 10px 10px 2px;border-radius:8px;
  border-left:2px solid transparent}
.z + .z{box-shadow:inset 0 1px 0 var(--rule)}
.zb{flex:1;min-width:0}
.zt{display:block;font-size:14.5px;line-height:1.4}
.zm{display:block;font-size:12px;color:var(--ink3);margin-top:3px}
.tat{font-size:12.5px;font-weight:600;background:var(--tinte-s);color:var(--tinte);
  border:1px solid transparent;border-radius:8px;padding:5px 11px;white-space:nowrap}
.tat.still{background:transparent;color:var(--ink2);border-color:var(--rule2)}

/* --- Schnellzugriff --- */
.sz{display:grid;grid-template-columns:repeat(auto-fill,minmax(176px,1fr));gap:5px}
.szk{display:flex;align-items:baseline;gap:9px;padding:7px 10px;border-radius:8px;
  border:1px solid var(--rule);background:var(--sheet)}
.szk b{font-family:var(--etikett);font-size:10.5px;color:var(--tinte);min-width:19px}
.szk span{font-size:13.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.szk:hover{border-color:var(--tinte);background:var(--tinte-s)}
.szk.frei{background:transparent;border-style:dashed;color:var(--ink3)}
.szk.frei b{color:var(--ink3)}

/* --- A: dichte Liste --- */
.dl{display:flex;flex-direction:column}
.dz{display:flex;align-items:baseline;gap:14px;padding:5px 8px;border-radius:6px}
.dz:hover{background:var(--sheet)}
.dz + .dz{box-shadow:inset 0 1px 0 var(--rule)}
.dt{font-size:14px;white-space:nowrap}
.du{flex:1;font-size:11.5px;color:var(--ink3);overflow:hidden;text-overflow:ellipsis;
  white-space:nowrap;text-align:right}
.pl{font-family:var(--etikett);font-size:10.5px;color:var(--tinte);min-width:22px;text-align:right}
.pl.leer{min-width:22px}

/* --- B: Gruppenkarten --- */
.kr{display:grid;grid-template-columns:repeat(auto-fill,minmax(216px,1fr));gap:11px;
  align-items:start}
.kk{border:1px solid var(--rule);border-radius:11px;background:var(--sheet);padding:5px 5px 7px}
.kkk{display:flex;align-items:baseline;gap:8px;padding:7px 9px 6px}
.kkk h3{font-family:var(--etikett);font-size:10.5px;letter-spacing:.13em;text-transform:uppercase;
  color:var(--ink3);margin:0;flex:1;font-weight:700}
.kkk span{font-family:var(--etikett);font-size:10.5px;color:var(--ink3)}
.kz{display:flex;align-items:baseline;gap:8px;width:100%;padding:5px 9px;border-radius:7px;
  font-size:13.5px}
.kz span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.kz b{font-family:var(--etikett);font-size:10px;color:var(--tinte)}
.kz:hover{background:var(--tinte-s);color:var(--tinte)}

/* --- C: Gruppenzeilen mit Chips --- */
.gz{display:flex;flex-direction:column;gap:2px}
.gzz{display:flex;gap:16px;padding:9px 0;align-items:baseline}
.gzz + .gzz{box-shadow:inset 0 1px 0 var(--rule)}
.gzn{font-family:var(--etikett);font-size:10.5px;letter-spacing:.13em;text-transform:uppercase;
  color:var(--ink3);width:104px;flex-shrink:0;padding-top:5px;font-weight:700;
  display:flex;gap:7px;align-items:baseline}
.gzn em{font-style:normal;color:var(--rule2)}
.gzc{flex:1;display:flex;flex-wrap:wrap;gap:5px}
.ch{font-size:13.5px;padding:5px 11px;border-radius:14px;border:1px solid var(--rule);
  background:var(--sheet);white-space:nowrap}
.ch:hover{border-color:var(--tinte);background:var(--tinte-s);color:var(--tinte)}
.ch.an{border-color:var(--tinte-hauch);background:var(--tinte-s)}
.ch b{font-family:var(--etikett);font-size:10px;color:var(--tinte);margin-right:6px}
.ch.neu{border-style:dashed;color:var(--ink3)}

/* --- C im Zustand „Ordnen“ --- */
.ord .gzn{width:150px;flex-wrap:wrap;row-gap:3px}
.mini{font-family:var(--etikett);font-size:10px;letter-spacing:.06em;color:var(--ink3);
  text-decoration:underline;text-underline-offset:2px;padding:0}
.chp{display:inline-flex;align-items:stretch;border:1px solid var(--rule);border-radius:14px;
  background:var(--sheet);overflow:hidden}
.chp.an{border-color:var(--tinte-hauch);background:var(--tinte-s)}
.cht{font-size:13.5px;padding:5px 4px 5px 11px;white-space:nowrap}
.chb{display:grid;place-items:center;width:27px;color:var(--ink3);
  border-left:1px solid var(--rule)}
.chb:hover{background:var(--tinte-s);color:var(--tinte)}

/* --- Bewertung --- */
.tab{width:100%;border-collapse:collapse;margin:18px 0 0;font-size:13.5px}
.tab th,.tab td{text-align:left;padding:9px 12px 9px 0;border-bottom:1px solid var(--rule);
  vertical-align:top;line-height:1.5}
.tab th{font-family:var(--etikett);font-size:10px;letter-spacing:.11em;text-transform:uppercase;
  color:var(--ink3)}
.tab td b{color:var(--tinte)}
.tab td i{font-style:normal;color:var(--signal)}
.merk{background:var(--sheet);border:1px solid var(--rule);border-left:2px solid var(--tinte);
  border-radius:9px;padding:14px 17px;font-size:13.5px;line-height:1.6;color:var(--ink2);
  margin:20px 0 0}
.merk b{color:var(--ink)}
</style>

<div class="blatt">
<h1 class="titel">Bookmarks dichter darstellen</h1>
<p class="unter">Drei Fassungen im Vergleich, alle mit denselben 24 Bookmarks aus
sieben Gruppen. Nichts davon ist gebaut — dies ist der Entwurf zur
Entscheidung. Die Höhenangaben sind gemessen, nicht geschätzt.</p>

<div class="stufe">
<h2 class="gross">Ist-Zustand</h2>
<h3 class="gross">Eine Zeile je Bookmark, 60 Pixel hoch</h3>
<div class="mass warn">Gemessen <b>715 px</b> für diese zehn · hochgerechnet <b>≈ 1800 px</b> für alle 24 · knapp drei Bildschirme</div>
<div class="buehne">${istZustand()}</div>
<div class="merk"><b>Woran es liegt:</b> Titel und Adresse stehen untereinander
statt nebeneinander, und beide Knöpfe sind immer sichtbar. Das kostet je
Bookmark 60 Pixel — für eine Zeile Text, die 20 bräuchte. Die Adresse liest
man ohnehin selten; sie ist Beleg, nicht Inhalt.</div>
</div>

<div class="stufe">
<h2 class="gross">Allen drei Fassungen gemeinsam</h2>
<h3 class="gross">Schnellzugriff oben</h3>
<div class="mass">Gemessen <b>160 px</b> breit · <b>196 px</b> bei 760 px Fensterbreite</div>
<div class="buehne">${schnell()}</div>
<div class="merk">Die acht angehefteten Bookmarks stehen künftig zuoberst,
mit ihrem Tastenkürzel. <b>Freie Plätze werden gezeigt, nicht verschwiegen</b> —
sonst sieht man nie, dass noch vier zu vergeben sind. Das ist der schnelle
Weg mit der Maus; der schnellste bleibt die Leiste mit <code>⌘K</code>.</div>
</div>

<div class="stufe">
<h2 class="gross">Fassung A</h2>
<h3 class="gross">Dichte Liste — eine Zeile, Adresse rechts</h3>
<div class="mass">Gemessen <b>1011 px</b> · gleich bei jeder Fensterbreite · gut halb so hoch wie heute</div>
<div class="buehne">${fassungA()}</div>
<div class="merk"><b>Dafür:</b> Die Gruppen bleiben genau wie heute, die
Adresse bleibt sichtbar, der Umbau ist klein. <b>Dagegen:</b> Es bleibt eine
lange Liste — sieben Gruppen untereinander sind weiterhin anderthalb
Bildschirme. Anheften und Bearbeiten müssten beim Überfahren erscheinen,
und <i>auf dem iPad gibt es kein Überfahren.</i></div>
</div>

<div class="stufe">
<h2 class="gross">Fassung B</h2>
<h3 class="gross">Gruppenkarten — jede Gruppe eine Karte, nebeneinander</h3>
<div class="mass">Gemessen <b>333 px</b> bei 1000 px Breite · <b>583 px</b> bei 760 px</div>
<div class="buehne">${fassungB()}</div>
<div class="merk"><b>Dafür:</b> Die Gruppen tragen die Übersicht, weil sie
nebeneinander stehen statt untereinander. Man sieht mit einem Blick, wie
viele es gibt und wie groß jede ist. <b>Am breiten Fenster ist sie die dichteste von allen</b> — 333 px.
<b>Dagegen:</b> Sie hängt an der Fensterbreite. Fällt das Raster von vier
Spalten auf zwei, wächst sie auf 583 px, also um drei Viertel. Und die
Karten sind unterschiedlich hoch: eine Gruppe mit einem Eintrag neben
einer mit zwanzig macht das Raster löchrig. Die Adresse fällt weg.</div>
</div>

<div class="stufe">
<h2 class="gross">Fassung C</h2>
<h3 class="gross">Gruppenzeilen — Gruppenname links, Bookmarks als Chips</h3>
<div class="mass">Gemessen <b>371 px</b> bei 1000 px Breite · <b>403 px</b> bei 760 px</div>
<div class="buehne">${fassungC()}</div>
<div class="merk"><b>Dafür:</b> Sehr dicht, und die Gruppen
bleiben dabei lesbar, weil ihr Name als Randbeschriftung stehen bleibt.
Eine Gruppe mit zwanzig Einträgen bricht einfach um, statt das Raster zu
sprengen. Angeheftetes trägt sein Kürzel im Chip. <b>Und sie ist die stabilste:</b> Von 1000 auf 760 px Breite wächst sie
nur von 371 auf 403 px — neun Prozent, gegen 75 Prozent bei Fassung B.
<b>Dagegen:</b> Am ganz breiten Fenster ist B um 38 px dichter. Die Adresse
ist weg — sie steht nur noch im Dialog. Lange Titel setzen der Dichte
eine Grenze.</div>
</div>

<div class="stufe">
<h2 class="gross">Zur offenen Frage in allen drei Fassungen</h2>
<h3 class="gross">Wohin mit „anheften" und „bearbeiten"?</h3>
<div class="mass">am Beispiel von Fassung C, die ersten drei Gruppen</div>
<div class="buehne">${fassungCord()}</div>
<div class="merk"><b>Der Vorschlag: ein Schalter <code>Öffnen</code> /
<code>Ordnen</code> im Kopf der Fläche.</b> Im Ruhezustand ist die Ansicht so
dicht wie oben und ein Klick öffnet. Wer ordnet, schaltet um — dann wächst
jeder Chip um zwei kleine Knöpfe, und die Gruppen bekommen ihr
„umbenennen".<br><br>
Der Grund gegen die naheliegende Lösung: <b>Knöpfe beim Überfahren
einzublenden funktioniert auf dem iPad nicht.</b> Dort gibt es kein
Überfahren, und die Knöpfe wären unerreichbar — derselbe Fehler wie beim
Ziehen im Planner, das dort ebenfalls nicht geht.</div>
</div>

<div class="stufe">
<h2 class="gross">Vergleich</h2>
<table class="tab">
<tr><th>&nbsp;</th><th>bei 1000 px</th><th>bei 760 px</th><th>Gruppen sichtbar</th><th>Adresse</th><th>Aufwand</th></tr>
<tr><td><b>Heute</b></td><td>≈ 1800 px</td><td>≈ 1800 px</td><td>untereinander</td><td>ja</td><td>—</td></tr>
<tr><td><b>A — dichte Liste</b></td><td>1011 px</td><td>1011 px</td><td>untereinander</td><td>ja, rechts</td><td>klein</td></tr>
<tr><td><b>B — Gruppenkarten</b></td><td><b>333 px</b></td><td><i>583 px</i></td><td>nebeneinander</td><td>nein</td><td>mittel</td></tr>
<tr><td><b>C — Gruppenzeilen</b></td><td>371 px</td><td><b>403 px</b></td><td>als Randbeschriftung</td><td>nein</td><td>mittel</td></tr>
</table>
<div class="merk"><b>Empfehlung: C, dazu der Schnellzugriff und der
Schalter Öffnen/Ordnen.</b> Nicht weil sie die dichteste wäre — am breiten Fenster
ist B um 38 Pixel besser. Sondern weil sie die <b>stabilste</b> ist.<br><br>
Das entscheidende Maß steht in der rechten Spalte: bei 760 Pixeln
Fensterbreite, also dem iPad hochkant. Dort fällt B von vier Spalten auf
zwei und wächst um 75 Prozent, C um neun. <b>Diese Zahl hatte ich vor dem
Messen falsch geschätzt</b> — ich hielt B für die schwächere und C für die
dichtere; tatsächlich ist es am breiten Fenster umgekehrt, und C gewinnt
aus einem anderen Grund als vermutet.<br><br>
Dazu kommt: C fällt auch bei einer Gruppe mit zwanzig Einträgen nicht
auseinander. Chips brechen um, Karten werden hoch und reißen Löcher ins
Raster.<br><br>
<b>Was der Wechsel kostet:</b> Die Adresse steht nicht mehr in der Liste,
sondern erst im Dialog. Das ist bewusst — man erkennt ein Bookmark am
Titel, nicht an <code>docs.obsidian.md/api</code>.</div>
</div>
</div>
`;
writeFileSync(new URL("../mockups/schritt-bookmarks-dicht.html", import.meta.url), html);
console.log("geschrieben, "+html.length+" Zeichen");
