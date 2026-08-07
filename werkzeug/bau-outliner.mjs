/* Erzeugt mockups/schritt-outliner.html — Entwurf zu Schritt 9.

   Zwei Fassungen zum Vergleich, aus denselben Daten gezeichnet:

   A — die uebernommene App: Tags, Notizzeile, Fokusmodus, Undo,
       Aufgaben mit Prioritaet und Fortschritt, dazu Gantt und Mindmap.
   B — der schlanke Outliner, erweitert um Gantt und Mindmap. Nur
       Struktur und Fristen, sonst nichts.

   Statisch. Nichts ist anklickbar, nichts wird gespeichert.

   Die Datumsangaben gehoeren dem Outliner allein. Sie erscheinen nicht
   im Planner, nicht im Kalender (06) und nicht im Jahreskalender (14). */
import {writeFileSync} from "node:fs";

const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

/* ---------- Zeitrechnung ----------
   Der Entwurf steht auf einem festen Tag, damit die Aufnahme sich nicht
   jeden Morgen aendert. */
const HEUTE="2026-08-07";
const tag=s=>new Date(s+"T00:00:00");
const diff=(a,b)=>Math.round((tag(b)-tag(a))/86400000);
const MON=["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
const kurz=s=>tag(s).getDate()+". "+MON[tag(s).getMonth()];

/* ---------- Die Gliederung ----------
   Eine flache Liste mit `e` als Ebene — dieselbe Form, die auch das
   Modul traegt. `frist`/`von`/`bis` sind die eigenen Datumsangaben. */
const BAUM=[
  {e:0,t:"Produktstrategie 2026"},
  {e:1,t:"Marktlage",tag:"recherche"},
  {e:2,t:"Vier Anbieter geprüft",fertig:true},
  {e:2,t:"Zwei davon relevant",frist:"2026-08-12",prio:"hoch",
   notiz:"Nordstern und Kranich. Beide setzen auf eine einzelne Datei."},
  {e:1,t:"Positionierung"},
  {e:2,t:"Einzeldatei als Merkmal",von:"2026-08-10",bis:"2026-08-21",fortschritt:50},
  {e:1,t:"Preismodell",tag:"vertrieb"},
  {e:2,t:"Rabattlogik prüfen",frist:"2026-08-05"},
  {e:2,t:"Staffeln ab Q4",von:"2026-08-24",bis:"2026-09-04",prio:"mittel"}
];

const kinderVon = i => {                       /* Wieviele haengen darunter? */
  let n=0;
  for(let j=i+1;j<BAUM.length && BAUM[j].e>BAUM[i].e;j++) n++;
  return n;
};
const spaet = k => (k.frist||k.bis) && (k.frist||k.bis) < HEUTE && !k.fertig;

/* ---------- Gliederungszeile ----------
   `voll` schaltet die Zutaten der Fassung A zu: Tags, Notizzeile,
   Prioritaet, Fortschritt, Kaestchen. Fassung B zeigt nur Struktur
   und Frist. */
function zeile(k,i,voll,opt){
  opt=opt||{};
  const kinder=kinderVon(i);
  const drei = kinder
    ? '<button class="ol-drei'+(opt.zu?" zu":"")+'" aria-label="Zuklappen">'
      +'<svg viewBox="0 0 12 12"><path d="M4 2.5 8 6l-4 3.5"/></svg></button>'
    : '<span class="ol-drei leer"></span>';

  const kasten = (voll && (k.frist||k.von||k.fertig||k.prio))
    ? '<span class="ol-kast'+(k.fertig?" an":"")+'">'
      +(k.fertig?'<svg viewBox="0 0 12 12"><path d="M2 6.2 4.6 9 10 3"/></svg>':'')+'</span>'
    : "";

  let text=esc(k.t);
  if(voll && k.tag) text+=' <span class="ol-tag">#'+esc(k.tag)+'</span>';

  const marken=[];
  if(k.frist) marken.push('<span class="ol-d'+(spaet(k)?" spaet":"")+'">'
    +(spaet(k)?"überfällig · ":"")+kurz(k.frist)+'</span>');
  if(k.von) marken.push('<span class="ol-d">'+kurz(k.von)+" – "+kurz(k.bis)+'</span>');
  if(voll && k.prio) marken.push('<span class="ol-p">!'+k.prio+'</span>');
  if(voll && k.fortschritt!=null) marken.push('<span class="ol-pz">'+k.fortschritt+' %</span>');

  const notiz = (voll && k.notiz && !opt.zu)
    ? '<div class="ol-notiz" style="margin-left:'+(k.e*24+46)+'px">'+esc(k.notiz)+'</div>'
    : "";

  /* Die Fuehrungslinie sitzt an der Kante des *uebergeordneten* Zweigs,
     nicht an der eigenen — sonst schneidet sie durch das eigene
     Dreieck. Die Wurzel hat keine, sie hat nichts ueber sich. */
  const spur = (opt.spur && k.e>0)
    ? '<span class="ol-spur" style="left:'+((k.e-1)*24+7)+'px"></span>' : "";

  return '<div class="ol-k'+(opt.mark?" mark":"")+(k.fertig?" fertig":"")
    +'" style="padding-left:'+(k.e*24)+'px">'+spur
    +drei+kasten+'<span class="ol-pkt"></span>'
    +'<span class="ol-tx">'+text+'</span>'+marken.join("")
    +(opt.zu&&kinder?'<span class="ol-zu">+'+kinder+'</span>':'')
    +'</div>'+notiz;
}

function gliederung(voll,opt){
  opt=opt||{};
  const aus=[];
  let ueber=-1;                 /* Ebene, ab der zugeklappt ist */
  BAUM.forEach((k,i)=>{
    if(opt.nur && !opt.nur.includes(i)) return;
    if(ueber>=0){ if(k.e>ueber) return; ueber=-1; }
    const zu = opt.zu===i;
    if(zu) ueber=k.e;
    aus.push(zeile(k,i,voll,{
      zu, mark:opt.mark===i,
      /* Die Fuehrungslinie leuchtet nur im Zweig, in dem der Cursor
         steht — sie gibt es nur in Fassung A. */
      spur: voll && opt.spur && opt.spur.includes(i)
    }));
  });
  return '<div class="ol-baum">'+aus.join("")+'</div>';
}

/* ---------- Gantt ----------
   Ein Zeitraum wird zum Balken, eine blosse Frist zur Raute. In
   Fassung A fasst ein Elternpunkt ohne eigenes Datum zusammen, was
   darunter liegt; in Fassung B gibt es das nicht. */
const G_VON="2026-08-03", G_BIS="2026-09-06";
const G_TAGE=diff(G_VON,G_BIS)+1;
const proz = d => (diff(G_VON,d)/G_TAGE*100);

function gantt(voll){
  /* Kopfzeile: eine Spalte je Woche */
  const wochen=[];
  for(let i=0;i<G_TAGE;i+=7){
    const d=new Date(tag(G_VON).getTime()+i*86400000).toISOString().slice(0,10);
    wochen.push('<div class="g-w" style="left:'+(i/G_TAGE*100)+'%;width:'+(7/G_TAGE*100)+'%">'
      +kurz(d)+'</div>');
  }

  const reihen=[];
  BAUM.forEach((k,i)=>{
    let von=k.von||k.frist, bis=k.bis||k.frist, art=k.von?"balken":"raute";

    if(!von){
      if(!voll) return;                     /* Fassung B: kein Datum, keine Reihe */
      /* Fassung A: Zusammenfassung ueber den ganzen Teilbaum */
      const kinder=BAUM.slice(i+1,i+1+kinderVon(i)).filter(x=>x.von||x.frist);
      if(!kinder.length) return;
      von=kinder.map(x=>x.von||x.frist).sort()[0];
      bis=kinder.map(x=>x.bis||x.frist).sort().pop();
      art="fasst";
    }

    const l=proz(von), b=Math.max(proz(bis)-l+(1/G_TAGE*100), 1.4);
    const koerper = art==="raute"
      ? '<span class="g-raute'+(spaet(k)?" spaet":"")+'" style="left:'+l+'%"></span>'
      : '<span class="g-balken '+art+(spaet(k)?" spaet":"")
        +(voll && k.fortschritt!=null?" hat-fort":"")
        +'" style="left:'+l+'%;width:'+b+'%">'
        +(voll && k.fortschritt!=null
          ? '<span class="g-fort" style="width:'+k.fortschritt+'%"></span>' : '')
        +'</span>';

    reihen.push('<div class="g-r"><div class="g-nm" style="padding-left:'+(k.e*13)+'px">'
      +esc(k.t)+'</div><div class="g-feld">'+koerper+'</div></div>');
  });

  const heuteL=proz(HEUTE);
  return '<div class="gantt"><div class="g-kopf"><div class="g-nm"></div>'
    +'<div class="g-feld">'+wochen.join("")+'</div></div>'
    +'<div class="g-koerper"><div class="g-nm-sp"></div>'
    +'<div class="g-heute" style="left:calc('+heuteL+'% * (1 - 210px / 100%) + 210px)"></div></div>'
    +reihen.join("")+'</div>';
}

/* ---------- Mindmap ----------
   Derselbe Zweig, radial. Fassung A faerbt Ueberfaelliges, Fassung B
   zeigt nur die Struktur. */
function mindmap(voll){
  /* Die Masse sind gemessen, nicht geschaetzt: mit engerem Radius und
     kleinerem Winkel schoben sich die Beschriftungen der zweiten Ebene
     uebereinander. */
  const B=760, H=420, MX=B/2, MY=H/2;
  const teile=[], text=[];

  const eins=BAUM.map((k,i)=>({k,i})).filter(x=>x.k.e===1);
  text.push('<div class="m-kn wurzel" style="left:'+MX+'px;top:'+MY+'px">'
    +esc(BAUM[0].t)+'</div>');

  eins.forEach((p,pi)=>{
    const w = -Math.PI/2 + (pi/eins.length)*Math.PI*2;
    const x = MX+Math.cos(w)*160, y = MY+Math.sin(w)*105;
    teile.push('<path d="M'+MX+' '+MY+' Q'+((MX+x)/2)+' '+y+' '+x+' '+y+'"/>');
    text.push('<div class="m-kn eins" style="left:'+x+'px;top:'+y+'px">'
      +esc(p.k.t)+'</div>');

    const zwei=BAUM.slice(p.i+1,p.i+1+kinderVon(p.i));
    zwei.forEach((c,ci)=>{
      const w2 = w + (ci-(zwei.length-1)/2)*0.55;
      const x2 = MX+Math.cos(w2)*300, y2 = MY+Math.sin(w2)*175;
      teile.push('<path d="M'+x+' '+y+' Q'+((x+x2)/2)+' '+y2+' '+x2+' '+y2+'"/>');
      text.push('<div class="m-kn zwei'+(voll&&spaet(c)?" spaet":"")
        +'" style="left:'+x2+'px;top:'+y2+'px">'+esc(c.t)+'</div>');
    });
  });

  return '<div class="mind" style="width:'+B+'px;height:'+H+'px">'
    +'<svg viewBox="0 0 '+B+' '+H+'">'+teile.join("")+'</svg>'+text.join("")+'</div>';
}

/* ---------- Seitenbausteine ---------- */
const schalter = a => '<div class="schalter">'
  + ["Gliederung","Gantt","Mindmap"].map(x=>'<span class="'+(x===a?"an":"")+'">'+x+'</span>').join("")
  + '</div>';

function karte(nr,titel,text,inhalt){
  return '<section class="karte"><h2><span class="nr">'+nr+'</span>'+esc(titel)+'</h2>'
    +'<p class="was">'+text+'</p><div class="buehne">'+inhalt+'</div></section>';
}

const TASTEN_B=[
  [["↵"],"","Neuer Knoten darunter, gleiche Ebene"],
  [["Tab"],"","Einrücken, mit allen Unterknoten"],
  [["⇧","Tab"],"","Ausrücken, mit allen Unterknoten"],
  [["↑","↓"],"","In den Knoten darüber oder darunter"],
  [["Alt","↑","↓"],"","Knoten verschieben, mit allen Unterknoten"],
  [["⌫"],"","Im leeren Knoten: löschen"],
  [[],"Klick aufs Dreieck","Klappt zu und wieder auf"],
  [[],"@20.8. · @20.8...31.8.","Eigene Frist oder Zeitraum, getippt"]
];
const TASTEN_A=TASTEN_B.slice(0,7).concat([
  [["Strg","."],"","Zweig klappen"],
  [["⇧","↵"],"","Notizzeile öffnen"],
  [["Alt","⇧","→"],"","In einen Punkt springen"],
  [["Strg","Z"],"","Rückgängig, auch mehrstufig"],
  [[],"#tag · !hoch · %50","Etikett, Priorität, Fortschritt — getippt"],
  [[],"@20.8. · @20.8...31.8.","Eigene Frist oder Zeitraum, getippt"]
]);
const tasten = L => '<table>'+L.map(([kap,klar,w])=>'<tr><td>'
  +kap.map(x=>'<kbd>'+esc(x)+'</kbd>').join(" ")
  +(klar?'<span class="klar">'+esc(klar)+'</span>':'')
  +'</td><td>'+esc(w)+'</td></tr>').join("")+'</table>';

/* ---------- Seite ---------- */
const html=`<!doctype html>
<html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Entwurf — Schritt 9, Outliner</title>
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
.fassung{background:var(--tinte-s);border:1px solid #c9d0ea;border-radius:11px;
  padding:13px 17px;margin:30px 0 15px}
.fassung h2{font-size:15px;margin-bottom:3px}
.fassung p{font-size:12.5px;color:var(--ink2);max-width:78ch}
.karte{background:var(--sheet);border:1px solid var(--rule);border-radius:12px;
  padding:18px 21px 21px;margin-bottom:17px}
.karte h2{font-size:14.5px;display:flex;align-items:center;gap:9px;margin-bottom:5px}
.nr{display:inline-flex;align-items:center;justify-content:center;min-width:23px;height:21px;
  padding:0 6px;border-radius:11px;background:var(--tinte-s);color:var(--tinte);
  font-size:11px;font-weight:650}
.was{color:var(--ink3);font-size:12.5px;margin-bottom:13px;max-width:76ch}
.buehne{background:var(--paper);border:1px solid var(--rule);border-radius:9px;
  padding:13px 12px;overflow-x:auto}

/* ---- Ansichtenschalter ---- */
.schalter{display:inline-flex;gap:2px;background:var(--raise);border-radius:8px;
  padding:3px;margin-bottom:12px}
.schalter span{font-size:12.5px;padding:3px 12px;border-radius:6px;color:var(--ink2)}
.schalter span.an{background:var(--sheet);color:var(--tinte);font-weight:600;
  box-shadow:0 1px 2px rgba(0,0,0,.06)}

/* ---- Gliederung ---- */
.ol-baum{padding:0}
.ol-k{position:relative;display:flex;align-items:center;gap:7px;padding:5px 8px;
  border-radius:7px;min-height:29px}
.ol-k:hover{background:var(--sheet)}
.ol-k.mark{background:var(--tinte-s)}
.ol-k.fertig .ol-tx{color:var(--ink3);text-decoration:line-through}
.ol-spur{position:absolute;top:-3px;bottom:-3px;width:2px;background:var(--tinte);
  opacity:.5;border-radius:2px}
.ol-drei{width:15px;height:15px;flex-shrink:0;border:0;background:none;padding:0;
  color:var(--ink3);display:flex;align-items:center;justify-content:center;cursor:pointer}
.ol-drei svg{width:11px;height:11px;fill:none;stroke:currentColor;stroke-width:1.9;
  stroke-linecap:round;stroke-linejoin:round;transform:rotate(90deg)}
.ol-drei.zu svg{transform:rotate(0)}
.ol-drei.leer{cursor:default}
.ol-kast{width:13px;height:13px;border:1.4px solid var(--rule2);border-radius:4px;
  flex-shrink:0;background:var(--sheet);display:flex;align-items:center;justify-content:center}
.ol-kast.an{background:var(--gut-s);border-color:var(--gut);color:var(--gut)}
.ol-kast svg{width:9px;height:9px;fill:none;stroke:currentColor;stroke-width:2;
  stroke-linecap:round;stroke-linejoin:round}
.ol-pkt{width:5px;height:5px;border-radius:50%;background:var(--rule2);flex-shrink:0}
.ol-tx{font-size:14px;color:var(--ink)}
.ol-tag{font-size:11.5px;color:var(--tinte);background:var(--tinte-s);
  border-radius:20px;padding:1px 7px}
.ol-d{font-family:var(--mono);font-size:11px;color:var(--ink3);background:var(--raise);
  border-radius:5px;padding:1px 6px;margin-left:5px;white-space:nowrap}
.ol-d.spaet{background:var(--signal-s);color:var(--signal);font-weight:600}
.ol-p{font-family:var(--mono);font-size:11px;color:var(--ink2);margin-left:5px}
.ol-pz{font-family:var(--mono);font-size:11px;color:var(--ink3);margin-left:5px}
.ol-zu{font-size:11px;color:var(--ink3);background:var(--raise);border-radius:20px;
  padding:1px 7px;margin-left:5px}
.ol-notiz{font-size:12.5px;color:var(--ink3);border-left:2px solid var(--rule2);
  margin-top:-2px;margin-bottom:5px;padding:1px 0 1px 9px}

/* ---- Pfadleiste des Fokusmodus ---- */
.pfad{display:flex;gap:6px;align-items:center;font-size:12px;color:var(--ink3);
  margin-bottom:9px}
.pfad b{color:var(--ink);font-weight:600}

/* ---- Gantt ---- */
.gantt{min-width:660px;position:relative}
.g-kopf,.g-r{display:flex;align-items:center}
.g-nm{width:210px;flex-shrink:0;font-size:12.5px;color:var(--ink2);
  padding-right:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.g-feld{position:relative;flex:1;height:24px}
.g-kopf .g-feld{border-bottom:1px solid var(--rule2)}
.g-w{position:absolute;top:3px;font-family:var(--mono);font-size:10.5px;color:var(--ink3);
  border-left:1px solid var(--rule);padding-left:5px;height:18px}
.g-r{height:29px;border-bottom:1px solid var(--rule)}
.g-r:last-child{border-bottom:0}
/* Der Balken ist die Spanne, der Fortschritt liegt gefuellt darin. Erst
   war es umgekehrt — ein heller Streifen links las sich als „noch
   offen“, meinte aber „erledigt“. */
.g-balken{position:absolute;top:6px;height:13px;border-radius:4px;
  background:var(--tinte);opacity:.85;overflow:hidden}
.g-balken.hat-fort{opacity:1;background:var(--tinte-s);
  border:1px solid rgba(47,58,140,.35)}
.g-balken.fasst{background:none;border:1.5px solid var(--rule2);opacity:1;height:11px;top:7px}
.g-balken.spaet{background:var(--signal)}
.g-fort{position:absolute;left:0;top:0;bottom:0;background:var(--tinte);opacity:.85}
.g-raute{position:absolute;top:7px;width:11px;height:11px;background:var(--tinte);
  transform:rotate(45deg);margin-left:-5px;border-radius:2px}
.g-raute.spaet{background:var(--signal)}
.g-heute{position:absolute;top:24px;bottom:0;width:1.5px;background:var(--signal);opacity:.45}
.g-koerper{position:absolute;inset:0;pointer-events:none}
.g-nm-sp{width:210px}

/* ---- Mindmap ---- */
.mind{position:relative;margin:0 auto}
.mind svg{position:absolute;inset:0;width:100%;height:100%;
  fill:none;stroke:var(--rule2);stroke-width:1.4}
.m-kn{position:absolute;transform:translate(-50%,-50%);font-size:12px;
  background:var(--sheet);border:1px solid var(--rule);border-radius:7px;
  padding:3px 9px;white-space:nowrap;color:var(--ink2)}
.m-kn.wurzel{font-size:13.5px;font-weight:650;color:var(--ink);
  border-color:var(--rule2);background:var(--raise)}
.m-kn.eins{color:var(--ink);font-weight:600}
.m-kn.spaet{border-color:var(--signal);color:var(--signal);background:var(--signal-s)}

/* ---- Listen und Hinweise ---- */
table{border-collapse:collapse;width:100%}
td{padding:6px 10px;border-bottom:1px solid var(--rule);font-size:13px;vertical-align:top}
tr:last-child td{border-bottom:0}
td:first-child{width:190px;white-space:nowrap}
kbd{font-family:var(--ff);font-size:11.5px;background:var(--raise);border:1px solid var(--rule2);
  border-bottom-width:2px;border-radius:5px;padding:1px 6px;color:var(--ink2)}
.klar{color:var(--ink2);font-size:12.5px;font-family:var(--mono)}
.hin{background:var(--tinte-s);border:1px solid #c9d0ea;border-radius:10px;
  padding:14px 17px;font-size:12.5px;color:var(--ink2);max-width:78ch}
.hin b{color:var(--ink)}
.warn{background:var(--signal-s);border:1px solid #eccfc8;border-radius:10px;
  padding:14px 17px;font-size:12.5px;color:#7d2718;max-width:78ch}
.warn b{color:var(--signal)}
.gegen{width:100%;border-collapse:collapse;margin-top:4px}
.gegen th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.06em;
  color:var(--ink3);padding:6px 10px;border-bottom:1px solid var(--rule2)}
.gegen td:first-child{width:auto}
.gegen td+td{width:130px;text-align:center;font-size:12.5px}
.ja{color:var(--gut);font-weight:650}
.nein{color:var(--ink3)}
</style></head><body><div class="blatt">

<h1>Entwurf — Schritt 9, Outliner</h1>
<p class="unter">Zwei Fassungen, aus denselben Daten gezeichnet. Statisch —
nichts ist anklickbar, nichts wird gespeichert.
<b>Alle Datumsangaben gehören dem Outliner allein.</b> Sie erscheinen
nicht im Planner, nicht im Kalender (06) und nicht im Jahreskalender (14).
Heute ist in diesem Entwurf der 7. August 2026.</p>

<div class="fassung">
<h2>Fassung A — die übernommene App</h2>
<p>Der beschlossene Umfang: Tags, Notizzeile, Fokusmodus, Undo, Aufgaben mit
Priorität und Fortschritt, dazu Gantt und Mindmap. Rund 1400 Zeilen.</p>
</div>

${karte("A1","Gliederung","Kästchen, Etiketten, Fristen, Priorität und Fortschritt stehen in der Zeile. Die Notizzeile hängt unter ihrem Punkt. Die blaue Führungslinie zeigt den Zweig, in dem der Cursor steht.",
  schalter("Gliederung")+gliederung(true,{mark:3,spur:[1,2,3]}))}

${karte("A2","Suche · <span style=\"font-family:var(--mono)\">#recherche</span>","Die Gliederung selbst wird gefiltert. Der Weg zum Treffer bleibt stehen — man sieht ihn im Zusammenhang und kann sofort darin weiterschreiben.",
  gliederung(true,{nur:[0,1,2,3]}))}

${karte("A3","Fokusmodus","In einen Punkt gesprungen: er ist jetzt die Wurzel, darüber steht der Weg zurück. Bei tiefen Gliederungen der eigentliche Nutzen.",
  '<div class="pfad">Produktstrategie 2026 <span>›</span> <b>Preismodell</b></div>'
  +gliederung(true,{nur:[6,7,8]}))}

${karte("A4","Gantt","Ein Zeitraum wird zum Balken, eine bloße Frist zur Raute. Der gefüllte Teil eines Balkens ist der Fortschritt. Ein Elternpunkt ohne eigenes Datum fasst zusammen, was darunter liegt — das ist der offene Rahmen. Die senkrechte Linie ist heute.",
  schalter("Gantt")+gantt(true))}

${karte("A5","Mindmap","Derselbe Zweig, radial angeordnet. Verbindungen als SVG, Beschriftungen als Text darüber. Überfälliges bleibt auch hier rot.",
  schalter("Mindmap")+mindmap(true))}

${karte("A6","Tastenbelegung",'Alles Weitere wird getippt, nicht ausgewählt — <span style="font-family:var(--mono)">#tag</span>, <span style="font-family:var(--mono)">@datum</span>, <span style="font-family:var(--mono)">!hoch</span>, <span style="font-family:var(--mono)">%50</span>. Damit bleibt der Text die einzige Wahrheit.',
  tasten(TASTEN_A))}

<div class="fassung">
<h2>Fassung B — der schlanke Outliner, erweitert</h2>
<p>Mein ursprünglicher Vorschlag, um Gantt und Mindmap ergänzt. Struktur,
Klappen, Fristen — sonst nichts. Kein Tag, keine Notizzeile, kein Fokus,
kein Undo, keine Priorität, kein Fortschritt. Rund 450 Zeilen.</p>
</div>

${karte("B1","Gliederung","Ein Knoten ist ein Feld mit einem Text und höchstens einer eigenen Frist. Kein Kästchen, kein Etikett — geordnet wird über die Struktur.",
  schalter("Gliederung")+gliederung(false,{mark:3}))}

${karte("B2","Zugeklappt","„Marktlage“ ist zu. Die beiden Unterknoten sind nicht verschwunden: <b>+2</b> sagt, wie viele darunter liegen. Nichts darf unsichtbar werden.",
  gliederung(false,{zu:1}))}

${karte("B3","Gantt","Dieselbe Zeichnung, aber ohne Zusammenfassung und ohne Fortschritt: Es erscheint nur, was <b>selbst</b> ein Datum trägt. „Marktlage“ und „Preismodell“ fehlen deshalb hier.",
  schalter("Gantt")+gantt(false))}

${karte("B4","Mindmap","Unverändert — die Mindmap zeigt Struktur, und Struktur hat auch die schlanke Fassung.",
  schalter("Mindmap")+mindmap(false))}

${karte("B5","Tastenbelegung","Sieben Tasten und eine getippte Angabe. Das ist die ganze Bedienung.",
  tasten(TASTEN_B))}

<div class="fassung">
<h2>Gegenüberstellung</h2>
<p>Was die beiden Fassungen unterscheidet — und was sie teilen.</p>
</div>

<section class="karte">
<table class="gegen">
<tr><th>Funktion</th><th>A</th><th>B</th></tr>
${[
 ["Anlegen, Ein- und Ausrücken, Verschieben, Klappen",1,1],
 ["Eigene Frist am Knoten",1,1],
 ["Eigener Zeitraum (von … bis)",1,1],
 ["Gantt",1,1],
 ["Gantt: Elternpunkt fasst zusammen",1,0],
 ["Mindmap",1,1],
 ["Filtersuche in der Gliederung",1,0],
 ["Etiketten mit #",1,0],
 ["Notizzeile",1,0],
 ["Fokusmodus mit Pfad",1,0],
 ["Rückgängig",1,0],
 ["Aufgabe, Kästchen, Priorität, Fortschritt",1,0],
 ["Anheften auf die zwölf Plätze",1,0],
 ["Markdown-Ausgabe, Zweig sichern",1,0],
 ["Zeilen in dashboard.html",0,0]
].map(([t,a,b])=>'<tr><td>'+esc(t)+'</td>'
  +(t.startsWith("Zeilen")
    ? '<td class="nein">≈ 1400</td><td class="nein">≈ 450</td>'
    : '<td class="'+(a?"ja":"nein")+'">'+(a?"ja":"—")+'</td>'
      +'<td class="'+(b?"ja":"nein")+'">'+(b?"ja":"—")+'</td>')
  +'</tr>').join("")}
</table>
</section>

<section class="karte">
<h2><span class="nr">!</span>Was in beiden Fassungen getrennt bleibt</h2>
<div class="warn">
<b>Die Datumsangaben des Outliners sind sein eigener Bestand.</b> Eine Frist
an einem Knoten erscheint <b>nicht</b> im Planner, <b>nicht</b> im Kalender (06)
und <b>nicht</b> im Jahreskalender (14). Sie wird dort auch nicht gesucht.
Umgekehrt erscheint kein Termin des Dashboards im Gantt.<br><br>
Das ist dieselbe Entscheidung, die schon für den Jahreskalender getroffen
wurde: getrennte Bestände, keine wechselseitige Anzeige. Wer eine Frist an
beiden Orten braucht, trägt sie an beiden Orten ein.
</div>
</section>

<section class="karte">
<h2><span class="nr">?</span>Was auch Fassung A nicht bekommt</h2>
<div class="hin">
<b>Keine Kalender-Ansicht.</b> Von den drei Ansichten der App kommen Gantt und
Mindmap; der Kalender wäre der vierte Ort im Dashboard mit Datumsangaben.<br><br>
<b>Keine Befehlspalette und kein Strg+F.</b> Das ist die Leiste. Ein zweiter
Einstieg mit eigener Suche stünde neben ihr.<br><br>
<b>Kein Archiv, kein Markdown-Einlesen, kein „Alles verwerfen“.</b><br><br>
<b>Kein Ziehen mit der Maus.</b> Verschoben wird mit <kbd>Alt</kbd> und den
Pfeilen — über Ebenen hinweg ist Ziehen schwer zu treffen.
</div>
</section>

</div></body></html>`;

writeFileSync(new URL("../mockups/schritt-outliner.html", import.meta.url), html);
console.log("mockups/schritt-outliner.html geschrieben — "+html.length+" Zeichen");
