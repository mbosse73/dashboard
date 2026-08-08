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

## 11 — Ein Klassenname, zwei Bedeutungen

**Erscheinung:** Der Dialog zeigt Eingabefelder in 27 Pixeln ohne Rahmen.
Der Planner zeichnet sein Stundenraster als zweispaltiges Gitter mit
Lücken. Beides bei grünem Prüflauf.

**Ursache:** Der Dialog aus Schritt 1b nannte seine Eingaben `.feld` und
sein Gitter `.raster`. Beide Namen gehörten längst der Leiste und dem
Planner:

```css
.feld{display:flex;flex-direction:column}   /* Dialog, Zeile 177 */
...
.feld{display:flex;align-items:center}      /* Leiste, Zeile 240 */
.feld input{font-size:27px;border:0}        /* gewinnt still */
```

In einer einzigen Datei ohne Geltungsbereiche ist der Name die einzige
Trennung. Bei gleicher Spezifität gewinnt die spätere Regel — lautlos.

**Warum es so lange unentdeckt blieb:** Die Prüfungen waren alle grün,
und die eine Aufnahme, die ich mir angesehen hatte, zeigte die
Löschrückfrage — die hat keine Felder. Der Fehler ging in Schritt 1b
nach `main` und fiel erst in Schritt 2 auf, als jemand hinsah.

**Lösung:** Die neuen Klassen heißen `.dfeld` und `.draster`. Dazu prüft
`werkzeug/pruefen.mjs` jetzt, ob eine Klasse an zwei weit
auseinanderliegenden Stellen beschrieben wird.

**Regel daraus:** Ein Klassenname gehört einem Bereich. Wer einen
allgemeinen Namen wie `feld`, `raster`, `zeile` oder `karte` vergeben
will, sucht ihn vorher im Stylesheet. Und: Zusammengehörige Regeln
bleiben beieinander — schiebt man einen fremden Block dazwischen,
schlägt die Prüfung an.

---

## 12 — Die Sicherungsdatei ist Fremdeingabe

**Erscheinung:** Nach dem Laden einer von Hand bearbeiteten Sicherung
sind Leiste **und** Planner leer. Kein Fehlertext, kein Weg zurück außer
Handarbeit im localStorage.

**Ursache:** Ein Termin ohne `zeit`. `toMin` machte daraus
`undefined.split(":")` und riss die ganze Zeichnung ab — beide
Oberflächen lesen Termine, also fielen beide gleichzeitig aus.

```js
const toMin = t => { const [h,m]=t.split(":").map(Number); return h*60+m; };
```

Alle anderen Verstümmelungen überlebten: Kontakt ohne Namensfelder,
ungültiges Datum, Notiz ohne Felder, Workflow mit unbekannter Vorlage.
Für die gab es schon Absicherungen — für diese eine nicht.

**Lösung:** Zwei Ebenen. `toMin` verträgt jetzt einen fehlenden Wert, und
`heile(Z)` zieht Termine einmal gerade — beim Start aus localStorage und
beim Laden einer Datei. Nicht an jeder Lesestelle einzeln.

**Regel daraus:** Was von der Platte kommt, ist Fremdeingabe, auch wenn
das Programm es selbst geschrieben hat. Zwischen Einlesen und Zeichnen
gehört eine Stelle, die geradezieht — und ein fehlendes Feld darf nie
mehr als seinen eigenen Eintrag kosten.

---

## 13 — Eine Ersetzung, die nichts trifft

**Erscheinung:** Im README stand nach Schritt 2 unverändert „zehn Fehler"
und „neun Module als Gerüst", obwohl im Schrittbericht „README
nachgezogen" abgehakt war.

**Ursache:** Die Änderung lief über ein `replace()` ohne Prüfung. Der
Weißraum passte nicht, die Ersetzung fand nichts, tat nichts und meldete
nichts. Abgehakt wurde trotzdem.

**Lösung:** Zwei Dinge. Jede maschinelle Ersetzung prüft vorher, dass sie
genau einmal zutrifft, und bricht sonst ab. Und `pruefen.mjs` zählt die
drei Zahlen im README selbst nach — Fehlerbucheinträge, angemeldete
Module, Gerüste.

**Regel daraus:** Eine Änderung gilt erst als geschehen, wenn etwas
anderes als der Ausführende sie bestätigt. „Abgehakt" ist kein Beleg.
Was sich nachzählen lässt, wird nachgezählt statt beschrieben.

---

## 14 — Der Dialog sitzt schief

**Erscheinung:** Auf dem iPad stehen die Eingabefelder eines Dialogs nicht
auf einer Linie. Das Feld links beginnt tiefer als das rechts daneben, und
Datums- und Zeitfelder ragen gut dreißig Pixel über ihre Spalte hinaus.
Ihr Wert steht mittig, während jedes andere Feld links ausrichtet.

**Zwei Ursachen, die nichts miteinander zu tun haben:**

Erstens stand der erklärende Hinweis **im** Label, zwischen Beschriftung
und Feld. Zwei Zeilen Label schieben die Eingabe nach unten — das Feld
daneben, das keinen Hinweis hat, beginnt höher. Die Zeile sitzt schief.

Zweitens gibt WebKit `input[type=date]` und `input[type=time]` eine
eigene Mindestbreite und zentriert ihren Wert. Beides schlägt `width:100%`.
In Chromium fällt das nicht auf, in Safari läuft das Feld aus der Spalte.

**Lösung:** Der Hinweis steht jetzt unter dem Feld, wo er sich nur auf die
Gesamthöhe auswirkt, und hängt über `aria-describedby` am Feld statt im
Label. Dazu `min-width:0`, `appearance:none` und
`::-webkit-date-and-time-value{text-align:left}`.

**Regel daraus:** Was zwischen Beschriftung und Feld steht, verschiebt das
Feld. Erklärungen gehören darunter. Und: Ein Formular sieht in jeder
Maschine anders aus — Chromium allein beweist nichts über Safari.
Der Befund kam nicht aus einer Prüfung, sondern aus einer Aufnahme vom
iPad. Genau wie Punkt 11.

---

## 15 — `100vh` ist auf dem iPhone zu viel

Im Querformat war auf dem iPhone die obere Leiste nicht zu sehen.

`100vh` ist auf iOS nicht die sichtbare Höhe, sondern die Höhe, die das
Fenster **ohne** die Safari-Leisten hätte. `.app` war damit höher als das,
was tatsächlich zu sehen ist. Im Hochformat fällt das kaum auf, im
Querformat nehmen die Leisten einen großen Teil der ohnehin geringen Höhe
weg — der Kopf rutschte oben heraus.

Verschärft durch `body{overflow:hidden}`: Ohne diese Zeile ließe sich der
Kopf wenigstens zurückscrollen. So war er unerreichbar.

**Lösung:** `height:100vh` bleibt als Rückfall stehen, darunter
`height:100dvh` — die *dynamische* Sichthöhe, die die Leisten mitrechnet.
Dieselbe Doppelzeile bei `.dlg`, dessen `max-height` am selben Maß hing.

**Regel daraus:** Vollhöhe misst man mit `dvh`, nicht mit `vh`. Und:
Chromium am Rechner zeigt den Unterschied nicht — dort sind beide Werte
gleich. Wie Punkt 11 und 14 kam der Befund von einem echten Gerät.

---

## 16 — `margin:0 auto` schrumpft ein Flex-Element

Der Planner sollte auf 1480 px gedeckelt und zentriert werden:

```css
.planer{max-width:1480px;margin:0 auto}
```

Statt 400/540/540 kamen **400/151/151** heraus — die Tagesspalten fielen
auf Inhaltsbreite zusammen.

`.planer` ist ein Flex-Element in einer Spalte. Quer zur Hauptachse
werden solche Elemente normalerweise gestreckt. **Ein `auto`-Rand quer
zur Hauptachse schaltet das Strecken ab**, und dann gilt wieder
Inhaltsbreite. `max-width` deckelt nur, es setzt keine Breite.

**Lösung:** `width:100%` daneben.

```css
.planer{width:100%;max-width:1480px;margin:0 auto}
```

**Regel daraus:** Zentrieren mit `margin:0 auto` braucht innerhalb eines
Flex-Behälters immer ein `width:100%`. Außerhalb — bei einem Block wie
`.mitte` — nicht, weil ein Block ohnehin die volle Breite nimmt. Deshalb
fällt es lange nicht auf.

---

## Prüfmuster, die sich bewährt haben

* **Zustandslogik gegen die Uhr testen.** Funktionen wie `frist()` mit
  gefälschtem `Date` über einen ganzen Tag und über alle sieben Wochentage
  laufen lassen.
* **Rundlauf prüfen.** Sichern, laden, Feld für Feld vergleichen. Nicht nur
  die Anzahl.
* **Randfälle mit Sonderzeichen.** Titel mit Gedankenstrich, Klammern und
  Umlauten.
* **Höhen bei der Breite messen, die sie später haben.** Beim Entwurf
  der zweispaltigen Leiste standen im Plan 646 px, gemessen wurden 909.
  Die Blockhöhen waren bei 860 px Breite genommen worden — dort passen
  drei Kontaktkacheln nebeneinander und die Modulliste hat vier Spalten.
  In einer 542 px breiten Spalte werden daraus je zwei, und beide Blöcke
  wachsen um mehr als hundert Pixel. Wer eine Fläche schmaler macht,
  misst nicht vorher an der breiten.
* **Nach einem Umbau die Klassenliste vergleichen.** Wird das Stylesheet
  getauscht, alle Klassennamen aus dem alten gegen das neue prüfen — sonst
  fehlt still eine Regel.

---

## 17 — Fokus und Höhe an einem Knoten, der noch nirgends hängt

Ein Modul bekommt von `male()` einen **losgelösten** Knoten. Erst wenn
`flaeche(b)` zurückkehrt, hängt er im Dokument. Wer darin `focus()` ruft
oder `scrollHeight` liest, bekommt nichts: Der Fokus wandert nicht, die
Höhe ist null.

Im Outliner hieß das: Nach jedem Neuzeichnen verlor die Schreibmarke den
Halt. `Tab`, `Alt+Pfeil` und `Strg+Z` taten daraufhin sichtbar nichts —
die Taste ging an `body`. Der Prüflauf war grün, die Bedienung tot.

**Regel:** Alles, was Fokus setzt oder Größen misst, gehört in einen
`queueMicrotask` am Ende von `flaeche()`. Er läuft, sobald `male()`
fertig ist, und prüft vorher `isConnected`.

---

## 18 — Zurücknehmen ging genau einmal

Nach einem `Strg+Z` gab es den markierten Knoten nicht mehr. Die Marke
wurde auf `null` gesetzt, damit kein Verweis ins Leere zeigt — richtig
gedacht, aber damit verließ der Fokus die Fläche, und **jede weitere
Taste ging ins Leere**. Zurücknehmen funktionierte, aber nur ein
einziges Mal, und niemand konnte sagen, warum.

**Regel:** Ein ungültig gewordener Verweis wird nicht gelöscht, sondern
auf etwas Gültiges umgelenkt — hier auf den ersten sichtbaren Knoten.

---

## 19 — Zwei Einheiten in derselben Zeichnung

Die Mindmap zeichnete ihre Verbindungen als SVG und ihre Beschriftungen
als HTML darüber. Die Kästen standen in Prozent, die Zeichenfläche saß
mit `inset` innerhalb der Polsterung. Prozentwerte eines Kindes rechnen
gegen die **Polsterkante** des Elternteils, `inset` nicht — die Linien
lagen um genau den Innenabstand versetzt neben den Kästen.

**Regel:** Wenn zwei Darstellungsarten dieselbe Zeichnung ergeben,
bekommen beide dieselbe Einheit. Hier: echte Pixel für Linien und
Kästen, der Rahmen scrollt, wenn es zu breit wird.

---

## 20 — `split` an einer Trennung, die im Datum vorkommt

`@20.8...31.8.` ist ein Zeitraum: `20.8.` bis `31.8.`, dazwischen `..`
als Trenner. Drei Punkte stehen dort hintereinander. `split("..")`
greift beim **ersten** Paar zu und liefert `20.8` und `.31.8.` — beides
kein Datum mehr, der Zeitraum verschwand stillschweigend.

**Regel:** Ein Trennzeichen, das auch im Wert vorkommen kann, wird nicht
mit `split` gesucht, sondern mit einem **gierigen** Ausdruck:
`/^(.+)\.\.(.+)$/` nimmt links so viel wie möglich und trifft damit
den richtigen Trenner.

---

## 21 — Die gewünschte Größe entschied über den Umbruch

Im PDF sollten Zeilen auf großen Bogen höher werden. Der Umbruch wurde
danach berechnet — mit dem Ergebnis, dass ein A2-Bogen auf zwei Blätter
rutschte, obwohl alle Zeilen darauf gepasst hätten. Die Vergrößerung
stand sich selbst im Weg.

**Regel:** Über den Umbruch entscheidet die **kleinste vertretbare**
Größe. Erst danach wird das Blatt gefüllt.

---

## 22 — Aufräumen mit `replace`, nachdem der Text schon fertig war

Der SQL-Formatierer setzte beim Zusammenbauen zu viele Zwischenräume und
rückte sie hinterher mit `replace(/ +\./g, ".")` gerade. Das griff in
**jede** Stelle des Textes — auch in Zeichenketten. Aus `'a . b'` wäre
still `'a. b'` geworden.

**Regel:** Wer über Zwischenräume entscheidet, tut das an **einer**
Stelle beim Schreiben, nicht hinterher am fertigen Text. Ein
Suchen-und-Ersetzen kennt den Unterschied zwischen Code und Inhalt
nicht.

---

## 23 — Eine Prüfung, die den eigentlichen Fehler nicht sehen konnte

Die Rückprobe des SQL-Formatierers verglich alle Wörter **ohne Rücksicht
auf Groß und Klein** — sie sollte ja gerade zulassen, dass
Schlüsselwörter großgeschrieben werden. Damit hätte sie einen
umgeschriebenen Spaltennamen nie bemerkt, und das ist genau der Fehler,
den sie fangen soll.

**Regel:** Eine Prüfung, die eine Abweichung erlaubt, muss die Erlaubnis
so eng fassen wie möglich. Hier: Der Schriftfall darf sich nur bei den
vierundzwanzig Wörtern unterscheiden, die überhaupt großgeschrieben
werden dürfen.

---

## 24 — Ein Backtick im Kommentar beendet das Template-Literal

Ein CSS-Kommentar innerhalb eines JavaScript-Template-Literals enthielt
`\`min-width:0\`` in Anführung — die Backticks beendeten die
Zeichenkette mitten im Satz. Die Fehlermeldung zeigte auf die Zeile
danach und nannte einen Bezeichner, den es nicht gab.

**Regel:** In Template-Literalen keine Backticks zur Auszeichnung. Dort
gelten die deutschen Anführungszeichen, die im Projekt ohnehin üblich
sind.

---

## 25 — `zoom` bricht die Vollhöhe

Die Schriftgröße ist `zoom` auf `body`. Das vergrößert alles zugleich —
auch die Höhe von `.app`, die auf `100dvh` steht. Bei Faktor 1,15 wurde
die Fläche **1035 px hoch in einem 900-px-Fenster**, und ein senkrechter
Rollbalken erschien. Damit war Fehlerbuch 15 auf dem Rückweg, nur von
der anderen Seite.

**Regel:** Wer `zoom` benutzt, muss jede Länge, die sich auf das
*Fenster* bezieht, durch denselben Faktor teilen:

```css
body[data-schrift="gross"]{--zoom:1.15; zoom:var(--zoom)}
body[data-schrift="gross"] .app{height:calc(100dvh / var(--zoom))}
```

Gemessen bei 1400×900, 1920×1080 und 390×844: Höhe gleich der
Fensterhöhe, kein Rollbalken.

---

## 26 — Über eine Kennung vergleichen, die es noch gar nicht gibt

Die Einstellungen erkennen Beispieldaten daran, dass ihre Kennung so in
`vorgabe()` steht. Bei Bookmarks fand das **null von vierundzwanzig** —
denn dort stehen sie *ohne* Kennung, sie bekommen sie erst in `heile()`.
Die Folge wäre gewesen: Beispiel-Bookmarks bleiben stehen, und ihre
angehefteten Plätze mit ihnen.

**Regel:** Bevor man über ein Feld vergleicht, nachsehen, ob es an
dieser Stelle überhaupt schon existiert. Fehlt es, hilft der Inhalt:
der Eintrag ohne seine Kennung, als Zeichenkette.

---

## 27 — Eine Prüfung, die die falsche Eigenschaft prüft

Der SQL-Formatierer hat eine Rückprobe: Nach dem Formatieren wird die
Ausgabe erneut zerlegt und mit der Eingabe verglichen. Sie meldete
`ok` — und gab trotzdem kaputtes SQL aus:

```
select data->>'x' from t   →   data -> > 'x'
select 1.5e10 as x from t  →   1.5 e10
select a#>>'{b}' from t    →   a #> > '{b}'
select tags @> '{a}'       →   tags @ > '{a}'
select 0x1F from t         →   0 x1F
```

Sechs Fälle, alle mit grünem Haken. Der Grund ist derselbe: Der
Zerleger kannte den Operator nicht und teilte ihn. `->` und `>` sind
**vor und nach** dem Formatieren dieselbe Bestandteilfolge — die
Rückprobe verglich genau diese Folge und konnte den Unterschied
deshalb gar nicht sehen. Der Schaden entsteht im Zwischenraum, und
Zwischenräume hatte sie weggeworfen.

**Regel:** Bei einer Prüfung nicht fragen „läuft sie durch?", sondern
„**welche Eigenschaft** sichert sie zu — und ist das die, die kaputt
gehen kann?". Ein Formatierer setzt Zwischenräume; also muss die Probe
über Zwischenräume wachen.

Geflickt in zwei Lagen. Der Zerleger kennt jetzt dreizeichige
Operatoren, Exponenten und Hexzahlen. Und darunter liegt die
**Klebeprobe**: Zu jedem Bestandteil wird gemerkt, ob im Urtext
unmittelbar davor ein Zwischenraum stand. Rückt der Formatierer zwei
Zeichen auseinander, die aneinanderklebten und zusammen etwas anderes
bedeuten könnten, wird nichts ausgegeben. Damit führt ein unbekannter
Operator zu einem klaren „geht nicht" statt zu stillem Unsinn — das
ist der eigentliche Gewinn, denn die Operatorliste wird nie vollständig
sein.

Ausgenommen sind Klammern, Komma und Strichpunkt: Die trennen sich
immer selbst, `count(*)` darf zu `count( * )` werden.

Das ist Punkt 23 ein zweites Mal, aus derselben Richtung.

---

## 28 — Ein Zustand, der nur den Hinweg kennt

`standZeigen()` blendete den Meldungszettel ein, wenn lange nicht
gesichert wurde. Wieder ausgeblendet wurde er **nirgends** — `hidden`
stand in der ganzen Datei kein zweites Mal.

Sichtbar wurde das so: Das Banner bittet ums Sichern. Man drückt
„Sichern". Das Banner bleibt stehen, mit dem alten Text. Die Anwendung
reagiert nicht auf die Handlung, um die sie gerade gebeten hat.

Der Fehler ist ein Ausrutscher aus dem eigenen Bauprinzip. Jeder
andere Zustand dieser Datei wird bei jedem Malen vollständig neu
hergeleitet; diese eine Stelle setzte nur.

**Regel:** Wer einen Zustand setzt, muss ihn im selben Durchlauf auch
zurücksetzen können. Am einfachsten: am Anfang der Funktion auf den
Grundzustand stellen, dann bei Bedarf ändern.

---

## 29 — Beschriftet für die falsche Tastatur

Die Zielumgebung steht in `CLAUDE.md` in der zweiten Zeile: Windows,
Edge. Trotzdem trug jedes Tastenkürzel in der Oberfläche das
Mac-Zeichen — `⌘1` auf den Plätzen, `⌘P` an „Planner öffnen", die
ganze Tastentabelle in der Hilfe. Zweiunddreißig Stellen.

Der Code war nie falsch: Er hört seit jeher auf
`e.ctrlKey||e.metaKey`. Falsch war allein, was danebenstand. Auf einer
deutschen Windows-Tastatur gibt es keine Taste mit diesem Zeichen, und
ausgerechnet die Hilfe — die einzige Stelle, die die Kürzel *erklärt* —
lehrte damit ein Symbol, das am Zielrechner nicht vorkommt.

**Regel:** Eine Beschriftung gehört zur Zielumgebung, nicht zum
Rechner, auf dem entwickelt wird. Steht die Zielumgebung im
Arbeitsdokument, ist sie beim Beschriften nachzulesen.

Nebenbei aufgefallen: `Strg+1` achtmal nebeneinander auf den Kacheln
war so breit, dass „MDN Web Docs" abschnitt. Das Kürzel steht jetzt
einmal in der Überschrift, die Kachel trägt nur die Ziffer. Der
Vorlesetext nennt es weiterhin je Kachel vollständig.

---

## 30 — Eine Prüfung, die auf etwas zeigt, das es nicht gibt

Beim Einbau der Kontrastprüfung stand als eines der Paare `--gut` auf
`--gut-s`. Sie meldete sofort einen Verstoß: Basecamp mit 2,15 : 1.

Nur gibt es dieses Paar nicht. `--gut-s` steht in drei Themenblöcken
und wird in der ganzen Anwendung **null Mal** benutzt; `--gut` färbt
einen Streifen und einen Stern, nie Text. Die Prüfung hätte den
nächsten Bearbeiter dazu gebracht, eine funktionierende Farbe zu
ändern, um eine Zahl zu bessern, die nichts bedeutet.

**Regel:** Eine Prüfung, die etwas Erfundenes meldet, ist schlimmer als
keine — sie kostet Vertrauen und erzeugt falsche Arbeit. Vor dem
Einbau nachsehen, ob es die geprüfte Stelle wirklich gibt. Die Liste
der Paare steht deshalb von Hand gepflegt und kommentiert in
`werkzeug/pruefen.mjs`.

Dieselbe Prüfung fand im selben Lauf etwas Echtes: `referenz/workflow-dialog.html`
und `browsertest.html` trugen `--ink3` noch mit `#87837c` — dem Wert
mit 3,46 : 1, der in `dashboard.html` längst behoben war. Ein Fix, der
nur an einer von drei Stellen ankam.

