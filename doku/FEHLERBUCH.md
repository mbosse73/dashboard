# Fehlerbuch

Jeder Punkt hier ist tatsächlich passiert und hat Zeit gekostet. Vor der
Fehlersuche zuerst hier nachsehen.

---

## 1 — Schwarze Flächen, die im CSS nicht zu finden sind

**Erscheinung:** Große Bereiche schwarz, Text darauf unlesbar. Die Suche
nach dunklen Farbwerten im Stylesheet findet nichts.

**Zwei verschiedene Ursachen:**

**a) Kein Farbschema deklariert.** Ohne `color-scheme: light` in `:root`
färbt Windows im Dunkelmodus Scrollbalken und Formularfelder selbst ein.

**b) Die Fläche wurde nie bemalt.** Verlässt sich ein Container auf den
Hintergrund von `body` und läuft die Datei in einem eingebetteten
Betrachter, scheint dessen Hintergrund durch. Die Textfarbe bleibt dunkel —
daher unlesbar.

**Erkennungsmerkmal:** Bereiche mit eigenem `background` sind hell, alle
anderen schwarz. Genau dieses Muster war der entscheidende Hinweis.

**Lösung:** `color-scheme: light`, dazu `background` auf jeder
Vollflächen-Komponente, und `html, body { background: … !important }` als
Absicherung.

---

## 2 — Icons, die als schwarze Blöcke rendern

**Erscheinung:** Die Modulleiste zeigt dunkle Quadrate statt Symbolen.

**Ursache:** Verwendet wurden Unicode-Zeichen, die wörtlich so heißen:

* `▦` SQUARE WITH ORTHOGONAL CROSSHATCH FILL
* `▩` SQUARE WITH DIAGONAL CROSSHATCH FILL
* `⚑` BLACK FLAG
* `◕` CIRCLE WITH ALL BUT UPPER LEFT QUADRANT BLACK

Auf 27 Pixeln sind das massive dunkle Flächen. Kein CSS-Audit findet sie,
weil sie **Text** sind, keine Fläche.

**Lösung:** Inline-SVG mit `stroke="currentColor" fill="none"`,
Strichstärke 1,7. Prüfung: kein Zeichen über `U+2000` darf `BLACK`, `FILL`
oder `CROSSHATCH` im Unicode-Namen tragen.

---

## 3 — Einträge werden unsichtbar

**Erscheinung:** Ein nicht abgehakter Termin von gestern ist nirgends mehr
zu sehen. Er steht noch in den Daten, aber keine Ansicht zeigt ihn.

**Ursache:** Der Planner zeigt nur `d === Werktag1 || d === Werktag2`.
Der Vorrat zeigt nur Aufgaben. Die Überfällig-Liste kannte nur Aufgaben
und Workflows. Der Termin fiel durch alle Raster.

**Regel daraus:** Jede Filterbedingung braucht ein Gegenstück. Wer
„zeige nur X" schreibt, muss beantworten, wo alles Nicht-X sichtbar wird.

**Lösung:** Termine mit vergangenem Datum erscheinen unter „Überfällig"
mit einem Knopf „auf heute holen".

---

## 4 — Änderungen verschwinden beim Neuladen

**Erscheinung:** „Schritt abschließen" bei einem Workflow springt weiter,
nach dem Neuladen steht wieder der alte Stand da.

**Ursache:** Die betroffene Sammlung lag als `const` außerhalb des
gesicherten Objekts. Zusätzlich fehlte der Aufruf von `bewahre()`.

**Lösung:** Alles Veränderliche gehört in `Z`. Nach jeder Änderung
`bewahre()`.

**Verwandter Fehler:** Ein `let` neu zuweisen (`PINS = PINS.filter(…)`)
reißt den Verweis auf `Z.pins` ab. Danach wird ins Leere gesichert.
Deshalb `splice`, `push` oder `ersetze()`.

---

## 5 — Markdown als Sicherungsformat

**Erscheinung:** Ein Titel mit Gedankenstrich („Konzept — Teil zwei") wurde
beim Laden zerrissen: Titel abgeschnitten, Rest in der Notiz.

**Ursache:** Die Zerlegung trennte am ersten `—`. Ein selbst geschriebener
Parser hat solche Fehlerklassen.

**Zweiter, schlimmerer Fehler:** Der Export deckte nur Termine und
Aufgaben ab. Notizen lagen in den Daten, wurden aber nie geschrieben. Eine
„Sicherung", die still Daten verliert.

**Lösung:** Sichern über JSON. `stringify` und `parse`, kein eigener Parser,
automatisch vollständig. Markdown nur noch einbahnig zum Lesen.

---

## 6 — CSS-Spezifität bricht das Umschalten

**Erscheinung:** Der Wechsel zwischen zwei Ansichten funktioniert nicht;
beide sind gleichzeitig sichtbar oder gestapelt.

**Ursache:**

```css
#ansicht-a { display: flex; }      /* Spezifität 1-0-0 */
.ansicht.aktiv { display: block; } /* Spezifität 0-2-0 — verliert */
```

**Lösung:** `display` gehört nie in eine ID-Regel. Den Zustand über
`#a.aktiv, #b.aktiv { display: flex }` steuern.

---

## 7 — Sommerzeit verrechnet Wochen

**Erscheinung:** Ein Sprung aus der Suche landete eine Woche daneben —
aber nur bei Datumsspannen über die Zeitumstellung hinweg.

**Ursache:** `Math.floor((montag(a) - montag(b)) / 604800000)`. Über die
Umstellung ist der Quotient 4,994 statt 5. `floor` liefert 4.

**Lösung:** `Math.round`. Allgemein: Datumsdifferenzen in Tagen oder Wochen
immer runden, nie abschneiden.

---

## 8 — Eingefrorene Datumswerte

**Erscheinung:** Eine über Nacht offene Seite plant am nächsten Morgen auf
den falschen Tag.

**Ursache:** `const HEUTE = iso(new Date())` wird einmal beim Laden
berechnet.

**Lösung:** `HEUTE` als `let` führen und im Uhrentakt nachziehen. Innerhalb
von `deuten()` die Werktage frisch über `planTage()` berechnen, nicht aus
gespeicherten Konstanten lesen.

---

## 9 — Tastenkürzel, die nichts tun

**Erscheinung:** Treffer waren mit `⌘N`, `⌘T`, `⌘E`, `⌘C` beschriftet.
Keines davon war belegt, `⌘K` zeigte woandershin.

**Ursache:** Beschriftungen wurden geschrieben, bevor die Behandlung
existierte.

**Regel:** Eine Beschriftung erst setzen, wenn das Kürzel funktioniert.
`⌘N`, `⌘T` und `⌘W` fängt Edge ohnehin ab — nicht verwenden.

---

## 10 — Zu großzügige Textsuche

**Erscheinung:** Die Eingabe `or` löste den Code-Beautifier aus.

**Ursache:** `"json format beautify code".includes(q)` — `or` steckt in
`format`.

**Lösung:** Gegen eine Wortliste prüfen, mit `startsWith` je Wort.

---

## Prüfmuster, die sich bewährt haben

* **Zustandslogik gegen die Uhr testen.** Funktionen wie `frist()` mit
  gefälschtem `Date` über einen ganzen Tag und über alle sieben Wochentage
  laufen lassen.
* **Rundlauf prüfen.** Sichern, laden, Feld für Feld vergleichen. Nicht nur
  die Anzahl.
* **Randfälle mit Sonderzeichen.** Titel mit Gedankenstrich, Klammern und
  Umlauten.
* **Nach einem Umbau die Klassenliste vergleichen.** Wird das Stylesheet
  getauscht, alle Klassennamen aus dem alten gegen das neue prüfen — sonst
  fehlt still eine Regel.
