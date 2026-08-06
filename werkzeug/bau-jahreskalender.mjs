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
  /* Die beiden liegen bewusst im Urlaub: ein einzelner Tag und eine
     Spanne, die über das Urlaubsende hinausläuft. */
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

/* gewaehlt: ISO-Tag, der als angeklickt dargestellt wird */
function raster(gewaehlt){
  let h = '<div class="jahr">';
  for (let m = 0; m < 12; m++){
    const laenge = new Date(JAHR, m+1, 0).getDate();
    /* Die oberen Zeilen lassen ihre Blase nach unten aufklappen —
       nach oben liefe sie aus dem Fenster heraus und wuerde vom
       overflow des Fensters abgeschnitten. */
    h += '<div class="jz' + (m < 3 ? " nachunten" : "") + '">'
       + '<span class="jm">' + MONK[m] + '</span>';
    for (let t = 1; t <= 31; t++){
      if (t > laenge){ h += '<span class="jt keiner"></span>'; continue; }
      const key = iso(JAHR, m, t);
      const d   = new Date(JAHR, m, t);
      const l   = amTag(key);

      const k = ["jt"];
      if (d.getDay() === 0 || d.getDay() === 6) k.push("we");
      if (key === HEUTE) k.push("heute");
      if (key === gewaehlt) k.push("gewaehlt");

      /* Anfang und Ende je Kategorie getrennt. Beide Lagen laufen
         unabhaengig, sonst reisst eine Spanne dort auf, wo die
         andere beginnt. */
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

const legende = `
    <div class="legende">
      <span class="lp"><span class="pr urlaub u-anfang u-ende"><span class="z">14</span></span>Urlaub</span>
      <span class="lp"><span class="pr sonst s-anfang s-ende"><span class="z">14</span></span>Sonstiger Termin</span>
      <span class="lp"><span class="pr urlaub u-anfang u-ende sonst s-anfang s-ende"><span class="z">14</span></span>Beides am selben Tag</span>
      <span class="lp"><span class="pr heute"><span class="z t">14</span></span>Heute</span>
      <span class="lp"><span class="pr"><span class="z blass">14</span></span>Wochenende</span>
    </div>`;

/* Die Anwendung dahinter, angedeutet — damit sichtbar ist, dass das
   Fenster ueber ihr schwebt und nicht ihre Flaeche ersetzt. */
const hintergrund = `
    <div class="app">
      <div class="kopf">
        <span class="zeit">11:23</span><span class="dat">Donnerstag, 6. August</span>
        <span class="sp"></span>
        <span class="stand">gesichert 6.8.2026</span>
        <span class="akt">Sichern</span><span class="akt">Laden</span><span class="akt">Export</span>
        <span class="wechsel"><span class="an">Leiste</span><span>Planner</span></span>
        <span class="wechsel"><span class="an">Standard</span><span>Basecamp</span></span>
      </div>
      <div class="rumpf">
        <div class="feld"><span class="c">&rsaquo;</span>Tippen — suchen, rechnen, erfassen</div>
        <div class="absz">ÜBERFÄLLIG</div>
        <div class="zeile">Rechnung 2026-114 freigeben</div>
        <div class="zeile">Vertrag Meinhardt IT</div>
        <div class="absz">HEUTE</div>
        <div class="gross">Kein Termin mehr.</div>
      </div>
    </div>`;

function fenster(gewaehlt, felder){
  return `
  <div class="buehne">
    ${hintergrund}
    <div class="schleier">
      <div class="fenster">
        <div class="f-kopf">
          <span class="art">Jahreskalender</span>
          <span class="jahrzahl">${JAHR}</span>
          <span class="jpfeil"><svg viewBox="0 0 20 20"><path d="M12 4 6 10l6 6"/></svg></span>
          <span class="jpfeil"><svg viewBox="0 0 20 20"><path d="m8 4 6 6-6 6"/></svg></span>
          <span class="sp"></span>
          <span class="zaehler">${TERMINE.length} Einträge · ${TERMINE.filter(t=>t.kat==="urlaub").length} Urlaube</span>
          <span class="f-zu">×</span>
        </div>
        <div class="f-b">
          ${raster(gewaehlt)}
          ${legende}
          ${felder}
        </div>
      </div>
    </div>
  </div>`;
}

/* Der Termin-Bereich klappt im selben Fenster auf. Kein zweiter
   Dialog: dialog() ruft dialogZu() und wuerde das Fenster schliessen. */
const felderAuf = `
          <div class="einbau">
            <div class="ein-k"><span class="art">Neuer Termin</span>
              <span class="tag">Montag, 10. August 2026</span></div>
            <div class="draster">
              <div class="dfeld breit"><label>Titel</label>
                <div class="ein leer">Wobei geht es?</div></div>
              <div class="dfeld"><label>Von</label><div class="ein">10.08.2026</div></div>
              <div class="dfeld"><label>Bis</label><div class="ein">10.08.2026</div>
                <div class="sub">Leer lassen für einen einzelnen Tag.</div></div>
              <div class="dfeld breit"><label>Kategorie</label>
                <div class="wahl"><span class="w-o an"><span class="pp urlaub"></span>Urlaub</span><span class="w-o"><span class="pp sonst"></span>Sonstiger Termin</span></div></div>
            </div>
            <div class="ein-f">
              <span class="sp"></span>
              <span class="tat still">Abbrechen</span>
              <span class="tat">Speichern</span>
            </div>
          </div>`;

const html = `<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Entwurf — Jahreskalender als schwebendes Fenster</title>
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
.rahmenhinweis{max-width:1240px;margin:16px auto 0;padding:0 26px;font-size:13px;
  color:var(--ink2);line-height:1.6}
.rahmenhinweis b{color:var(--ink)}
.rahmenhinweis + .rahmenhinweis{margin-top:9px}
.mitte{max-width:1240px;margin:0 auto;padding:0 26px 70px}

.abs{display:flex;align-items:center;gap:13px;padding:34px 0 11px}
.abs h2{font-family:var(--mono);font-size:11px;letter-spacing:.16em;text-transform:uppercase;
  font-weight:700;color:var(--ink)}
.abs .r{flex:1;height:1px;background:var(--rule)}
.abs .n{font-family:var(--mono);font-size:11px;color:var(--ink3)}
.hinweis{font-size:12.5px;color:var(--ink3);line-height:1.55;padding:0 0 14px}

/* ---------- Buehne: Anwendung, darueber der Schleier ---------- */
/* Der Schleier liegt im Fluss und bestimmt die Hoehe der Buehne — sonst
   richtete sie sich nach dem Hintergrund und schnitte das Fenster unten
   ab. Der Hintergrund fuellt die so entstandene Flaeche dahinter. */
.buehne{position:relative;border:1px solid var(--rule);border-radius:12px;overflow:hidden;
  background:var(--paper)}
.app{position:absolute;inset:0;filter:saturate(.6)}
.kopf{display:flex;align-items:center;gap:11px;padding:11px 20px;background:var(--sheet);
  border-bottom:1px solid var(--rule);font-size:12.5px;color:var(--ink2)}
.kopf .zeit{font-family:var(--mono);font-weight:600;color:var(--ink2)}
.kopf .dat{font-family:var(--mono);font-size:11.5px;color:var(--ink3)}
.kopf .sp{flex:1}
.kopf .stand{font-family:var(--mono);font-size:10.5px;color:var(--ink3)}
.kopf .akt{border:1px solid var(--rule2);border-radius:8px;padding:4px 11px;background:var(--paper)}
.wechsel{display:flex;gap:2px;background:var(--raise);border-radius:9px;padding:3px}
.wechsel span{padding:5px 12px;border-radius:7px;font-size:12px;font-weight:550}
.wechsel span.an{background:var(--sheet);color:var(--tinte)}
.rumpf{padding:26px 20px 30px;max-width:820px;margin:0 auto}
.feld{display:flex;gap:13px;align-items:center;border-bottom:2px solid var(--rule2);
  padding-bottom:11px;font-size:23px;color:var(--ink3);letter-spacing:-.02em}
.feld .c{color:var(--rule2)}
.absz{font-family:var(--mono);font-size:10.5px;letter-spacing:.15em;color:var(--ink);
  font-weight:700;padding:22px 0 8px}
.zeile{font-size:14px;padding:8px 0 8px 12px;border-left:2px solid var(--signal);
  color:var(--ink2);margin-bottom:2px}
.gross{font-family:var(--serif);font-size:27px;padding-top:4px}

.schleier{position:relative;background:rgba(26,26,24,.34);
  display:grid;place-items:center;padding:26px 20px}

/* ---------- Das schwebende Fenster ---------- */
.fenster{width:min(1080px,100%);max-height:100%;background:var(--sheet);
  border:1px solid var(--rule2);border-radius:14px;
  box-shadow:0 24px 70px rgba(26,26,24,.28);display:flex;flex-direction:column;
  overflow:hidden}
.f-kopf{flex-shrink:0;display:flex;align-items:center;gap:11px;padding:14px 20px 12px;
  border-bottom:1px solid var(--rule)}
.f-kopf .art{font-family:var(--mono);font-size:10.5px;letter-spacing:.13em;
  text-transform:uppercase;color:var(--ink3);font-weight:700}
.f-kopf .jahrzahl{font-family:var(--serif);font-size:22px;letter-spacing:-.01em;
  margin-left:5px}
.jpfeil{width:26px;height:26px;border-radius:7px;border:1px solid var(--rule2);
  background:var(--paper);color:var(--ink2);display:grid;place-items:center;flex-shrink:0}
.jpfeil svg{width:12px;height:12px;stroke:currentColor;stroke-width:1.9;fill:none;
  stroke-linecap:round;stroke-linejoin:round}
.f-kopf .sp{flex:1}
.f-kopf .zaehler{font-family:var(--mono);font-size:11px;color:var(--ink3)}
.f-zu{font-size:19px;color:var(--ink3);line-height:1;padding:2px 7px;border-radius:6px}
/* Das Fenster selbst darf nicht abschneiden, sonst kappt es die Blasen
   der obersten Zeile. Gescrollt wird deshalb nicht im Fenster. */
.f-b{padding:16px 20px 20px}

/* ---------- Das Raster ---------- */
.jahr{border:1px solid var(--rule);border-radius:10px;background:var(--paper);padding:7px 9px}
.jz{display:grid;grid-template-columns:32px repeat(31,1fr);align-items:center}
.jm{font-family:var(--mono);font-size:10px;letter-spacing:.07em;text-transform:uppercase;
  color:var(--ink3);font-weight:700}
.jt{position:relative;height:27px;display:grid;place-items:center;
  font-size:11px;color:var(--ink2);font-variant-numeric:tabular-nums;cursor:pointer}
.jt.keiner{cursor:default}
.jt.we .n{color:#a6a29a}
.jt .n{position:relative;z-index:3;line-height:1}
.jt:hover .n{color:var(--ink);font-weight:700}

.jt.urlaub::before{content:"";position:absolute;inset:2px -1px;background:var(--k-urlaub);z-index:0}
.jt.u-anfang::before{left:2px;border-radius:6px 0 0 6px}
.jt.u-ende::before{right:2px;border-radius:0 6px 6px 0}
.jt.sonst::after{content:"";position:absolute;inset:6px -1px;background:var(--k-sonst);z-index:1}
.jt.s-anfang::after{left:3px;border-radius:5px 0 0 5px}
.jt.s-ende::after{right:3px;border-radius:0 5px 5px 0}

.jt.heute .n{color:var(--tinte);font-weight:700}
.jt.heute::after{content:"";position:absolute;inset:2px 1px;border:1.5px solid var(--tinte);
  border-radius:6px;z-index:2;background:none}
.jt.heute.sonst::after{inset:6px -1px;border:0;background:var(--k-sonst);border-radius:0}
.jt.heute.sonst.s-anfang::after{left:3px;border-radius:5px 0 0 5px}
.jt.heute.sonst.s-ende::after{right:3px;border-radius:0 5px 5px 0}
.jt.heute.sonst .n::before{content:"";position:absolute;inset:-8px -6px;
  border:1.5px solid var(--tinte);border-radius:6px;z-index:2}

/* Der angeklickte Tag bleibt sichtbar, solange die Felder offen sind.
   Die Umrandung haengt an der Zahl, nicht an der Zelle: ::before traegt
   den Urlaub und ::after den sonstigen Termin. Beide sind belegt, und
   eine dritte Regel darauf loeschte am gewaehlten Tag die Kategorie —
   der Urlaubsblock riss dort auf. */
.jt.gewaehlt .n{color:var(--tinte);font-weight:700}
.jt.gewaehlt .n::after{content:"";position:absolute;inset:-8px -7px;
  border:2px solid var(--tinte);border-radius:7px;z-index:4}

/* ---------- Die Blase beim Zeigen ---------- */
.jt .blase{position:absolute;bottom:calc(100% + 6px);left:50%;transform:translateX(-50%);
  background:var(--ink);color:var(--sheet);font-size:11.5px;line-height:1.45;
  padding:8px 11px;border-radius:8px;opacity:0;pointer-events:none;transition:opacity .13s;
  z-index:40;min-width:200px;text-align:left;display:flex;flex-direction:column;gap:4px}
.jz.nachunten .jt .blase{bottom:auto;top:calc(100% + 6px)}
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
.legende{display:flex;flex-wrap:wrap;gap:9px 20px;padding:13px 2px 0;font-size:12.5px;
  color:var(--ink2)}
.lp{display:flex;align-items:center;gap:8px}
.pr{position:relative;width:29px;height:25px;border-radius:6px;background:var(--paper);
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

/* ---------- Der eingebaute Termin-Bereich ---------- */
.einbau{margin-top:16px;border-top:1px solid var(--rule);padding-top:16px}
.ein-k{display:flex;align-items:baseline;gap:11px;padding-bottom:12px}
.ein-k .art{font-family:var(--mono);font-size:10.5px;letter-spacing:.13em;
  text-transform:uppercase;color:var(--ink3);font-weight:700}
.ein-k .tag{font-size:15px;font-weight:650;letter-spacing:-.01em}
.draster{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px 14px}
.dfeld{display:flex;flex-direction:column;gap:5px}
.dfeld.breit{grid-column:1/-1}
.dfeld label{font-size:12px;color:var(--ink3);font-weight:500}
.dfeld .ein{border:1px solid var(--rule2);border-radius:8px;padding:8px 11px;
  background:var(--paper);font-size:14px;color:var(--ink);min-height:37px;
  display:flex;align-items:center}
.dfeld .ein.leer{color:var(--ink3)}
.dfeld .sub{font-size:12px;color:var(--ink3);line-height:1.45}
.wahl{display:flex;gap:8px}
.w-o{display:flex;align-items:center;gap:8px;border:1px solid var(--rule2);border-radius:8px;
  padding:8px 13px;font-size:14px;background:var(--paper);color:var(--ink2)}
.w-o.an{border-color:var(--tinte);background:var(--tinte-s);color:var(--ink);font-weight:600}
.pp{width:13px;height:13px;border-radius:4px;flex-shrink:0}
.pp.urlaub{background:var(--k-urlaub)}
.pp.sonst{background:var(--k-sonst)}
.ein-f{display:flex;align-items:center;gap:9px;padding-top:16px}
.ein-f .sp{flex:1}
.tat{font-size:12.5px;font-weight:600;background:var(--tinte-s);color:var(--tinte);
  border:1px solid var(--tinte);padding:7px 15px;border-radius:8px}
.tat.still{background:var(--paper);color:var(--ink2);border-color:var(--rule2)}
</style>

<div class="meta">
  <b>Entwurf — Jahreskalender als schwebendes Fenster</b>
  <span>Statischer Look-&amp;-Feel-Entwurf, kein Anschluss an die Anwendung</span>
</div>

<p class="rahmenhinweis"><b>Was hier gezeigt wird:</b> Der Jahreskalender öffnet sich als
schwebendes Fenster über der Anwendung, die dahinter stehen bleibt. Alle 365 Tage in zwölf
Zeilen. Der Mauszeiger auf einem belegten Tag zeigt die Termindetails — fahre über den
3.–17. August oder den 12. März.</p>

<p class="rahmenhinweis"><b>Warum die Felder im Fenster liegen und nicht darüber.</b> Ein
zweites schwebendes Fenster ginge nicht: <code>dialog()</code> ruft als erstes
<code>dialogZu()</code> und würde den Kalender schließen, sobald man einen Tag anklickt.
Nach dem Speichern stünde man wieder vor der Leiste. Deshalb klappt der Termin unten im
selben Fenster auf — das Raster bleibt dabei sichtbar, was beim Eintragen mehrerer Termine
hintereinander ohnehin der ruhigere Weg ist.</p>

<p class="rahmenhinweis"><b>Zwei weitere Kleinigkeiten sind schon berücksichtigt:</b> Die
Blasen der obersten drei Monate klappen nach unten auf, weil sie nach oben aus dem Fenster
liefen. Und das Fenster scrollt nicht in sich — ein <code>overflow</code> würde genau diese
Blasen abschneiden.</p>

<div class="mitte">

  <div>
    <div class="abs"><h2>1 — Das Fenster ist offen</h2><span class="r"></span>
      <span class="n">Leiste bleibt dahinter stehen</span></div>
    <p class="hinweis">Kopfzeile mit Jahreswechsel und Zähler, darunter das Raster und die
    Legende. Ein Klick auf einen leeren Tag legt an, ein Klick auf einen belegten öffnet
    den vorhandenen Termin.</p>
    ${fenster(null, "")}
  </div>

  <div>
    <div class="abs"><h2>2 — Nach dem Klick auf den 10. August</h2><span class="r"></span>
      <span class="n">dasselbe Fenster, nichts schließt sich</span></div>
    <p class="hinweis">Der angeklickte Tag bleibt mit Tinte umrandet, damit sichtbar ist,
    worauf sich die Felder beziehen. Reihenfolge Was → Wann: Titel breit, darunter Von und
    Bis nebeneinander, zuletzt die Kategorie.</p>
    ${fenster("2026-08-10", felderAuf)}
  </div>

</div>
`;

writeFileSync("mockups/schritt-jahreskalender.html", html);
console.log("geschrieben:", html.split("\n").length, "Zeilen");
