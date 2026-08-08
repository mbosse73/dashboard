/* Erzeugt mockups/schritt-einstellungen.html — Entwurf zu Modul 17.

   Statisch. Nichts ist anklickbar, nichts wird gespeichert.

   Der Planner bleibt ausdruecklich unberuehrt: keine Einstellung fuer
   seine Stunden, keine fuer seine Tage. Ein Termin um 19:30 erscheint
   dort weiterhin nicht — das ist eine Entscheidung, kein Versehen. */
import {writeFileSync} from "node:fs";

const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

/* Eine Zeile: Beschriftung links, Schalter rechts, Erklaerung darunter.
   Die Erklaerung steht **unter** der Zeile, nie in der Beschriftung —
   so verlangt es CLAUDE.md fuer Dialogfelder, und hier gilt es genauso. */
function zeile(nm, steuer, unter){
  return '<div class="e-z"><div class="e-k"><span class="e-nm">'+esc(nm)+'</span>'
    +'<span class="e-s">'+steuer+'</span></div>'
    +(unter?'<div class="e-u">'+unter+'</div>':'')+'</div>';
}
const wahl=(opt,an)=>'<span class="wahl">'
  + opt.map(o=>'<span class="'+(o===an?"an":"")+'">'+esc(o)+'</span>').join("")
  + '</span>';
const haken=(nm,an)=>'<label class="hk"><span class="kast'+(an?" an":"")+'">'
  +(an?'<svg viewBox="0 0 12 12"><path d="M2 6.2 4.6 9 10 3"/></svg>':'')
  +'</span>'+esc(nm)+'</label>';

function abschnitt(nr,titel,inhalt,fuss){
  return '<section class="karte"><h2><span class="nr">'+nr+'</span>'+esc(titel)+'</h2>'
    +inhalt+(fuss?'<div class="e-f">'+fuss+'</div>':'')+'</section>';
}

const html=`<!doctype html>
<html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Entwurf — Modul 17, Einstellungen</title>
<style>
:root{
  color-scheme:light;
  --ff:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
  --mono:ui-monospace,"Cascadia Mono",Consolas,monospace;
  --paper:#f7f5f0; --sheet:#fffefb; --raise:#efece4;
  --rule:#e2ded4;  --rule2:#cbc6ba;
  --ink:#1a1a18;   --ink2:#54514b;  --ink3:#6b675e;
  --tinte:#2f3a8c; --tinte-s:#e7eaf6;
  --signal:#a8321f;--signal-s:#fbe9e5;
  --gut:#2b6b46;   --gut-s:#e3f0e8;
}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:var(--ff);background:var(--paper);color:var(--ink);
  font-size:14px;line-height:1.55;padding:34px 22px 70px}
.blatt{max-width:900px;margin:0 auto}
h1{font-size:21px;letter-spacing:-.2px;margin-bottom:5px}
.unter{color:var(--ink3);font-size:13px;margin-bottom:24px;max-width:74ch}
.karte{background:var(--sheet);border:1px solid var(--rule);border-radius:12px;
  padding:16px 20px 18px;margin-bottom:14px}
.karte h2{font-size:14.5px;display:flex;align-items:center;gap:9px;margin-bottom:10px}
.nr{display:inline-flex;align-items:center;justify-content:center;min-width:23px;height:21px;
  padding:0 7px;border-radius:11px;background:var(--tinte-s);color:var(--tinte);
  font-size:11px;font-weight:650}

/* ---- eine Einstellungszeile ---- */
.e-z{padding:9px 0;border-bottom:1px solid var(--rule)}
.e-z:last-of-type{border-bottom:0}
.e-k{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
.e-nm{flex:1;min-width:170px;font-size:13.5px}
.e-s{flex-shrink:0}
.e-u{color:var(--ink3);font-size:12px;margin-top:4px;max-width:70ch}
.e-f{color:var(--ink3);font-size:12px;margin-top:12px;padding-top:10px;
  border-top:1px solid var(--rule);max-width:74ch}

.wahl{display:inline-flex;gap:2px;background:var(--raise);border-radius:8px;padding:3px}
.wahl span{font-size:12.5px;padding:3px 12px;border-radius:6px;color:var(--ink2);
  white-space:nowrap}
.wahl span.an{background:var(--sheet);color:var(--tinte);font-weight:600;
  box-shadow:0 1px 2px rgba(0,0,0,.06)}
.hk{display:inline-flex;align-items:center;gap:8px;font-size:13px;color:var(--ink2);
  margin:3px 18px 3px 0}
.kast{width:14px;height:14px;border:1.4px solid var(--rule2);border-radius:4px;
  background:var(--sheet);display:inline-flex;align-items:center;justify-content:center;
  flex-shrink:0}
.kast.an{background:var(--tinte-s);border-color:var(--tinte);color:var(--tinte)}
.kast svg{width:9px;height:9px;fill:none;stroke:currentColor;stroke-width:2;
  stroke-linecap:round;stroke-linejoin:round}
.knopf{font-size:12.5px;padding:5px 14px;border-radius:8px;border:1px solid var(--rule2);
  background:var(--sheet);color:var(--ink2);white-space:nowrap}
.knopf.weg{border-color:#e0bdb4;color:var(--signal);background:var(--signal-s)}

.hin{background:var(--tinte-s);border:1px solid #c9d0ea;border-radius:10px;
  padding:13px 16px;font-size:12.5px;color:var(--ink2)}
.warn{background:var(--signal-s);border:1px solid #eccfc8;border-radius:10px;
  padding:13px 16px;font-size:12.5px;color:#7d2718}
.hin b,.warn b{color:inherit}
.hin ul,.warn ul{margin:6px 0 0 18px}
.hin li,.warn li{margin-bottom:3px}
code{font-family:var(--mono);font-size:11.5px;background:var(--raise);
  border-radius:4px;padding:1px 5px}
.merk{background:var(--raise);border-radius:9px;padding:11px 14px;font-size:12.5px;
  color:var(--ink2);margin-top:12px}
</style></head><body><div class="blatt">

<h1>Entwurf — Modul 17, Einstellungen</h1>
<p class="unter">Statisch. Nichts ist anklickbar. Die Fläche zeigt, was
einstellbar wäre — Sie entscheiden, was davon wirklich hinein soll.
<b>Der Planner bleibt unberührt:</b> keine Einstellung für seine Stunden,
keine für seine Tage.</p>

${abschnitt("1","Anzeige",
  zeile("Thema", wahl(["Standard","Basecamp","Drittes"],"Standard"),
    "Steht weiterhin auch oben im Kopf. Dort ist es ein Klick, hier steht es der Vollständigkeit halber.")
+ zeile("Schriftgröße", wahl(["Klein","Normal","Groß"],"Normal"),
    "Drei Stufen, nicht frei wählbar. Ein freier Wert bricht jedes Raster.")
+ zeile("Womit die App startet", wahl(["Leiste","Planner"],"Leiste"),
    "Bisher immer die Leiste."),
  "Diese drei bleiben am Rechner. Sie stehen <b>nicht</b> in der Sicherung — "
  +"ein anderer Bildschirm braucht andere Werte.")}

${abschnitt("2","Arbeit",
  zeile("Überfällig ab", wahl(["am Tag selbst","1 Tag vorher","2 Tage vorher"],"am Tag selbst"),
    "Heute wird etwas erst rot, wenn die Frist verstrichen ist. Ein Vorlauf warnt früher.")
+ zeile("Wochenende mitzählen", wahl(["nein","ja"],"nein"),
    "Betrifft Fristen und den Kalender. <b>Der Planner bleibt bei Montag bis Freitag</b> — "
    +"das ist so entschieden."),
  "Diese beiden kommen <b>in die Sicherung</b>. Sie ändern, wie Ihre Daten "
  +"gedeutet werden; auf einem anderen Rechner müssen sie gleich sein.")}

${abschnitt("3","Was in der Leiste steht",
  '<div class="e-z"><div style="padding:2px 0">'
  + haken("Überfälliges",true) + haken("Nächster Termin",true)
  + haken("Schmierzettel",true) + haken("Häufig benutzt",true)
  + haken("Favoriten",true) + haken("Modulliste",true)
  + '</div><div class="e-u">Ausgeschaltetes verschwindet nur aus der Leiste. '
  + 'Die Einträge selbst bleiben und sind über ihr Modul erreichbar.</div></div>')}

${abschnitt("4","Daten",
  zeile("Erinnerung ans Sichern", wahl(["aus","nach 3 Tagen","nach 7 Tagen"],"nach 7 Tagen"),
    "Die App weiß, wann Sie zuletzt gesichert haben. Bisher sagt sie nichts dazu.")
+ zeile("Beispieldaten", '<span class="knopf weg">Beispieldaten entfernen</span>',
    "Die Demo-Kontakte, -Termine und -Notizen stehen seit dem ersten Schritt drin. "
    +"Bisher gibt es keinen Weg, sie loszuwerden.")
+ zeile("Alles zurücksetzen", '<span class="knopf weg">Auf Auslieferungsstand</span>',
    "Löscht sämtliche Daten und stellt die Beispieldaten wieder her."))}

<section class="karte">
<h2><span class="nr">!</span>Wenn etwas gelöscht wird, fragt es vorher</h2>
<div class="warn">
<b>Beispieldaten wirklich entfernen?</b>
<ul>
<li>5 Kontakte, 6 Termine, 4 Aufgaben und 3 Notizen verschwinden.</li>
<li>Was Sie selbst angelegt haben, bleibt.</li>
<li>Angeheftete Plätze, die auf Beispieldaten zeigen, werden frei.</li>
<li><b>Das lässt sich nicht rückgängig machen.</b> Vorher sichern.</li>
</ul>
</div>
<div class="merk">So sieht die Rückfrage aus. Sie zählt vorher ab, was
verschwindet — eine Frage ohne Zahlen ist keine Frage, sondern eine
Zumutung.</div>
</section>

<section class="karte">
<h2><span class="nr">?</span>Was bewusst nicht hineinkommt</h2>
<div class="hin">
<ul>
<li><b>Die Planner-Stunden.</b> Bleiben bei 7 bis 18 Uhr. Ein Termin um
19:30 erscheint dort weiterhin nicht; der Kalender zeigt ihn.</li>
<li><b>Freie Farben.</b> Themen sind aufeinander abgestimmt. Frei
gewählte Farben brechen die Lesbarkeit.</li>
<li><b>Freie Tastenkürzel.</b> Die Hilfe liest die Tasten aus einer
festen Tabelle. Wären sie frei, stünde dort Falsches.</li>
<li><b>Die Zahl der Plätze.</b> Zwölf, davon acht mit Kürzel — das gibt
die Tastatur vor, nicht die App.</li>
<li><b>Einstellungen für den Beautifier.</b> Einzugtiefe, führende
Kommas, Kleinschreibung. Eine Gestalt, und die ist entschieden.</li>
<li><b>Ein voreingestelltes PDF-Format.</b> Auf Ihren Wunsch gestrichen —
der Dialog fragt weiterhin jedes Mal.</li>
</ul>
</div>
</section>

<section class="karte">
<h2><span class="nr">i</span>Was das kostet</h2>
<div class="hin">
Rund <b>200 Zeilen</b> in <code>dashboard.html</code>: das Modul selbst,
ein neuer Datenbereich für die beiden Arbeitsregeln, die Migration und
die Stellen, an denen die Werte wirken.<br><br>
<b>Sieben Einstellungen und zwei Knöpfe.</b> Jede muss gesichert,
geladen, in der Hilfe erklärt und in jeder Fläche beachtet werden, die
sie betrifft. Streichen Sie, was Sie nicht wirklich brauchen — jede
gestrichene Zeile ist eine, die nie kaputtgehen kann.
</div>
</section>

</div></body></html>`;

writeFileSync(new URL("../mockups/schritt-einstellungen.html", import.meta.url), html);
console.log("mockups/schritt-einstellungen.html geschrieben — "+html.length+" Zeichen");
