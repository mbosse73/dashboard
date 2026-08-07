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

**Vor dem Bau:** `browsertest.html` sagt, ob die Zwischenablage direkt
funktioniert oder der Notweg über ein verstecktes Textfeld nötig ist.

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

* Ziehen aus der Liste auf eine Stunde gibt der Aufgabe eine Uhrzeit
* Ziehen zurück nach links nimmt Tag und Uhrzeit wieder weg
* Überfällige Workflows unten links, rot, ohne Ziehfunktion

---

## 08 Appstarter — Gerüst

Lokale HTML-Werkzeuge, öffnen in einem neuen Tab.

**Fehlt noch:** Anlegen und Bearbeiten der Einträge.

**Vor dem Bau:** `browsertest.html` prüfen. Chromium ist beim Öffnen von
`file://` aus `file://` teilweise restriktiv. Blockiert Edge den
Skriptaufruf, muss ein anklickbarer Link statt `window.open` verwendet
werden.

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

**Darüber der Schnellzugriff:** die acht Plätze mit ihrem Kürzel. Freie
werden gestrichelt gezeigt, nicht verschwiegen — sonst sieht man nie, dass
noch welche zu vergeben sind.

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

## 10 Hilfe — offen

Übersicht der Tastenkürzel und der Eingabemuster für die Leiste.
Sollte sich aus dem Register aufbauen, nicht von Hand gepflegt werden.

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

## 15 Outliner — Gerüst

Gliederung mit Ebenen. Angelegt als Beleg, dass sich neue Module ohne
Änderung an Leiste und Planner anmelden lassen.

**Fehlt noch:** Knoten anlegen, ein- und ausrücken, verschieben, klappen.

---

## 16 Code-Beautifier — Gerüst

JSON einrücken. Erkennt JSON in der Leiste selbst und bietet Formatieren an.

**Möglich später:** HTML, CSS, XML. Ohne externe Bibliothek — alles muss
selbst geschrieben werden.

---

## Reihenfolge

Siehe `ROADMAP.md`.
