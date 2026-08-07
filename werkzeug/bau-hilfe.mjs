/* Erzeugt mockups/schritt-hilfe.html — Entwurf zu Schritt 8.
   Vier Zustaende: Hilfe im Ruhezustand, Hilfe mit Suche, die
   Schnellhilfe als schwebendes Fenster, und das Zusammenspiel der
   beiden Suchen. Statisch, nichts ist anklickbar. */
import {writeFileSync} from "node:fs";
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const IL='<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.9-3.9"/></svg>';

/* ---------- Was in der Hilfe steht ---------- */
const TASTEN=[
  ["⌘K","Leiste öffnen","überall"],
  ["⌘P","Planner öffnen","überall"],
  ["⌘S","Sichern","überall"],
  ["⌘1 … ⌘8","Platz 1 bis 8 öffnen","überall"],
  ["F1","Schnellhilfe","überall · noch zu prüfen"],
  ["⌘? ","Hilfe","überall · noch zu prüfen"],
  ["Esc","Eingabe leeren · zurück zur Leiste · Dialog schließen","je nach Ort"],
  ["↑ ↓","Treffer wählen","Leiste, wenn getippt"],
  ["↵","Gewählten Treffer nehmen","Leiste, wenn getippt"],
  ["a–z","springt ins Suchfeld","Leiste"]
];
const MUSTER=[
  ["mei","findet Kontakte — je zwei Treffer: Anrufen und Mailen"],
  ["17*1,19","rechnet, Komma wie Punkt"],
  ["Rückruf Kanzlei ? mo","<b>?</b> macht daraus eine Aufgabe zum Nachverfolgen, <b>mo</b> den Montag"],
  ["Abstimmung 14:30 @kowalski","<b>hh:mm</b> setzt die Uhrzeit, <b>@name</b> den Kontakt"],
  ["heute · morgen · übermorgen · mo–fr","setzen den Tag"],
  ['{"a":1}',"erkennt JSON und bietet Formatieren an"]
];
const MODULE=[
  ["01","Notizen","fertig","Zwei Arten, Telefonnotiz vorbelegt. Export und Import als .md."],
  ["02","Kontakte","fertig","Kacheln mit Anrufen und Mailen. Favoriten stehen in der Leiste."],
  ["04","Aufgaben","fertig","To-do und Nachverfolgen. Überfällige tragen eine rote Kante."],
  ["05","Textbausteine","Gerüst","Platzhalter erkennen und Kopieren fehlen noch."],
  ["06","Kalender","fertig","Termine für den aktuellen und den nächsten Werktag."],
  ["07","Planner","fertig","Zwei Werktage im Stundenraster, links der Aufgabenvorrat."],
  ["08","Appstarter","Gerüst","Starten und Anheften tragen. Anlegen und Bearbeiten fehlen."],
  ["09","Bookmarks","fertig","Nach Gruppen, als Chips. Anheftbar auf die zwölf Plätze."],
  ["13","Workflows","Gerüst","Weiterschalten trägt. Anlegen und Bearbeiten fehlen."],
  ["14","Jahreskalender","fertig","Alle 365 Tage als schwebendes Fenster, eigener Bestand."],
  ["15","Outliner","Gerüst","Ansehen ja, bearbeiten noch nicht."],
  ["16","Code-Beautifier","fertig","JSON formatieren, direkt aus der Leiste."]
];
const INDEX=[["Zwei Oberflächen",0],["Die Leiste",1],["Eingabemuster",1],["Der Planner",1],
  ["Tastenkürzel",0],["Die Plätze",1],["Module",0],["Sichern und Laden",0],["Themen",0]];

/* ---------- Bausteine ---------- */
const abs=(t,n)=>`<div class="s-abs"><h4>${esc(t)}</h4><i></i>${n?`<b>${esc(n)}</b>`:""}</div>`;
const tastenTabelle = (kl,filter) => `<table class="h-tab${kl?" "+kl:""}">`
  + TASTEN.filter(t=>!filter||filter(t)).map(([k,w,o])=>
      `<tr><td class="k"><kbd>${esc(k.trim())}</kbd></td><td>${esc(w)}</td>`
      +`<td class="o">${esc(o)}</td></tr>`).join("") + `</table>`;
const musterTabelle = f => `<table class="h-tab">`
  + MUSTER.filter(m=>!f||f(m)).map(([e,w])=>
      `<tr><td class="k"><code>${esc(e)}</code></td><td colspan="2">${w}</td></tr>`).join("")
  + `</table>`;
const modulListe = f => `<table class="h-tab">`
  + MODULE.filter(m=>!f||f(m)).map(([n,nm,st,txt])=>
      `<tr><td class="k"><b class="nr">${n}</b></td><td>${esc(nm)}`
      +(st==="Gerüst"?' <em class="gz">Gerüst</em>':'')
      +`<span class="mt">${esc(txt)}</span></td><td class="o"></td></tr>`).join("")
  + `</table>`;

const index = wahl => `<nav class="h-index">${INDEX.map(([t,e])=>
  `<a class="h-i${e?" ein":""}${t===wahl?" wahl":""}">${esc(t)}</a>`).join("")}</nav>`;

const suchfeld = (wert,hin) => `<div class="h-suche">
  <span class="lupe">${IL}</span>
  <input value="${esc(wert)}" placeholder="Hilfe durchsuchen — Funktion, Kürzel, Modul">
  ${wert?'<span class="weg">zurücksetzen</span>':''}</div>
  ${hin?`<div class="h-hin">${hin}</div>`:''}`;

const hilfeFlaeche = (wert,inhalt) => `<div class="s-app"><div class="s-kopf"></div>
 <div class="s-rumpf"><div class="s-mitte">
  <div class="s-modkopf">10 · Hilfe</div>
  ${suchfeld(wert, wert?`<b>3 Stellen</b> gefunden — die Suche in der Hilfe ist von der Suche in der Leiste getrennt`:"")}
  <div class="h-zwei">${index(wert?null:"Tastenkürzel")}<div class="h-inhalt">${inhalt}</div></div>
 </div></div></div>`;

const ruhe = abs("Zwei Oberflächen")
  + `<p class="h-p">Mehr gibt es nicht. Die <b>Leiste</b> ist der Einstieg — ein Feld
     für suchen, rechnen und erfassen. Ohne Eingabe zeigt sie Überfälliges, den
     nächsten Termin, den Schmierzettel und die Plätze. Der <b>Planner</b> ist die
     Arbeitsfläche: zwei Werktage im Stundenraster.</p>`
  + abs("Eingabemuster","6") + musterTabelle()
  + abs("Tastenkürzel","10") + tastenTabelle();

const gefunden = `<div class="h-treffer">Gefunden zu „platz“</div>`
  + abs("Tastenkürzel","1 von 10")
  + tastenTabelle("", t=>/Platz/i.test(t[1]))
  + abs("Die Plätze","1 von 9")
  + `<p class="h-p">Zwölf Plätze in der Leiste, von Hand belegt. Auf ihnen liegen
     Bookmarks und Apps gemeinsam. <b>⌘1</b> bis <b>⌘8</b> liegen auf den ersten
     acht — mehr freie Tastenkombinationen gibt es nicht.</p>`
  + abs("Module","1 von 12") + modulListe(m=>/Bookmarks/.test(m[1]));

const schnellhilfe = `<div class="s-app"><div class="s-kopf"></div>
 <div class="s-rumpf s-blass"><div class="s-mitte">
   <div class="s-feld-gross">› Tippen — suchen, rechnen, erfassen</div>
   <div class="s-schemen"></div><div class="s-schemen kurz"></div>
 </div></div>
 <div class="s-schleier"><div class="s-fenster">
   <div class="s-fk"><span class="art">Schnellhilfe</span>
     <span class="sp"></span><span class="zu">×</span></div>
   <div class="s-fb">
     <p class="h-p">Alles, was die Tastatur kann. <b>Esc</b> schließt.</p>
     ${tastenTabelle("gross")}
     <div class="h-fuss">Diese Liste kommt aus derselben Tabelle, die die Tasten
       auch schaltet — ein Kürzel, das nicht funktioniert, kann hier gar nicht
       stehen.</div>
   </div></div></div></div>`;

const buehne=(inhalt)=>`<div class="buehne"><div class="rahmen">${inhalt}</div></div>`;

const html=`<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Entwurf — Schritt 8, die Hilfe</title>
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
  --signal:#a8321f;--signal-s:#fbe9e5;
  --etikett:var(--mono);
}
*{box-sizing:border-box}
html,body{background:var(--paper);color:var(--ink);margin:0}
body{font-family:var(--ff);-webkit-font-smoothing:antialiased;padding:0 0 90px}
.blatt{max-width:1060px;margin:0 auto;padding:0 26px}
h1{font-family:var(--serif);font-size:31px;letter-spacing:-.02em;margin:44px 0 6px;font-weight:400}
.unter{font-size:14px;color:var(--ink2);line-height:1.6;max-width:72ch}
.unter code,.merk code{font-family:var(--mono);font-size:12.5px;background:var(--raise);
  padding:1px 5px;border-radius:4px}
.stufe{margin:52px 0 0;padding:26px 0 0;border-top:2px solid var(--rule2)}
.stufe h2{font-family:var(--etikett);font-size:11.5px;letter-spacing:.16em;
  text-transform:uppercase;color:var(--ink3);margin:0 0 5px;font-weight:700}
.stufe h3{font-family:var(--serif);font-size:23px;font-weight:400;margin:0 0 9px}
.mass{display:inline-flex;gap:9px;align-items:baseline;margin:0 0 15px;flex-wrap:wrap;
  font-family:var(--etikett);font-size:11px;letter-spacing:.05em;color:var(--ink3)}
.mass b{color:var(--tinte);font-size:13px}
.buehne{border:1px solid var(--rule2);border-radius:10px;background:var(--raise);
  overflow-x:auto;margin:0 0 6px}
.rahmen{width:1920px;zoom:.5;pointer-events:none}
.lupe2{font-family:var(--etikett);font-size:10px;letter-spacing:.09em;color:var(--ink3);
  text-transform:uppercase;margin:0 0 22px}

.s-app{background:var(--paper);display:flex;flex-direction:column;min-height:860px;position:relative}
.s-kopf{height:55px;background:var(--sheet);border-bottom:1px solid var(--rule);flex-shrink:0}
.s-rumpf{flex:1;min-height:0}
.s-rumpf.s-blass{opacity:.4}
.s-mitte{max-width:1180px;margin:0 auto;padding:0 26px 48px;width:100%}
.s-modkopf{font-family:var(--etikett);font-size:11px;letter-spacing:.16em;
  text-transform:uppercase;color:var(--ink3);font-weight:700;padding:30px 0 14px}
.s-feld-gross{font-size:27px;color:var(--ink3);padding:22px 0 20px;
  border-bottom:2px solid var(--tinte)}
.s-schemen{height:120px;background:var(--sheet);border:1px solid var(--rule);
  border-radius:10px;margin:26px 0 0}
.s-schemen.kurz{height:70px}

/* Suchfeld der Hilfe — eigenes Feld, eigener Zustand */
.h-suche{position:relative;margin:0 0 6px}
.h-suche input{width:100%;border:1px solid var(--rule2);border-radius:10px;
  padding:11px 15px 11px 40px;font-size:15px;background:var(--sheet);color:var(--ink);
  font-family:inherit}
.h-suche .lupe{position:absolute;left:12px;top:50%;transform:translateY(-50%);
  width:17px;height:17px;color:var(--ink3)}
.h-suche .lupe svg{width:17px;height:17px;stroke:currentColor;fill:none;stroke-width:1.7}
.h-suche .weg{position:absolute;right:10px;top:50%;transform:translateY(-50%);
  font-family:var(--etikett);font-size:11px;color:var(--ink3)}
.h-hin{font-size:12.5px;color:var(--ink3);padding:0 0 4px}
.h-hin b{color:var(--tinte)}

.h-zwei{display:grid;grid-template-columns:220px 1fr;gap:0 40px;align-items:start;
  padding-top:18px}
.h-index{display:flex;flex-direction:column;gap:1px;position:sticky;top:0}
.h-i{padding:7px 11px;border-radius:7px;font-size:13.5px;color:var(--ink2);
  border-left:2px solid transparent}
.h-i.ein{padding-left:26px;font-size:13px;color:var(--ink3)}
.h-i.wahl{background:var(--tinte-s);color:var(--tinte);border-left-color:var(--tinte);
  font-weight:600}
.h-inhalt{min-width:0}
.h-p{font-size:14.5px;line-height:1.65;color:var(--ink2);margin:0;max-width:70ch}
.h-p b{color:var(--ink)}
.h-treffer{font-family:var(--etikett);font-size:11px;letter-spacing:.09em;
  text-transform:uppercase;color:var(--tinte);padding:0 0 4px}
.s-abs{display:flex;align-items:center;gap:13px;padding:26px 0 10px}
.s-abs h4{font-family:var(--etikett);font-size:11px;letter-spacing:.16em;text-transform:uppercase;
  color:var(--ink3);margin:0;font-weight:700}
.s-abs i{flex:1;height:1px;background:var(--rule);font-style:normal}
.s-abs b{font-family:var(--etikett);font-size:11px;color:var(--ink3);font-weight:400}
.h-tab{width:100%;border-collapse:collapse;font-size:14px}
.h-tab td{padding:8px 12px 8px 0;border-bottom:1px solid var(--rule);vertical-align:top;
  line-height:1.5;color:var(--ink2)}
.h-tab td.k{width:150px;white-space:nowrap}
.h-tab td.o{width:200px;font-size:12px;color:var(--ink3);text-align:right}
.h-tab.gross td{font-size:15px;padding:9px 12px 9px 0}
kbd{font-family:var(--etikett);font-size:12px;background:var(--raise);color:var(--ink);
  border:1px solid var(--rule2);border-bottom-width:2px;border-radius:6px;padding:3px 8px;
  white-space:nowrap}
.h-tab code{font-family:var(--mono);font-size:12.5px;background:var(--raise);
  padding:2px 6px;border-radius:4px;color:var(--ink)}
.h-tab .nr{font-family:var(--etikett);font-size:11px;color:var(--ink3);font-weight:700}
.h-tab .mt{display:block;font-size:12.5px;color:var(--ink3);margin-top:2px}
.gz{font-family:var(--etikett);font-size:9.5px;letter-spacing:.07em;text-transform:uppercase;
  color:var(--ink3);border:1px dashed var(--rule2);border-radius:5px;padding:1px 5px;
  font-style:normal;margin-left:6px}
.h-fuss{margin-top:16px;font-size:12.5px;color:var(--ink3);line-height:1.55;
  border-top:1px solid var(--rule);padding-top:12px}

/* Das schwebende Fenster */
.s-schleier{position:absolute;inset:0;background:rgba(26,26,24,.34);display:grid;
  place-items:center;padding:18px}
.s-fenster{width:min(720px,100%);background:var(--sheet);border:1px solid var(--rule2);
  border-radius:14px;box-shadow:0 24px 70px rgba(26,26,24,.22);overflow:hidden}
.s-fk{display:flex;align-items:baseline;gap:12px;padding:16px 22px 13px;
  border-bottom:1px solid var(--rule)}
.s-fk .art{font-family:var(--etikett);font-size:10.5px;letter-spacing:.13em;
  text-transform:uppercase;color:var(--ink3);font-weight:700}
.s-fk .sp{flex:1}
.s-fk .zu{font-size:19px;color:var(--ink3)}
.s-fb{padding:18px 22px 22px}

.tab{width:100%;border-collapse:collapse;margin:16px 0 0;font-size:13.5px}
.tab th,.tab td{text-align:left;padding:9px 12px 9px 0;border-bottom:1px solid var(--rule);
  vertical-align:top;line-height:1.5}
.tab th{font-family:var(--etikett);font-size:10px;letter-spacing:.11em;text-transform:uppercase;
  color:var(--ink3)}
.merk{background:var(--sheet);border:1px solid var(--rule);border-left:2px solid var(--tinte);
  border-radius:9px;padding:15px 18px;font-size:13.5px;line-height:1.6;color:var(--ink2);margin:18px 0 0}
.merk.warn{border-left-color:var(--signal);background:var(--signal-s)}
.merk b{color:var(--ink)}
</style>

<div class="blatt">
<h1>Schritt 8 — die Hilfe</h1>
<p class="unter">Zwei Flächen: die <b>Hilfe</b> als Modul mit Index und eigener
Suche, die <b>Schnellhilfe</b> als schwebendes Fenster mit allen Tastenkürzeln.
Nichts davon ist gebaut. Die Schaubilder zeigen 1920 px in halber Größe.</p>

<div class="stufe">
<h2>Die Hilfe · Ruhezustand</h2>
<h3>Index links, Inhalt rechts, eigenes Suchfeld oben</h3>
<div class="mass">Modul <b>10</b> · Index klebt beim Scrollen oben</div>
${buehne(hilfeFlaeche("",ruhe))}
<p class="lupe2">1920 px in halber Größe</p>
<div class="merk"><b>Was aus dem Register kommt und was nicht.</b> Die
Modulliste, die Zahlen, die Gerüst-Marken und die Tastenkürzel erzeugen
sich selbst — sie können deshalb nicht veralten. Der beschreibende Satz
je Modul kommt aus einem neuen, freiwilligen Feld <code>hilfe</code> im
Modulblock: Er steht damit <b>neben dem Code, den er beschreibt</b>, statt
in einer zweiten Textsammlung, die driftet.</div>
</div>

<div class="stufe">
<h2>Die Hilfe · Suche</h2>
<h3>Getippt: „platz“</h3>
<div class="mass">drei Fundstellen · quer über alle Abschnitte</div>
${buehne(hilfeFlaeche("platz",gefunden))}
<p class="lupe2">1920 px in halber Größe</p>
<div class="merk"><b>Diese Suche bleibt von der Leiste getrennt — und zwar
konstruktiv, nicht durch Disziplin:</b><br><br>
<b>Erstens</b> meldet das Hilfe-Modul <b>kein <code>suche</code></b> an.
Es kann in der Leiste damit gar nicht auftauchen — nicht „es tut es
nicht", sondern „es kann nicht".<br><br>
<b>Zweitens</b> hat sein Feld einen eigenen Zustand <code>hSuche</code>,
außerhalb von <code>Z</code>, wie <code>kSuche</code> bei den Kontakten.
Was hier getippt wird, berührt die Leiste nicht und wird auch nicht
gesichert.</div>
</div>

<div class="stufe">
<h2>Die Schnellhilfe</h2>
<h3>Schwebendes Fenster, alle Kürzel auf einen Blick</h3>
<div class="mass">hängt an <b>dlgOffen</b> · Escape und Klick daneben schließen</div>
${buehne(schnellhilfe)}
<p class="lupe2">1920 px in halber Größe</p>
<div class="merk"><b>Dieselbe Mechanik wie beim Jahreskalender.</b> Das
Fenster trägt sich in <code>dlgOffen</code> ein — damit greifen Escape und
der Klick daneben, ohne dass es eine zweite Mechanik dafür bräuchte.<br><br>
<b>Und dieselbe Tabelle, die die Tasten schaltet.</b> Heute stehen die
Kürzel als <code>if</code>-Kette im Tastaturteil; eine Liste daneben würde
davon abdriften. Künftig steht jedes Kürzel einmal da — mit seiner
Beschriftung und seiner Handlung —, und die Tastatur wie die Schnellhilfe
lesen dieselbe Stelle. <b>Ein Kürzel, das nicht funktioniert, kann dann
gar nicht in der Liste stehen.</b> Das ist Fehlerbuch Punkt 9, in Bauform
statt als Mahnung.</div>
</div>

<div class="stufe">
<h2>Die offene Frage</h2>
<h3>Welche Tastenkombinationen sind überhaupt frei?</h3>
<table class="tab">
<tr><th>Kürzel</th><th>belegt von</th></tr>
<tr><td><code>⌘K ⌘P ⌘S ⌘1–⌘8</code></td><td>die Anwendung — funktionieren nachweislich</td></tr>
<tr><td><code>⌘N ⌘T ⌘W</code></td><td>Edge — steht schon im Fehlerbuch</td></tr>
<tr><td><code>⌘F ⌘H ⌘J ⌘L ⌘O ⌘R ⌘U ⌘D ⌘E ⌘G ⌘B</code></td><td>Edge, sehr wahrscheinlich</td></tr>
<tr><td><code>F1</code></td><td>öffnet Edges eigene Hilfe</td></tr>
</table>
<div class="merk warn"><b>Was übrig bleibt, kann ich von hier aus nicht
feststellen.</b> Der Prüfbrowser ist Chromium und verhält sich anders als
Ihr Edge. Und Fehlerbuch Punkt 9 ist eindeutig: „Eine Beschriftung erst
setzen, wenn das Kürzel funktioniert."<br><br>
<b>Vorschlag:</b> <code>browsertest.html</code> um eine Prüfung erweitern —
<i>welche Kombinationen erreichen die Seite überhaupt?</i> Sie drücken sie
einmal durch, und wir wissen es. Genau dafür ist diese Datei da.<br><br>
Bis dahin baue ich mit zwei Kandidaten. Weil beide Hilfen aus derselben
Tabelle kommen, ist ein Auswechseln <b>eine Zeile</b> — und die
Schnellhilfe zeigt danach von selbst das Richtige.</div>
</div>

<div class="stufe">
<h2>Bewusst nicht dabei</h2>
<div class="merk">
<b>Keine Suche über die Anwendungsdaten.</b> Die Hilfe durchsucht die
Hilfe. Wer einen Kontakt sucht, nimmt die Leiste.<br><br>
<b>Kein Hilfetext je Dialogfeld.</b> Erklärungen stehen dort schon unter
dem Feld; sie zusätzlich in der Hilfe zu führen hieße, sie zweimal zu
pflegen.<br><br>
<b>Keine Bilder.</b> Die Anwendung ist eine Datei ohne Netz; eingebettete
Aufnahmen würden sie um ein Vielfaches aufblähen und veralten beim ersten
Umbau.<br><br>
<b>Kein Verlauf, kein „zuletzt gelesen".</b> Eine Hilfe ist zum
Nachschlagen da, nicht zum Wiederfinden.</div>
</div>
</div>
`;
writeFileSync(new URL("../mockups/schritt-hilfe.html", import.meta.url), html);
console.log("geschrieben, "+html.length+" Zeichen");
