/* Erzeugt mockups/schritt-outliner.html — Entwurf zu Schritt 9.
   Vier Zustaende: gefuellt mit Schreibmarke, ein geklappter Knoten mit
   seinem Zaehler, die leere Gliederung, und der Fehlerfall beim
   Einruecken. Statisch, nichts ist anklickbar. */
import {writeFileSync} from "node:fs";
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

/* Die Beispielgliederung — dieselbe, die heute schon in `baum` steht,
   um zwei Ebenen erweitert. So laesst sich der Entwurf mit dem
   bestehenden Geruest vergleichen. */
const BAUM=[
  {e:0,t:"Produktstrategie 2026"},
  {e:1,t:"Marktlage"},
  {e:2,t:"Vier Anbieter geprüft"},
  {e:2,t:"Zwei davon relevant"},
  {e:1,t:"Positionierung"},
  {e:2,t:"Einzeldatei als Merkmal"},
  {e:1,t:"Preismodell"},
  {e:2,t:"Staffeln ab Q4"}
];

/* Erstes Feld: die Tastenkappen, einzeln. Zweites Feld: was ohne Kappe
   danebensteht — „Klick aufs Dreieck“ ist keine Taste und darf nicht in
   drei Kappen zerfallen. */
const TASTEN=[
  [["↵"],"","Neuer Knoten darunter, gleiche Ebene"],
  [["Tab"],"","Einrücken, mit allen Unterknoten"],
  [["⇧","Tab"],"","Ausrücken, mit allen Unterknoten"],
  [["↑","↓"],"","In den Knoten darüber oder darunter"],
  [["Alt","↑","↓"],"","Knoten verschieben, mit allen Unterknoten"],
  [["⌫"],"","Im leeren Knoten: löschen"],
  [[],"Klick aufs Dreieck","Klappt zu und wieder auf"]
];

/* ---------- Bausteine ---------- */

/* Ein Knoten. `kinder` > 0 heisst: er hat Unterknoten, bekommt also ein
   Dreieck. `zu` klappt ihn zu, `mark` setzt die Schreibmarke hinein. */
function knoten(k, opt){
  opt=opt||{};
  const drei = opt.kinder
    ? '<button class="ol-drei'+(opt.zu?" zu":"")+'" aria-label="'
      +(opt.zu?"Aufklappen":"Zuklappen")+'">'
      +'<svg viewBox="0 0 12 12"><path d="M4 2.5 8 6l-4 3.5"/></svg></button>'
    : '<span class="ol-drei leer"></span>';
  const zahl = (opt.zu && opt.kinder)
    ? '<span class="ol-zu">+'+opt.kinder+'</span>' : "";
  return '<div class="ol-k'+(opt.mark?" mark":"")+'" style="padding-left:'
    +(k.e*24)+'px">'+drei
    +'<span class="ol-pkt"></span>'
    +'<span class="ol-tx"'+(k.e===0?' style="font-weight:650"':'')+'>'
    +esc(k.t)+(opt.mark?'<span class="ol-cur"></span>':'')+'</span>'
    +zahl+'</div>';
}

function baum(liste){
  return '<div class="ol-baum">'+liste.map(x=>knoten(x.k,x)).join("")+'</div>';
}

function karte(nr, titel, text, inhalt){
  return '<section class="karte"><h2><span class="nr">'+nr+'</span>'+esc(titel)+'</h2>'
    +'<p class="was">'+text+'</p><div class="buehne">'+inhalt+'</div></section>';
}

/* ---------- Die vier Zustaende ---------- */

/* 1 — gefuellt, Schreibmarke im vierten Knoten */
const zustand1 = baum(BAUM.map((k,i)=>({
  k, kinder: k.e===0?7:(k.t==="Marktlage"?2:(k.t==="Positionierung"||k.t==="Preismodell"?1:0)),
  mark: i===3
})));

/* 2 — „Marktlage“ zugeklappt. Die beiden Unterknoten verschwinden nicht
   spurlos: der Zaehler sagt, wie viele es sind. */
const zustand2 = baum(BAUM
  .filter(k=>k.t!=="Vier Anbieter geprüft" && k.t!=="Zwei davon relevant")
  .map(k=>({
    k, kinder: k.e===0?5:(k.t==="Marktlage"?2:(k.t==="Positionierung"||k.t==="Preismodell"?1:0)),
    zu: k.t==="Marktlage"
  })));

/* 3 — leer. Ein einzelner leerer Knoten steht bereit, dazu ein Satz,
   der sagt, was zu tun ist. Nie eine tote Flaeche. */
const zustand3 = baum([{k:{e:0,t:""}, mark:true}])
  + '<p class="leer">Noch keine Gliederung. Tippen Sie los — <b>↵</b> legt '
  + 'den nächsten Knoten an, <b>Tab</b> rückt ihn ein.</p>';

/* 4 — Fehlerfall: „Marktlage“ ist der erste Knoten unter seinem
   Elternknoten. Es gibt darueber niemanden auf gleicher Ebene, unter den
   er rutschen koennte. Einruecken ist hier keine Kleinigkeit, die still
   misslingt — es wird gesagt. */
const zustand4 = baum([
    {k:BAUM[0], kinder:7},
    {k:BAUM[1], kinder:2, mark:true},
    {k:BAUM[2]}, {k:BAUM[3]}
  ])
  + '<div class="zettel">Kein Knoten darüber auf gleicher Ebene</div>';

/* ---------- Seite ---------- */
const html = `<!doctype html>
<html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Entwurf — Schritt 9, Outliner</title>
<style>
:root{
  color-scheme:light;
  --ff:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
  --paper:#f7f5f0; --sheet:#fffefb; --raise:#efece4;
  --rule:#e2ded4;  --rule2:#cbc6ba;
  --ink:#1a1a18;   --ink2:#54514b;  --ink3:#6b675e;
  --tinte:#2f3a8c; --tinte-s:#e7eaf6;
  --signal:#a8321f;--signal-s:#fbe9e5;
}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:var(--ff);background:var(--paper);color:var(--ink);
  font-size:14px;line-height:1.55;padding:34px 22px 70px}
.blatt{max-width:1180px;margin:0 auto}
h1{font-size:21px;letter-spacing:-.2px;margin-bottom:5px}
.unter{color:var(--ink3);font-size:13px;margin-bottom:26px;max-width:78ch}
.karte{background:var(--sheet);border:1px solid var(--rule);border-radius:12px;
  padding:19px 21px 22px;margin-bottom:19px}
.karte h2{font-size:14.5px;display:flex;align-items:center;gap:9px;margin-bottom:5px}
.nr{display:inline-flex;align-items:center;justify-content:center;width:21px;height:21px;
  border-radius:50%;background:var(--tinte-s);color:var(--tinte);font-size:11px;font-weight:650}
.was{color:var(--ink3);font-size:12.5px;margin-bottom:14px;max-width:74ch}
.buehne{background:var(--paper);border:1px solid var(--rule);border-radius:9px;padding:14px 12px}

/* ---- der Baum selbst ---- */
.ol-baum{padding:0}
.ol-k{display:flex;align-items:center;gap:7px;padding:5px 8px;border-radius:7px;min-height:29px}
.ol-k:hover{background:var(--sheet)}
.ol-k.mark{background:var(--tinte-s)}
.ol-drei{width:15px;height:15px;flex-shrink:0;border:0;background:none;padding:0;
  color:var(--ink3);display:flex;align-items:center;justify-content:center;cursor:pointer}
.ol-drei svg{width:11px;height:11px;fill:none;stroke:currentColor;stroke-width:1.9;
  stroke-linecap:round;stroke-linejoin:round;transform:rotate(90deg)}
.ol-drei.zu svg{transform:rotate(0deg)}
.ol-drei.leer{cursor:default}
.ol-pkt{width:5px;height:5px;border-radius:50%;background:var(--rule2);flex-shrink:0}
.ol-tx{font-size:14px;color:var(--ink)}
.ol-cur{display:inline-block;width:1.5px;height:15px;background:var(--tinte);
  margin-left:1px;vertical-align:-3px}
.ol-zu{font-size:11px;color:var(--ink3);background:var(--raise);border-radius:20px;
  padding:1px 7px;margin-left:5px}
.leer{color:var(--ink3);font-size:12.5px;margin:12px 4px 2px;max-width:78ch}
.zettel{margin:13px auto 2px;width:max-content;background:var(--signal-s);
  color:var(--signal);border:1px solid #eccfc8;border-radius:8px;
  padding:7px 13px;font-size:12.5px}

/* ---- Tastenliste ---- */
table{border-collapse:collapse;width:100%}
td{padding:6px 10px;border-bottom:1px solid var(--rule);font-size:13px;vertical-align:top}
tr:last-child td{border-bottom:0}
td:first-child{width:160px;white-space:nowrap}
.klar{color:var(--ink2);font-size:12.5px}
kbd{font-family:var(--ff);font-size:11.5px;background:var(--raise);border:1px solid var(--rule2);
  border-bottom-width:2px;border-radius:5px;padding:1px 6px;color:var(--ink2)}
.hin{background:var(--tinte-s);border:1px solid #c9d0ea;border-radius:10px;
  padding:14px 17px;font-size:12.5px;color:var(--ink2);max-width:78ch}
.hin b{color:var(--ink)}
</style></head><body><div class="blatt">

<h1>Entwurf — Schritt 9, Outliner</h1>
<p class="unter">Statisch. Nichts ist anklickbar, nichts wird gespeichert.
Der Entwurf soll die Gestalt entscheiden, bevor sie etwas kostet.</p>

${karte("1","Gefüllt","Die Schreibmarke steht in einem Knoten. Ein Knoten ist ein Feld — es wird direkt darin geschrieben, es gibt keinen Dialog.",zustand1)}

${karte("2","Zugeklappt","„Marktlage“ ist zu. Die beiden Unterknoten sind nicht verschwunden: <b>+2</b> sagt, wie viele darunter liegen. Nichts darf unsichtbar werden.",zustand2)}

${karte("3","Leer","Ein leerer Knoten steht bereit, die Schreibmarke sitzt darin. Dazu ein Satz, der den Weg zeigt.",zustand3)}

${karte("4","Einrücken geht nicht","„Marktlage“ ist der erste Knoten unter seinem Elternknoten. Es gibt darüber niemanden auf gleicher Ebene, unter den er rutschen könnte. Das misslingt nicht still, es wird gesagt.",zustand4)}

<section class="karte">
<h2><span class="nr">5</span>Tastenbelegung</h2>
<p class="was">Alle Tasten gelten im Knoten, also während geschrieben wird.
Sie kommen aus derselben Tabelle, aus der die Hilfe sie liest.</p>
<table>${TASTEN.map(([kappen,klar,w])=>'<tr><td>'
  +kappen.map(x=>'<kbd>'+esc(x)+'</kbd>').join(" ")
  +(klar?'<span class="klar">'+esc(klar)+'</span>':'')
  +'</td><td>'+esc(w)+'</td></tr>').join("")}</table>
</section>

<section class="karte">
<h2><span class="nr">6</span>Was der Entwurf offenlässt</h2>
<div class="hin">
<b>Kein Ziehen mit der Maus.</b> Verschoben wird mit <kbd>Alt</kbd> und den
Pfeilen. Ziehen über Ebenen hinweg ist schwer zu treffen und schwer
rückgängig zu machen.<br><br>
<b>Nur eine Gliederung.</b> Kein Umschalten zwischen mehreren. Der oberste
Knoten trägt den Titel.<br><br>
<b>Keine Kennungen je Knoten.</b> Ein Knoten bleibt <b>{ebene, t}</b>, dazu
neu <b>zu</b> fürs Klappen. Damit ist keine Migration bestehender
Sicherungen nötig — der einzige Punkt in diesem Schritt, der sonst nicht
umkehrbar wäre.
</div>
</section>

</div></body></html>`;

writeFileSync(new URL("../mockups/schritt-outliner.html", import.meta.url), html);
console.log("mockups/schritt-outliner.html geschrieben — " + html.length + " Zeichen");
