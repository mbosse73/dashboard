# Dashboard

Persönliches Dashboard für die tägliche Arbeit. **Eine einzige HTML-Datei**,
offline lauffähig, ohne Server, ohne Build-Schritt, ohne Abhängigkeiten.

Zielumgebung: Windows-PC, Microsoft Edge, per Doppelklick geöffnet.

---

## Was es kann

Zwei Oberflächen, mehr nicht:

**Leiste** — der Einstieg. Ein Feld für alles: suchen, rechnen, erfassen.
Ohne Eingabe zeigt sie Überfälliges, den nächsten Termin, angeheftete
Bookmarks und alle angemeldeten Module.

**Planner** — die Arbeitsfläche. Der aktuelle und der nächste Werktag im
Stundenraster, links die nicht eingeplanten Aufgaben. Ziehen weist einer
Aufgabe eine Uhrzeit zu.

Alles Übrige sind Module, die sich über ein Register anmelden: Kontakte,
Aufgaben, Kalender, Jahreskalender, Notizen, Textbausteine, Appstarter,
Bookmarks, Workflows, Outliner, Code-Beautifier — und eine Hilfe, die
sich aus ebendiesem Register aufbaut.

Dazu ein Themen-Umschalter im Kopf, `Standard` / `Basecamp` — dieselbe
Anwendung, andere Optik, ohne zweite Datei.

---

## Ausprobieren

`dashboard.html` herunterladen und doppelklicken. Sonst nichts.

Zum Hineinschauen ohne Herunterladen liegt der jeweils letzte Stand von
`main` unter **<https://mbosse73.github.io/dashboard/dashboard.html>**.
Das ist nur eine Vorschau: Die Anwendung ist für die lokal geöffnete
Datei gebaut, und der Speicher hängt am Browser — was dort eingetragen
wird, steht nicht in der eigenen Datei und umgekehrt.

Ein paar Eingaben für die Leiste:

| Eingabe | Wirkung |
|---|---|
| `mei` | findet Kontakte, je zwei Treffer: Anrufen und Mailen |
| `17*1,19` | rechnet |
| `md` | startet den MD-Editor aus dem Appstarter |
| `Rückruf Kanzlei ? mo` | legt eine Aufgabe zum Nachverfolgen an |
| `{"a":1,"b":[2]}` | erkennt JSON und bietet Formatieren an |

Tastenkürzel: `⌘K` Leiste, `⌘P` Planner, `⌘S` sichern, `⌘1`–`⌘8`
angeheftete Bookmarks.

---

## Aufbau

```
dashboard.html            die Anwendung
browsertest.html          prüft, was Edge lokal erlaubt

CLAUDE.md                 Arbeitsregeln, von Claude Code automatisch gelesen
ANLEITUNG.md              Schritt-für-Schritt-Anleitung zum Weiterbauen
STAND.md                  offene Fragen und nächster Schritt

doku/ARCHITEKTUR.md       Modulvertrag, Datenmodell, Formate
doku/SPEC.md              alle Module und ihr Stand
doku/ROADMAP.md           Reihenfolge der Arbeit
doku/ARBEITSWEISE.md      wie Claude Code einen Schritt abarbeitet
doku/FEHLERBUCH.md        26 Fehler, die schon passiert sind

referenz/workflow-dialog.html   Entwurf des Workflow-Dialogs

werkzeug/pruefen.mjs      Regelprüfung, ohne Abhängigkeiten
qs/PRUEFUNGEN.md          Prüfungen am Rechner, zum Abhaken
mockups/                  Entwürfe je Schritt, vor der Umsetzung
```

---

## Weiterbauen

```bash
node werkzeug/pruefen.mjs
```

Prüft in wenigen Sekunden: Syntax, keine externen Abhängigkeiten, keine
gefüllten Zeichen als Symbole, `color-scheme`, `display` in ID-Regeln,
Modulmarker, und ob jeder Datenbereich auch beim Laden ersetzt wird.

**Das ersetzt nicht das Hinsehen.** Sämtliche schwarzen Flächen aus dem
Fehlerbuch haben diese Prüfung bestanden.

Die vollständige Anleitung steht in `ANLEITUNG.md`, die Regeln in
`CLAUDE.md`, die Reihenfolge in `doku/ROADMAP.md`.

---

## Warum eine einzige Datei

Kein Server, kein Netz, kein Build, keine Installation. Kopieren genügt,
und in zehn Jahren öffnet sie noch. Die Beschränkung erzwingt Ehrlichkeit:
Was nicht hineinpasst, gehört meist nicht hinein.

Der Preis ist Länge. Deshalb ist jeder Modulblock von Markern eingefasst,
sodass sich einzelne Teile ersetzen lassen, ohne die Datei anzufassen.

---

## Stand

Beide Oberflächen stehen. 14 Module angemeldet,
davon 12 fertig und 2 als Gerüst.
Fertig heißt: Anlegen, Bearbeiten und Löschen tragen — Kontakte,
Aufgaben, Kalender, Jahreskalender, Notizen, Bookmarks, Rechner,
Code-Beautifier, Hilfe. Die übrigen vier
sagen auf ihrer Fläche selbst, was ihnen noch fehlt. Die Reihenfolge
steht in `doku/ROADMAP.md`.

Diese drei Zahlen prüft `werkzeug/pruefen.mjs` gegen die Anwendung — eine
Ersetzung in diesem Dokument, die still danebengeht, fällt damit auf.

Privates Projekt, keine Lizenz, keine Beiträge von außen vorgesehen.
