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

## 01 Notizen — Gerüst

Zwei Arten:

* **Telefonnotiz** — Datum, Uhrzeit und Kontakt werden automatisch gesetzt
* **Allgemeine Notiz** — nur Titel und Text

**Fehlt noch:** Bearbeiten im Markdown-Format mit Vorschau, Import und
Export einzelner Notizen, Verknüpfung mit einem Kontakt im Bearbeiten-Dialog.

---

## 02 Kontakte — Gerüst

Felder: Nachname, Vorname, Firma, Telefon, Mail, Notizen, Favorit.

Favoriten stehen oben. Jede Zeile bietet „Anrufen" und „Mailen".

**Fehlt noch:** Anlegen, Bearbeiten, Löschen. Eigene Suche innerhalb des
Moduls.

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

## 04 Aufgaben — Gerüst

Zwei Kategorien: **To-do** (selbst abarbeiten) und **Nachverfolgen**
(liegt bei anderen).

Felder: Titel, Fälligkeit, Uhrzeit, Notiz, Kontakt.
Jedes beliebige Datum erlaubt oder gar keins.

**Fehlt noch:** Bearbeiten-Dialog, Kategorie wechseln, Kontakt zuordnen,
Löschen.

---

## 05 Textbausteine — Gerüst

Nach Gruppen geordnet. Platzhalter in der Form `{Name}`.

**Fehlt noch:** Eingabemaske für die Platzhalter, Kopieren in die
Zwischenablage, Anlegen und Bearbeiten, Gruppen verwalten.
Variable `{Datum}` soll automatisch das heutige Datum einsetzen.

**Vor dem Bau:** `browsertest.html` sagt, ob die Zwischenablage direkt
funktioniert oder der Notweg über ein verstecktes Textfeld nötig ist.

---

## 06 Kalender — Gerüst

Termine ausschließlich für den aktuellen und den nächsten Werktag.
Felder: Uhrzeit, Dauer, Titel, Anmerkung, Kontakt.

**Fehlt noch:** Anlegen und Bearbeiten als Dialog, Löschen.

**Hinweis:** Der Planner ist die Fläche, der Kalender nur noch der Dialog.
Zwei getrennte Vollansichten wären doppelt.

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

## 09 Bookmarks — Gerüst

Nach Gruppen geordnet. Acht anheftbare Plätze auf `⌘1` bis `⌘8`, sichtbar
im Ruhezustand der Leiste.

**Fehlt noch:** Anlegen, Bearbeiten, Löschen, Gruppen verwalten.

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
