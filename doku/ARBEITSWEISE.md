# Arbeitsweise

Diese Datei richtet sich an Claude Code. Sie beschreibt, **wie** ein
Schritt abgearbeitet wird. Was gebaut wird, steht in `doku/ROADMAP.md`,
die Regeln stehen in `CLAUDE.md`.

---

## Der Ablauf in acht Phasen

### 1 — Lesen, bevor du irgendetwas tust

In dieser Reihenfolge:

1. `CLAUDE.md` — die Regeln
2. `doku/ARCHITEKTUR.md` — Modulvertrag, Datenmodell, Formate
3. `STAND.md` — was gerade offen ist
4. Den betreffenden Abschnitt in `doku/ROADMAP.md`

Bei einem Fehler zusätzlich `doku/FEHLERBUCH.md`. Die zehn Punkte dort
sind alle schon einmal passiert; suche dort, bevor du selbst suchst.

### 2 — Den Ist-Zustand verstehen

Lies **nur** den betroffenen Modulblock, nicht die ganze Datei:

```
/* ===== MODUL kontakte ===== */
…
/* ===== ENDE kontakte ===== */
```

Dazu die Bausteine, die du brauchst — `feld`, `zeile`, `abschnitt`,
`treff`, `bewahre`. Ihre Beschreibung steht in `doku/ARCHITEKTUR.md`.

Die Datei ist rund 1700 Zeilen. Sie vollständig zu lesen kostet Kontext,
den du später beim Prüfen brauchst.

### 3 — Planen und den Plan zeigen

Der Plan gehört vor die erste Änderung. Er sollte beantworten:

* Welche Blöcke werden angefasst? Namentlich.
* Kommt ein neuer Datenbereich hinzu? Dann **zwei** Stellen: `vorgabe()`
  und die Liste im Ladevorgang.
* Welche Bausteine werden wiederverwendet, welche neu gebaut?
* Was wird bewusst **nicht** gemacht?

Bei den Schritten 2, 5 und 6 der Roadmap ist der Plan besonders wichtig —
dort wird eine falsche Grundentscheidung teuer.

### 4 — Ändern, aber nur innerhalb der Marker

* Ein Modulblock wird als Ganzes ersetzt, der Rest der Datei bleibt
  unberührt.
* Neue gemeinsame Bausteine kommen in den passenden nummerierten
  Abschnitt, nicht in einen Modulblock.
* Nach jeder Datenänderung `bewahre()`.
* Nie ein Array neu zuweisen — `push`, `splice` oder `ersetze()`.
* Neue Kennungen über `neueId(praefix)`.

### 5 — Selbst prüfen

```bash
node werkzeug/pruefen.mjs
```

Muss ohne Fehler durchlaufen. Danach den Umfang ansehen:

```bash
git diff --stat
```

**Für ein Modul sind 50 bis 200 geänderte Zeilen normal.** Sind es mehr
als 500, hast du die Datei umgeschrieben statt einen Block ersetzt. Dann
zurücknehmen und enger arbeiten.

### 6 — Berichten, was der Mensch ansehen muss

Der Prüflauf sagt nichts über die Darstellung. Sämtliche schwarzen
Flächen aus dem Fehlerbuch haben ihn bestanden. Sag deshalb konkret, was
zu prüfen ist:

```
Geändert: Modulblock kontakte, dazu Abschnitt 2 (Datenbereich).
Umfang: 4 Dateien, 137 Zeilen.

Bitte im Browser prüfen:
1. Leiste → Modul Kontakte öffnen, neuen Kontakt anlegen
2. Seite neu laden — ist er noch da?
3. Kontakt löschen, der in einer Aufgabe verwendet wird —
   zeigt die Aufgabe danach ins Leere?
4. Sichern, Laden — kommt alles zurück?

Nicht umgesetzt: Suche innerhalb des Moduls (gehört zu Schritt 2).
```

### 7 — Stand nachziehen

* `doku/ROADMAP.md` — Schritt als erledigt markieren
* `STAND.md` — was sich geändert hat, welche Frage dadurch beantwortet ist
* Bei einer neuen automatisch prüfbaren Regel: `werkzeug/pruefen.mjs`
  erweitern, nicht nur `CLAUDE.md`
* Bei einem neuen Fehlertyp: `doku/FEHLERBUCH.md` ergänzen

### 8 — Aufhören

Ein Schritt pro Sitzung. Fang den nächsten nicht an, auch wenn er klein
wirkt. Die Datei wächst, und lange Sitzungen führen zu großen,
unüberprüfbaren Änderungen.

---

## Wann du nachfragst statt zu raten

* Die Aufgabe widerspricht einer Regel in `CLAUDE.md`
* Eine offene Frage aus `STAND.md` betrifft genau diesen Schritt
* Der Schritt setzt einen anderen voraus, der noch nicht erledigt ist
  (Schritt 6 braucht Schritt 2, Schritt 4 und 7 brauchen die
  Browsertest-Ergebnisse)
* Zwei Umsetzungen sind vertretbar und die Entscheidung ist nicht
  umkehrbar

Widerspricht ein Auftrag einer Regel: **sag es und nenne die Regel.**
Nicht stillschweigend umsetzen, nicht stillschweigend verweigern.

---

## Was in diesem Projekt falsch ist, auch wenn es sonst richtig wäre

Diese Vorschläge sind bei üblichen Projekten sinnvoll und hier verboten:

| Vorschlag | warum hier nicht |
|-----------|------------------|
| Module in eigene Dateien aufteilen | eine Datei ist die Grundbedingung |
| Build-Schritt, Bundler, Minifizierung | muss per Doppelklick laufen |
| Bibliothek einbinden, npm-Paket | kein Netz zur Laufzeit |
| Webfont laden oder einbetten | nur Systemschriften |
| Markdown-Bibliothek für Notizen | selbst schreiben, Schritt 5 |
| Framework einführen | wäre eine Neuschreibung |
| `localStorage` durch Dateizugriff ersetzen | Edge erlaubt das bei `file://` nicht |
| Statusfeld je Workflow-Schritt | der Stand ergibt sich aus der Position |
| `aktiv` als Zahl speichern | bricht, sobald die Vorlage sich ändert |
| Modulfarben im Inhaltsbereich | Farbe codiert Dringlichkeit |
| Unicode-Zeichen als Symbole | rendern als dunkle Flächen |

---

## Ein neues Modul anlegen

Vier Stellen, und keine darf fehlen:

1. `vorgabe()` — Datenbereich ergänzen, etwa `beispiel: []`
2. Liste im Ladevorgang — Schlüssel `"beispiel"` eintragen
3. Modulblock samt Marker in Abschnitt 4
4. `doku/SPEC.md` — Modul mit Stand eintragen

Fehlt Punkt 1 oder 2, funktioniert das Modul, seine Daten überleben aber
kein Laden einer Sicherung. `werkzeug/pruefen.mjs` schlägt darauf an.

Den Vertrag findest du in `doku/ARCHITEKTUR.md` unter „Der Modulvertrag".

---

## Auftragsvorlage

So sieht ein guter Auftrag aus, den der Mensch dir gibt:

```
Lies CLAUDE.md, doku/ARBEITSWEISE.md und doku/ARCHITEKTUR.md.
Setze Schritt 1 aus doku/ROADMAP.md um.
Zeige zuerst den Plan.
Ändere nur den Modulblock zwischen den Markern.
```

Kommt ein Auftrag ohne diese Angaben, arbeite trotzdem nach dieser Datei.
