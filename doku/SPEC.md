# Module

Stand der Umsetzung in `dashboard.html`.

| Status | Bedeutung |
|--------|-----------|
| **fertig** | vollständig, einschließlich Anlegen, Ändern und Löschen |
| **Gerüst** | angemeldet, zeigt Daten, aber keine Bearbeitung |
| **offen** | noch nicht vorhanden |

---

## Shell — keine eigenen Module

Diese vier Punkte der ursprünglichen Aufstellung sind in den beiden festen
Oberflächen aufgegangen:

* **Suche**, **Quick Capture** und **Befehlspalette** beschrieben dieselbe
  Handlung — tippen, Treffer, Aktion. Sie sind **eine** Leiste.
* **Übersicht** ist der Ruhezustand ebendieser Leiste.

---

## Breiten — eine Entscheidung, drei Zahlen

Zielumgebung ist ein Bildschirm ab 24 Zoll. Die Anwendung deckelt
trotzdem, weil Text über die volle Breite eines solchen Schirms schlechter
zu lesen ist, nicht besser. Drei Maße, jedes begründet:

| Wo | Breite | warum |
|---|---|---|
| Kopf und Planner | **1480 px** | drei Spalten nebeneinander, davon zwei Stundenraster |
| Modulflächen, `.mitte` | **1180 px** | zwei Stapel nebeneinander, jeder breit genug für zwei Kontaktkacheln |
| Suchergebnis, `.eng` | **860 px** | eine Rangliste, die untereinander gelesen wird |

**Der Kopf** wird nicht über `max-width` gedeckelt, sondern über
`padding-inline: max(22px, calc((100% - 1480px) / 2))`. Die Leiste selbst
läuft weiter über die volle Breite — sie ist der Rahmen der Anwendung —,
nur ihr Inhalt rückt zum übrigen Inhalt.

**Die Leiste ist im Ruhezustand zweispaltig**, ab 1100 px. Links steht,
was zu einer Handlung auffordert: Überfälliges, der nächste Termin, der
Schmierzettel, die Pinnwand. Rechts, wonach man nachschlägt:
Kontaktkacheln und Modulliste. Einspaltig war der Inhalt 1181 px hoch und
passte damit nicht auf einen 24-Zoll-Schirm, der im Rumpf 895 px lässt.

Die Pinnwand stand zuerst rechts — dort trug die Spalte sie nicht: Mit
Favoriten, Pinnwand und Modulliste war sie ab dem **sechsten** belegten
Platz 918 px hoch. Links sind es bei voller Belegung 652 px gegen 561 px
rechts, und nichts scrollt.

**Das Suchergebnis bleibt einspaltig.** Treffer sind nach Rang geordnet,
und `↵` nimmt den obersten; in zwei Spalten stünde der zweitbeste neben
dem besten statt darunter. `suchen()` setzt dafür die Klasse `eng`.

**Erklärender Text bleibt schmal** — `.hinweis` und `.leer` tragen
`max-width:78ch`. 1180 px Fließtext liest niemand.

Was das **nicht** löst: Auf Schirmen über 2560 px wächst der leere Rand
weiter. Eine dritte Spalte wurde geprüft und verworfen — ab 2560 px passt
der Inhalt schon in eine, weil größere Bildschirme auch höher sind. Der
enge Fall ist 24 Zoll mit 1080 Zeilen.

---

## 01 Notizen — fertig

Zwei Arten:

* **Telefonnotiz** — Datum, Uhrzeit und Kontakt werden automatisch gesetzt
* **Allgemeine Notiz** — nur Titel und Text

Bei einer Telefonnotiz stehen Datum und Uhrzeit zusätzlich **im Text**,
damit sie beim Ausleiten als `.md` erhalten bleiben. Beim späteren Ändern
des Datumsfelds wird die Zeile bewusst nicht nachgeschrieben.

Der Anrufer kommt aus der Kontaktliste (`kontakt`) oder wird frei
eingetragen (`wer`). Wird beides gefüllt, gewinnt die Auswahl.

Sortiert nach Datum und Uhrzeit, neueste zuerst. Eigene Suche über Titel,
Text und Anrufer. Die Vorschau steht in der Liste.

**Export und Import als `.md`** je Notiz, mit einem Kopfblock, dessen
Grenze hart gezogen ist. Der Kontaktverweis überlebt den Weg nach draußen
nicht — der Name bleibt als Text.

**Der Schmierzettel** ist eine einzelne Notiz ohne Titel und Datum, zum
schnellen Merken. Er steht groß im Modul und kompakt in der Leiste;
beide schreiben auf dieselbe Stelle.

---

## 02 Kontakte — fertig

Felder: Nachname, Vorname, Firma, Telefon, Mail, Notizen, Favorit.
Pflicht ist nur der Nachname.

Kontakte erscheinen als **Kacheln** in einem Raster, das umbricht statt
waagerecht zu rollen. Favoriten stehen oben — im Modul wie im
Suchergebnis — und zusätzlich im Ruhezustand der Leiste. Der Stern auf
der Kachel setzt und löst den Favoriten.

Jede Kachel bietet „Anrufen" und „Mailen" als echte `tel:`- und
`mailto:`-Verweise. Fehlt ein Weg, bleibt der Knopf blass an seinem
Platz stehen. Beide tragen denselben Farbton: Er sagt „hinterlegt", also
einen Zustand, keine Kategorie.

Eigene Suche im Modul über Name, Firma, Nummer, Mail und Notiz.

Beim Löschen werden alle Verweise auf den Kontakt geleert — in Terminen,
Aufgaben, Notizen und in Workflows auf **beiden** Ebenen. Welche
Schlüssel das sind, ergibt sich aus `VORLAGEN`, aus jeder Eigenschaft mit
`art:"kontakt"`, und steht bewusst nicht fest im Code.

**Wichtig:** Kontakte sind das Rückgrat — Notizen, Aufgaben, Termine und
Workflows verweisen darauf. Beim Löschen müssen diese Verweise auf `null`
gesetzt werden. **Dieses Modul zuerst fertigstellen.**

---

## 03 Suche — in der Leiste aufgegangen, fertig

Ein Feld über alle Daten. Besonderheiten:

* Ein Kontakt liefert **zwei** Treffer: „Anrufen" und „Mailen"
* Favoriten ab dem ersten Buchstaben, übrige Kontakte ab dem dritten
* Apps starten direkt
* Rechnen nebenbei: `17*1,19`
* Was nichts trifft, wird zum Erfassungsangebot

---

## 04 Aufgaben — fertig

Zwei Kategorien: **To-do** (selbst abarbeiten) und **Nachverfolgen**
(liegt bei anderen).

Felder: Titel, Fälligkeit, Uhrzeit, Notiz, Kontakt.
Jedes beliebige Datum erlaubt oder gar keins.

Abgehakte Aufgaben ziehen in einen eigenen Abschnitt „Erledigt" und
lassen sich dort einzeln oder gesammelt löschen. Auf Aufgaben verweist
nichts — Löschen ist hier wirklich nur Löschen.

Überfällige tragen eine rote Kante links und eine rote Fälligkeit rechts.

---

## 05 Textbausteine — Gerüst

Nach Gruppen geordnet. Platzhalter in der Form `{Name}`.

**Fehlt noch:** Eingabemaske für die Platzhalter, Kopieren in die
Zwischenablage, Anlegen und Bearbeiten, Gruppen verwalten.
Variable `{Datum}` soll automatisch das heutige Datum einsetzen.

**Der Weg steht fest:** `browsertest.html` hat am 7. August 2026 bestätigt, dass
`navigator.clipboard.writeText` aus einer lokal geöffneten Datei heraus
funktioniert. Der Notweg über ein verstecktes Textfeld entfällt.

---

## 06 Kalender — fertig

Termine ausschließlich für den aktuellen und den nächsten Werktag.
Felder: Uhrzeit, Dauer, Titel, Anmerkung, Kontakt.

Die Modulfläche zeigt die beiden Werktage nebeneinander. Der Tag ist im
Dialog eine **Auswahl aus genau zweien**, kein freies Datum — ein Termin
kann damit gar nicht erst irgendwo landen, wo ihn niemand sieht.

**Termine haben kein `fertig`.** Ein vergangener Termin erscheint unter
„Überfällig" und bietet dort zwei Wege heraus: auf heute holen oder
löschen.

**Hinweis:** Verschoben wird im Planner. Dort lässt sich jeder Termin
zwischen den beiden Tagen und über die Stunden ziehen.

---

## 07 Planner — fertig

Zwei Werktage im Stundenraster von 7 bis 18 Uhr. Links die nicht
eingeplanten Aufgaben.

**Auf 1480 px gedeckelt und zentriert.** Ohne Deckel nahm der Planner die
volle Fensterbreite: Bei 1920 px waren die Tagesspalten 830 px breit und
ein halbstündiger Termin bekam einen Block von 767 px. Jetzt sind es
540 px je Tag und 477 px je Block.

**Der Aufgabenvorrat wächst mit dem Fenster**, aber nie auf Kosten der
Tage: `clamp(262px, 21vw, 400px)`. Unter rund 1250 px bleibt er bei
seinen 262, und die Tagesspalten sind dort so breit wie zuvor. Ließe man
ihn einfach mitwachsen, nähme er den Tagen bei 1280 px je 70 px weg.

**`min-height:100%` statt `flex:1`.** `.rumpf` ist ein Block, kein
Flex-Behälter — deshalb lief `flex:1` ins Leere und die Höhe kam aus dem
Inhalt: 786 px, gleich wie groß das Fenster war. Bei 1300 px Fensterhöhe
blieben 459 px leer und die Spaltenränder hörten mitten in der Fläche
auf.

* Ziehen aus der Liste auf eine Stunde gibt der Aufgabe eine Uhrzeit
* Ziehen zurück nach links nimmt Tag und Uhrzeit wieder weg
* Überfällige Workflows unten links, rot, ohne Ziehfunktion

---

## 08 Appstarter — fertig

Lokale HTML-Werkzeuge, öffnen in einem neuen Tab. **Starten trägt** —
`appOeffne()` benutzt denselben Weg wie ein Bookmark, nur ohne
`https://` davor, weil `mkUrl()` ein vorhandenes Schema unangetastet
lässt.

**Apps sind anheftbar** und liegen auf denselben Plätzen wie Bookmarks.
Es sind keine Bookmark-Plätze, sondern Plätze; das Zeichen im Platz sagt,
woher der Eintrag kommt.

**Anlegen, Bearbeiten und Löschen** über denselben Dialog-Baustein wie
Kontakte und Bookmarks. Vier Felder: Titel, Pfad, Wozu, Anheften.
Titel und Pfad sind Pflicht.

**Keine Gruppen.** Bookmarks haben sie, Apps nicht: Eine Handvoll lokaler
Werkzeuge braucht keine Ordnung in Ordnern, und was oft gebraucht wird,
liegt ohnehin auf einem Platz.

**Löschen räumt den Platz mit ab.** Die Rückfrage sagt vorher, welcher
Platz frei wird und dass die Datei selbst bleibt, wo sie ist — gelöscht
wird nur der Eintrag.

**In der Leiste** erscheint das Angebot „als neue App anlegen" nur, wenn
das Getippte nach einem Pfad aussieht: `file:`, ein Laufwerksbuchstabe,
zwei Rückstriche oder ein führender Schrägstrich. Sonst stünde bei jedem
getippten Wort ein App-Vorschlag zwischen den übrigen.

**Der Weg steht fest:** `browsertest.html` hat am 7. August 2026 bestätigt, dass
Edge eine andere lokale Datei öffnet. `window.open` genügt; der
anklickbare Verweis als Notweg entfällt.

---

## 09 Bookmarks — fertig

Nach Gruppen geordnet. Acht anheftbare Plätze auf `⌘1` bis `⌘8`, sichtbar
im Ruhezustand der Leiste. Ein Klick auf den Titel öffnet in einem neuen
Tab, `⌘1` bis `⌘8` und die Kacheln der Leiste ebenso.

**Die Fläche ist auf Dichte gebaut.** Der Gruppenname steht links als
Randbeschriftung, die Bookmarks daneben als Chips. 24 Bookmarks brauchten
als Zeilen rund 1800 Pixel, jetzt sind es **315** — bei 808 Pixeln, der
Breite, die `.mitte{max-width:860px}` der Fläche wirklich lässt. Ein
größerer Bildschirm ändert daran nichts; der Rest bleibt Rand.

Gegen ein Kartenraster entschieden: Karten brauchen vier Spalten, um dicht
zu sein, und bekommen bei 808 Pixeln drei. Chips brechen dagegen um — eine
Gruppe mit zwanzig Einträgen sprengt nichts, sondern wird zwei Zeilen hoch.

**Darüber „Häufig benutzt":** die zwölf Plätze. Auf der Verwaltungsfläche
werden auch die freien gestrichelt gezeigt — man soll sehen, wie viele
noch zu vergeben sind. In der Leiste steht dafür nur ein Feld mit der
Restzahl; zwölf leere Kästen wären dort Unruhe.

Es sind **nicht nur Bookmarks**: Was ein anderes Modul angeheftet hat,
steht hier mit seinem eigenen Zeichen.

**Zwei Zustände statt eingeblendeter Knöpfe.** Im Ruhezustand öffnet ein
Klick, mehr nicht. `ordnen ›` schaltet um: Dann trägt jeder Chip Nadel und
Stift, jede Gruppe ihr „umbenennen", jede Zeile ein „+ neues Bookmark" mit
schon gesetzter Gruppe. Knöpfe beim Überfahren einzublenden wäre
naheliegend und auf dem iPad unbrauchbar — dort gibt es kein Überfahren,
derselbe Fehler wie beim Ziehen im Planner. Der Zustand liegt in
`mkOrdnen`, bewusst außerhalb von `Z`: Er beschreibt die Ansicht, nicht
die Daten, und wird deshalb nicht gesichert.

**Adressen stehen so da, wie man sie liest** — `github.com`, ohne Schema.
Beim Öffnen setzt `mkUrl()` `https://` davor. Wer selbst ein Schema angibt
(`mailto:`, `file:`), bekommt es unverändert zurück. Der Verweis trägt
`target="_blank"` und zwingend `rel="noopener noreferrer"`.

**Jedes Bookmark hat eine `id`.** Anfangs wurden sie über ihre Adresse
erkannt, und `pins` merkte sich ebenfalls die Adresse — sobald sich eine
Adresse bearbeiten lässt, risse damit die Anheftung ab. `heile()` zieht
das beim Start und beim Laden einer älteren Sicherung einmal nach: fehlende
`id` vergeben, `pins` von Adressen auf `id` umstellen, ins Leere zeigende
Plätze streichen. Ein leerer Platz in der Mitte verschöbe sonst alle
Tastenkürzel dahinter.

**Eine Gruppe ist kein eigener Datensatz**, sondern das Feld `g` an den
Bookmarks. Sie entsteht mit dem ersten Eintrag darin und verschwindet mit
dem letzten. Umbenennen ändert `g` an allen Einträgen der Gruppe; trägt man
den Namen einer vorhandenen Gruppe ein, werden beide zu einer — das ist der
Weg, Gruppen zusammenzulegen. Ein Löschen der Gruppe gibt es folgerichtig
nicht; es wäre ein Löschen ihrer Bookmarks unter falschem Namen.

Im Dialog stehen Titel und Gruppe nebeneinander, die Adresse breit
darunter. Das Feld für eine neue Gruppe hängt über `nurWenn` an der
Auswahl und steht direkt bei ihr — näher an seinem Auslöser als an der
Reihenfolge Was → Wann → Wer.

Die Leiste bietet ein Bookmark beim Erfassen nur an, wenn die Eingabe
wirklich nach einer Adresse aussieht: ein Punkt, kein Leerzeichen, eine
Endung aus Buchstaben. Sonst käme das Angebot bei jedem Satz mit Punkt.

---

## Die Plätze — „Häufig benutzt"

Eine Pinnwand mit **zwölf Plätzen**, von Hand belegt. Sie wächst nicht mit
der Sammlung: Ob zwanzig Bookmarks oder zweihundert, die Leiste bleibt
gleich hoch. Das ist der Zweck — der Aktenschrank darf beliebig groß sein,
auf die Pinnwand kommt, was man täglich braucht.

`⌘1` bis `⌘8` liegen auf den ersten acht. Mehr freie Tastenkombinationen
gibt es nicht; ein Kürzel ist eine Zugabe, keine Bedingung.

**Ein Platz merkt sich, woher sein Eintrag stammt:**

```js
Z.pins = [ {m:"marken", id:"m-1"}, {m:"apps", id:"p1"}, … ]
```

Welches Modul etwas anbietet, sagt `heftbar` im Register — **die Leiste
kennt kein Modul beim Namen.** Ein weiteres anheftbares Modul kostet dort
deshalb keine Zeile. Der Vertrag steht in `ARCHITEKTUR.md`.

**Zwei Migrationen in `heile()`, deren Reihenfolge zwingend ist.** Ganz
alte Sicherungen enthalten Adressen, ältere blanke Kennungen, neue
Objekte. Erst Adresse → Kennung, dann Kennung → Objekt; umgekehrt liefe
die zweite ins Leere. Und Stufe 1 muss fertige Objekte durchlassen, sonst
frisst sie jeden Platz aus einer neueren Sicherung — das ist beim
Durchspielen aufgefallen, nicht im Betrieb.

**Plätze, die ins Leere zeigen**, räumt `heftAufraeumen()` ab: nach allen
Modulanmeldungen und nach jedem Laden einer Datei. In `heile()` ginge das
nicht — dort ist das Register noch leer.

**Warum Kontakte nicht anheftbar sind:** Ein Platz hat eine Handlung, eine
Kontaktkachel hat zwei — anrufen und mailen. Der Stern bleibt etwas
anderes als die Pinnwand.

**In der Leiste steht die Pinnwand links**, unter dem Schmierzettel.
Rechts trug die Spalte sie nicht: Mit Favoriten, Pinnwand und Modulliste
war sie ab dem sechsten belegten Platz 918 px hoch, bei 895 px sichtbarer
Höhe. Links passt sie bis zum zwölften.

---

## 10 Hilfe — fertig

Zwei Flächen: die **Hilfe** als Modulfläche und die **Schnellhilfe** als
schwebendes Fenster. `F1` öffnet die Schnellhilfe, `⇧F1` die Hilfe. Beide
Kürzel sind am Zielrechner noch nicht bestätigt; die Liste schreibt das
dazu.

**Die Suche der Hilfe ist von der Leiste getrennt — konstruktiv.** Das
Modul meldet **kein `suche`** an und kann in der Leiste deshalb gar nicht
auftauchen. Sein Feld hat einen eigenen Zustand `hiSuche`, außerhalb von
`Z`. Wer Daten sucht, nimmt die Leiste; wer die Hilfe durchsucht, bleibt
in der Hilfe.

**Sechs Abschnitte, links ein Index.** Zwei Oberflächen, Eingabemuster,
Tastenkürzel, Module, Sichern und Laden, Themen. Die Suche filtert die
Abschnitte, der Index zeigt dann nur die passenden.

### Woher der Inhalt kommt

| Was | Herkunft | bei etwas Neuem |
|---|---|---|
| Module, Nummer, Anzahl, Gerüst-Marke, Beiträge | Register | erscheint von selbst |
| Erklärtext je Modul | `hilfe` im Modulblock | vom Prüflauf erzwungen |
| Tastenkürzel | `TASTEN` | erscheint von selbst |
| Eingabemuster | `MUSTER` | erscheint von selbst |
| Oberflächen, Sichern, Themen | von Hand | selten, siehe unten |

**`TASTEN` schaltet und beschreibt.** Die Tastatur liest dieselbe Tabelle
wie die Schnellhilfe. Ein Kürzel kann deshalb nicht in der Liste stehen,
ohne zu wirken. Die ortsabhängigen Tasten — Escape, die Pfeile — tragen
kein `tun` und bleiben Sonderfälle; sie stehen trotzdem in der Tabelle,
weil die Hilfe sie nennen muss.

**`MUSTER` deutet und beschreibt.** `deuten()` liest seine Regeln von dort.

**Von Hand bleiben nur drei Dinge:** Leiste und Planner, Sichern und
Laden, die Themen. Die beiden Oberflächen können nicht wachsen —
`CLAUDE.md` lässt genau zwei zu.

### Der Prüflauf verlangt Hilfetexte

Jedes Modul mit `flaeche` braucht `hilfe`. Dazu drei Regeln an den Stil:
höchstens 20 Wörter je Satz, höchstens ein Komma je Satz, mindestens 40
Zeichen. Sie prüfen die Form, nicht den Inhalt — aber ein Satz mit
dreiunddreißig Wörtern ist sicher nicht verständlich.

**Bewusst nicht dabei:** keine Suche über Anwendungsdaten, keine Bilder,
kein Hilfetext je Dialogfeld. Erklärungen zu Feldern stehen dort schon
unter dem Feld.

---

## 11 Quick Capture — in der Leiste aufgegangen, fertig

Was nichts trifft, wird zum Angebot: Aufgabe, Notiz, Termin, Kontakt oder
Kopieren. Die Chips zeigen die Deutung vor dem Anlegen.

---

## 12 Befehlspalette — in der Leiste aufgegangen, fertig

---

## 13 Workflows — Gerüst

Ein Workflow ist eine **Vorlage**: feste Teilschritte in fester Reihenfolge,
dazu Eigenschaften auf Instanz- und auf Schrittebene. Je Teilschritt können
es andere Eigenschaften sein.

Eine **Instanz** ist ein Durchlauf mit eigenen Werten. Gleiche Schritte,
gleiche Eigenschaften, andere Werte.

Eingebaut und nicht abwählbar: der Titel der Instanz, die Frist je
Teilschritt.

Genau ein Teilschritt ist aktiv. Alles davor gilt als erledigt, alles
danach als offen — das ergibt sich aus der Position, es gibt kein
Statusfeld. Überfällig heißt: Die Frist des **aktiven** Schritts liegt in
der Vergangenheit.

Vorlagen stehen fest im Code. Wir starten mit einer:
**Vertragsabschluss**, acht Teilschritte.

**Fehlt noch:** Instanzen anlegen, Teilschritte einzeln bearbeiten,
Dialog einbauen (Entwurf liegt unter `referenz/workflow-dialog.html`).

**Hängt ab von** Schritt 2 der Roadmap — der Dialog-Baustein verwendet
dasselbe Eigenschaftsformat.

---

## 14 Jahreskalender — fertig

Ein **eigener Bestand**, `Z.jahrestermine`, vom Kalender (06) und vom
Planner vollständig getrennt. Was hier steht, erscheint dort nicht — und
umgekehrt. Das ist ausdrücklich so gewollt und keine Lücke.

Ein Eintrag: `{id, von, bis, titel, kat}`. Keine Uhrzeit, kein Kontakt.
`kat` ist `urlaub` oder `sonst`, mehr gibt es nicht.

**Die Fläche ist ein schwebendes Fenster**, kein Rumpfbereich: alle 365
Tage als 12 × 31 Raster. Ein Klick auf einen leeren Tag legt an, auf
einen belegten öffnet den vorhandenen Eintrag. Der Mauszeiger auf einem
belegten Tag zeigt die Details.

**Der Eintrag wird im Fenster bearbeitet, nicht in einem Dialog
darüber.** `dialog()` beginnt mit `dialogZu()` und schlösse das Fenster,
sobald man einen Tag anklickt — nach dem Speichern stünde man wieder vor
der Leiste. Das Fenster trägt sich aber selbst in `dlgOffen` ein, damit
Escape und der Klick daneben ohne zweite Mechanik greifen.

**Farbe:** die einzige Stelle im Programm, an der Farbe eine Kategorie
codiert statt Dringlichkeit. Die Ausnahme steht in `CLAUDE.md`. Die
zweite Farbe liegt deckend über der ersten, damit beide Kategorien
denselben Tag tragen können, ohne dass eine Spanne aufreißt.

**Das Jahr ist umschaltbar.** Ohne das wäre ein Eintrag im Folgejahr
nirgends zu sehen. Aus demselben Grund führt die Modulfläche zusätzlich
eine Liste aller Einträge: Ist das Fenster zu, sind sie sonst weg.

---

## 15 Outliner — fertig

Gliederung mit Ebenen, dazu Gantt und Mindmap als zwei weitere Lesarten
derselben Knoten. Angelegt als Beleg, dass sich neue Module ohne
Änderung an Leiste und Planner anmelden lassen.

**Das Datenmodell ist flach.** `e` ist die Ebene, ein Teilbaum ist ein
zusammenhängender Abschnitt der Liste. Ein- und Ausrücken, Verschieben
und Löschen sind damit ein `splice` und kein Umhängen. Ein Knoten:

```
{id, e, t, notiz, zu, frist, von, bis}
```

**Rückgängig** liegt als Abzug der ganzen Liste auf einem Stapel, nicht
als Befehlsstapel je Knoten. Bei einigen Hundert Knoten kostet ein Abzug
nichts, und er kann nicht danebenliegen. Getipptes wird zu einem Schritt
gebündelt, der Stapel bei 60 Schritten gedeckelt. Es gibt Rückgängig
**nur hier** — sonst nirgends im Dashboard.

**Datumsangaben werden getippt, nicht ausgewählt:** `@20.8.`,
`@2026-08-20`, `@heute`, `@morgen`, `@mo` bis `@so`, dazu
`@20.8...31.8.` für einen Zeitraum. Beim Verlassen der Zeile wird
Relatives ausgeschrieben — sonst liefen Text und gespeicherte Frist ab
dem nächsten Tag auseinander.

**Diese Fristen gehören dem Outliner allein.** Sie erscheinen nicht im
Planner, nicht im Kalender (06) und nicht im Jahreskalender (14) und
werden dort auch nicht gesucht. Umgekehrt erscheint kein Termin des
Dashboards im Gantt. Dieselbe Entscheidung wie beim Jahreskalender:
getrennte Bestände, keine wechselseitige Anzeige.

**Fokus und Suche gelten in allen drei Ansichten, das Zuklappen nicht.**
Zuklappen ist eine Lesehilfe der Gliederung und darf keine Fristen still
verschwinden lassen.

**Die Mindmap ist nicht radial.** Ein Fächer sieht bei drei Ästen gut aus
und schiebt bei dreißig Punkten die Beschriftungen übereinander — dagegen
hilft auch kein größeres Blatt, das vergrößert die Überlappung mit.
Stattdessen: Wurzel in der Mitte, Äste nach beiden Seiten, jeder Punkt in
seiner eigenen Zeile.

**Bewusst nicht dabei:** Befehlspalette und `Strg+F` (das ist die
Leiste), Kalenderansicht, Etiketten mit `#`, Filtersuche, Aufgaben mit
Kästchen und Priorität, Anheften auf die zwölf Plätze, Archiv, Ziehen mit
der Maus.

---

## PDF-Ausgabe — ohne Bibliothek und ohne Druckdialog

Gantt und Mindmap gehen als PDF heraus. Die Datei wird byteweise selbst
geschrieben; der Schreiber steht in Abschnitt 9b.

**Warum nicht mit Bibliothek?** Eine wäre erlaubt gewesen. Gemessen:

| | |
|---|---|
| `dashboard.html` vorher | 195 KB |
| jsPDF, kleinste brauchbare Fassung | 420 KB (MIT, gewerblich nutzbar) |
| Ladezeit ohne / mit | 13,8 ms / 46,1 ms — Median aus fünf Läufen |
| eigener Schreiber | rund 200 Zeilen |

Die Bibliothek bringt Bilder, Tabellen und eingebettete Schriften — davon
braucht keine der beiden Ansichten etwas. Und die Zeichengrenze wäre
dieselbe, solange keine Schrift eingebettet wird.

**Die Grenze:** Pfeile und Häkchen werden im PDF zu `?`. Namen, Umlaute
und das Eurozeichen nicht — auch polnische und französische.

**Große Diagramme.** Das Blattformat wählt der Mensch, A4 bis A0 quer.
Ein Gantt wächst in zwei Richtungen, und die brauchen verschiedene
Antworten:

* **nach unten** hilft ein Umbruch. Jedes Blatt wiederholt Kopf **und
  Namensspalte** und trägt „Blatt 2 von 3".
* **nach rechts** hilft kein Umbruch — ein Zeitstrahl, der mitten im
  November aufhört, ist nicht mehr zu lesen. Die Achse rechnet sich
  immer auf die Blattbreite; nur die Beschriftung wird gröber: Wochen,
  Monate, Vierteljahre.

Passt alles auf ein Blatt, werden die Zeilen gestreckt, und Schrift und
Balken wachsen mit dem Format. Eine Mindmap wird **nie** umgebrochen; bei
„von selbst wählen" bekommt sie das kleinste Blatt, auf dem ihre Schrift
über sieben Punkt bleibt.

---

## 16 Code-Beautifier — fertig

JSON und SQL einrücken. Beides wird in der Leiste selbst erkannt und
sofort als Angebot gezeigt.

**SQL ist kein Parser.** Der Formatierer zerlegt in Wörter und setzt
Zeilenumbrüche. Er versteht nicht, was die Abfrage tut, kennt keinen
Dialekt und prüft nicht, ob das SQL gültig ist.

**Namen werden nie angetastet.** Großgeschrieben wird nur, was
strukturell als Schlüsselwort erkannt ist — die Klausel- und
Verbundfolgen sowie eine kurze Liste von Operatorwörtern. Alles andere
bleibt Zeichen für Zeichen so stehen, wie es getippt wurde, **auch im
Schriftfall**. Die Liste war zunächst länger und enthielt Datentypen und
Wörter wie `TEXT`, `DATE`, `KEY`, `NAME`, `FIRST`, `ROW`; das war falsch,
denn eine Spalte darf so heißen. `left(name, 3)` bleibt deshalb
unberührt, obwohl `LEFT` ein reserviertes Wort ist.

**Die Rückprobe.** Nach dem Formatieren wird die Ausgabe erneut zerlegt
und Bestandteil für Bestandteil mit der Eingabe verglichen — Art, Text
und bei Namen auch der Schriftfall. Weicht etwas ab, wird **nichts**
ausgegeben, sondern gesagt, woran es lag. Ein Formatierer, der still ein
Wort verschluckt, ist gefährlicher als gar keiner: Man merkt es erst an
falschen Zahlen.

**Die Regeln**

* Jede Klausel beginnt eine Zeile, ebenso jeder Verbund.
* Nach `SELECT`, `GROUP BY`, `ORDER BY`, `SET`, `VALUES`, `RETURNING`
  steht ein Eintrag je Zeile, eingerückt.
* `ON` steht eingerückt unter seinem Verbund, die Bedingung in derselben
  Zeile; folgende `AND` darunter.
* `CASE` bricht um: `WHEN`, `ELSE` und `END` beginnen je eine Zeile,
  `THEN` bleibt bei seinem `WHEN`. Auch verschachtelt.
* Eine Klammer bricht nur um, wenn eine Unterabfrage darin steht.
  `count(*)` bleibt `count(*)`.
* Zeichenketten, Kommentare und zitierte Namen bleiben unverändert, auch
  `'Müller''s'` und `[Vor Name]`.

**Erkennung in der Leiste.** JSON an `{` oder `[`, SQL am ersten Wort —
`select`, `with`, `insert`, `update`, `delete`, `create`, `alter`,
`drop`, `truncate`. Bewusst streng: Ein „select" mitten in einem Satz
macht daraus keine Abfrage, und ein bloßes `select` ist zu kurz.

**Möglich später:** HTML, CSS, XML. Ohne externe Bibliothek — alles muss
selbst geschrieben werden.

---

## Reihenfolge

Siehe `ROADMAP.md`.

---

## 17 Einstellungen — fertig

Sechs Einstellungen und zwei Knöpfe, in vier Abschnitten. Was hier
steht, gilt sofort; ein Speichern gibt es nicht.

**Wo die Werte liegen, ist eine Entscheidung, keine Technikfrage.**

* **Anzeige** — Thema, Schriftgröße, Startfläche, dazu die Leisten-Blöcke
  und die Sicherungs-Erinnerung. Sie gehören zum Rechner, nicht zu den
  Daten: Ein anderer Bildschirm braucht andere Werte. Sie liegen in
  `localStorage` unter `anzeige` und stehen **nicht** in Sicherung oder
  Export. Das Thema behält aus älteren Zeiten seinen eigenen Schlüssel.
* **Arbeit** — der Vorlauf für „überfällig". Er ändert, wie Fristen
  gedeutet werden, und liegt deshalb als `Z.vorlauf` **in der
  Sicherung**. Auf einem anderen Rechner muss er gleich sein, sonst
  sähen dieselben Daten anders aus.

**Die Schriftgröße** ist `zoom` auf `body`, nicht eine geänderte
Grundschrift. Alle Maße dieser Datei stehen in Pixeln — 825 Stück —,
eine Grundschrift wirkte deshalb auf fast nichts. Dazu gehört zwingend
eine zweite Regel: `.app` teilt seine Höhe durch denselben Faktor. Ohne
sie wird die Fläche bei 1,15 um fünfzehn Prozent höher als das Fenster,
und ein Rollbalken erscheint. Gemessen: 1035 px in einem 900-px-Fenster.
Das ist Fehlerbuch 15 auf dem Rückweg.

**Überfällig ab** hat drei Stufen: am Tag danach (wie bisher), am Tag
selbst, einen Tag vorher. Gerechnet wird `d <= tagPlus(vorlauf - 1)` —
bei 0 ist das genau das alte `d < HEUTE`.

**Die Leisten-Blöcke** lassen sich einzeln abschalten. Wer alle sechs
abschaltet, bekommt nicht nichts: „Die Leiste nie leer lassen" ist eine
harte Regel, also steht dort ein Satz und ein Weg zurück in die
Einstellungen.

**Beispieldaten erkennen** geht über die Kennung — und, wo es keine
gibt, über den Inhalt. Bookmarks bekommen ihre Kennung erst in
`heile()`; ein Vergleich allein über Kennungen fand deshalb null von
vierundzwanzig. Wer ein Beispiel bearbeitet hat, macht es damit zu
seinem: Es zählt nicht mehr als Beispiel, und das ist richtig so.

**Beide Löschknöpfe fragen vorher und zählen ab**, was verschwindet.
Eine Frage ohne Zahlen ist keine Frage.

**Bewusst nicht dabei**

* **Ein drittes Thema.** Es ist geplant, aber nicht gebaut. Ein Knopf
  ohne Wirkung wäre Fehlerbuch 9.
* **Die Planner-Stunden** und **die Werktage.** Der Planner bleibt bei
  7 bis 18 Uhr und Montag bis Freitag. Ein Termin um 19:30 erscheint
  dort nicht; der Kalender zeigt ihn.
* **Ein voreingestelltes PDF-Format.** Der Dialog fragt jedes Mal.
* **Freie Farben, freie Tastenkürzel, die Zahl der Plätze,
  Einstellungen für den Beautifier.**

