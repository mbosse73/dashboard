/* Erzeugt mockups/schritt-jahreskalender.html — 12 Monate × 31 Tage
   lassen sich nicht von Hand schreiben und schon gar nicht prüfen. */
import { writeFileSync } from "node:fs";

const JAHR = 2026;
const HEUTE = "2026-08-06";
const MONL = ["Januar","Februar","März","April","Mai","Juni",
              "Juli","August","September","Oktober","November","Dezember"];
const MONK = ["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
const TAGK = ["So","Mo","Di","Mi","Do","Fr","Sa"];

/* Demodaten. Kategorie: "urlaub" oder "sonst". */
const TERMINE = [
  {von:"2026-02-16", bis:"2026-02-20", titel:"Skiurlaub Tirol",           kat:"urlaub"},
  {von:"2026-03-12", bis:"2026-03-14", titel:"Messe Hannover",             kat:"sonst"},
  {von:"2026-05-05", bis:"2026-05-05", titel:"Zahnarzt",                   kat:"sonst"},
  {von:"2026-06-18", bis:"2026-06-19", titel:"Konferenz Berlin",           kat:"sonst"},
  {von:"2026-08-03", bis:"2026-08-17", titel:"Sommerurlaub Dänemark",      kat:"urlaub"},
  /* Die drei liegen bewusst im Urlaub: ein einzelner Tag und eine
     Spanne, die über das Urlaubsende hinausläuft. Genau daran zeigt
     sich, ob ein Overlay trägt. */
  {von:"2026-08-10", bis:"2026-08-10", titel:"Termin Steuerberater",       kat:"sonst"},
  {von:"2026-08-15", bis:"2026-08-19", titel:"Umzug Lager",                kat:"sonst"},
  {von:"2026-09-30", bis:"2026-09-30", titel:"Jahresabschluss besprechen", kat:"sonst"},
  {von:"2026-11-11", bis:"2026-11-13", titel:"Fortbildung Buchhaltung",    kat:"sonst"},
  {von:"2026-12-22", bis:"2026-12-31", titel:"Weihnachtsurlaub",           kat:"urlaub"}
];

const p2 = n => String(n).padStart(2, "0");
const iso = (j,m,t) => j + "-" + p2(m+1) + "-" + p2(t);
const esc = s => String(s).replace(/[&<>"]/g,
  c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

function spanne(t){
  const [jv,mv,tv] = t.von.split("-").map(Number);
  const [jb,mb,tb] = t.bis.split("-").map(Number);
  if (t.von === t.bis) return tv + ". " + MONL[mv-1];
  if (mv === mb && jv === jb) return tv + ".–" + tb + ". " + MONL[mv-1];
  return tv + ". " + MONK[mv-1] + " – " + tb + ". " + MONK[mb-1];
}

const amTag = key => TERMINE.filter(t => key >= t.von && key <= t.bis);
const hat = (key, kat) => amTag(key).some(x => x.kat === kat);

function raster(){
  let h = '<div class="jahr">';
  for (let m = 0; m < 12; m++){
    const laenge = new Date(JAHR, m+1, 0).getDate();
    h += '<div class="jz"><span class="jm">' + MONK[m] + '</span>';
    for (let t = 1; t <= 31; t++){
      if (t > laenge){ h += '<span class="jt keiner"></span>'; continue; }
      const key = iso(JAHR, m, t);
      const d   = new Date(JAHR, m, t);
      const l   = amTag(key);

      const k = ["jt"];
      if (d.getDay() === 0 || d.getDay() === 6) k.push("we");
      if (key === HEUTE) k.push("heute");

      /* Anfang und Ende je Kategorie getrennt bestimmen. Beide Lagen
         laufen unabhängig voneinander, sonst reißt eine Spanne genau
         dort auf, wo die andere beginnt. */
      ["urlaub","sonst"].forEach(kat => {
        if (!hat(key, kat)) return;
        k.push(kat);
        const vor  = t > 1      && hat(iso(JAHR,m,t-1), kat);
        const nach = t < laenge && hat(iso(JAHR,m,t+1), kat);
        if (!vor)  k.push(kat === "urlaub" ? "u-anfang" : "s-anfang");
        if (!nach) k.push(kat === "urlaub" ? "u-ende"   : "s-ende");
      });

      h += '<span class="' + k.join(" ") + '">';
      h += '<span class="n">' + t + '</span>';
      if (l.length){
        h += '<span class="blase"><b>' + TAGK[d.getDay()] + ", " + t + ". " + MONL[m] + '</b>';
        l.forEach(x => {
          h += '<span class="e"><span class="w ' + x.kat + '"></span>'
             + esc(x.titel) + ' <em>' + esc(spanne(x)) + '</em></span>';
        });
        h += '</span>';
      }
      h += '</span>';
    }
    h += '</div>';
  }
  return h + '</div>';
}

const kopf = `
    <div class="jkopf">
      <span class="jpfeil"><svg viewBox="0 0 20 20"><path d="M12 4 6 10l6 6"/></svg></span>
      <span class="jahrzahl">${JAHR}</span>
      <span class="jpfeil"><svg viewBox="0 0 20 20"><path d="m8 4 6 6-6 6"/></svg></span>
      <span class="sp"></span>
      <span class="zaehler">${TERMINE.length} Einträge · ${TERMINE.filter(t=>t.kat==="urlaub").length} Urlaube</span>
    </div>`;

/* Jede Probe zeigt eine echte Tageszahl. Eine Probe, die etwas anderes
   zeigt als ihre Beschriftung behauptet, ist schlimmer als keine. */
const legende = `
<div class="legende">
  <span class="lp"><span class="pr urlaub u-anfang u-ende"><span class="z">14</span></span>Urlaub</span>
  <span class="lp"><span class="pr sonst s-anfang s-ende"><span class="z">14</span></span>Sonstiger Termin</span>
  <span class="lp"><span class="pr urlaub u-anfang u-ende sonst s-anfang s-ende"><span class="z">14</span></span>Beides am selben Tag</span>
  <span class="lp"><span class="pr heute"><span class="z t">14</span></span>Heute</span>
  <span class="lp"><span class="pr"><span class="z blass">14</span></span>Wochenende</span>
</div>`;

const html = `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Entwurf — Jahreskalender, Overlay</title>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  color-scheme:light;
  --ff:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
  --serif:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,ui-serif,serif;
  --mono:ui-monospace,"SF Mono","Cascadia Mono","Fira Code",Consolas,monospace;
  --paper:#f7f5f0; --sheet:#fffefb; --raise:#efece4;
  --rule:#e2ded4;  --rule2:#cbc6ba;
  --ink:#1a1a18;   --ink2:#54514b;  --ink3:#6b675e;
  --tinte:#2f3a8c; --tinte-s:#e7eaf6;
  --signal:#a8321f;--signal-s:#fbe9e5;
  /* Die beiden Kategorienfarben. Nur hier, nirgends sonst. */
  --k-urlaub:#cfe4d6; --k-sonst:#d3daf0;
}
body{font-family:var(--ff);background:var(--paper);color:var(--ink);
  -webkit-font-smoothing:antialiased}

.meta{background:#1a1a18;color:#e7e5e0;padding:10px 22px;font-size:13px;
  display:flex;align-items:baseline;gap:16px;flex-wrap:wrap}
.meta b{color:#fff}
.rahmenhinweis{max-width:1180px;margin:16px auto 0;padding:0 26px;font-size:13px;
  color:var(--ink2);line-height:1.6}
.rahmenhinweis b{color:var(--ink)}
.rahmenhinweis + .rahmenhinweis{margin-top:9px}
.mitte{max-width:1180px;margin:0 auto;padding:0 26px 70px}

.abs{display:flex;align-items:center;gap:13px;padding:34px 0 11px}
.abs h2{font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;
  font-weight:700;color:var(--ink)}
.abs .r{flex:1;height:1px;background:var(--rule)}
.abs .n{font-family:var(--mono);font-size:11px;color:var(--ink3)}
.abs .n.warn{color:var(--signal)}
.hinweis{font-size:12.5px;color:var(--ink3);line-height:1.55;padding:0 0 14px}

.jkopf{display:flex;align-items:center;gap:10px;padding:0 0 14px}
.jkopf .jahrzahl{font-family:var(--serif);font-size:26px;letter-spacing:-.01em}
.jpfeil{width:28px;height:28px;border-radius:8px;border:1px solid var(--rule2);
  background:var(--sheet);color:var(--ink2);display:grid;place-items:center;flex-shrink:0}
.jpfeil svg{width:13px;height:13px;stroke:currentColor;stroke-width:1.9;fill:none;
  stroke-linecap:round;stroke-linejoin:round}
.jkopf .sp{flex:1}
.jkopf .zaehler{font-family:var(--mono);font-size:11px;color:var(--ink3)}

/* ---------- Das Raster: 12 Zeilen, 31 Spalten ---------- */
.jahr{border:1px solid var(--rule);border-radius:11px;background:var(--sheet);
  padding:7px 9px;overflow-x:auto}
.jz{display:grid;grid-template-columns:34px repeat(31,1fr);align-items:center;min-width:940px}
.jm{font-family:var(--mono);font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;
  color:var(--ink3);font-weight:700}
.jt{position:relative;height:29px;display:grid;place-items:center;
  font-size:11.5px;color:var(--ink2);font-variant-numeric:tabular-nums;cursor:pointer}
.jt.keiner{cursor:default}
.jt.we .n{color:#a6a29a}
.jt .n{position:relative;z-index:3;line-height:1}
.jt:hover .n{color:var(--ink);font-weight:700}

/* Urlaub — die untere Lage, volle Höhe, durchgehend über die Spanne */
.jt.urlaub::before{content:"";position:absolute;inset:2px -1px;background:var(--k-urlaub);
  z-index:0}
.jt.u-anfang::before{left:2px;border-radius:6px 0 0 6px}
.jt.u-ende::before{right:2px;border-radius:0 6px 6px 0}

/* Sonstiger Termin — die obere Lage. Deckend, aber niedriger, damit
   der Urlaub darunter an beiden Rändern stehen bleibt. Halbtransparent
   ginge nicht: die Mischfarbe läge zu beiden Ausgangsfarben bei
   1,00 : 1 und wäre von keiner der beiden zu unterscheiden. */
.jt.sonst::after{content:"";position:absolute;inset:6px -1px;background:var(--k-sonst);
  z-index:1}
.jt.s-anfang::after{left:3px;border-radius:5px 0 0 5px}
.jt.s-ende::after{right:3px;border-radius:0 5px 5px 0}

/* Heute — Tinte, über beiden Lagen */
.jt.heute .n{color:var(--tinte);font-weight:700}
.jt.heute::after{content:"";position:absolute;inset:2px 1px;border:1.5px solid var(--tinte);
  border-radius:6px;z-index:2;background:none}
/* Fällt heute auf einen sonstigen Termin, braucht es beide Lagen:
   der Rahmen kommt dann aus einem eigenen Element. */
.jt.heute.sonst::after{inset:6px -1px;border:0;background:var(--k-sonst);border-radius:0}
.jt.heute.sonst.s-anfang::after{left:3px;border-radius:5px 0 0 5px}
.jt.heute.sonst.s-ende::after{right:3px;border-radius:0 5px 5px 0}
.jt.heute.sonst .n::before{content:"";position:absolute;inset:-8px -6px;
  border:1.5px solid var(--tinte);border-radius:6px;z-index:2}

/* ---------- Gegenprobe: halbtransparent ---------- */
.durchsichtig .jt.sonst::after{background:rgba(122,138,206,.5)}

/* ---------- Die Blase beim Zeigen ---------- */
.jt .blase{position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);
  background:var(--ink);color:var(--sheet);font-size:11.5px;line-height:1.45;
  padding:8px 11px;border-radius:8px;opacity:0;pointer-events:none;transition:opacity .13s;
  z-index:40;min-width:200px;text-align:left;display:flex;flex-direction:column;gap:4px}
.jt:hover .blase{opacity:1}
.jt .blase b{font-size:11px;color:#b9b6ad;font-weight:600}
.jt .blase .e{display:flex;align-items:baseline;gap:6px;white-space:nowrap}
.jt .blase em{font-style:normal;color:#b9b6ad;font-size:10.5px}
.jt .blase .w{width:8px;height:8px;border-radius:2px;flex-shrink:0}
.jt .blase .w.urlaub{background:var(--k-urlaub)}
.jt .blase .w.sonst{background:var(--k-sonst)}
.jz .jt:nth-child(-n+5) .blase{left:0;transform:none}
.jz .jt:nth-last-child(-n+4) .blase{left:auto;right:0;transform:none}

/* ---------- Legende ---------- */
.legende{display:flex;flex-wrap:wrap;gap:9px 22px;padding:14px 2px 0;font-size:12.5px;
  color:var(--ink2)}
.lp{display:flex;align-items:center;gap:8px}
.pr{position:relative;width:30px;height:26px;border-radius:6px;background:var(--sheet);
  border:1px solid var(--rule);flex-shrink:0;display:grid;place-items:center}
.pr .z{font-size:11px;color:var(--ink2);font-variant-numeric:tabular-nums;line-height:1;
  position:relative;z-index:3}
.pr .z.blass{color:#a6a29a}
.pr .z.t{color:var(--tinte);font-weight:700}
.pr.urlaub::before{content:"";position:absolute;inset:2px;background:var(--k-urlaub);
  border-radius:5px;z-index:0}
.pr.sonst::after{content:"";position:absolute;inset:6px 2px;background:var(--k-sonst);
  border-radius:4px;z-index:1}
.pr.heute{border:1.5px solid var(--tinte)}
.durchsichtig .pr.sonst::after{background:rgba(122,138,206,.5)}
</style>

<div class="meta">
  <b>Entwurf — Jahreskalender, Overlay</b>
  <span>Statischer Look-&amp;-Feel-Entwurf, kein Anschluss an die Anwendung</span>
</div>

<p class="rahmenhinweis"><b>Was hier gezeigt wird:</b> Variante B mit den beiden
Kategorienfarben, die zweite Farbe als Overlay über der ersten. Alle 365 Tage in zwölf
Zeilen, Klick legt an, der Mauszeiger zeigt die Termindetails.</p>

<p class="rahmenhinweis"><b>Das Overlay deckt, es blendet nicht.</b> Der Urlaub liegt über
die volle Höhe der Zelle, der sonstige Termin als etwas niedrigerer Streifen darüber — so
bleibt der Urlaub oben und unten sichtbar und behält seine reine Farbe. Beide Spannen
laufen unabhängig voneinander durch, jede mit eigenen Rundungen an ihren Enden.</p>

<p class="rahmenhinweis"><b>Zum Prüfen: der 10. bis 19. August.</b> Dort liegt ein
einzelner Termin im Urlaub (10.), und eine Spanne läuft über das Urlaubsende hinaus
(15.–19., Urlaub endet am 17.). Beides muss gleichzeitig lesbar sein. Der 6. August ist
zugleich „heute“ und trägt Urlaub.</p>

<div class="mitte">

  <div>
    <div class="abs"><h2>So sieht es aus — Overlay, deckend</h2><span class="r"></span>
      <span class="n">umsetzbar</span></div>
    <p class="hinweis">Beide Farben bleiben rein und damit in der Legende wiederfindbar.
    Die Tageszahl liegt bei 5,9 : 1 auf beiden Flächen und damit über den geforderten
    4,5 : 1.</p>
    ${kopf}
    ${raster()}
    ${legende}
  </div>

  <div class="durchsichtig">
    <div class="abs"><h2>Warum nicht halbtransparent</h2><span class="r"></span>
      <span class="n warn">nicht umsetzbar</span></div>
    <p class="hinweis">Dieselbe Anordnung, das Overlay aber mit 50 % Deckung. Wo beide
    zusammentreffen, entsteht eine dritte Farbe — sie liegt zu Urlaub wie zu sonstigem
    Termin bei 1,00 : 1 und ist von beiden nicht zu unterscheiden. In der Legende käme sie
    nicht vor. Sieh dir wieder den 10. bis 19. August an und vergleiche mit oben.</p>
    ${kopf}
    ${raster()}
    ${legende}
  </div>

</div>
`;

writeFileSync("mockups/schritt-jahreskalender.html", html);
console.log("geschrieben:", html.split("\n").length, "Zeilen");
