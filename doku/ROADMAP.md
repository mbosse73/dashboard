# Reihenfolge

Ein Schritt pro Sitzung. Jeder Schritt ist für sich lauffähig und wird
einzeln übergeben — nicht mehrere gleichzeitig anfangen.

---

## Schritt 0 — Browsertest (vor allem anderen)

`browsertest.html` per **Doppelklick** in Edge öffnen, nicht per Ziehen in
ein offenes Fenster. Alle Prüfungen durchlaufen lassen.

Drei Ergebnisse entscheiden über spätere Schritte:

| Prüfung | Wenn nein |
|---------|-----------|
| Zwischenablage | Textbausteine brauchen den Notweg über ein verstecktes Textfeld |
| Lokale Datei öffnen | Appstarter braucht einen anklickbaren Link statt `window.open` |
| localStorage | Vor jedem Schließen sichern; die Warnleiste erscheint automatisch |

**Ergebnisse hier eintragen, bevor es weitergeht:**

| Prüfung | Ergebnis | Datum |
|---|---|---|
| localStorage nutzbar | noch offen | |
| Zwischenablage | noch offen | |
| Andere lokale Datei öffnen | noch offen | |

---

## Schritt 1 — Kontakte vollständig · **erledigt**

Umgesetzt in zwei Zügen: 1a Kacheln, eigene Suche, echtes `tel:` und
`mailto:`, Favoriten in der Leiste. 1b Dialog, Anlegen, Bearbeiten,
Löschen mit Verweisbereinigung.

Die Demodaten sind bewusst stehen geblieben und werden später
aufgeräumt. Die Prüfliste dazu steht in `qs/PRUEFUNGEN.md`.

Alles verweist auf Kontakte. Bleiben sie unfertig, wird jedes weitere
Modul später nachgezogen werden müssen.

**Zu bauen**
* Dialog zum Anlegen und Bearbeiten: Nachname, Vorname, Firma, Telefon,
  Mail, Notizen, Favorit
* Löschen mit Rückfrage
* Beim Löschen alle `kontakt`-Verweise in Aufgaben, Terminen, Notizen und
  Workflows auf `null` setzen
* Suchfeld innerhalb des Moduls

**Fertig, wenn**
* Ein neuer Kontakt taucht sofort in der Leiste auf, mit „Anrufen" und
  „Mailen"
* Nach Neuladen ist er noch da
* Nach dem Löschen zeigt keine Zeile mehr ins Leere
* Sichern und Laden bringt ihn unverändert zurück

---

## Schritt 2 — Der Dialog als Baustein · **erledigt**

Umgesetzt in zwei Ebenen statt einer:

* `felderMalen(felder, werte, beiAenderung)` — eine Gruppe Eigenschaften
  im Format `{schl, nm, art, optionen}`, acht Feldarten. Schritt 6
  braucht nur diese Ebene.
* `dialog(o)` — die Hülle: Kopf, Fuß, Escape, Klick daneben, Löschen mit
  Rückfrage, Prüfung, die auf das schuldige Feld zeigt.

Mehrzeilige Felder tragen eine Formatierungsleiste und verstehen
Markdown: fett, kursiv, unterstrichen, Überschrift, Aufzählung,
Trennlinie. Der Umwandler dahinter ist der Anfang von Schritt 5 und
wird dort erweitert, nicht neu geschrieben.

Kontakte, Aufgaben, Termine, Notizen, Bausteine, Apps und Bookmarks
brauchen alle dasselbe: eine Maske mit Feldern, Speichern und Abbrechen.

**Zu bauen:** eine Funktion `dialog(titel, felder, werte, beiSpeichern)`,
die Text-, Datums-, Zeit-, Auswahl- und Mehrzeilenfelder kennt. Schritt 1
darauf umstellen.

**Fertig, wenn** der Kontaktdialog dieselbe Funktion benutzt wie ein
danach gebauter Testdialog.

---

## Schritt 3 — Aufgaben und Termine bearbeiten

Mit dem Baustein aus Schritt 2.

* Aufgaben: Titel, Kategorie, Fälligkeit, Uhrzeit, Notiz, Kontakt, Löschen
* Termine: Uhrzeit, Dauer, Titel, Anmerkung, Kontakt, Löschen
* Termine bleiben auf die beiden Werktage beschränkt

**Fertig, wenn** ein im Planner angelegter Termin nach dem Neuladen an
derselben Stelle steht.

---

## Schritt 4 — Textbausteine

* Anlegen und Bearbeiten samt Gruppen
* Platzhalter `{Name}` erkennen und eine Eingabemaske erzeugen
* `{Datum}` automatisch mit dem heutigen Datum füllen
* Ergebnis in die Zwischenablage, Weg je nach Ergebnis aus Schritt 0

**Fertig, wenn** ein Baustein mit drei Platzhaltern in vier Klicks als
fertiger Text in der Zwischenablage liegt.

---

## Schritt 5 — Notizen mit Markdown

* Bearbeiten mit Vorschau
* Eigener Markdown-Umwandler — **keine Bibliothek**. Es genügen
  Überschriften, Fett, Kursiv, Listen, Links, Code und Zitat
* Einzelne Notiz als `.md` exportieren, einzelne `.md` importieren

**Fertig, wenn** eine exportierte Notiz nach dem Import identisch aussieht.

---

## Schritt 6 — Workflows vollständig

Setzt Schritt 2 voraus: Die Eigenschaften der Vorlage haben dasselbe
Format wie die Felder des Dialog-Bausteins.

**Zu bauen**
* Instanz aus einer Vorlage anlegen — Teilschritte und leere Werte werden
  dabei erzeugt
* Dialog nach `referenz/workflow-dialog.html`: Instanzeigenschaften oben,
  darunter alle Teilschritte, darunter der gewählte Schritt
* Ansehen und Aktivieren bleiben getrennt. Ein Klick auf einen Schritt
  ändert den Stand **nicht**
* Instanz löschen

**Fertig, wenn**
* Eine neue Instanz hat sofort alle acht Teilschritte mit leeren Werten
* Der Durchlauf lässt sich von Schritt 1 bis zum Ende klicken
* Ein überfälliger aktiver Schritt erscheint in der Leiste und im Planner
* Ein Klick auf Schritt 6 ändert nichts am Stand
* Nach Neuladen steht alles unverändert da

---

## Schritt 7 — Bookmarks und Apps bearbeiten

Anlegen, Bearbeiten, Löschen, Gruppen verwalten. Bei Apps den in Schritt 0
ermittelten Weg verwenden.

---

## Schritt 8 — Hilfe

Baut sich aus dem Register auf: alle angemeldeten Module, ihre
Tastenkürzel, die Eingabemuster der Leiste. Nicht von Hand pflegen.

---

## Schritt 9 — Outliner

Knoten anlegen, ein- und ausrücken, verschieben, klappen. Tastaturbedienung
wie gewohnt: `Tab` rückt ein, `Umschalt+Tab` aus.

---

## Später

* Code-Beautifier um HTML und CSS erweitern
* Planner: Termine im Raster ziehen, um die Uhrzeit zu ändern
* Wiederkehrende Termine
* Suche in der Leiste nach Relevanz ordnen statt nach Modulreihenfolge

---

## Regeln für jede Sitzung

Der vollständige Ablauf steht in `doku/ARBEITSWEISE.md`. Das Wichtigste:

1. `CLAUDE.md` und `doku/ARBEITSWEISE.md` sind gelesen
2. Genau einen Schritt bearbeiten
3. Nur die betroffenen Modulblöcke zwischen den Markern ersetzen
4. `node werkzeug/pruefen.mjs` muss ohne Fehler durchlaufen
5. Umfang prüfen: `git diff --stat` — über 500 Zeilen für ein Modul
   heißt, die Datei wurde umgeschrieben statt ein Block ersetzt
6. Der Mensch sieht die geänderte Fläche im Browser an
7. Neuer Datenbereich: `vorgabe()` **und** die Liste im Ladevorgang
8. `STAND.md` und diese Datei nachziehen
