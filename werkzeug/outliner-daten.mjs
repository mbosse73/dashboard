/* Die Beispielgliederung und die Zeitrechnung des Outliner-Entwurfs.

   Eigene Datei, weil zwei Erzeuger dasselbe brauchen: bau-outliner.mjs
   fuer den HTML-Entwurf und bau-pdf.mjs fuer die PDF-Ausgabe. Zweimal
   dieselbe Liste zu pflegen ist genau der Fehler, der als Punkt 9 im
   Fehlerbuch steht. */

/* Der Entwurf steht auf einem festen Tag, damit die Ausgabe sich nicht
   jeden Morgen aendert. */
export const HEUTE="2026-08-07";

export const tag=s=>new Date(s+"T00:00:00");
export const diff=(a,b)=>Math.round((tag(b)-tag(a))/86400000);
export const MON=["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
export const kurz=s=>tag(s).getDate()+". "+MON[tag(s).getMonth()];

/* Flache Liste mit `e` als Ebene — dieselbe Form, die auch das Modul
   traegt. `frist`/`von`/`bis` sind die eigenen Datumsangaben des
   Outliners; sie gehoeren nicht zum Planner und nicht zum Kalender. */
export const BAUM=[
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

/* ---------- Eine grosse Gliederung ----------
   Acht Zeilen und fuenf Wochen sind der freundliche Fall. Zum Pruefen
   der PDF-Ausgabe braucht es einen Bestand, der auf ein A4-Blatt nicht
   mehr passt: hier 43 Zeilen ueber ein halbes Jahr. Fest gerechnet,
   nicht zufaellig — sonst saehe jede Ausgabe anders aus. */
export const GROSS=(()=>{
  const L=[{e:0,t:"Produktentwicklung 2026 / 27"}];
  const start=tag("2026-08-10");
  const nachN=n=>new Date(start.getTime()+n*86400000).toISOString().slice(0,10);
  const bereiche=[
    ["Marktlage und Wettbewerb",  ["Anbieter erfassen","Preise vergleichen","Lücken benennen","Bericht schreiben"]],
    ["Positionierung",            ["Merkmale schärfen","Zielgruppen trennen","Botschaft festlegen"]],
    ["Preismodell",               ["Staffeln entwerfen","Rabattlogik prüfen","Mit Vertrieb abstimmen","Freigabe einholen"]],
    ["Technik",                   ["Einzeldatei absichern","Offlinebetrieb prüfen","Datenformat festschreiben","Sicherung testen","Lasttest fahren"]],
    ["Einführung",                ["Schulungsunterlagen","Pilotgruppe begleiten","Rückmeldungen sammeln","Breite Einführung"]],
    ["Betrieb",                   ["Fehlerbuch führen","Vierteljahresbericht","Nachschulung"]]
  ];
  let t=0;
  bereiche.forEach(([b,kinder])=>{
    L.push({e:1,t:b});
    kinder.forEach(k=>{
      const d=t*9;
      L.push(t%3===2
        ? {e:2,t:k,frist:nachN(d+7)}
        : {e:2,t:k,von:nachN(d),bis:nachN(d+11),
           fortschritt: t<4 ? [100,70,40,15][t] : undefined});
      t++;
    });
  });
  return L;
})();

/* Wieviele Knoten haengen unter dem an Stelle `i`? Nimmt die Liste
   mit, weil es zwei gibt — die kleine und die grosse. */
export const kinderVon = (L,i) => {
  let n=0;
  for(let j=i+1;j<L.length && L[j].e>L[i].e;j++) n++;
  return n;
};
export const spaet = k => (k.frist||k.bis) && (k.frist||k.bis) < HEUTE && !k.fertig;

/* Die Farbtoken des Dashboards, als Dreier fuer die PDF-Ausgabe.
   Dieselben Werte wie in :root — nur eine andere Schreibweise. */
export const FARBE={
  paper:[0.969,0.961,0.941], sheet:[1,0.996,0.984], raise:[0.937,0.925,0.894],
  rule:[0.886,0.871,0.831],  rule2:[0.796,0.776,0.729],
  ink:[0.102,0.102,0.094],   ink2:[0.329,0.318,0.294], ink3:[0.420,0.404,0.369],
  tinte:[0.184,0.227,0.549], tinteS:[0.906,0.918,0.965],
  signal:[0.659,0.196,0.122],signalS:[0.984,0.914,0.898],
  gut:[0.169,0.420,0.275]
};
