# Reihenfolge

Ein Schritt pro Sitzung. Jeder Schritt ist für sich lauffähig und wird
einzeln übergeben — nicht mehrere gleichzeitig anfangen.

**Die Nummern sind Kennungen, keine Reihenfolge.** Schritt 10 kam
nachträglich dazu, Schritt 6 ist ans Ende gerückt. Offen ist heute, in
dieser Reihenfolge:

1. **Schritt 8** — Hilfe, baut sich aus dem Register auf
2. **Schritt 9** — Outliner
3. **Schritt 4** und der Apps-Teil von **Schritt 7** — warten auf den
   Browsertest. Die Bookmarks aus Schritt 7 sind erledigt; sie hingen
   nicht am Test.
4. **Schritt 6** — Workflows, zuletzt

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
Markdown: fett, kursiv, Überschrift, Aufzählung, Trennlinie.
Unterstreichen ist bewusst nicht dabei — Markdown kennt es nicht. Der Umwandler dahinter ist der Anfang von Schritt 5 und
wird dort erweitert, nicht neu geschrieben.

Kontakte, Aufgaben, Termine, Notizen, Bausteine, Apps und Bookmarks
brauchen alle dasselbe: eine Maske mit Feldern, Speichern und Abbrechen.

**Zu bauen:** eine Funktion `dialog(titel, felder, werte, beiSpeichern)`,
die Text-, Datums-, Zeit-, Auswahl- und Mehrzeilenfelder kennt. Schritt 1
darauf umstellen.

**Fertig, wenn** der Kontaktdialog dieselbe Funktion benutzt wie ein
danach gebauter Testdialog.

---

## Schritt 3 — Aufgaben und Termine bearbeiten · **erledigt**

Beide Module beschreiben ihre Maske nur noch als Liste von
`{schl, nm, art}` — eigenen Dialogcode gibt es nicht mehr. Damit hat
sich der Baustein aus Schritt 2 bewährt.

Der Tag eines Termins ist eine **Auswahl aus genau zwei Werktagen**,
kein freies Datum. Die Regel steckt in der Maske statt in einer Prüfung
dahinter.

Abgehakte Aufgaben ziehen in einen eigenen Abschnitt „Erledigt" und
lassen sich dort einzeln oder gesammelt löschen.

`fertig` bei Terminen ist entfallen — siehe `ARCHITEKTUR.md`.

Der Planner bekam drei Handgriffe dazu: Klick auf einen Block öffnet den
Dialog, Aufgabenblöcke tragen ein Kästchen, der Vorrat ist anklickbar.
Das Ziehen blieb unverändert.

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

## Schritt 5 — Notizen mit Markdown · **erledigt**

Zwei Arten, Telefonnotiz vorbelegt. Datum und Uhrzeit stehen zusätzlich
im Text, damit sie beim Ausleiten erhalten bleiben. Der Anrufer kommt aus
der Kontaktliste oder wird frei eingetragen.

Der Umwandler aus Schritt 2 ist erweitert worden, nicht neu geschrieben.
Die Vorschau steht **in der Liste** — eine Notiz ist ihr Text.

Export und Import als `.md` mit einem Kopfblock, der eine harte Grenze
hat: `---` in Zeile 1, ein zweites `---` innerhalb von zehn Zeilen,
dazwischen ausschließlich `schlüssel: wert`. Sonst ist alles Text.
Gegengeprüft mit den beiden Fällen aus `FEHLERBUCH.md` Punkt 5.

Dazu der **Schmierzettel**: ein einzelner Text, groß im Modul und
kompakt in der Leiste, beide auf dieselbe Stelle.

* Bearbeiten mit Vorschau
* Eigener Markdown-Umwandler — **keine Bibliothek**. Es genügen
  Überschriften, Fett, Kursiv, Listen, Links, Code und Zitat
* Einzelne Notiz als `.md` exportieren, einzelne `.md` importieren

**Fertig, wenn** eine exportierte Notiz nach dem Import identisch aussieht.

---

## Schritt 6 — Workflows vollständig · **zurückgestellt, kommt zuletzt**

Bewusst ans Ende gerückt. Der Schritt ist der größte und der einzige mit
einem eigenen Datenmodell aus Vorlage, Instanz und aktivem Teilschritt;
`ANLEITUNG.md` nennt ihn einen der drei, bei denen eine falsche
Grundentscheidung teuer wird. Er wird nach Schritt 8, 9, 4 und 7
angegangen, nicht davor. Die Nummer bleibt, damit alle Verweise in den
übrigen Dokumenten stimmen — sie ist eine Kennung, keine Reihenfolge.

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

**Bookmarks: erledigt.** Anlegen, Bearbeiten, Löschen, Anheften und Lösen,
Gruppen umbenennen und zusammenlegen. Öffnen in einem neuen Tab, aus dem
Modul, aus der Suche, von den Kacheln der Leiste und über `⌘1` bis `⌘8`.

**Nachgeschoben: die Fläche dichter.** Aus 1800 Pixeln wurden 315 —
Gruppenname links als Randbeschriftung, Bookmarks daneben als Chips, dazu
ein Schnellzugriff mit den acht Plätzen und ein Schalter `ordnen ›`.
Entwurf mit drei Fassungen und gemessenen Höhen unter
`mockups/schritt-bookmarks-dicht.html`.

Der Teil hing **nicht** am Browsertest: Der betrifft das Öffnen einer
lokalen Datei, und Bookmarks zeigen auf `http(s)`. Deshalb vorgezogen.

**Apps: offen, wartet weiter auf Schritt 0.** Ein Appstarter zeigt auf
`file:///C:/…`. Ob Edge das aus einer lokal geöffneten Datei heraus
zulässt, entscheidet, ob `window.open` genügt oder ob es ein anklickbarer
Verweis sein muss. Ohne diese Antwort wäre der Weg geraten.

---

## Zwischenschritt — die Breite auf 24 Zoll · **erledigt**

Kein Roadmap-Schritt. Alle zwölf Modulflächen benutzten 860 px und ließen
auf einem 24-Zoll-Schirm 1060 px leer, während drei von ihnen scrollten;
der Planner machte das Gegenteil und nahm alles.

**Umgesetzt (Vorgang 1)**
* `.mitte` von 860 auf 1180 px, Fließtext bleibt bei 78 Zeichen
* Leiste im Ruhezustand zweispaltig ab 1100 px — 1181 auf 895 px
* Suchergebnis bleibt einspaltig und bei 860 px
* Planner auf 1480 px gedeckelt und zentriert, Vorrat über `clamp`
* Planner füllt die Höhe (`min-height:100%`)
* Kopf über `padding-inline` auf dieselben 1480 px eingerückt

**Offen (Vorgang 2)**
* Die Leiste als Pinnwand mit zwölf Plätzen, über das Register auch für
  Apps. Braucht eine Änderung an den gespeicherten Daten und eine
  Erweiterung des Modulvertrags.

Entwurf mit gemessenen Zahlen: `mockups/schritt-breite.html`.

---

## Schritt 8 — Hilfe

Baut sich aus dem Register auf: alle angemeldeten Module, ihre
Tastenkürzel, die Eingabemuster der Leiste. Nicht von Hand pflegen.

---

## Schritt 9 — Outliner

Knoten anlegen, ein- und ausrücken, verschieben, klappen. Tastaturbedienung
wie gewohnt: `Tab` rückt ein, `Umschalt+Tab` aus.

---

## Schritt 10 — Jahreskalender · **erledigt**

Nachträglich in den Plan aufgenommen, nicht Teil der ursprünglichen
Reihenfolge. Alle 365 Tage eines Jahres in einem schwebenden Fenster,
mit eigenem Bestand `Z.jahrestermine`.

**Umgesetzt**
* 12 × 31 Raster, Jahr umschaltbar
* Eintrag mit Start- und Enddatum, ohne Uhrzeit, ohne Kontakt
* Zwei Kategorien: Urlaub und sonstiger Termin, mit Legende
* Klick auf einen Tag legt an oder öffnet den vorhandenen Eintrag
* Der Eintrag wird **im Fenster** bearbeitet, nicht in einem zweiten
  Dialog — `dialog()` beginnt mit `dialogZu()` und schlösse das Fenster
* Mauszeiger auf einem belegten Tag zeigt die Details

**Zwei Entscheidungen, die festgehalten gehören**
* Der Bestand ist vom Kalender (06) und vom Planner **getrennt**. Keine
  wechselseitige Anzeige. So gewollt.
* Farbe codiert hier ausnahmsweise die Kategorie. Die Ausnahme steht in
  `CLAUDE.md` und gilt nur für dieses Modul.

**Bewusst nicht dabei:** Wiederholungen, Verweis auf Kontakte, Anzeige in
Leiste oder Planner, Ziehen im Raster zum Verschieben einer Spanne.

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
