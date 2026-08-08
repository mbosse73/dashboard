/* SQL lesbar einrücken — ohne Bibliothek, wie alles hier.

   Der wichtigste Satz zuerst: **Dies ist kein Parser.** Er zerlegt in
   Wörter und setzt Zeilenumbrüche. Er versteht nicht, was die Abfrage
   tut, und er kennt keinen Dialekt. Das reicht zum Lesbarmachen und
   nicht viel weiter.

   Deshalb gibt es eine Rückprobe: Nach dem Formatieren wird die Ausgabe
   erneut zerlegt und Wort für Wort mit der Eingabe verglichen. Stimmt
   etwas nicht überein, wird **nichts** ausgegeben, sondern gesagt, dass
   es nicht ging. Ein Formatierer, der still ein Wort verschluckt, ist
   gefährlicher als gar keiner. */

/* ---------- Zerlegen ----------
   Reihenfolge ist Absicht: Kommentare und Zeichenketten zuerst, sonst
   zerlegt der Rest ihren Inhalt mit. */
export function zerlege(s){
  const t=[]; let i=0;
  while(i<s.length){
    const c=s[i];
    if(/\s/.test(c)){ let j=i; while(j<s.length && /\s/.test(s[j])) j++;
      t.push({a:"raum", w:s.slice(i,j)}); i=j; continue; }
    if(c==="-" && s[i+1]==="-"){ let j=s.indexOf("\n",i); if(j<0) j=s.length;
      t.push({a:"komm", w:s.slice(i,j).trimEnd()}); i=j; continue; }
    if(c==="/" && s[i+1]==="*"){ let j=s.indexOf("*/",i+2); j=j<0?s.length:j+2;
      t.push({a:"komm", w:s.slice(i,j)}); i=j; continue; }
    if(c==="'"){
      /* Ein doppeltes Hochkomma steht für eines im Text und beendet die
         Zeichenkette nicht. */
      let j=i+1;
      while(j<s.length){
        if(s[j]==="'"){ if(s[j+1]==="'") j+=2; else { j++; break; } } else j++;
      }
      t.push({a:"text", w:s.slice(i,j)}); i=j; continue;
    }
    if(c==='"' || c==="`"){ let j=i+1; while(j<s.length && s[j]!==c) j++;
      t.push({a:"name", w:s.slice(i,Math.min(j+1,s.length))}); i=Math.min(j+1,s.length); continue; }
    if(c==="["){ let j=s.indexOf("]",i); j=j<0?s.length:j+1;
      t.push({a:"name", w:s.slice(i,j)}); i=j; continue; }
    if(/[0-9]/.test(c) || (c==="." && /[0-9]/.test(s[i+1]||""))){
      let j=i; while(j<s.length && /[0-9._]/.test(s[j])) j++;
      t.push({a:"zahl", w:s.slice(i,j)}); i=j; continue; }
    if(/[A-Za-z_@#:$]/.test(c)){
      let j=i; while(j<s.length && /[A-Za-z0-9_@#$:]/.test(s[j])) j++;
      t.push({a:"wort", w:s.slice(i,j)}); i=j; continue; }
    const zwei=s.substr(i,2);
    if(["<=",">=","<>","!=","||","::","->","=>"].includes(zwei)){
      t.push({a:"op", w:zwei}); i+=2; continue; }
    t.push({a:"op", w:c}); i++;
  }
  return t;
}

/* ---------- Was eine neue Zeile bekommt ----------
   Mehrwortige zuerst, damit `GROUP BY` nicht als `GROUP` und `BY`
   auseinanderfällt. */
const KLAUSEL=[
  "WITH RECURSIVE","WITH","SELECT DISTINCT","SELECT","FROM","WHERE",
  "GROUP BY","HAVING","ORDER BY","LIMIT","OFFSET","FETCH FIRST","WINDOW",
  "UNION ALL","UNION","EXCEPT","INTERSECT",
  "INSERT INTO","VALUES","UPDATE","SET","DELETE FROM","RETURNING",
  "CREATE TABLE","CREATE VIEW","ALTER TABLE","DROP TABLE","TRUNCATE"
];
const VERBUND=[
  "LEFT OUTER JOIN","RIGHT OUTER JOIN","FULL OUTER JOIN","INNER JOIN",
  "CROSS JOIN","LEFT JOIN","RIGHT JOIN","FULL JOIN","NATURAL JOIN","JOIN",
  "ON","USING"
];
/* Nach diesen Klauseln steht die Liste eingerückt unter der Klausel. */
const MIT_LISTE=new Set(["SELECT","SELECT DISTINCT","GROUP BY","ORDER BY","SET","VALUES","RETURNING"]);

/* ---------- Was großgeschrieben werden darf ----------
   **Nur das hier.** Alles andere bleibt Zeichen für Zeichen so stehen,
   wie es getippt wurde — ein Tabellen- oder Spaltenname wird nie
   angefasst, auch nicht im Schriftfall.

   Die Liste war einmal deutlich länger und enthielt Datentypen und
   Wörter wie TEXT, DATE, KEY, NAME, FIRST, ROW. Das war falsch: Eine
   Spalte darf so heißen, und dann hätte der Formatierer sie
   umgeschrieben. Was nur in einer Wortfolge vorkommt — LEFT, INNER,
   OUTER, INTO — steht ebenfalls nicht hier; das erledigt die
   Folgenerkennung, und `left(name,3)` bleibt damit unberührt. */
/* Wörter, die nur als Teil einer erkannten Wortfolge großgeschrieben
   werden — SELECT, LEFT JOIN, INSERT INTO und so fort. */
const SCHRITT_WORT=new Set(
  [...KLAUSEL, ...VERBUND].flatMap(k=>k.split(" ")));
const GROSS_ERLAUBT=new Set([
  "AND","OR","NOT","IS","IN","LIKE","ILIKE","BETWEEN","EXISTS","NULL",
  "CASE","WHEN","THEN","ELSE","END","AS","ASC","DESC","DISTINCT",
  "ALL","ANY","OVER","PARTITION","BY","TRUE","FALSE"
]);

/* Sucht ab Stelle `i` die längste passende Wortfolge aus `liste`. */
function phrase(t,i,liste){
  for(const p of liste){
    const w=p.split(" ");
    let j=i, k=0;
    while(k<w.length && j<t.length){
      if(t[j].a==="raum" || t[j].a==="komm"){ j++; continue; }
      if(t[j].a!=="wort" || t[j].w.toUpperCase()!==w[k]) break;
      j++; k++;
    }
    if(k===w.length) return {text:p, bis:j};
  }
  return null;
}

/* Vor einer Klammer steht ein Zwischenraum nur nach diesen Wörtern.
   Sonst ist es ein Funktionsaufruf und die Klammer klebt am Namen:
   `count(*)`, aber `IN (…)`. */
const KLAMMER_RAUM=new Set(["IN","VALUES","EXISTS","ALL","ANY","USING","NOT",
  "AND","OR","ON","INTO","RETURNING","BY","SETS","OVER","PARTITION","AS",
  "SELECT","FROM","WHERE","SET","UNION","BETWEEN","WHEN","THEN","ELSE",
  "TABLE","VIEW","KEY","REFERENCES","FILTER","DISTINCT"]);

export function formatiere(quelle, opt){
  opt=opt||{};
  const EIN=opt.einzug || "  ";
  const t=zerlege(quelle).filter(x=>x.a!=="raum");
  if(!t.length) return {text:"", ok:true, leer:true};

  const zeilen=[];
  let puffer="", tiefe=0, vorher=null;
  /* Nach `INSERT INTO kunden` ist `(…)` eine Spaltenliste, kein
     Funktionsaufruf — sie bekommt einen Zwischenraum. */
  let nachTabelle=false;
  /* `zusatz` ist die eine Ebene, die eine Liste oder ein ON öffnet. Sie
     wird beim nächsten Klausel- oder Verbundwort wieder eingezogen. */
  let zusatz=0;
  /* Je offener Klammer merken, ob sie umgebrochen wurde. Nur dann wird
     beim Schließen wieder ausgerückt. */
  const klammern=[];
  /* Je offenem CASE ein Eintrag — damit auch ein CASE in einem CASE
     wieder richtig ausrückt. */
  const faelle=[];

  const flush=()=>{
    if(puffer.trim()) zeilen.push(EIN.repeat(Math.max(0,tiefe))+puffer.trim());
    puffer="";
  };
  /* Ein einziger Ort entscheidet über den Zwischenraum. Vorher stand
     das an fünf Stellen, und hinterher rückte ein `replace` die Reste
     gerade — das griff auch in Zeichenketten hinein und hätte
     `'a . b'` still verändert. */
  const raumDavor=(x)=>{
    if(!puffer) return false;
    if(x.a==="op" && [",",";",")",".","::"].includes(x.w)) return false;
    if(vorher && vorher.a==="op" && (vorher.w==="." || vorher.w==="(")) return false;
    if(x.a==="op" && x.w==="("){
      if(!vorher) return false;
      if(vorher.a==="tabelle") return true;
      if(vorher.a==="wort") return KLAMMER_RAUM.has(vorher.w.toUpperCase());
      if(vorher.a==="name") return false;
      return true;
    }
    return true;
  };
  const setz=(x, text)=>{
    puffer += (raumDavor(x) ? " " : "") + (text!==undefined ? text : x.w);
    vorher=x;
  };
  const roh=(s)=>{ puffer += (puffer?" ":"")+s; vorher={a:"wort",w:s}; };

  /* Flush **vor** dem Ausrücken: Was noch im Puffer steht, gehört zur
     eingerückten Ebene. Andersherum verlor der letzte Eintrag einer
     Liste seinen Einzug — sichtbar an einem `firma`, das unter zwei
     eingerückten Geschwistern plötzlich links stand. */
  const zusatzZu=()=>{ flush(); if(zusatz){ tiefe-=zusatz; zusatz=0; } };

  const istUnterabfrage=i=>{
    for(let j=i+1;j<t.length;j++){
      if(t[j].a==="komm") continue;
      return t[j].a==="wort" && ["SELECT","WITH","VALUES"].includes(t[j].w.toUpperCase());
    }
    return false;
  };

  let i=0;
  while(i<t.length){
    const x=t[i];

    if(x.a==="komm"){
      if(x.w.startsWith("--")){ setz(x,x.w); flush(); }
      else if(puffer) setz(x,x.w);          /* Blockkommentar bleibt in der Zeile */
      else { zeilen.push(EIN.repeat(Math.max(0,tiefe))+x.w); }
      i++; continue;
    }

    if(x.a==="wort"){
      const kl=phrase(t,i,KLAUSEL);
      if(kl){
        zusatzZu(); roh(kl.text);
        nachTabelle=["INSERT INTO","UPDATE","CREATE TABLE","ALTER TABLE"].includes(kl.text);
        if(MIT_LISTE.has(kl.text)){ flush(); tiefe++; zusatz=1; }
        i=kl.bis; continue;
      }
      const vb=phrase(t,i,VERBUND);
      if(vb){
        zusatzZu();
        if(vb.text==="ON" || vb.text==="USING"){
          /* Die Bedingung gehört unter ihren Verbund und in dieselbe
             Zeile — sonst steht `ON` allein und das Folgende links. */
          tiefe++; zusatz=1; roh(vb.text);
        } else roh(vb.text);
        i=vb.bis; continue;
      }
      const gross=x.w.toUpperCase();

      /* CASE bricht um: WHEN, ELSE und END beginnen je eine Zeile,
         THEN bleibt bei seinem WHEN. Bei drei Zweigen wäre eine Zeile
         noch zu lesen, bei acht nicht mehr. */
      if(gross==="CASE"){ flush(); roh("CASE"); flush(); tiefe++; faelle.push(true);
        i++; continue; }
      if(faelle.length && (gross==="WHEN" || gross==="ELSE")){
        flush(); roh(gross); i++; continue; }
      if(faelle.length && gross==="END"){
        flush(); tiefe--; faelle.pop(); roh("END"); i++; continue; }

      if(gross==="AND" || gross==="OR"){ flush(); roh(gross); i++; continue; }
      setz(x, GROSS_ERLAUBT.has(gross) ? gross : x.w);
      if(nachTabelle) vorher={a:"tabelle", w:x.w};
      nachTabelle=false;
      i++; continue;
    }

    if(x.a==="op"){
      if(x.w==="("){
        if(istUnterabfrage(i)){ setz(x,"("); flush(); tiefe++; klammern.push(true); }
        else { setz(x,"("); klammern.push(false); }
        i++; continue;
      }
      if(x.w===")"){
        /* Erst die Zusatzebene schließen, die eine Liste innerhalb der
           Klammer geöffnet hat. Ohne das stand die schließende Klammer
           einer CTE um eine Ebene zu weit rechts. */
        if(klammern[klammern.length-1]) zusatzZu();
        if(klammern.pop()){ flush(); tiefe--; setz(x,")"); }
        else setz(x,")");
        i++; continue;
      }
      if(x.w===","){
        setz(x,",");
        /* Eine Liste bricht auf ihrer eigenen Ebene um — auch innerhalb
           einer umgebrochenen Klammer, denn dort steht wieder eine
           eigene Abfrage. Nur in einer Funktionsklammer bleibt sie in
           der Zeile: `count(a, b)` gehört zusammen. */
        const innen = klammern.length ? klammern[klammern.length-1] : true;
        if(zusatz && innen) flush();
        i++; continue;
      }
      if(x.w===";"){
        setz(x,";"); flush(); zeilen.push("");
        tiefe=0; zusatz=0; klammern.length=0; vorher=null;
        i++; continue;
      }
      setz(x); i++; continue;
    }

    setz(x);
    i++;
  }
  flush();

  const text=zeilen.join("\n").replace(/\n{3,}/g,"\n\n").trimEnd();

  /* ---------- Die Rückprobe ----------
     Ausgabe erneut zerlegen und Bestandteil für Bestandteil
     vergleichen. Nur der Schriftfall der Schlüsselwörter darf sich
     unterscheiden. Stimmt etwas nicht, wird nichts ausgegeben. */
  const vor=zerlege(quelle).filter(y=>y.a!=="raum");
  const nach=zerlege(text).filter(y=>y.a!=="raum");
  if(vor.length!==nach.length)
    return {text:"", ok:false,
      grund:"Die Rückprobe fand "+nach.length+" Bestandteile statt "+vor.length+"."};
  for(let k=0;k<vor.length;k++){
    const a=vor[k], b=nach[k];
    if(a.a!==b.a)
      return {text:"", ok:false, grund:"Die Rückprobe stolperte bei „"+a.w+"“."};
    if(a.a==="wort"){
      if(a.w.toUpperCase()!==b.w.toUpperCase())
        return {text:"", ok:false, grund:"Die Rückprobe stolperte bei „"+a.w+"“."};
      /* Der Schriftfall darf sich nur bei den wenigen erlaubten Wörtern
         unterscheiden. Vorher verglich die Probe alle Wörter ohne
         Rücksicht auf Groß und Klein — ein umgeschriebener Spaltenname
         wäre ihr damit nie aufgefallen, und genau das soll sie fangen. */
      if(a.w!==b.w && !GROSS_ERLAUBT.has(a.w.toUpperCase()) && !SCHRITT_WORT.has(a.w.toUpperCase()))
        return {text:"", ok:false,
          grund:"„"+a.w+"“ hätte seinen Schriftfall verloren. Namen bleiben, wie sie stehen."};
    } else if(a.w!==b.w)
      return {text:"", ok:false, grund:"Die Rückprobe stolperte bei „"+a.w+"“."};
  }
  return {text, ok:true, zeilen:text.split("\n").length};
}
