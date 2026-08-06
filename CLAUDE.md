# Dashboard — Arbeitsregeln

Persönliches Dashboard für die tägliche Arbeit. Eine einzige HTML-Datei,
offline lauffähig, ohne Server und ohne Abhängigkeiten.

**Zielumgebung:** Windows-PC, Microsoft Edge, Datei per Doppelklick geöffnet
(`file://`). Kein Internetzugriff zur Laufzeit. Kein Server, kein Build-Schritt.

**Wie ein Schritt abgearbeitet wird, steht in `doku/ARBEITSWEISE.md`.
Diese Datei zuerst lesen.**

Dazu `doku/ARCHITEKTUR.md` vor jeder Änderung. Bei Fehlern zuerst
`doku/FEHLERBUCH.md` prüfen — die dort beschriebenen Fehler sind alle schon
einmal passiert.

---

## Harte Regeln

Diese sind nicht verhandelbar. Ein Verstoß macht die Datei unbrauchbar.

1. **Eine Datei.** Alles in `dashboard.html`. Kein Build, kein Bundler,
   keine separate `.js` oder `.css`.
2. **Keine externen Abhängigkeiten.** Kein `<script src>`, kein `<link>`,
   kein `@import`, kein CDN, kein `fetch()`, keine Webfonts.
   Prüfbefehl: `grep -c "src=\|<link\|@import\|https://cdn\|fetch(" dashboard.html`
   muss `0` liefern.
3. **Nur Systemschriften.** Auf Windows greift Segoe UI. Keine eingebetteten
   Schriften (Lizenz und Dateigröße).
4. **`color-scheme: light` in `:root`.** Ohne diese Zeile färbt Windows im
   Dunkelmodus Scrollbalken und Formularfelder selbst ein — schwarz.
5. **Jede Fläche selbst bemalen.** `.app`, `.rumpf`, `.mitte`, `.planer`,
   `.spalte` und jede weitere Vollflächen-Komponente brauchen ein eigenes
   `background`. Sich auf `body` zu verlassen genügt nicht.
6. **Keine gefüllten Unicode-Glyphen als Icons.** `▦ ▩ ⚑ ◕ ▤` heißen im
   Standard wörtlich „BLACK FLAG" und „SQUARE WITH CROSSHATCH FILL" und
   rendern als dunkle Blöcke. Icons sind Inline-SVG mit
   `stroke="currentColor" fill="none"`.
7. **`display` niemals in einer ID-Regel.** `#x{display:flex}` schlägt
   `.x.aktiv{display:block}` und bricht jedes Umschalten.

---

## Datenhaltung

* Alles Veränderliche liegt im Objekt `Z`. Kurznamen wie `KONTAKTE` sind
  **Verweise** auf dieselben Arrays.
* **Nie neu zuweisen.** Immer an Ort und Stelle ändern: `push`, `splice`,
  Feld setzen. Zum Austauschen des Inhalts gibt es `ersetze(ziel, neu)`.
* Nach jeder Änderung `bewahre()` aufrufen. Ohne das ist die Änderung beim
  Neuladen weg.
* **Sichern: JSON**, vollständig, mit `format: 1`.
  **Export: Markdown**, einbahnig, nur zum Lesen. Kein Rückweg.
* Speicherung läuft über `localStorage`. Ein Browsertest hat ergeben, dass
  Edge aus einer lokal geöffneten Datei **keinen** direkten Dateizugriff
  erlaubt. Die File System Access API ist also keine Option.

---

## Module

Kein Modul wird von der Leiste oder vom Planner namentlich gekannt. Jedes
meldet sich über `registriere({...})` an. Der Vertrag steht in
`doku/ARCHITEKTUR.md` — beim Anlegen eines neuen Moduls dort nachlesen.

Jeder Modulblock ist von Markern eingefasst:

```
/* ===== MODUL kontakte ===== */
registriere({ ... });
/* ===== ENDE kontakte ===== */
```

**Änderst du ein Modul, ersetze genau diesen Block.** Nicht die Datei neu
schreiben. Das hält Diffs klein und lesbar.

---

## Oberflächen

Es gibt zwei feste Flächen, alles andere sind Modulflächen:

* **Leiste** — der Einstieg. Ein Eingabefeld für Suchen, Rechnen und
  Erfassen in einem. Ohne Eingabe zeigt sie Überfälliges, den nächsten
  Termin, angeheftete Bookmarks und die Modulliste. **Nie leer lassen.**
* **Planner** — die Arbeitsfläche. Zwei Werktage im Stundenraster,
  links die nicht eingeplanten Aufgaben.

---

## Fachliche Regeln

* **Werktage sind Montag bis Freitag.** Geplant wird für den aktuellen und
  den nächsten Werktag. Fällt heute auf ein Wochenende, sind es die beiden
  nächstfolgenden.
* **Nur Termine sind an diese zwei Tage gebunden.** Aufgaben und Workflows
  dürfen jedes beliebige Datum tragen oder gar keins.
* **Aufgaben haben zwei Kategorien:** `todo` (selbst abarbeiten) und
  `nach` (nachverfolgen, liegt bei anderen).
* **Überfällige Workflows sind reine Information.** Sie erscheinen im
  Planner, lassen sich dort aber nicht ziehen.

### Workflows

* Ein **Workflow ist eine Vorlage**: feste Teilschritte in fester
  Reihenfolge, dazu Eigenschaften auf Instanz- und auf Schrittebene.
  Je Teilschritt können es andere Eigenschaften sein.
* Eine **Instanz** ist ein Durchlauf: gleiche Schritte, gleiche
  Eigenschaften, eigene Werte.
* Vorlagen stehen **fest im Code** in `VORLAGEN`. Kein Editor dafür.
* Eingebaut und nicht abwählbar: `titel` an der Instanz, `frist` am
  Teilschritt. Alles Weitere kommt aus der Vorlage.
* **Genau ein Teilschritt ist aktiv.** Alles davor gilt als erledigt,
  alles danach als offen. Es gibt kein Statusfeld — der Stand ergibt sich
  aus der Position und wird nie gespeichert.
* `aktiv` speichert den **Schlüssel** des Teilschritts, niemals eine
  Position. Sonst zeigen laufende Instanzen ins Leere, sobald die Vorlage
  sich ändert.
* **Überfällig** heißt: Die Frist des *aktiven* Schritts ist verstrichen.
  Verstrichene Fristen späterer Schritte zählen bewusst nicht.
* Im Dialog sind **Ansehen und Aktivieren getrennt**. Ein Klick auf einen
  Teilschritt ändert den Stand nicht.

Ausführlich in `doku/ARCHITEKTUR.md`, Entwurf unter
`referenz/workflow-dialog.html`.
* **Nichts darf unsichtbar werden.** Ein Eintrag, der aus einer Ansicht
  herausfällt, muss woanders auftauchen. Siehe `doku/FEHLERBUCH.md`, Punkt 3.

---

## Gestaltung

* Hell, warm, ruhig. Alle Farbwerte stehen als Token in `:root`.
  Nichts weiter unten hart codieren.
* **Farbe codiert Dringlichkeit, nicht Kategorie.** Tinte für „jetzt und
  aktiv", Signalrot ausschließlich für „überfällig". Sonst Graustufen.
  Keine Modulfarben im Inhaltsbereich.
  * **Eine einzige Ausnahme: der Jahreskalender.** Dort tragen die beiden
    Kategorien `urlaub` und `sonst` je eine eigene Flächenfarbe
    (`--k-urlaub`, `--k-sonst`), erklärt durch eine Legende unter dem
    Raster. Grund: Ein Jahresraster zeigt 365 Zellen von 27 Pixeln Höhe;
    dort trägt nur die Fläche selbst, und Graustufen wären von den
    Wochenenden nicht zu unterscheiden. Die Ausnahme gilt **nur** für
    diese beiden Tokens und **nur** im Jahreskalender. Sie ist kein
    Präzedenzfall: Kategorien anderswo — Aufgabenarten, Notizarten,
    Workflow-Schritte — bleiben in Graustufen.
  * Die zweite Farbe liegt **deckend** über der ersten, nie
    halbtransparent. Die Mischfarbe läge zu beiden Ausgangsfarben bei
    1,00 : 1, wäre also von keiner der beiden zu unterscheiden und käme
    in der Legende nicht vor.
* Kontrast prüfen: tragender Text mindestens 4,5 : 1, große Schrift
  mindestens 3 : 1.
* **Dialogfelder folgen Was → Wann → Wer → Dazu.** Datum und Uhrzeit
  stehen nebeneinander, nie in verschiedenen Zeilen. Mehrzeiliges zuletzt
  und breit, Schalter darunter. Kein Feld bleibt allein in einer halben
  Zeile stehen. Erklärungen stehen **unter** dem Feld, nie im Label.
* **Ein zweites Thema, kein zweites File.** Basecamp ist ein Umschalter im
  Kopf (`Standard` / `Basecamp`, Knöpfe `#th-standard` / `#th-basecamp`),
  der `data-theme="basecamp"` auf `body` setzt — nicht auf `.app`:
  Dialoge und der Meldungszettel hängen als eigene Zweige direkt an
  `body` und würden von einem Thema an `.app` nie erreicht. Alle
  Basecamp-Farbwerte stehen in `body[data-theme="basecamp"]{...}` unter dem
  `:root`-Block — dieselben Tokens, andere Werte. Nur was sich nicht als
  Token ausdrücken lässt (Georgia im Dialogtitel, der gefüllte statt helle
  Knopf, der goldene statt tintenfarbene Stern), bekommt eine eigene,
  mit `body[data-theme="basecamp"]` vorangestellte Regel direkt daneben.
  Die Wahl selbst ist eine Anzeigeeinstellung, kein Anwendungsdatum — sie
  liegt für sich in `localStorage` unter `"thema"`, nicht im Objekt `Z`,
  und taucht deshalb auch nicht in Sicherung oder Export auf.

---

## Nach jeder Änderung prüfen

```bash
node werkzeug/pruefen.mjs
```

Läuft unter Windows, Linux und in Claude Code on the web. Keine
Abhängigkeiten. Rückgabewert 1, wenn etwas nicht stimmt.

Geprüft werden: Syntax, externe Abhängigkeiten, gefüllte Zeichen als
Symbole, `color-scheme`, `display` in ID-Regeln, bemalte Flächen,
paarige Modulmarker und ob jeder Datenbereich beim Laden ersetzt wird.

**Danach die Datei im Browser öffnen und die geänderte Fläche ansehen.**
Sämtliche schwarzen Flächen aus dem Fehlerbuch haben diese Prüfung
bestanden. Ein bestandener Prüflauf sagt nichts über die Darstellung.

Wird eine neue Regel gefunden, die sich automatisch prüfen lässt, gehört
sie in `werkzeug/pruefen.mjs` — nicht nur in dieses Dokument.

---

## Beim Arbeiten über GitHub

Claude Code on the web schiebt Änderungen auf einen eigenen Branch und
öffnet einen Pull Request. Dabei gilt zusätzlich:

* Ein Branch je Roadmap-Schritt, benannt `schritt-1-kontakte`
* Die Vorlage unter `.github/pull_request_template.md` ausfüllen
* `node werkzeug/pruefen.mjs` vor dem Öffnen des Pull Requests laufen lassen
* Der Umfang gehört in die Beschreibung: `git diff --stat`

---

## Sprache

Code, Kommentare, Bezeichner und Oberfläche auf Deutsch. Bestehende
Namensgebung übernehmen (`bewahre`, `melde`, `zeichne`, `frist`, `Z`).
