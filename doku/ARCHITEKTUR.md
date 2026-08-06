# Architektur

## Aufbau der Datei

`dashboard.html` ist in nummerierte Abschnitte geteilt. Die Reihenfolge ist
bindend, weil spätere Abschnitte auf frühere zugreifen.

| Nr | Abschnitt | Inhalt |
|----|-----------|--------|
| 1  | Grundlagen | Helfer, Datumsrechnung, Werktage, `store` |
| 2  | Daten | `vorgabe()`, `Z`, Kurznamen, `bewahre()` |
| 3  | Modulregister | `registriere()`, `treff()` |
| 4  | Module | je ein Block zwischen Markern |
| 5  | Deutung | `deuten()` — Freitext zu Datum, Zeit, Person, Kategorie |
| 6  | Leiste | Ruhezustand und Trefferliste |
| 7  | Planner | Zwei Werktage, Stundenraster, Ziehen |
| 8  | Schalter | `zeigeFlaeche()`, `male()` |
| 9  | Sichern, Laden, Export | JSON und Markdown |
| 10 | Tastatur | globale Kürzel |
| 11 | Uhr und Start | Taktgeber, erster Aufbau |

---

## Der Modulvertrag

Ein Modul ist ein Objekt. Es meldet sich selbst an; niemand kennt es beim
Namen. Alle Felder außer `id` und `nm` sind freiwillig.

```js
/* ===== MODUL beispiel ===== */
registriere({
  id:"beispiel",        // eindeutig, klein geschrieben
  nr:"17",              // Nummer aus der SPEC, für die Sortierung
  nm:"Beispiel",        // Anzeigename
  versteckt:false,      // true = taucht nicht in der Modulliste auf

  // Solange das Modul nur ansehen kann: ein Satz, was noch nicht trägt.
  // male() setzt daraus ein Band über die Fläche, die Modulliste auf der
  // Leiste eine Marke. Ein Gerüst mit Demodaten und Knöpfen sieht sonst
  // fertig aus — siehe Fehlerbuch Punkt 9. Fehlt der Schlüssel, gilt das
  // Modul als fertig; die drei Zahlen im README zählt pruefen.mjs daraus.
  geruest:"Die Liste steht. Anlegen und Bearbeiten fehlen noch.",

  zahl(){ return Z.beispiel.length; },

  // Treffer für die Leiste. q ist kleingeschrieben, roh im Original.
  suche(q, roh){
    return Z.beispiel
      .filter(x => x.titel.toLowerCase().includes(q))
      .map(x => treff("Beispiel", x.titel, "Zusatzinfo", "↵",
        () => zeigeFlaeche("beispiel")));
  },

  // Angebot, wenn der Text nichts trifft. d kommt aus deuten().
  erfassen(d){
    return [treff("Beispiel", d.titel, "als Beispiel anlegen", "↵",
      () => { Z.beispiel.push({id:neueId("b"), titel:d.titel});
              bewahre(); melde("Angelegt"); })];
  },

  // Eigene Oberfläche. b ist ein leerer Container.
  flaeche(b){
    b.appendChild(abschnitt("Beispiele", Z.beispiel.length+" Stück"));
    Z.beispiel.forEach(x => b.appendChild(zeile(x, {rechts: frist(x)})));
  }
});
/* ===== ENDE beispiel ===== */
```

### Ein neues Modul anlegen — die vier Schritte

1. Datenbereich in `vorgabe()` ergänzen: `beispiel: []`
2. In der Liste in Abschnitt 9 (`ladenBtn.onchange`) den Schlüssel
   `"beispiel"` eintragen, damit er beim Laden ersetzt wird
3. Den Modulblock samt Markern in Abschnitt 4 einfügen — solange er nur
   ansehen kann, mit `geruest`
4. Trägt das Modul später Anlegen und Bearbeiten, `geruest` entfernen und
   die Zahlen im README nachziehen (`node werkzeug/pruefen.mjs` prüft sie)
5. Fertig. An Leiste, Planner, Kopfzeile und Navigation ändert sich nichts

Vergisst du Schritt 1 oder 2, funktioniert das Modul — aber seine Daten
werden nicht gesichert. Das ist der häufigste Fehler.

### Verfügbare Bausteine

| Funktion | Zweck |
|----------|-------|
| `treff(art, titel, meta, taste, fn)` | Trefferobjekt für die Leiste |
| `abschnitt(titel, rechts, klasse)` | Überschrift mit Zähler |
| `zeile(x, opt)` | Standardzeile, `opt.hakbar:false` für nicht abhakbare |
| `frist(x)` | Fälligkeit als Text: „morgen", „Dienstag", „überfällig" |
| `melde(text)` | kurze Rückmeldung unten |
| `zeigeFlaeche(id)` | Fläche wechseln, `"leiste"` oder `"planner"` oder Modul-ID |
| `neueId(praefix)` | eindeutige Kennung |
| `bewahre()` | Zustand sichern |
| `ersetze(ziel, neu)` | Arrayinhalt tauschen, ohne den Verweis zu zerreißen |

---

## Datenmodell

```js
Z = {
  format: 1,
  kontakte:  [{id, nach, vor, firma, tel, mail, fav, notiz}],
  termine:   [{id, d, zeit, dauer, titel, anm, kontakt}],
  aufgaben:  [{id, kat, titel, d, zeit, notiz, kontakt, fertig}],
  notizen:   [{id, art, titel, d, zeit, kontakt, wer, text}],
  workflows: [{id, vorlage, titel, aktiv, werte, schritte}],
  bausteine: [{id, grp, titel, text}],
  apps:      [{id, titel, url}],
  marken:    [{t, u, g}],
  pins:      ["url", ...],
  baum:      [{ebene, t}],
  schmierzettel: ""            /* ein einzelner Text, kein Array */
}
```

**Feldbedeutungen**

* `d` — Datum als `"JJJJ-MM-TT"` oder `null` (ohne Frist)
* `zeit` — `"HH:MM"` oder `null`
* `kat` — `"todo"` oder `"nach"`
* `kontakt` — ID aus `kontakte` oder `null`
* `aktiv` — **Schlüssel** des laufenden Teilschritts, nicht seine Position
* `art` bei Notizen — `"telefon"` oder `"allgemein"`
* `wer` bei Notizen — frei eingetragener Anrufer, wenn er nicht in der
  Kontaktliste steht. Ist `kontakt` gesetzt, bleibt `wer` leer

**Einzelwerte im Ladevorgang.** `schmierzettel` ist ein Text und kein
Array. Der Ladevorgang in Abschnitt 9 hat deshalb eine **zweite Liste**
für Einzelwerte — die erste prüft `Array.isArray` und hätte ihn still
übersprungen. `werkzeug/pruefen.mjs` erfasst seit Schritt 5 jeden
Schlüssel der obersten Ebene, nicht mehr nur die Arrays.

**Termine haben kein `fertig`.** Ein vergangener Termin ist vorbei, nicht
abgearbeitet. Er erscheint unter „Überfällig" und bietet dort zwei Wege
heraus: auf heute holen oder löschen. Ein drittes Feld dafür wäre eine
Zustandsangabe, die niemand pflegt.

Kontakte sind das Rückgrat: Notizen, Aufgaben, Termine und Workflows
verweisen darauf. Beim Löschen eines Kontakts müssen die Verweise auf
`null` gesetzt werden, sonst zeigen Zeilen ins Leere.

---

## Workflows: Vorlage und Instanz

Ein **Workflow** ist eine Schablone. Er legt fest, welche Teilschritte es
gibt, in welcher Reihenfolge sie stehen und welche Eigenschaften auf
welcher Ebene erfasst werden. Er enthält keine Werte.

Eine **Instanz** ist ein einzelner Durchlauf. Sie hat dieselben
Teilschritte und dieselben Eigenschaften wie jede andere Instanz derselben
Vorlage — nur die Werte unterscheiden sich.

Vorlagen stehen **fest im Code** in `VORLAGEN`. Ein Editor dafür ist
bewusst nicht vorgesehen.

```js
VORLAGEN = [{
  id:"vertrag", nm:"Vertragsabschluss",
  eigenschaften:[                                  // gelten je Instanz
    {schl:"kontakt", nm:"Ansprechpartner", art:"kontakt"}
  ],
  schritte:[                                       // feste Reihenfolge
    {schl:"angebot", nm:"Angebot erstellt", eigenschaften:[
      {schl:"nummer", nm:"Angebotsnummer", art:"text"},
      {schl:"betrag", nm:"Betrag",         art:"zahl"}

Ein Feld kennt außer `schl`, `nm`, `art` und `optionen` vier Zusätze:

| Schlüssel | Wirkung |
|---|---|
| `breit` | Feld über beide Spalten. Darf eine Funktion `(werte)=>bool` sein — die Notiz braucht das, damit das Datum die frei werdende Hälfte einnimmt |
| `sub` | Erklärung **unter** dem Feld. Nie im Label: dort schöbe sie das Feld nach unten und die Zeile säße schief (Fehlerbuch Punkt 14) |
| `einheit` | steht im Feld, rechts. Ein Label benennt („Dauer“), es erklärt nicht („Dauer in Minuten“) |
| `nurWenn` | `(werte)=>bool`. Ist es falsch, wird das Feld nicht gezeichnet **und beim Speichern geleert** — sonst bliebe ein Wert da, den niemand sieht. Das Feld, von dem es abhängt, trägt `schaltet:true` |

Die Anordnung folgt in allen Dialogen **Was → Wann → Wer → Dazu**. Datum
und Uhrzeit stehen nebeneinander, mehrzeilige Felder zuletzt und breit,
Schalter darunter. Bleibt ein Feld allein in einer Zeile, bekommt es
`breit` — eine halbe leere Zeile liest sich als Fehler.
    ]}
  ]
}]

Z.workflows = [{
  id:"i1", vorlage:"vertrag",
  titel:"Vertrag Meinhardt IT",       // eingebaut, nicht aus der Vorlage
  aktiv:"angebot",                    // Schlüssel des aktiven Teilschritts
  werte:{kontakt:"k6"},               // Werte der Instanzeigenschaften
  schritte:{
    angebot:{ frist:"2026-08-05",     // eingebaut, nicht aus der Vorlage
              werte:{nummer:"A-2026-114", betrag:24000} }
  }
}]
```

### Zwei eingebaute Felder

| Ebene | Feld | warum eingebaut |
|-------|------|-----------------|
| Instanz | `titel` | sonst in Listen und Suche nicht auffindbar |
| Teilschritt | `frist` | sonst wüsste niemand, was überfällig ist |

Alle übrigen Felder kommen aus der Vorlage.

### Der Stand wird berechnet, nicht gespeichert

Es gibt **genau einen aktiven Teilschritt**. Alles davor gilt als erledigt,
alles danach als offen. Gespeichert wird nur `aktiv`.

```js
wfSchritte(w)   // Teilschritte der Vorlage
wfIndex(w)      // Position des aktiven Schritts, -1 wenn abgeschlossen
wfAktiv(w)      // der aktive Teilschritt aus der Vorlage
wfFrist(w)      // Frist des aktiven Schritts
wfSpaet(w)      // Frist des aktiven Schritts liegt in der Vergangenheit
wfFertig(w)     // aktiv zeigt ins Leere = Ablauf durch
wfStand(w)      // "Schritt 3 von 8 · Angebot erstellt"
wfLage(w, schl) // "fertig" | "aktiv" | "spaet" | "offen"
```

**Warum `aktiv` ein Schlüssel ist und keine Zahl:** Eine Position würde
brechen, sobald jemand die Vorlage ändert. Ein neuer Schritt in der Mitte
ließe jede laufende Instanz still auf den falschen Schritt zeigen.
Getestet: Schritt einfügen verschiebt die Position, die Instanz zeigt
weiterhin auf denselben Teilschritt.

**Nur der aktive Schritt zählt für „überfällig".** Eine verstrichene Frist
eines späteren Schritts erscheint nicht in der Leiste. Der Dialog weist
still darauf hin. Das ist so gewollt.

### Ein Zusammenhang, der Arbeit spart

Das Format `{schl, nm, art, optionen}` in den Eigenschaften ist **dasselbe**,
das der Dialog-Baustein aus Schritt 2 der Roadmap verlangt. Ist der Baustein
gebaut, zeigt er Workflow-Eigenschaften ohne Sonderbehandlung an.
Deshalb kommt Schritt 2 vor Schritt 6.

Ein Entwurf des Dialogs liegt unter `referenz/workflow-dialog.html`.

---

## Formate

### Sicherung — JSON

Das gesamte `Z` mit `format: 1`. Beim Laden wird bereichsweise über
`ersetze()` getauscht; fehlende Bereiche bleiben unangetastet. Dadurch
überlebt eine alte Sicherung das Hinzufügen eines Moduls.

Bei einem unverträglichen Modellwechsel `format` auf `2` erhöhen und beim
Laden eine Umwandlung von 1 nach 2 einbauen. Ältere Dateien nie stumm
verwerfen.

### Export — Markdown

Einbahnig. Erzeugt einen lesbaren Tagesplan: die beiden Werktage,
Überfälliges, offene Aufgaben nach Kategorie, Notizen von heute.
**Kein Import.** Der frühere Versuch, Markdown in beide Richtungen zu
nutzen, ist gescheitert — siehe `FEHLERBUCH.md`, Punkt 5.

---

## Freitextdeutung

`deuten(text)` liefert:

```js
{ titel, zeit, tag, datum, person, nach }
```

Erkannt werden:

| Eingabe | Wirkung |
|---------|---------|
| `14:00` oder `9 uhr` | Uhrzeit → wird ein Termin |
| `heute`, `morgen`, `übermorgen`, `mo`…`fr` | Datum, jeweils das nächste Vorkommen |
| `@name` | Person |
| `?` | Kategorie „nachverfolgen" |

Ein Wochentag ohne Uhrzeit ergibt eine **Aufgabe mit Frist**, keinen Termin.
Termine außerhalb der beiden Werktage werden nicht angelegt; der Chip sagt
das an, statt still zu verschieben.

---

## Tastaturbelegung

| Kürzel | Wirkung |
|--------|---------|
| `⌘K` / `Strg+K` | zur Leiste |
| `⌘P` | zum Planner |
| `⌘S` | sichern |
| `⌘1`–`⌘8` | angeheftetes Bookmark öffnen |
| `↑` `↓` `↵` | Treffer wählen und auslösen |
| `Esc` | Eingabe leeren, dann zurück zur Leiste |

**Nicht belegen:** `⌘N`, `⌘T`, `⌘W` — Edge fängt sie ab. Eine Beschriftung,
die etwas verspricht, das nicht passiert, ist schlechter als keine.
