/* Erzeugt die beiden Beispiel-PDF zum Entwurf von Schritt 9:

     mockups/outliner-gantt.pdf
     mockups/outliner-mindmap.pdf

   Kein Druckdialog, keine Bibliothek — die Dateien werden in pdf.mjs
   byteweise selbst geschrieben. Beide sind A4 quer, weil ein Zeitstrahl
   und ein radiales Bild breiter als hoch sind.

   Die Zeichnungen benutzen dieselben Farbtoken wie die Anwendung. Auch
   hier gilt: Farbe codiert Dringlichkeit, nicht Kategorie. Tinte fuer
   „laeuft“, Signalrot ausschliesslich fuer „ueberfaellig“, sonst
   Graustufen. */
import {writeFileSync} from "node:fs";
import {blatt, bauen, breite} from "./pdf.mjs";
import {BAUM, HEUTE, diff, tag, kurz, kinderVon, spaet, FARBE as F}
  from "./outliner-daten.mjs";

const A4B=842, A4H=595, RAND=42;

/* ---------- Gemeinsames ---------- */
function grund(s, titel, unter){
  s.fuell(F.paper).rechteck(0,0,s.B,s.H);
  s.fuell(F.sheet).rund(RAND-14, RAND-14, s.B-(RAND-14)*2, s.H-(RAND-14)*2, 10);
  s.fuell(F.ink).text(titel, RAND, RAND+6, 17, {fett:true});
  s.fuell(F.ink3).text(unter, RAND, RAND+22, 9);
  s.strich(F.rule).dick(0.8).linie(RAND, RAND+32, s.B-RAND, RAND+32);
}

function fuss(s, text){
  s.fuell(F.ink3).text(text, RAND, s.H-RAND+4, 8);
  s.text("Outliner · Dashboard", s.B-RAND, s.H-RAND+4, 8, {wo:"r"});
}

/* ============================================================
   Gantt
   ============================================================ */
function gantt(){
  const s=blatt(A4B,A4H);
  grund(s,"Produktstrategie 2026","Gantt · Stand "+kurz(HEUTE)
    +" · eigene Fristen des Outliners");

  const VON="2026-08-03", BIS="2026-09-06";
  const TAGE=diff(VON,BIS)+1;
  const X0=RAND+192, X1=s.B-RAND, FB=X1-X0;
  const px = d => X0 + diff(VON,d)/TAGE*FB;

  const Y0=RAND+80, ZH=32;

  /* Erst ausrechnen, welche Zeilen es ueberhaupt gibt — dann zeichnen.
     Vorher lief das Raster ueber `BAUM.length` und damit eine Zeile zu
     weit: die Linien schnitten durch die Legende. Ein Punkt ohne Datum
     bekommt keine Zeile, also darf er auch nicht mitzaehlen. */
  const reihen=[];
  BAUM.forEach((k,i)=>{
    let von=k.von||k.frist, bis=k.bis||k.frist, art=k.von?"balken":"raute";
    if(!von){
      const ki=BAUM.slice(i+1,i+1+kinderVon(i)).filter(x=>x.von||x.frist);
      if(!ki.length) return;
      von=ki.map(x=>x.von||x.frist).sort()[0];
      bis=ki.map(x=>x.bis||x.frist).sort().pop();
      art="fasst";
    }
    reihen.push({k,von,bis,art});
  });
  const UNTEN=Y0+reihen.length*ZH-ZH/2;

  /* Wochenraster zuerst, damit alles Weitere darueber liegt. */
  s.dick(0.7);
  for(let i=0;i<TAGE;i+=7){
    const d=new Date(tag(VON).getTime()+i*86400000).toISOString().slice(0,10);
    const x=px(d);
    s.strich(F.rule).linie(x, Y0-16, x, UNTEN);
    s.fuell(F.ink3).text(kurz(d), x+5, Y0-21, 8);
  }

  /* Heute: die einzige rote Linie im Blatt. */
  s.strich(F.signal).dick(1).linie(px(HEUTE), Y0-16, px(HEUTE), UNTEN);
  s.fuell(F.signal).text("heute", px(HEUTE), Y0-36, 7.5, {wo:"m"});

  let y=Y0;
  reihen.forEach(({k,von,bis,art})=>{

    /* Zeilenname, eingerueckt wie in der Gliederung. */
    s.fuell(k.e===0?F.ink:F.ink2)
     .textEng(k.t, RAND+k.e*12, y+4, k.e===0?10:9.5, 176-k.e*12, {fett:k.e<=1});

    const x=px(von), b=Math.max(px(bis)-x+FB/TAGE, 4);
    const rot=spaet(k);

    if(art==="raute"){
      const m=x, c=y, r=5.5;
      s.fuell(rot?F.signal:F.tinte)
       .weg([[m,c-r],[m+r,c],[m,c+r],[m-r,c]]);
    } else if(art==="fasst"){
      s.strich(F.rule2).dick(1).rund(x, y-4.5, b, 9, 2.5, "S");
    } else if(k.fortschritt!=null){
      s.fuell(F.tinteS).rund(x, y-6, b, 12, 3);
      s.fuell(F.tinte).rund(x, y-6, b*k.fortschritt/100, 12, 3);
      s.fuell(F.ink3).text(k.fortschritt+" %", x+b+6, y+3, 7.5);
    } else {
      s.fuell(rot?F.signal:F.tinte).rund(x, y-6, b, 12, 3);
    }

    /* Datum an den Balken, damit das Blatt ohne Raster lesbar bleibt. */
    if(art!=="fasst"){
      const bez = k.von ? kurz(k.von)+" – "+kurz(k.bis) : kurz(k.frist);
      const bb = breite(bez,7.5);
      let bx = art==="raute" ? x+10 : x+b+(k.fortschritt!=null?34:6);
      /* Faellt die Beschriftung auf die Heute-Linie, wandert sie auf die
         andere Seite. Ein Datum quer auf einer roten Linie ist weder zu
         lesen noch zu deuten. */
      const h=px(HEUTE);
      if(bx-4<h && h<bx+bb+4) bx = x-10-bb;
      if(bx>X0-60 && bx+bb<X1) s.fuell(rot?F.signal:F.ink3).text(bez, bx, y+3, 7.5);
    }

    y+=ZH;
  });

  s.strich(F.rule).dick(0.8).linie(RAND, UNTEN+10, X1, UNTEN+10);
  s.fuell(F.ink3).text("Balken: Zeitraum   ·   Raute: einzelne Frist   ·   "
    +"offener Rahmen: fasst die Unterpunkte zusammen", RAND, UNTEN+26, 8);

  fuss(s, "Diese Fristen gehören dem Outliner. Sie stehen nicht im Planner, "
    +"nicht im Kalender und nicht im Jahreskalender.");
  return s;
}

/* ============================================================
   Mindmap
   ============================================================ */
function mindmap(){
  const s=blatt(A4B,A4H);
  grund(s,"Produktstrategie 2026","Mindmap · Stand "+kurz(HEUTE));

  /* Erst rechnen, dann zeichnen. Zwei Gruende: Linien duerfen nicht
     ueber Beschriftungen laufen, und die fertige Anordnung muss sich
     noch aufs Blatt einpassen lassen. Ein radiales Bild ist nie
     symmetrisch — wo die Aeste hinzeigen, haengt am Inhalt. Ohne das
     Einpassen sass die Zeichnung ausserhalb der Mitte, mit toter
     Flaeche auf einer Seite. */
  const kaesten=[], bogen=[];
  const merke=(t,x,y,gr,fett,rot)=>{
    const b=breite(t,gr,fett)+18;
    kaesten.push({t,x,y,gr,fett,rot,b,h:gr+11});
  };

  merke(BAUM[0].t, 0, 0, 12.5, true, false);
  const eins=BAUM.map((k,i)=>({k,i})).filter(x=>x.k.e===1);

  eins.forEach((p,pi)=>{
    const w=-Math.PI/2 + (pi/eins.length)*Math.PI*2;
    const x=Math.cos(w)*168, y=Math.sin(w)*112;
    bogen.push([0,0,x,y,F.rule2,1.1]);
    merke(p.k.t, x, y, 11, true, false);

    const zwei=BAUM.slice(p.i+1, p.i+1+kinderVon(p.i));
    zwei.forEach((c,ci)=>{
      const w2=w+(ci-(zwei.length-1)/2)*0.58;
      const x2=Math.cos(w2)*320, y2=Math.sin(w2)*188;
      bogen.push([x,y,x2,y2,F.rule,1]);
      merke(c.t, x2, y2, 9.5, false, spaet(c));
    });
  });

  /* Einpassen: Umriss aller Kaesten messen, dann so verschieben und
     verkleinern, dass er die freie Flaeche fuellt. Vergroessert wird
     hoechstens auf das Anderthalbfache — sonst wirkte eine Mindmap aus
     drei Punkten wie ein Plakat. */
  const l=Math.min(...kaesten.map(k=>k.x-k.b/2)), r=Math.max(...kaesten.map(k=>k.x+k.b/2));
  const o=Math.min(...kaesten.map(k=>k.y-k.h/2)), u=Math.max(...kaesten.map(k=>k.y+k.h/2));
  const FX=RAND+8, FY=RAND+58, FB=s.B-2*FX, FH=s.H-FY-RAND-26;
  const m=Math.min(FB/(r-l), FH/(u-o), 1.5);
  const vx=FX+FB/2-(l+r)/2*m, vy=FY+FH/2-(o+u)/2*m;
  const PX=x=>vx+x*m, PY=y=>vy+y*m;

  bogen.forEach(([x1,y1,x2,y2,farbe,dicke])=>
    s.strich(farbe).dick(dicke).bogen(PX(x1),PY(y1),PX(x2),PY(y2)));

  kaesten.forEach(k=>{
    const b=k.b*m, h=k.h*m, gr=k.gr*m;
    const x=PX(k.x)-b/2, y=PY(k.y)-h/2;
    s.fuell(k.rot ? F.signalS : (k.fett && k.gr>12 ? F.raise : F.sheet))
     .rund(x,y,b,h,5*m);
    s.strich(k.rot ? F.signal : F.rule2).dick(k.rot?1:0.8).rund(x,y,b,h,5*m,"S");
    s.fuell(k.rot ? F.signal : (k.fett ? F.ink : F.ink2))
     .text(k.t, PX(k.x), PY(k.y)+gr*0.35, gr, {wo:"m", fett:k.fett});
  });

  fuss(s, "Derselbe Zweig, radial angeordnet. Überfälliges ist rot.");
  return s;
}

/* ---------- Schreiben ---------- */
const paare=[["outliner-gantt.pdf",gantt()],["outliner-mindmap.pdf",mindmap()]];
paare.forEach(([name,s])=>{
  const b=bauen([s]);
  writeFileSync(new URL("../mockups/"+name, import.meta.url), b);
  console.log("mockups/"+name+" — "+b.length+" Bytes");
});
