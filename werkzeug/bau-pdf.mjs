/* Erzeugt die Beispiel-PDF zum Entwurf von Schritt 9.

   Kein Druckdialog, keine Bibliothek — die Dateien werden in pdf.mjs
   byteweise selbst geschrieben.

   Ein Gantt waechst in zwei Richtungen, und die beiden verlangen
   verschiedene Antworten:

   * Nach unten, mit der Zahl der Zeilen. Dagegen hilft ein Umbruch.
     Jedes Blatt wiederholt Kopf und Namensspalte, sonst weiss man auf
     Blatt 3 nicht mehr, welcher Balken zu wem gehoert.
   * Nach rechts, mit der Laenge des Zeitraums. Dagegen hilft **kein**
     Umbruch: Ein Zeitstrahl, der mitten im November aufhoert und auf
     dem naechsten Blatt weitergeht, ist nicht mehr zu lesen. Die
     Zeitachse wird deshalb immer auf die Blattbreite gerechnet, und
     nur die Beschriftung wird groeber — Wochen, dann Monate, dann
     Vierteljahre.

   Eine Mindmap wird nie umgebrochen. Ein zerschnittener Ast ist kein
   halber Ast, er ist Unsinn. Sie bekommt stattdessen das kleinste
   Blattformat, auf dem ihre Schrift noch lesbar bleibt.

   Auch hier gilt: Farbe codiert Dringlichkeit, nicht Kategorie. */
import {writeFileSync} from "node:fs";
import {blatt, bauen, breite} from "./pdf.mjs";
import {BAUM, GROSS, HEUTE, diff, tag, kurz, MON, kinderVon, spaet, FARBE as F}
  from "./outliner-daten.mjs";

/* ---------- Blattformate ----------
   In Punkt, quer. Alle nach DIN, damit jede Druckerei sie kennt. */
export const FORMAT={
  A4:[842,595], A3:[1191,842], A2:[1684,1191], A1:[2384,1684], A0:[3370,2384]
};
const RAND=42;

/* ---------- Gemeinsames ---------- */
/* `sk` vergroessert Titel und Fusszeile auf grossen Bogen mit. Ohne das
   sass auf einem A2-Blatt eine A4-Ueberschrift — richtig gerechnet und
   trotzdem verloren. */
function grund(s, titel, unter, sk){
  sk=sk||1;
  s.fuell(F.paper).rechteck(0,0,s.B,s.H);
  s.fuell(F.sheet).rund(RAND-14, RAND-14, s.B-(RAND-14)*2, s.H-(RAND-14)*2, 10);
  s.fuell(F.ink).text(titel, RAND, RAND+4+3*sk, 17*sk, {fett:true});
  s.fuell(F.ink3).text(unter, RAND, RAND+16+7*sk, 9*sk);
  s.strich(F.rule).dick(0.8).linie(RAND, RAND+24+9*sk, s.B-RAND, RAND+24+9*sk);
}
function fuss(s, links, rechts, sk){
  sk=sk||1;
  s.fuell(F.ink3).text(links, RAND, s.H-RAND+4, 8*sk);
  s.text(rechts, s.B-RAND, s.H-RAND+4, 8*sk, {wo:"r"});
}

/* ---------- Zeilen mit Datum ----------
   Ein Elternpunkt ohne eigenes Datum fasst zusammen, was unter ihm
   liegt. Wer gar nichts Datiertes unter sich hat, faellt weg. */
function reihenAus(L){
  const aus=[];
  L.forEach((k,i)=>{
    let von=k.von||k.frist, bis=k.bis||k.frist, art=k.von?"balken":"raute";
    if(!von){
      const ki=L.slice(i+1,i+1+kinderVon(L,i)).filter(x=>x.von||x.frist);
      if(!ki.length) return;
      von=ki.map(x=>x.von||x.frist).sort()[0];
      bis=ki.map(x=>x.bis||x.frist).sort().pop();
      art="fasst";
    }
    aus.push({k,von,bis,art});
  });
  return aus;
}

/* ---------- Die Zeitachse ----------
   Waehlt die groebste noetige Einteilung. Der Schwellwert 58 Punkt ist
   gemessen, nicht geraten: Bei „24. Aug“ in 8 Punkt Helvetica sind das
   die Breite der Beschriftung plus Luft. */
function achse(von, bis, feldBreite){
  const tage=diff(von,bis)+1;
  const px = d => diff(von,d)/tage*feldBreite;
  const marken=[];

  const wochen=feldBreite*7/tage;
  if(wochen>=58){
    for(let i=0;i<tage;i+=7){
      const d=new Date(tag(von).getTime()+i*86400000).toISOString().slice(0,10);
      marken.push([px(d), kurz(d)]);
    }
    return {tage,px,marken,art:"Wochen"};
  }

  /* Monatserste einsammeln, danach entscheiden, ob jeder oder nur
     jeder dritte beschriftet wird. */
  const erste=[];
  const d0=tag(von);
  let j=new Date(d0.getFullYear(), d0.getMonth(), 1);
  if(j<d0) j=new Date(d0.getFullYear(), d0.getMonth()+1, 1);
  while(j<=tag(bis)){
    erste.push(new Date(j));
    j=new Date(j.getFullYear(), j.getMonth()+1, 1);
  }
  const iso=x=>x.toISOString().slice(0,10);
  const abst = erste.length>1 ? px(iso(erste[1]))-px(iso(erste[0])) : feldBreite;
  const jeder = abst>=58 ? 1 : 3;
  erste.forEach((x,i)=>{
    if(i%jeder) return;
    marken.push([px(iso(x)),
      MON[x.getMonth()]+(x.getMonth()===0||i===0 ? " "+x.getFullYear() : "")]);
  });
  return {tage,px,marken,art: jeder===1 ? "Monate" : "Vierteljahre"};
}

/* ============================================================
   Gantt — ein oder mehrere Blaetter
   ============================================================ */
function gantt(L, opt){
  opt=opt||{};
  const [B,H]=FORMAT[opt.format||"A4"];
  const titel=L[0].t;
  const reihen=reihenAus(L);

  let VON=reihen.map(r=>r.von).sort()[0];
  const BIS=reihen.map(r=>r.bis).sort().pop();
  /* Heute mit aufnehmen, wenn der Plan erst demnaechst beginnt. Sonst
     fehlt die einzige Linie, an der man sieht, wo man steht. Liegt der
     Beginn weiter als ein Vierteljahr voraus, bleibt sie weg — sonst
     waere das halbe Blatt leerer Vorlauf. */
  if(HEUTE<VON && diff(HEUTE,VON)<=90) VON=HEUTE;

  /* Groessere Bogen bekommen groessere Schrift. Ein A2-Plan an der Wand
     mit 9,5-Punkt-Text waere zwar korrekt und trotzdem unbrauchbar.
     Die Wurzel statt des vollen Verhaeltnisses, damit A0 nicht zum
     Plakat wird. */
  const sk=Math.min(1.6, Math.sqrt(B/842));

  const NAMSP=Math.round(B*0.23);
  const X0=RAND+NAMSP, X1=B-RAND, FB=X1-X0;
  const A=achse(VON,BIS,FB);
  const px = d => X0+A.px(d);

  /* Erst der Umbruch, dann die Zeilenhoehe — nicht umgekehrt. Beim
     ersten Versuch entschied die *gewuenschte* Hoehe ueber den Umbruch;
     damit rutschte ein A2-Bogen auf zwei Blaetter, obwohl alles darauf
     gepasst haette. Ueber den Umbruch entscheidet die kleinste noch
     vertretbare Hoehe, danach wird das Blatt gefuellt. */
  const OBEN=RAND+80, PLATZ=H-RAND-40-OBEN;
  const ZHMIN=20*sk;
  const jeSeite=Math.max(3, Math.floor(PLATZ/ZHMIN));
  const seitenZahl=Math.ceil(reihen.length/jeSeite);
  const aufBlatt=seitenZahl===1 ? reihen.length : jeSeite;
  const ZH=Math.min(46*sk, PLATZ/aufBlatt);

  const seiten=[];
  for(let sn=0; sn<seitenZahl; sn++){
    const s=blatt(B,H);
    const teil=reihen.slice(sn*jeSeite, (sn+1)*jeSeite);
    const UNTEN=OBEN+teil.length*ZH-ZH/2;

    grund(s, titel+(sn?" (Fortsetzung)":""),
      "Gantt · Stand "+kurz(HEUTE)+" · "+kurz(VON)+" bis "+kurz(BIS)
      +" · eigene Fristen des Outliners", sk);

    /* Raster und Beschriftung */
    s.dick(0.7);
    A.marken.forEach(([x,bez])=>{
      s.strich(F.rule).linie(X0+x, OBEN-16, X0+x, UNTEN);
      s.fuell(F.ink3).text(bez, X0+x+5, OBEN-21, 8*Math.min(sk,1.3));
    });

    /* Heute nur zeichnen, wenn der Tag ueberhaupt im Zeitraum liegt. */
    if(HEUTE>=VON && HEUTE<=BIS){
      s.strich(F.signal).dick(1).linie(px(HEUTE), OBEN-16, px(HEUTE), UNTEN);
      s.fuell(F.signal).text("heute", px(HEUTE), OBEN-34, 7.5*Math.min(sk,1.3), {wo:"m"});
    }

    let y=OBEN;
    teil.forEach(({k,von,bis,art})=>{
      s.fuell(k.e===0?F.ink:F.ink2)
       .textEng(k.t, RAND+k.e*12*sk, y+4*sk, (k.e===0?10:9.5)*sk,
                NAMSP-16-k.e*12*sk, {fett:k.e<=1});

      const x=px(von), b=Math.max(px(bis)-x+FB/A.tage, 4*sk), rot=spaet(k);
      const BH=12*sk;

      if(art==="raute"){
        const r=5.5*sk;
        s.fuell(rot?F.signal:F.tinte).weg([[x,y-r],[x+r,y],[x,y+r],[x-r,y]]);
      } else if(art==="fasst"){
        s.strich(F.rule2).dick(1).rund(x, y-BH*0.375, b, BH*0.75, 2.5*sk, "S");
      } else if(k.fortschritt!=null){
        s.fuell(F.tinteS).rund(x, y-BH/2, b, BH, 3*sk);
        s.fuell(F.tinte).rund(x, y-BH/2, b*k.fortschritt/100, BH, 3*sk);
      } else {
        s.fuell(rot?F.signal:F.tinte).rund(x, y-BH/2, b, BH, 3*sk);
      }

      /* Beschriftung nur, wo sie hinpasst und nichts kreuzt. Bei engen
         Achsen bleibt sie weg — ein zerquetschtes Datum ist schlimmer
         als keins, der Balken sagt es auch. */
      if(art!=="fasst"){
        const bez = k.von ? kurz(k.von)+" – "+kurz(k.bis) : kurz(k.frist);
        const bb=breite(bez,7.5*sk);
        let bx = art==="raute" ? x+10*sk : x+b+6*sk;
        const h=px(HEUTE);
        if(bx-4<h && h<bx+bb+4) bx = x-10*sk-bb;
        if(bx>X0-70 && bx+bb<X1) s.fuell(rot?F.signal:F.ink3).text(bez, bx, y+3*sk, 7.5*sk);
      }
      y+=ZH;
    });

    s.strich(F.rule).dick(0.8).linie(RAND, UNTEN+10, X1, UNTEN+10);
    s.fuell(F.ink3).text("Balken: Zeitraum   ·   Raute: einzelne Frist   ·   "
      +"offener Rahmen: fasst die Unterpunkte zusammen   ·   Achse: "+A.art,
      RAND, UNTEN+18+8*sk, 8*sk);

    fuss(s, "Diese Fristen gehören dem Outliner. Sie stehen nicht im Planner, "
      +"nicht im Kalender und nicht im Jahreskalender.",
      (opt.format||"A4")+" quer · "
      +(seitenZahl>1 ? "Blatt "+(sn+1)+" von "+seitenZahl : "ein Blatt"), sk);

    seiten.push(s);
  }
  return seiten;
}

/* ============================================================
   Mindmap — immer ein Blatt, Format nach Bedarf
   ============================================================ */
/* Erst war das ein reiner Faecher: alle Aeste radial um die Wurzel.
   Bei drei Aesten sah das gut aus, bei dreissig Punkten schoben sich
   die Kaesten uebereinander — und dagegen hilft kein groesseres Blatt,
   denn das vergroessert die Ueberlappung mit.

   Jetzt die klassische Anordnung: die Wurzel in der Mitte, die Aeste
   nach links und rechts, und **jeder Punkt bekommt seine eigene
   Zeile**. Damit kann sich nichts mehr ueberdecken, ganz gleich wie
   gross die Gliederung wird. Die Hoehe waechst mit der Zahl der
   Punkte — und ueber die Hoehe entscheidet sich dann das Format. */
function mindmapLage(L){
  const kaesten=[], bogen=[];
  const halb=(t,gr,fett)=>(breite(t,gr,fett)+18)/2;
  const merke=(t,x,y,gr,fett,rot)=>
    kaesten.push({t,x,y,gr,fett,rot,b:breite(t,gr,fett)+18,h:gr+11});

  const eins=L.map((k,i)=>({k,i})).filter(x=>x.k.e===1)
    .map(p=>({...p, kinder:L.slice(p.i+1,p.i+1+kinderVon(L,p.i)).filter(c=>c.e===2)}));

  /* Die Spalten stehen fest, damit nichts ineinanderlaeuft. Ihre
     Abstaende kommen aus den breitesten Beschriftungen. */
  const wurzelH=halb(L[0].t,12.5,true);
  const astH=Math.max(...eins.map(p=>halb(p.k.t,11,true)));
  const blattH=Math.max(...eins.flatMap(p=>p.kinder.map(c=>halb(c.t,9.5,false))), 40);
  const SP1=wurzelH+64+astH, SP2=SP1+astH+56+blattH;

  /* Abwechselnd rechts und links verteilen, damit beide Seiten
     ungefaehr gleich lang werden. */
  const seiten=[[],[]];
  const last=[0,0];
  eins.forEach(p=>{
    const s = last[0]<=last[1] ? 0 : 1;
    seiten[s].push(p);
    last[s] += Math.max(1,p.kinder.length)+0.6;      /* Luft je Ast */
  });

  const ZEILE=26;
  merke(L[0].t, 0, 0, 12.5, true, false);

  seiten.forEach((liste,si)=>{
    const vz = si===0 ? 1 : -1;
    const zeilen=liste.reduce((n,p)=>n+Math.max(1,p.kinder.length)+0.6, -0.6);
    let y=-zeilen*ZEILE/2;

    liste.forEach(p=>{
      const n=Math.max(1,p.kinder.length);
      const yAst=y+(n-1)*ZEILE/2;
      bogen.push([0,0,vz*SP1,yAst,F.rule2,1.1]);
      merke(p.k.t, vz*SP1, yAst, 11, true, false);

      p.kinder.forEach((c,ci)=>{
        const yb=y+ci*ZEILE;
        bogen.push([vz*SP1,yAst,vz*SP2,yb,F.rule,1]);
        merke(c.t, vz*SP2, yb, 9.5, false, spaet(c));
      });
      y += (n+0.6)*ZEILE;
    });
  });
  return {kaesten,bogen};
}

function mindmap(L, opt){
  opt=opt||{};
  const lage=mindmapLage(L);
  const K=lage.kaesten;
  const l=Math.min(...K.map(k=>k.x-k.b/2)), r=Math.max(...K.map(k=>k.x+k.b/2));
  const o=Math.min(...K.map(k=>k.y-k.h/2)), u=Math.max(...K.map(k=>k.y+k.h/2));

  /* Das kleinste Format nehmen, auf dem die kleinste Schrift noch
     ueber 7 Punkt bleibt. Darunter ist ein Ausdruck nicht mehr zu
     lesen, und ein unleserliches Blatt ist kein Ergebnis. */
  const kleinste=Math.min(...K.map(k=>k.gr));
  const kette=opt.format ? [opt.format] : ["A4","A3","A2","A1","A0"];
  let gewaehlt=kette[kette.length-1], m=0, B=0, H=0, FX,FY,FB,FH;
  for(const name of kette){
    [B,H]=FORMAT[name];
    FX=RAND+8; FY=RAND+58; FB=B-2*FX; FH=H-FY-RAND-26;
    m=Math.min(FB/(r-l), FH/(u-o), 1.5);
    gewaehlt=name;
    if(kleinste*m>=7) break;
  }

  const s=blatt(B,H);
  const skm=Math.min(1.6, Math.sqrt(B/842));
  grund(s, L[0].t, "Mindmap · Stand "+kurz(HEUTE)+" · "+K.length+" Punkte", skm);

  const vx=FX+FB/2-(l+r)/2*m, vy=FY+FH/2-(o+u)/2*m;
  const PX=x=>vx+x*m, PY=y=>vy+y*m;

  lage.bogen.forEach(([x1,y1,x2,y2,farbe,dicke])=>
    s.strich(farbe).dick(dicke*Math.max(m,0.6)).bogen(PX(x1),PY(y1),PX(x2),PY(y2)));

  K.forEach(k=>{
    const b=k.b*m, h=k.h*m, gr=k.gr*m;
    const x=PX(k.x)-b/2, y=PY(k.y)-h/2;
    s.fuell(k.rot ? F.signalS : (k.fett && k.gr>12 ? F.raise : F.sheet))
     .rund(x,y,b,h,5*m);
    s.strich(k.rot ? F.signal : F.rule2).dick((k.rot?1:0.8)*Math.max(m,0.6))
     .rund(x,y,b,h,5*m,"S");
    s.fuell(k.rot ? F.signal : (k.fett ? F.ink : F.ink2))
     .text(k.t, PX(k.x), PY(k.y)+gr*0.35, gr, {wo:"m", fett:k.fett});
  });

  fuss(s, "Die Wurzel in der Mitte, die Äste nach beiden Seiten. Überfälliges ist rot.",
    gewaehlt+" quer · ein Blatt", skm);
  return [s];
}

/* ---------- Schreiben ---------- */
const werke=[
  ["outliner-gantt.pdf",              gantt(BAUM)],
  ["outliner-mindmap.pdf",            mindmap(BAUM)],
  ["outliner-gantt-gross-a4.pdf",     gantt(GROSS,{format:"A4"})],
  ["outliner-gantt-gross-a2.pdf",     gantt(GROSS,{format:"A2",eng:true})],
  ["outliner-mindmap-gross.pdf",      mindmap(GROSS)]
];
werke.forEach(([name,seiten])=>{
  const b=bauen(seiten);
  writeFileSync(new URL("../mockups/"+name, import.meta.url), b);
  console.log(String(seiten.length).padStart(2)+" Blatt  "
    +String(b.length).padStart(7)+" Bytes  "+name);
});
