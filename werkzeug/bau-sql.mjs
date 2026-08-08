/* Erzeugt mockups/schritt-sql.html — Entwurf zum SQL-Formatierer.

   Die Ausgabe im Entwurf ist **echt**: Sie kommt aus werkzeug/sql.mjs,
   also aus demselben Code, der später in dashboard.html stünde. Eine
   von Hand geschriebene Wunschausgabe hätte hier nichts bewiesen. */
import {writeFileSync} from "node:fs";
import {formatiere} from "./sql.mjs";

const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

const PROBEN=[
  ["Der Alltagsfall",
   "select id,name,firma from kontakte where fav=true order by name"],
  ["Verbund mit Bedingung",
   "SELECT k.name, count(a.id) AS offen FROM kontakte k LEFT JOIN aufgaben a "
   +"ON a.kontakt = k.id AND a.fertig = false WHERE k.firma = 'Nordstern GmbH' "
   +"GROUP BY k.name HAVING count(a.id) > 0 ORDER BY offen DESC LIMIT 20"],
  ["Unterabfrage",
   "select * from termine where kontakt in (select id from kontakte "
   +"where firma='Nordstern GmbH') and datum >= '2026-08-01'"],
  ["Gemeinsamer Tabellenausdruck",
   "with offen as (select kontakt, count(*) n from aufgaben where fertig=false "
   +"group by kontakt) select k.name, o.n from kontakte k join offen o on o.kontakt=k.id"],
  ["Einfügen",
   "insert into aufgaben (id,titel,frist,fertig) values "
   +"('a1','Rückruf Kanzlei','2026-08-20',false)"],
  ["Kommentare und Apostrophe",
   "-- Offene Posten\nselect id, betrag /* in Cent */, 'Müller''s Firma' as wer "
   +"from rechnungen where bezahlt is null"],
  ["Fenster und eckige Namen",
   "SELECT [Vor Name], row_number() over (partition by firma order by name) rn FROM [dbo].[Kunden]"]
];

const paar=(nm,quelle)=>{
  const r=formatiere(quelle);
  return '<section class="karte"><h2>'+esc(nm)+'</h2>'
    +'<div class="paar">'
    +'<div><div class="et">vorher</div><pre class="c roh">'+esc(quelle)+'</pre></div>'
    +'<div><div class="et">nachher · '+(r.ok?r.zeilen+" Zeilen":"abgelehnt")+'</div>'
    +'<pre class="c">'+esc(r.ok?r.text:r.grund)+'</pre></div>'
    +'</div></section>';
};

const html=`<!doctype html>
<html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Entwurf — SQL im Code-Beautifier</title>
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
.blatt{max-width:1180px;margin:0 auto}
h1{font-size:21px;letter-spacing:-.2px;margin-bottom:5px}
.unter{color:var(--ink3);font-size:13px;margin-bottom:24px;max-width:78ch}
.karte{background:var(--sheet);border:1px solid var(--rule);border-radius:12px;
  padding:17px 20px 19px;margin-bottom:15px}
.karte h2{font-size:14.5px;margin-bottom:11px}
/* min-width:0 ist hier nicht kosmetisch: Eine Rasterzelle schrumpft
   von sich aus nicht unter die Breite ihres Inhalts. Eine lange
   SQL-Zeile schob damit die ganze Seite auf 1890 Pixel, statt im
   eigenen Rahmen zu scrollen. */
.paar{display:grid;gap:14px}
.paar>div{min-width:0}
@media(min-width:900px){.paar{grid-template-columns:1fr 1fr}}
.et{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--ink3);
  margin-bottom:5px}
pre.c{font-family:var(--mono);font-size:12px;line-height:1.65;background:var(--paper);
  border:1px solid var(--rule);border-radius:8px;padding:11px 13px;
  overflow-x:auto;white-space:pre;color:var(--ink)}
pre.c.roh{color:var(--ink3)}
.hin{background:var(--tinte-s);border:1px solid #c9d0ea;border-radius:10px;
  padding:14px 17px;font-size:12.5px;color:var(--ink2);max-width:82ch}
.warn{background:var(--signal-s);border:1px solid #eccfc8;border-radius:10px;
  padding:14px 17px;font-size:12.5px;color:#7d2718;max-width:82ch}
.gut{background:var(--gut-s);border:1px solid #bcd8c7;border-radius:10px;
  padding:14px 17px;font-size:12.5px;color:#204d33;max-width:82ch}
.hin b,.warn b,.gut b{color:inherit;font-weight:700}
code{font-family:var(--mono);font-size:11.5px;background:var(--raise);
  border-radius:4px;padding:1px 5px}
ul{margin:8px 0 0 18px} li{margin-bottom:4px}
</style></head><body><div class="blatt">

<h1>Entwurf — SQL im Code-Beautifier</h1>
<p class="unter">Die Ausgabe unten ist <b>echt</b>: erzeugt von
<code>werkzeug/sql.mjs</code>, also von demselben Code, der später in
<code>dashboard.html</code> stünde. Eine von Hand geschriebene
Wunschausgabe hätte hier nichts bewiesen.</p>

<section class="karte">
<h2>Was der Formatierer ist — und was nicht</h2>
<div class="warn">
<b>Es ist kein Parser.</b> Er zerlegt in Wörter und setzt Zeilenumbrüche.
Er versteht nicht, was die Abfrage tut, und er kennt keinen Dialekt. Er
prüft auch nicht, ob das SQL gültig ist — ein Satz auf Deutsch geht
unverändert hindurch.
</div>
</section>

<section class="karte">
<h2>Die Rückprobe</h2>
<div class="gut">
Nach dem Formatieren wird die Ausgabe <b>erneut zerlegt</b> und
Bestandteil für Bestandteil mit der Eingabe verglichen. Nur der
Schriftfall der Schlüsselwörter darf sich unterscheiden. Stimmt etwas
nicht, wird <b>nichts</b> ausgegeben, sondern gesagt, woran es lag.<br><br>
Ein Formatierer, der still ein Wort verschluckt, ist gefährlicher als
gar keiner — man merkt es erst, wenn die Abfrage falsche Zahlen liefert.
<br><br>
<b>Absichtlich zum Anschlagen gebracht</b>, bevor eingebaut:
<pre class="c" style="margin-top:8px;background:#fff">ein Wort verschluckt   → Die Rückprobe fand 7 Bestandteile statt 8.
ein Wort verändert     → Die Rückprobe stolperte bei „FIRMA“.</pre>
</div>
</section>

${PROBEN.map(([nm,q])=>paar(nm,q)).join("\n")}

<section class="karte">
<h2>Die Regeln, in einem Satz je Zeile</h2>
<div class="hin">
<ul>
<li>Schlüsselwörter groß, alles andere bleibt, wie es getippt wurde.</li>
<li>Jede Klausel beginnt eine Zeile: <code>SELECT</code>, <code>FROM</code>,
<code>WHERE</code>, <code>GROUP BY</code>, <code>HAVING</code>,
<code>ORDER BY</code>, <code>LIMIT</code>, <code>UNION</code> und die
Verbünde.</li>
<li>Nach <code>SELECT</code>, <code>GROUP BY</code>, <code>ORDER BY</code>,
<code>SET</code>, <code>VALUES</code> steht ein Eintrag je Zeile, eingerückt.</li>
<li><code>ON</code> steht eingerückt unter seinem Verbund, die Bedingung
in derselben Zeile. Folgende <code>AND</code> stehen darunter.</li>
<li>Eine Klammer bricht um, wenn eine Unterabfrage darin steht —
sonst bleibt sie in der Zeile. <code>count(*)</code> bleibt
<code>count(*)</code>.</li>
<li>Ein Semikolon beendet die Anweisung und setzt eine Leerzeile.</li>
<li>Zeichenketten, Kommentare und zitierte Namen werden nie angetastet.
Auch <code>'Müller''s'</code> nicht.</li>
</ul>
</div>
</section>

<section class="karte">
<h2>Zwei Fragen, bevor ich baue</h2>
<div class="hin">
<b>1 — Soll <code>CASE</code> umbrechen?</b> Heute bleibt es in einer
Zeile:
<pre class="c" style="margin:8px 0;background:#fff">CASE WHEN n > 10 THEN 'viel' WHEN n > 0 THEN 'wenig' ELSE 'nichts' END AS stufe</pre>
Bei drei Zweigen geht das noch, bei acht nicht mehr. Umbrechen kostet
rund 20 Zeilen und macht kurze Fälle unnötig lang.<br><br>
<b>2 — Soll die Leiste SQL erkennen?</b> Sie erkennt heute JSON an
<code>{</code> und <code>[</code>. Bei SQL ginge das über ein führendes
<code>select</code>, <code>with</code>, <code>insert</code>,
<code>update</code> oder <code>delete</code>. Das ist zuverlässig, würde
aber bedeuten, dass ein getipptes „select“ am Zeilenanfang immer ein
Angebot erzeugt.
</div>
</section>

<section class="karte">
<h2>Was bewusst nicht kommt</h2>
<div class="hin">
<b>Keine Prüfung auf gültiges SQL.</b> Dafür bräuchte es einen Parser je
Dialekt.<br><br>
<b>Kein Umschreiben.</b> Keine Kurzformen auflösen, keine Sternchen
ausschreiben, keine Klammern ergänzen. Der Formatierer setzt
Zeilenumbrüche, sonst nichts.<br><br>
<b>Keine Einstellungen.</b> Kein Wahlfeld für Einzugtiefe, führende
Kommas oder Kleinschreibung der Schlüsselwörter. Eine Gestalt, und die
ist entschieden.<br><br>
<b>Weiterhin kein HTML, kein CSS, kein XML.</b> Die stehen in
<code>doku/ROADMAP.md</code> unter „Später“ und bleiben dort.
</div>
</section>

</div></body></html>`;

writeFileSync(new URL("../mockups/schritt-sql.html", import.meta.url), html);
console.log("mockups/schritt-sql.html geschrieben — "+html.length+" Zeichen");
