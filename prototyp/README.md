# Prototyp — Tag + Palette

`dashboard-tag.html`, per Doppelklick zu öffnen. Eine Datei, offline,
ohne Abhängigkeiten — dieselben harten Regeln wie die Anwendung.

Dieser Prototyp vereint die beiden Ansätze aus `fable/ANSAETZE.md`:

* **Ansatz A** — der Tag als Dokument, statt einer werkzeugzentrierten
  Leiste
* **Ansatz B** — das Suchfeld als Palette über der Arbeit, statt als
  eigene Fläche

Er enthält **alle Module der Anwendung mit allen vorhandenen
Funktionen**. Geändert ist nur, wie man zu ihnen hinkommt.

---

## Dieser Branch wird nicht zusammengeführt

`prototyp-tag-palette` ist ein Seitenzweig. Er dient dem Ausprobieren,
nicht der Auslieferung. `dashboard.html` auf `main` bleibt unberührt —
der Prototyp ist eine **Kopie**, keine Abzweigung im Code.

Das ist Absicht: Zwei Bedienkonzepte in einer Datei wären ein
Umschalter, den niemand pflegen will. Wenn sich etwas hier bewährt,
wandert es als eigener Roadmap-Schritt nach `main`, nicht als Merge.

---

## Was anders ist

### 1. Die Grundfläche ist der Tag

Beim Start steht ein Tag da, nicht ein leeres Suchfeld.

* **Ein Fluss.** Termine, Notizen, Aufgaben, Workflows und
  Jahrestermine stehen chronologisch untereinander. Die Telefonnotiz
  von 9:42 steht im Tag, nicht im Modul Notizen.
* **Ganztägiges oben.** Urlaub und Einträge ohne Uhrzeit stehen vor
  der ersten Stunde — sie betreffen den Tag, nicht eine Stunde darin.
* **Liegengebliebenes oben.** Was überfällig ist, steht als roter
  Kasten über dem Tag, mit Knöpfen zum Erledigen und Weiterschieben.
  Nichts wird unsichtbar.
* **Blättern.** `‹ Vortag`, `Heute`, `Folgetag ›` — auf der Tastatur
  `Alt+←` und `Alt+→`. Rückwärts ist Gedächtnis, vorwärts ist Planung.
* **Rechts** stehen die Blöcke, die früher den Ruhezustand der Leiste
  füllten: nächster Termin, Schmierzettel, Plätze, Favoriten, Module.
  Die sechs Schalter in den Einstellungen gelten unverändert.

**Kein neues Datenmodell.** Die Tagesfläche legt nichts an und
speichert nichts Eigenes. Sie liest, was ohnehin da ist. Ein Klick auf
einen Eintrag öffnet den Dialog seines Moduls — denselben wie immer.

### 2. Das Suchfeld ist ein Fenster

`Strg+K` öffnet die Palette über der Fläche, auf der Sie gerade sind.
`Esc` leert sie, ein zweites `Esc` schließt sie. Ein einzelner
Buchstabe öffnet sie ebenfalls und landet darin.

Was Sie tippen, wird genau wie bisher gedeutet: `di 14:00`,
`@kowalski`, `?`, Rechnungen, JSON, SQL. Dieselben Angebote, dieselben
Module.

**Nach dem Erfassen bleiben Sie, wo Sie sind.** Früher sprang das
Anlegen eines Termins fest in den Planner; das widerspricht dem Ansatz
und ist hier entfernt. Nur der Tag folgt dem Eintrag, wenn er an einem
anderen Tag landet — sonst sähe man vom Erfolg nichts.

### 3. Die Vorschau am Zielort

Das ist der eigentliche Gewinn, und er ist nur so zu haben.

Während Sie tippen, erscheint der Eintrag **gestrichelt an seiner
Stelle** — auf der Tagesfläche zwischen den Nachbarn, im Planner in
der richtigen Stunde. Er ist noch nicht gespeichert. Tippen Sie `mi`
statt `di`, springt er weg. Sie korrigieren, bevor etwas passiert.

Auf einer eigenen Suchfläche geht das grundsätzlich nicht: Der Zielort
ist dann nicht zu sehen.

---

## Was gleich geblieben ist

* **Alle Module**, mit allen Funktionen und allen Dialogen.
* **Die Daten.** Eine Sicherung aus der Anwendung lädt hier, eine
  Sicherung von hier lädt dort. `format: 1`, dieselben Bereiche.
* **Die Einstellungen**, samt Thema, Schriftgröße und den sechs
  Schaltern. Die Startfläche heißt jetzt „Tag" statt „Leiste".
* **Beide Themen**, Standard und Basecamp.
* **Die harten Regeln** aus `CLAUDE.md`. Der Prototyp läuft im
  Prüflauf mit — eine Fassung, die die Regeln brechen darf, wäre kein
  Prototyp, sondern eine Ausrede.

---

## Tastenkürzel

| Taste | Wirkung |
|---|---|
| `Strg+K` | Palette öffnen und schließen, über jeder Fläche |
| `Strg+T` | Tagesfläche |
| `Strg+P` | Planner |
| `Alt+←` `Alt+→` | einen Tag zurück, einen vor |
| `a`–`z` | öffnet die Palette und tippt hinein |
| `Esc` | Palette leeren, dann schließen · Dialog · zurück zum Tag |
| `Strg+1`–`Strg+8` | angeheftete Plätze |

Die Schichtung ist: **Palette über Dialog über Fläche.** Wer oben
liegt, bekommt `Esc` zuerst.

---

## Geprüft

`node werkzeug/pruefen.mjs` — der Prototyp steht in der Dateiliste und
läuft ohne Fehler durch, mit allen elf Prüfungen einschließlich
Kontrast.

Im Browser gemessen:

* 15 Flächen × 2 Themen × 3 Breiten (1920, 1280, 390 px) — kein
  Querüberlauf, keine Seitenfehler
* Palette über jeder Fläche, in beiden Themen, auch bei 390 px
* Vorschau auf der Tagesfläche und im Planner
* Erfassen legt an, schließt die Palette und zeigt das Ergebnis
* Alle Dialoge öffnen und schließen
* Sichern → Laden: 78 Einträge unverändert

---

## Was am eigenen Gerät zu prüfen bleibt

1. **Der Kern:** `Strg+K` im Planner, `Rückruf Meyer di 14:00` tippen.
   Steht der gestrichelte Kasten im Dienstag, bevor Sie Enter drücken?
2. Tippen Sie sich um (`mi` statt `di`) — springt er?
3. Enter — bleiben Sie im Planner, und steht der Eintrag da?
4. Blättern Sie mit `Alt+←` eine Woche zurück. Ist die Vergangenheit
   lesbar?
5. Ein Eintrag im Tag angeklickt: Öffnet sich der gewohnte Dialog?
6. **Sicherung aus der Anwendung laden.** Kommt alles unverändert an?
7. Alle sechs Nebenblöcke in den Einstellungen abschalten — steht der
   Tag links weiter?
8. Fehlt Ihnen etwas, das die Leiste konnte?

Punkt 8 ist der eigentliche Prüfstein. Der Prototyp nimmt eine Fläche
weg und ersetzt sie durch zwei andere Dinge. Ob das ein Gewinn ist,
zeigt sich nicht am Bildschirm, sondern nach einer Woche Arbeit.
