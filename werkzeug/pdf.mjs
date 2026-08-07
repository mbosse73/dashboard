/* Ein PDF von Hand schreiben — ohne Bibliothek, ohne Druckdialog.

   Warum ueberhaupt selbst? Die harte Regel des Projekts erlaubt keine
   externe Abhaengigkeit, und der Druckdialog des Browsers ist
   ausdruecklich nicht gewollt. Bleibt: die Datei selbst bauen.

   Das ist weniger wild, als es klingt. Ein PDF ist ein Textformat mit
   nummerierten Objekten, einer Tabelle ihrer Byte-Positionen und einem
   Inhaltsstrom aus Zeichenbefehlen. Es werden nur die vierzehn
   Standardschriften benutzt — Helvetica ist darunter und muss deshalb
   nicht eingebettet werden. Das spart die Schriftdatei und die
   Lizenzfrage gleich mit.

   Zwei Fallen, die hier ausgeraeumt sind:

   * Der Nullpunkt liegt **unten links**, nicht oben links. `hoch()`
     rechnet um, damit der Zeichencode von oben denken darf.
   * Die Standardschriften erwarten **WinAnsi**, nicht UTF-8. Ein
     „ä“ ist dort ein einzelnes Byte 0xE4. Ohne die Umrechnung stuenden
     im PDF zwei Zeichen Kauderwelsch.

   Dieselbe Datei laeuft spaeter unveraendert in dashboard.html; nur die
   Ausgabe wechselt von Buffer auf Blob. */

/* ---------- Schriftbreiten ----------
   Helvetica und Helvetica-Bold, je Tausendstel Geviert, Zeichen 32–126.
   Ohne sie liesse sich nichts zentrieren und keine Kastenbreite
   bestimmen — beides braucht die Mindmap. */
const W_NORM=[
278,278,355,556,556,889,667,191,333,333,389,584,278,333,278,278,
556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,
1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,
667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,
333,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,
556,556,333,500,278,556,500,722,500,500,500,334,260,334,584];
const W_FETT=[
278,333,474,556,556,889,722,238,333,333,389,584,278,333,278,278,
556,556,556,556,556,556,556,556,556,556,333,333,584,584,584,611,
975,722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,
667,778,722,667,611,722,667,944,667,667,611,333,278,333,584,556,
333,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,
611,611,389,556,333,611,556,778,556,556,500,389,280,389,584];

/* Was ueber 126 hinaus wirklich vorkommt: Umlaute, scharfes s, der
   Mittelpunkt und die beiden Striche. */
const SONDER={0xE4:[556,556],0xF6:[556,611],0xFC:[556,611],
  0xC4:[667,722],0xD6:[778,778],0xDC:[722,722],0xDF:[611,611],
  0xB7:[278,278],0x96:[556,556],0x97:[1000,1000],0xA0:[278,278],
  0xE9:[556,556],0xE8:[556,556]};

/* ---------- WinAnsi ----------
   Alles bis 0xFF geht unveraendert durch; die Handvoll Zeichen, die
   Unicode anderswo einsortiert hat, wird umgesetzt. */
const UMSETZ={0x2013:0x96, 0x2014:0x97, 0x2018:0x91, 0x2019:0x92,
  0x201A:0x82, 0x201C:0x93, 0x201D:0x94, 0x201E:0x84, 0x2022:0x95,
  0x2026:0x85, 0x20AC:0x80, 0x2039:0x8B, 0x203A:0x9B};

function winansi(s){
  const aus=[];
  for(const z of String(s)){
    const c=z.codePointAt(0);
    if(UMSETZ[c]!==undefined) aus.push(UMSETZ[c]);
    else if(c<=0xFF) aus.push(c);
    else aus.push(0x3F);                    /* alles Uebrige: Fragezeichen */
  }
  return aus;
}

/* Breite eines Textes in Punkt. */
export function breite(text, groesse, fett){
  let s=0;
  for(const c of winansi(text)){
    if(c>=32 && c<=126) s += (fett?W_FETT:W_NORM)[c-32];
    else if(SONDER[c])  s += SONDER[c][fett?1:0];
    else s += 556;
  }
  return s/1000*groesse;
}

/* Text fuer den Inhaltsstrom: Klammern und Rueckstrich schuetzen. */
const roh = text => winansi(text)
  .map(c => (c===40||c===41||c===92) ? "\\"+String.fromCharCode(c)
          : (c<32||c>126) ? "\\"+c.toString(8).padStart(3,"0")
          : String.fromCharCode(c))
  .join("");

const z2 = n => (Math.round(n*100)/100).toString();

/* ============================================================
   Das Blatt
   ============================================================ */
export function blatt(breitePt, hoehePt){
  const op=[];
  const hoch = y => hoehePt-y;            /* von oben gedacht nach PDF */

  const S={
    B:breitePt, H:hoehePt, hoch,

    fuell(f){ op.push(z2(f[0])+" "+z2(f[1])+" "+z2(f[2])+" rg"); return S; },
    strich(f){ op.push(z2(f[0])+" "+z2(f[1])+" "+z2(f[2])+" RG"); return S; },
    dick(w){ op.push(z2(w)+" w"); return S; },

    rechteck(x,y,b,h,art){
      op.push(z2(x)+" "+z2(hoch(y+h))+" "+z2(b)+" "+z2(h)+" re "+(art||"f"));
      return S;
    },

    /* Abgerundetes Rechteck. Der Faktor 0.5523 ist die uebliche
       Naeherung eines Viertelkreises durch eine Bezierkurve. */
    rund(x,y,b,h,r,art){
      r=Math.min(r,b/2,h/2);
      const k=r*0.5523, Y=y0=>hoch(y0);
      op.push(
        z2(x+r)+" "+Y(y)+" m",
        z2(x+b-r)+" "+Y(y)+" l",
        z2(x+b-r+k)+" "+Y(y)+" "+z2(x+b)+" "+Y(y+r-k)+" "+z2(x+b)+" "+Y(y+r)+" c",
        z2(x+b)+" "+Y(y+h-r)+" l",
        z2(x+b)+" "+Y(y+h-r+k)+" "+z2(x+b-r+k)+" "+Y(y+h)+" "+z2(x+b-r)+" "+Y(y+h)+" c",
        z2(x+r)+" "+Y(y+h)+" l",
        z2(x+r-k)+" "+Y(y+h)+" "+z2(x)+" "+Y(y+h-r+k)+" "+z2(x)+" "+Y(y+h-r)+" c",
        z2(x)+" "+Y(y+r)+" l",
        z2(x)+" "+Y(y+r-k)+" "+z2(x+r-k)+" "+Y(y)+" "+z2(x+r)+" "+Y(y)+" c",
        "h "+(art||"f"));
      return S;
    },

    linie(x1,y1,x2,y2){
      op.push(z2(x1)+" "+z2(hoch(y1))+" m "+z2(x2)+" "+z2(hoch(y2))+" l S");
      return S;
    },

    /* Weiche Verbindung fuer die Mindmap: ein waagerecht auslaufender
       Bogen liest sich ruhiger als eine gerade Strecke. */
    bogen(x1,y1,x2,y2){
      const mx=(x1+x2)/2;
      op.push(z2(x1)+" "+z2(hoch(y1))+" m "
        +z2(mx)+" "+z2(hoch(y1))+" "+z2(mx)+" "+z2(hoch(y2))+" "
        +z2(x2)+" "+z2(hoch(y2))+" c S");
      return S;
    },

    /* Vieleck, hier fuer die Raute des Meilensteins. */
    weg(punkte,art){
      punkte.forEach(([x,y],i)=>
        op.push(z2(x)+" "+z2(hoch(y))+" "+(i?"l":"m")));
      op.push("h "+(art||"f"));
      return S;
    },

    /* `wo` richtet aus: "l" links, "m" mittig, "r" rechts.
       `y` ist die Grundlinie, von oben gezaehlt. */
    text(s,x,y,groesse,opt){
      opt=opt||{};
      const b=breite(s,groesse,opt.fett);
      const px = opt.wo==="m" ? x-b/2 : opt.wo==="r" ? x-b : x;
      op.push("BT /"+(opt.fett?"F2":"F1")+" "+z2(groesse)+" Tf "
        +"1 0 0 1 "+z2(px)+" "+z2(hoch(y))+" Tm ("+roh(s)+") Tj ET");
      return S;
    },

    /* Text, der in eine Breite passen muss. Was nicht passt, wird
       gekuerzt — abgeschnittene Beschriftungen sind schlimmer als ein
       sichtbares Auslassungszeichen. */
    textEng(s,x,y,groesse,max,opt){
      let t=String(s);
      if(breite(t,groesse,opt&&opt.fett)>max){
        while(t.length>1 && breite(t+"…",groesse,opt&&opt.fett)>max) t=t.slice(0,-1);
        t+="…";
      }
      return S.text(t,x,y,groesse,opt);
    },

    strom: ()=>op.join("\n")
  };
  return S;
}

/* ============================================================
   Die Datei
   ============================================================ */
export function bauen(seiten){
  const teile=[], pos=[];
  let laenge=0;
  const schreib = s => { const b=Buffer.from(s,"latin1"); teile.push(b); laenge+=b.length; };
  const objekt = (nr,inhalt) => { pos[nr]=laenge; schreib(nr+" 0 obj\n"+inhalt+"\nendobj\n"); };

  schreib("%PDF-1.4\n");
  /* Vier hohe Bytes als Kommentar: das Kennzeichen dafuer, dass die
     Datei binaer ist. Ohne sie behandeln manche Werkzeuge sie als Text
     und zerstoeren sie beim Kopieren. */
  schreib("%\xE2\xE3\xCF\xD3\n");

  const ERST=5;                                  /* 1–4 sind vergeben */
  const seitenNr = seiten.map((_,i)=>ERST+i*2);

  objekt(1,"<< /Type /Catalog /Pages 2 0 R >>");
  objekt(2,"<< /Type /Pages /Kids ["+seitenNr.map(n=>n+" 0 R").join(" ")
    +"] /Count "+seiten.length+" >>");
  objekt(3,"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica "
    +"/Encoding /WinAnsiEncoding >>");
  objekt(4,"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold "
    +"/Encoding /WinAnsiEncoding >>");

  seiten.forEach((s,i)=>{
    const nr=seitenNr[i];
    objekt(nr,"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 "
      +z2(s.B)+" "+z2(s.H)+"] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> "
      +"/Contents "+(nr+1)+" 0 R >>");
    const inhalt=s.strom();
    objekt(nr+1,"<< /Length "+Buffer.byteLength(inhalt,"latin1")+" >>\nstream\n"
      +inhalt+"\nendstream");
  });

  const xref=laenge, anzahl=ERST+seiten.length*2;
  let t="xref\n0 "+anzahl+"\n0000000000 65535 f \n";
  for(let n=1;n<anzahl;n++)
    t += String(pos[n]||0).padStart(10,"0")+" 00000 n \n";
  schreib(t);
  schreib("trailer\n<< /Size "+anzahl+" /Root 1 0 R >>\nstartxref\n"+xref+"\n%%EOF\n");

  return Buffer.concat(teile);
}
