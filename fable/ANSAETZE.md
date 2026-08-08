# Zwei andere Ansätze — eine Antwort, kein Plan

Dieses Verzeichnis beantwortet eine Frage, die im Gespräch gestellt
wurde: *Hätte Fable 5 für das Dashboard einen ganz anderen Ansatz
gewählt — und wenn ja, welchen?* Es ist eine dokumentierte Meinung mit
zwei Mockups. Es ist **kein Roadmap-Schritt**, nichts hier ist
beschlossen, und `dashboard.html` ist nicht berührt.

Vorab die nötige Einordnung: Der heutige Ansatz — Leiste und Planner
als feste Flächen, Module mit eigenen Flächen, das Register — steht in
`CLAUDE.md` als Verfassung des Projekts. Er war eine gemeinsame
Entscheidung über viele Schritte, nicht die Erfindung eines Modells.
Die Frage ist also hypothetisch: anderes Fundament, gleiche
Rahmenbedingungen — eine Person, tägliche Arbeit, Windows/Edge, eine
Datei, offline.

---

## Ansatz A — Der Tag als Dokument

**Mockup: `ansatz-a-tag.html`**

### Der Gedanke

Das heutige Dashboard ist werkzeugzentriert: Kontakte, Aufgaben,
Notizen, Termine — je ein Modul, je ein Ort. Man springt dorthin, wo
das Werkzeug liegt. Dieser Ansatz ist stattdessen **tageszentriert**:
Die eine zentrale Fläche ist der heutige Tag als fortlaufendes
Dokument.

Oben der Zeitstrahl mit den Terminen. Dazwischen, chronologisch
eingewoben, alles, was der Tag hervorbringt: Die Telefonnotiz von 9:42
steht *im Tag*, nicht im Modul Notizen. Die erledigte Aufgabe hakt
sich dort ab, wo sie erledigt wurde. Was liegen bleibt, rollt sichtbar
an den Anfang des nächsten Tages — nichts wird unsichtbar, ganz im
Sinn der bestehenden Regel.

Rückwärts blättern ist Gedächtnis („was war Dienstag?"), vorwärts
blättern ist Planung. Module gäbe es weiter, aber als **Ansichten**
auf dieselben Einträge: „alle Notizen zu Bergmann" ist eine Filterung,
kein zweiter Ort.

### Warum das für genau diesen Anwendungsfall stark wäre

Die tägliche Büroarbeit *ist* chronologisch. Man erinnert „das war
vorgestern nach dem Anruf", nicht „das liegt in Bereich 01". Das
Papiervorbild — Tageskalender mit Notizspalte, Bullet Journal —
funktioniert seit hundert Jahren genau so. Und der Ansatz löst das
Problem an der Wurzel, das heute die Leiste lösen muss: dass Dinge
über zehn Bereiche verstreut liegen und eine eigene Fläche das
Verstreute wieder einsammeln muss. Beim Tagesdokument fällt nichts
auseinander, also muss nichts eingesammelt werden.

### Der Preis, ehrlich benannt

* **Ein Eintragsmodell statt zehn Datenbereichen.** Alles wird „ein
  Eintrag mit Eigenschaften". Jede Änderung am Modell trifft alle
  Daten statt einen Bereich — die Migrationen in `heile()` würden
  deutlich anspruchsvoller.
* **Jahreskalender und Workflows passen schlecht** in eine
  Chronologie. Sie blieben Sonderfälle.
* **Der harte Kern muss am Anfang stehen.** Ist das Eintragsmodell im
  dritten Monat falsch geschnitten, ist das eine Katastrophe. Ist
  Modul 08 falsch geschnitten, ersetzt man einen Block.

## Ansatz B — Die Leiste als Überlagerung

**Mockup: `ansatz-b-palette.html`**

### Der Gedanke

Heute ist die Leiste eine *Fläche*, auf der man landet. Die
Alternative: Suchen, Rechnen und Erfassen sind eine **Palette, die auf
Strg+K über jeder Fläche erscheint** und danach wieder verschwindet —
wie bei den erkennbaren Vorbildern Spotlight und Raycast. Man bleibt,
wo man ist (im Planner, in den Notizen), und ruft das Werkzeug
dorthin, statt zum Werkzeug zu reisen und zurückzuspringen.

Das Mockup zeigt den entscheidenden Zusatzgewinn: Weil die Fläche
dahinter sichtbar bleibt, kann die Erfassung eine **Vorschau an den
Zielort** legen — der Termin steht gestrichelt schon im Dienstag,
bevor Enter gedrückt ist. Auf einer eigenen Leisten-Fläche ist das
grundsätzlich unmöglich, denn der Zielort ist dort nie zu sehen.

### Der Preis, ehrlich benannt

* **Der Ruhezustand der Leiste braucht ein neues Zuhause.**
  Überfälliges, der nächste Termin, die Pinnwand — eine Überlagerung
  hat keinen Ruhezustand, sie ist ja sonst nicht da. Das Zuhause wäre
  sinnvollerweise das Tagesdokument aus Ansatz A: Die beiden Ansätze
  gehören zusammen.
* **Ein Fenster über allem** kollidiert mit den bestehenden Dialogen —
  Palette über Dialog über Fläche braucht klare Regeln, wer Escape
  bekommt.

---

## Warum der gewählte Ansatz trotzdem der richtige gewesen sein kann

Der Modulansatz ist der Grund, warum dieses Projekt nach siebzehn
Modulen noch gesund ist. Es entstand über viele Pull Requests, jeder
ein abgeschlossener, einzeln prüfbarer Schritt; Markerblöcke lassen
sich ersetzen, ohne den Rest anzufassen; ein Fehler in den Notizen
kann die Termine nicht beschädigen. Fehlerbuch, Prüflauf, kleine Diffs
— die Arbeitskultur dieses Projekts hängt an dieser Zerlegbarkeit.

Das Tagesdokument ist die elegantere Architektur, aber sie verlangt
ihren großen Entwurf am Anfang und verzeiht späte Korrekturen
schlecht. Für eine Arbeitsweise, bei der ein Mensch jeden Schritt am
eigenen Gerät abnimmt und das Risiko klein halten will, war der
Modulansatz vermutlich die **richtige** Wahl — nicht die schönste.

Und ehrlich: Ob dieser Ansatz bei einem echten Neustart durchgehalten
worden wäre oder nach zwei Schritten dieselben Zerlegbarkeits-Schmerzen
gezeigt hätte, ist nicht beweisbar. Das hier ist ein Urteil, kein
Befund.

## Der gangbare Mittelweg

Nichts davon verlangt einen Neubau. Der billigste Schritt wäre eine
**Fläche „Tag" als ganz normales Modul**: Sie *liest* nur, was ohnehin
da ist — Termine, Notizen und erledigte Aufgaben tragen alle ein
Datum — und webt es chronologisch zusammen. Kein neues Datenmodell,
kein Umbau am Fundament, ein Modul wie jedes andere, das sich über
`registriere({...})` anmeldet.

Damit ließe sich am eigenen Alltag messen, ob die tageszentrierte
Sicht trägt. Erst wenn ja, stellte sich die Frage, ob sie mehr sein
soll als eine Ansicht. Entscheiden am Gebrauch, nicht am Geschmack.

---

*Zu den Mockups: Beide verwenden die Farbwerte des Standardthemas aus
`dashboard.html`, damit der Ansatz verglichen wird und nicht die
Farben. Das gelbe Band oben gehört zum Mockup, nicht zum Entwurf. Die
Daten sind die bekannten Beispieldaten. Beide Dateien sind
eigenständig und offline lauffähig, per Doppelklick zu öffnen.*
