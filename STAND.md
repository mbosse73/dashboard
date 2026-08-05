# Stand

Notiz zur Übergabe an eine neue Unterhaltung. Ergänzt die übrigen
Dokumente um das, was noch offen ist.

---

## Wo wir stehen

**Zuletzt: Schritt 2 — der Dialog als Baustein.** In zwei Ebenen statt
einer: `felderMalen` erzeugt eine Gruppe Eigenschaften im Format
`{schl, nm, art, optionen}`, `dialog` legt die Hülle darum. Der Grund ist
Schritt 6 — der Workflow-Dialog braucht die Felder, aber nicht die Hülle,
und er braucht sie dreimal in einem Dialog. Acht Feldarten. Mehrzeilige
Felder tragen eine Formatierungsleiste und verstehen Markdown; der
Umwandler dahinter ist der Anfang von Schritt 5.

**Dabei kam ein Fehler ans Licht, der seit Schritt 1b in `main` stand.**
Der Dialog nannte seine Eingaben `.feld` und sein Gitter `.raster` —
beide Namen gehörten längst der Leiste und dem Planner. Die spätere Regel
gewinnt still: Der Planner zeichnete sein Stundenraster als
zweispaltiges Gitter, die Dialogfelder waren 27 Pixel hoch und rahmenlos.
Alle Prüfungen waren dabei grün. Jetzt heißen sie `.dfeld` und
`.draster`, `pruefen.mjs` schlägt bei solchen Kollisionen an, und der
Fall steht als Punkt 11 im Fehlerbuch.

**Davor: Schritt 1 der Roadmap — Kontakte vollständig.** In zwei Zügen
umgesetzt. 1a: Kontakte erscheinen als Kacheln in einem umbrechenden
Raster, das Modul hat eine eigene Suche, Favoriten stehen überall oben
und zusätzlich im Ruhezustand der Leiste, und „Anrufen" und „Mailen"
führen als echte `tel:`- und `mailto:`-Verweise aus statt nur zu melden.
1b: Dialog zum Anlegen und Bearbeiten, Löschen mit Rückfrage und
vollständiger Verweisbereinigung.

Zwei Dinge daran sind erwähnenswert. Erstens lief `knm(kfind(x))` an
sieben von neun Stellen ungeschützt — beim ersten gelöschten Kontakt wäre
die Zeichnung abgebrochen; `kname()` fängt das jetzt ab. Zweitens hängen
Kontakte in Workflows auf **zwei** Ebenen, an der Instanz und am
Teilschritt. Welche Schlüssel betroffen sind, leitet `kVerweise()` aus
`VORLAGEN` ab statt sie fest einzutragen, sonst bräche die Bereinigung
still, sobald eine Vorlage wächst.

Die Demodaten sind auf Wunsch stehen geblieben, Kontakte eingeschlossen.
Das wird später aufgeräumt.

**Neu: `qs/PRUEFUNGEN.md`.** Jede Prüfung, die am Rechner nachzusehen ist,
als Liste zum Abhaken. Wächst mit jedem Schritt mit.

**Davor: Phase 0, das Fundament.** Die Anwendung selbst blieb dabei
unberührt. Fünf Dinge im Umfeld waren nicht in Ordnung:

* Die Anwendung lag als `index.html` im Repository, während alle zwölf
  Dokumente und `werkzeug/pruefen.mjs` von `dashboard.html` sprachen. Der
  Prüfer fand sie deshalb nicht, wertete das als Hinweis und meldete
  trotzdem „Keine Fehler" — ein grüner Lauf, der die Anwendung nie
  angesehen hatte. Sie heißt jetzt wieder `dashboard.html`; `index.html`
  ist nur noch eine Weiterleitung für GitHub Pages, ohne Logik.
* `pruefen.mjs` behandelt ein fehlendes Hauptdokument jetzt als Fehler
  mit Rückgabewert 1 und schreibt am Ende, wie viele Dateien er
  tatsächlich angesehen hat.
* `.gitattributes` fehlte, obwohl `ANLEITUNG.md` Teil 6.3 sie als
  vorhanden beschreibt. Ohne sie ist die Umfangsprüfung wertlos.
* `.github/pull_request_template.md` fehlte.
* `browsertest.html` sprach noch von „FlowBoard" und `C:\FlowBoard`.

Dazu sind `referenz/theme-notion.html` und `referenz/workflow-dialog.html`
nachgereicht worden. Damit läuft Prüfung 9 (Logik deckungsgleich) zum
ersten Mal — sie ist grün, die Notion-Fassung ist zeichengenau dieselbe
Logik — und Schritt 6 hat seine Dialogvorlage. Der Prüflauf sieht jetzt
alle vier Dateien an und meldet keinen einzigen Hinweis mehr.

`dashboard.html` läuft. Zwei Oberflächen — Leiste als Einstieg, Planner
als Arbeitsfläche. Elf Module sind angemeldet, davon drei fertig
(Planner, Leiste, Kontakte) und acht als Gerüst. Sichern und Laden über JSON,
Markdown-Export einbahnig. Alle Modulblöcke tragen Marker.

Ein Entwurf für den Workflow-Dialog liegt unter
`referenz/workflow-dialog.html` — noch nicht in `dashboard.html` eingebaut.
Das Datenmodell für Workflows ist bereits umgestellt.

---

## Entschieden

* **Zwei Oberflächen statt vierzehn Türen.** Suche, Quick Capture und
  Befehlspalette sind eine einzige Leiste.
* **Modulregister.** Kein Modul wird namentlich gekannt; jedes meldet
  sich mit `suche`, `erfassen` und `flaeche` an.
* **Werktage.** Termine nur für den aktuellen und den nächsten Werktag.
  Aufgaben und Workflows ohne diese Grenze.
* **Aufgaben** haben zwei Kategorien: `todo` und `nach`.
* **Sichern als JSON**, Export als Markdown ohne Rückweg.
* **Workflows**: Vorlage und Instanz sind getrennt. Vorlagen stehen fest
  im Code, ein Editor ist nicht vorgesehen. Titel der Instanz und Frist je
  Teilschritt sind eingebaut, alles Weitere kommt aus der Vorlage. Genau
  ein Schritt ist aktiv; der Stand ergibt sich aus der Position. Überfällig
  heißt: Frist des aktiven Schritts ist verstrichen. Verstrichene Fristen
  späterer Schritte zählen bewusst nicht.
* **Schrittnavigation im Dialog: Liste**, nicht Leiste.
* **Speicherung über localStorage.** Der Browsertest hat ergeben, dass
  Edge aus einer lokal geöffneten Datei keinen Dateizugriff erlaubt.
* **Farbe codiert Dringlichkeit**, nicht Kategorie.
* Eine Alternativfassung im Notion-Stil liegt unter
  `referenz/theme-notion.html`, Logik identisch.

---

## Offen — hier weitermachen

### 1. Browsertest, drei Antworten fehlen

`browsertest.html` per Doppelklick in Edge ausführen. Die Ergebnisse
bestimmen, wie drei Dinge gebaut werden müssen:

| Prüfung | Wenn nein |
|---|---|
| Zwischenablage | Textbausteine brauchen den Notweg über ein verstecktes Textfeld |
| Lokale Datei öffnen | Appstarter braucht einen Link statt `window.open` |
| localStorage | vor jedem Schließen sichern |

**Bis das geklärt ist, Schritt 4 und Schritt 7 der Roadmap zurückstellen.**

### 2. Notion-Fassung: Kontrast

Notions Tertiärton hat 2,5 : 1 auf Weiß und trifft Zeitangaben und
Metazeilen. Das ist Notions eigener Wert, kein Fehler. Falls es stört:
`--ink3` von `.45` auf `.6` — eine Zahl.

---

## Nächster Schritt

Schritt 3 der Roadmap: **Aufgaben und Termine bearbeiten** — die erste
Nutzung des Bausteins durch ein Modul, das ihn nicht selbst gebaut hat.
Damit zeigt sich, ob er trägt. Termine bleiben auf die beiden Werktage
beschränkt.

Danach Schritt 5 (Notizen mit Markdown; der Umwandler aus Schritt 2 wird
dort erweitert) und Schritt 6 (Workflows; benutzt `felderMalen` dreimal).

Schritt 4 und 7 bleiben zurückgestellt, bis der Browsertest beantwortet
ist.

---

## Für den Einstieg in eine neue Unterhaltung

> Ich baue ein persönliches Dashboard als einzelne HTML-Datei, offline,
> für Windows und Edge. Im Anhang das Projektpaket. Lies CLAUDE.md,
> doku/ARBEITSWEISE.md, doku/ARCHITEKTUR.md und STAND.md, dann sag mir,
> wo wir stehen.
