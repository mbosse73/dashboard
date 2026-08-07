# Prüfungen

Alles, was **du** am Rechner nachsehen sollst. Eine Liste zum Abhaken, die
über das ganze Projekt mitwächst — am Ende steht hier jede Prüfung, die je
nötig war.

Wird bei jedem Schritt fortgeschrieben. Neue Abschnitte kommen unten dazu,
erledigte bleiben stehen: Sie sind der Nachweis, dass es einmal lief, und
die Grundlage für einen späteren Nachtest.

---

## Wie das hier gemeint ist

**Ein grüner Prüflauf sagt nichts über die Darstellung.** Sämtliche schwarzen
Flächen aus `doku/FEHLERBUCH.md` haben `node werkzeug/pruefen.mjs` bestanden.
Deshalb diese Liste.

`dashboard.html` immer per **Doppelklick** im Explorer öffnen. Nicht in ein
offenes Edge-Fenster ziehen — das erzeugt eine andere Herkunft und verfälscht
localStorage, Zwischenablage und den Appstarter.

Zwei Marken hinter den Punkten:

| Marke | Bedeutung |
|---|---|
| **[nur du]** | Kann ich nicht prüfen. Braucht Windows, Edge oder ein Auge. |
| **[vorgeprüft]** | Habe ich in einem Chromium automatisch durchgefahren. Bitte trotzdem ansehen — die Automatik sieht keine Farben und kein Windows. |

Fällt eine Prüfung durch: Punkt hier stehen lassen, Beobachtung darunter
notieren und mir sagen. Wenn es ein neuer Fehlertyp ist, gehört er zusätzlich
in `doku/FEHLERBUCH.md`.

---

## Schritt 0 — Browsertest · **offen, blockiert Schritt 4 und den Apps-Teil von 7**

`browsertest.html` per Doppelklick öffnen, alle Knöpfe der Reihe nach drücken.

- [ ] **localStorage nutzbar** — Abschnitt „Speicherwege“, läuft ohne Knopfdruck **[nur du]**
      → Ergebnis: `________`  ·  Bei *nein*: vor jedem Schließen sichern
- [ ] **Zwischenablage** — Knopf „Kopieren testen“ **[nur du]**
      → Ergebnis: `ja` / `notweg` / `nein`: `________`
      Bei *notweg* oder *nein*: Textbausteine brauchen ein verstecktes Textfeld
- [ ] **Andere lokale Datei öffnen** — Knopf „Appstart testen“, vorher eine beliebige
      `test2.html` danebenlegen **[nur du]**
      → Ergebnis: `________`  ·  Bei *nein*: Appstarter braucht einen Link statt `window.open`
- [ ] **Anrufen und Mailen** — Knöpfe „Anruf-Übergabe“ und „Mail-Übergabe“ **[nur du]**
      → Ergebnis: `________`  ·  Steht nicht in der Roadmap, ist aber seit Schritt 1a
      echter Code und keine Meldung mehr

**Die drei ersten Ergebnisse gehören anschließend in `doku/ROADMAP.md`, Schritt 0.**

---

## Phase 0 — Fundament

Kein Roadmap-Schritt. Die Anwendung wurde dabei nicht verändert, nur umbenannt.

- [ ] `dashboard.html` per Doppelklick — Leiste und Planner sehen aus wie vorher,
      keine dunklen Flächen **[nur du]**
- [ ] `index.html` per Doppelklick — leitet sofort auf `dashboard.html` weiter **[vorgeprüft]**
- [ ] `referenz/theme-notion.html` per Doppelklick — dieselbe Anwendung im hellen
      Notion-Stil **[nur du]**
- [ ] In PowerShell `node werkzeug/pruefen.mjs` — läuft ohne Fehler durch und meldet
      „4 von 4 Dateien angesehen“ **[vorgeprüft]**
- [ ] `git diff --stat` nach einer eigenen Änderung zeigt **nur** die geänderten Zeilen,
      nicht die ganze Datei. Zeigt er alles, greift `.gitattributes` nicht **[nur du]**

---

## Schritt 1a — Kacheln, Suche, Anrufen und Mailen

- [ ] **Leiste:** Der Block **Favoriten** steht zwischen „Als Nächstes“ und „Bookmarks“.
      Drei helle Kacheln, keine dunklen Flächen **[vorgeprüft]**
- [ ] **Telefonknopf überfahren** — die Sprechblase nennt die Rufnummer **[vorgeprüft]**
- [ ] **Telefonknopf anklicken** — Edge übergibt an dein Telefonprogramm.
      Kommt eine Rückfrage von Windows, zählt das als bestanden **[nur du]**
- [ ] **Mailknopf anklicken** — dein Mailprogramm öffnet sich mit der Adresse **[nur du]**
- [ ] **Modul Kontakte** öffnen — Favoriten oben, darunter alle übrigen **[vorgeprüft]**
- [ ] Ins Suchfeld `nordstern` tippen — es filtert mit, und der **Cursor bleibt im Feld** **[vorgeprüft]**
- [ ] Suchen nach etwas, das es nicht gibt — es erscheint „Kein Kontakt passt zu …“,
      keine leere Fläche **[vorgeprüft]**
- [ ] Bei **Kai Richter** den Stern setzen — er rutscht zu den Favoriten **[vorgeprüft]**
- [ ] Zur Leiste wechseln — Kai Richter steht dort **[vorgeprüft]**
- [ ] **Seite neu laden** — ist er noch Favorit? **[vorgeprüft]**
- [ ] Fenster **schmal ziehen** — die Kacheln brechen in die nächste Reihe um.
      Es darf **kein** waagerechter Rollbalken erscheinen **[vorgeprüft]**
- [ ] In der Leiste `mei` tippen — die Treffer „Anrufen“ und „Mailen“ führen wirklich
      aus, statt nur zu melden **[nur du]**
- [ ] `referenz/theme-notion.html` — dieselben Kacheln in Notions Stil, hell und lesbar **[nur du]**

---

## Schritt 1b — Anlegen, Bearbeiten, Löschen

- [ ] **Neuen Kontakt anlegen**, nur den Nachnamen ausfüllen. Er erscheint sofort,
      und im Namenskreis steht ein sinnvoller Buchstabe — **nicht** `undefinedM` **[vorgeprüft]**
- [ ] **Seite neu laden** — ist er noch da? **[vorgeprüft]**
- [ ] Kontakt öffnen, etwas ändern, **Abbrechen** drücken — die Änderung ist verworfen **[vorgeprüft]**
- [ ] Kontakt öffnen, Vorname und Telefon eintragen, **Speichern** — die Kachel
      zeigt beides, und der Telefonknopf ist nicht mehr blass **[vorgeprüft]**
- [ ] **Ohne Nachnamen speichern** — es kommt die Meldung „Ohne Nachnamen geht es nicht“,
      nichts wird angelegt **[vorgeprüft]**
- [ ] **Escape** schließt den Dialog **[vorgeprüft]**
- [ ] Klick **neben** den Dialog schließt ihn ebenfalls **[nur du]**
- [ ] **Löschen** drücken — die Rückfrage nennt die Zahl der betroffenen Verweise
      und sagt, dass die Einträge selbst bleiben **[vorgeprüft]**
- [ ] **„Doch nicht“** führt zurück in den Dialog, nichts ist gelöscht **[vorgeprüft]**
- [ ] Einen Kontakt löschen, **der in einer Aufgabe hängt** (etwa Eva Bergmann):
      Die Aufgabe bleibt, nur der Name daneben ist weg **[vorgeprüft]**
- [ ] Nach dem Löschen durch **alle** Flächen gehen — Leiste, Planner, Aufgaben,
      Notizen, Kalender, Workflows. Nirgends steht `undefined`, `null` oder eine
      leere Zeile, wo ein Name war **[nur du]**
- [ ] **Sichern** drücken, Datei irgendwo ablegen. **Laden** drücken, dieselbe Datei
      wählen — alle Daten kommen unverändert zurück **[vorgeprüft]**
- [ ] `referenz/theme-notion.html` — derselbe Dialog in Notions Stil, keine dunklen
      Flächen, Löschrückfrage lesbar **[nur du]**

---

## Schritt 2 — Der Dialog als Baustein

Der Kontaktdialog benutzt jetzt dieselbe Funktion, die künftig alle
Module benutzen. Von außen soll er sich **genauso** verhalten wie vorher.

- [ ] Kontakt öffnen — der Dialog sieht aus wie in Schritt 1b, sieben Felder **[vorgeprüft]**
- [ ] Anlegen, Bearbeiten, Abbrechen, Löschen verhalten sich unverändert **[vorgeprüft]**
- [ ] **Ohne Nachnamen speichern** — das Feld färbt sich rot und bekommt den Fokus.
      Bisher kam nur eine Meldung **[vorgeprüft]**

### Formatierungsleiste am Notizfeld

- [ ] Über dem Notizfeld steht eine Leiste mit fünf Zeichen **[vorgeprüft]**
- [ ] Wort markieren, **B** drücken — es wird zu `**Wort**`. Nochmal drücken nimmt es zurück **[vorgeprüft]**
- [ ] Drei Zeilen markieren, **Aufzählung** drücken — jede bekommt ein `- ` **[vorgeprüft]**
- [ ] **Überschrift** setzt `## `, **Trennlinie** setzt `---` auf eine eigene Zeile **[vorgeprüft]**
- [ ] `Strg+B` und `Strg+I` wirken im Feld **[vorgeprüft]**
- [ ] Es gibt **kein** Unterstreichen — Markdown kennt es nicht **[vorgeprüft]**
- [ ] **Vorschau** drücken — der Text erscheint gesetzt. Nochmal drücken: das Feld ist
      unverändert zurück **[vorgeprüft]**
- [ ] Speichern, Seite neu laden, Kontakt öffnen — der Markdown-Text steht noch da **[nur du]**

### Nachtest zum Fehlerbuch, Punkt 11

Zwei Klassennamen kollidierten und haben seit Schritt 1b unbemerkt
Schaden angerichtet. Bitte beides eigens ansehen:

- [ ] **Planner öffnen** (`⌘P`). Das Stundenraster ist eine hohe, einspaltige Liste
      von 7 bis 18 Uhr — **kein** zweispaltiges Gitter mit Lücken **[vorgeprüft]**
- [ ] **Kontaktdialog öffnen.** Die Eingabefelder haben normale Schriftgröße und einen
      Rahmen — nicht riesig und rahmenlos **[vorgeprüft]**
- [ ] **Suchfeld der Leiste** ist unverändert groß und rahmenlos, so wie immer **[vorgeprüft]**

---

## Schritt 3 — Aufgaben und Termine

### Modul Aufgaben

- [ ] Zwei Abschnitte **To-do** und **Nachverfolgen**, darunter **Erledigt** **[vorgeprüft]**
- [ ] Überfällige tragen eine rote Kante links und eine rote Fälligkeit rechts **[vorgeprüft]**
- [ ] Zeile anklicken öffnet den Dialog, sechs Felder **[vorgeprüft]**
- [ ] Die **Uhrzeit ist als optional beschriftet** **[vorgeprüft]**
- [ ] Aufgabe **ohne Datum** speichern, die eine Uhrzeit hatte — die Uhrzeit ist
      danach leer. Ohne Tag kann der Planner sie nicht unterbringen **[nur du]**
- [ ] Kästchen drücken — die Aufgabe wandert nach „Erledigt" **[vorgeprüft]**
- [ ] Dort das Kästchen erneut drücken — sie kommt zurück in ihre Kategorie **[nur du]**
- [ ] **„alle N löschen"** fragt zurück und löscht nur die abgehakten **[vorgeprüft]**
- [ ] Eine einzelne erledigte Aufgabe über den Dialog löschen **[nur du]**
- [ ] **Seite neu laden** — Stand unverändert? **[nur du]**

### Modul Kalender

- [ ] Genau **zwei Tage** nebeneinander, der heutige mit der Marke „heute" **[vorgeprüft]**
- [ ] Termine nach Uhrzeit sortiert, mit Dauer rechts **[vorgeprüft]**
- [ ] Termin anklicken öffnet den Dialog; **Dauer ist ein Feld** **[vorgeprüft]**
- [ ] Der **Tag ist eine Auswahl aus genau zwei Werktagen**, kein freies Datum **[vorgeprüft]**
- [ ] „neuer Termin +" legt am richtigen Tag an **[nur du]**
- [ ] Termin **ohne Uhrzeit** speichern — es kommt eine Meldung, das Feld wird rot **[nur du]**
- [ ] Im Dialog den Tag wechseln, speichern — der Termin steht auf der anderen Seite **[nur du]**

### Vergangene Termine

- [ ] In der Leiste steht ein vergangener Termin unter **Überfällig** **[vorgeprüft]**
- [ ] Er bietet **„auf heute holen"** und **„löschen"** **[vorgeprüft]**
- [ ] Er hat **kein Kästchen** — Termine kennen kein Abhaken mehr **[vorgeprüft]**
- [ ] „auf heute holen" drücken — er erscheint im Kalender und im Planner **[nur du]**

### Planner

- [ ] **Klick auf einen Terminblock** öffnet den Termindialog **[vorgeprüft]**
- [ ] **Klick auf einen Aufgabenblock** öffnet den Aufgabendialog **[vorgeprüft]**
- [ ] Aufgabenblöcke haben ein **Kästchen**, Terminblöcke nicht **[vorgeprüft]**
- [ ] **Klick im Vorrat links** öffnet den Aufgabendialog **[vorgeprüft]**
- [ ] **Ziehen wie bisher:** Aufgabe aus dem Vorrat auf eine Stunde, Termin von
      einem Tag auf den anderen, Aufgabe zurück nach links **[nur du]**
- [ ] Ziehen und Klicken kommen sich **nicht** ins Gehege — ein Zug darf keinen
      Dialog öffnen **[nur du]**

---

## Schritt 5 — Notizen mit Markdown

### Schmierzettel an beiden Stellen

- [ ] In der **Leiste** steht ein kompakter Schmierzettel zwischen „Als Nächstes“
      und „Favoriten“ **[vorgeprüft]**
- [ ] Dort etwas tippen, ins **Modul Notizen** wechseln — derselbe Text steht oben **[vorgeprüft]**
- [ ] Im Modul ändern, zurück zur Leiste — die Änderung ist dort **[vorgeprüft]**
- [ ] **Seite neu laden** — der Text steht noch da **[vorgeprüft]**
- [ ] **Sichern**, Schmierzettel ändern, **Laden** — der gesicherte Text kommt zurück.
      Das ist die Stelle, die um ein Haar still nicht geladen worden wäre **[nur du]**
- [ ] „leeren“ räumt ab, „im Modul öffnen“ wechselt hinüber **[vorgeprüft]**

### Notizen

- [ ] Notizen sind nach Datum sortiert, **neueste zuerst** **[vorgeprüft]**
- [ ] Die Liste zeigt den Text **gesetzt**, nicht als Rohtext **[vorgeprüft]**
- [ ] **Neue Notiz** ist eine Telefonnotiz, Datum und Uhrzeit stehen schon im Text **[vorgeprüft]**
- [ ] Art auf „Allgemeine Notiz“ umstellen und speichern **[nur du]**
- [ ] Anrufer **aus der Kontaktliste** wählen · alternativ **frei eintragen** **[nur du]**
- [ ] Beides gefüllt — es gewinnt die Auswahl aus der Liste **[nur du]**
- [ ] Suche nach einem frei eingetragenen Namen findet die Notiz **[vorgeprüft]**
- [ ] Bearbeiten und Löschen **[nur du]**

### Der Weg als .md hinaus und zurück

- [ ] Bei einer Notiz **„als .md ausleiten“** (erscheint beim Überfahren) —
      es entsteht eine Datei mit Kopfblock **[nur du]**
- [ ] **„Notiz aus .md einlesen“** mit derselben Datei — Text, Titel, Datum und Uhrzeit
      kommen unverändert zurück **[nur du]**
- [ ] Der **Kontakt** kommt *nicht* zurück, der Name steht als Text da. Das ist Absicht:
      die Gegenseite kennt unsere Kennungen nicht **[vorgeprüft]**
- [ ] Eine **fremde** `.md` einlesen, die keinen Kopfblock hat — der Titel kommt aus der
      ersten Überschrift oder aus dem Dateinamen **[vorgeprüft]**
- [ ] Eine Notiz anlegen, deren Titel einen **Gedankenstrich** enthält, und eine, deren
      Text mit `---` beginnt. Ausleiten, einlesen — beide überleben.
      Das ist Fehlerbuch Punkt 5 **[vorgeprüft]**

### Nebenbei behoben

- [ ] **Laden** drücken — der Dateidialog zeigt jetzt `.json` an. Vorher filterte er auf
      `.md` und hätte die Sicherungsdatei ausgeblendet **[nur du]**

---

## Zwischenprüfung — Fehler, Inkonsistenzen, UI

Kein Roadmap-Schritt, sondern ein Durchgang über den erreichten Stand.
Fünf Befunde wurden behoben.

### Absturz: Termin ohne Uhrzeit (Fehlerbuch Punkt 12)

- [ ] Eine Sicherung schreiben, sie in einem Texteditor öffnen und bei einem
      Termin die Zeile `"zeit": "…"` **löschen**. Datei laden.
      Erwartet: Leiste und Planner stehen weiter, der Termin liegt auf 09:00,
      die Meldung nennt die ergänzten Felder. Vorher blieben **beide**
      Oberflächen leer, ohne Weg zurück **[vorgeprüft]**
- [ ] Dasselbe mit gelöschtem `"dauer"` — der Termin dauert dann 30 Minuten
      **[vorgeprüft]**

### Kontrast

- [ ] Metazeilen, Hinweise und Zähler ansehen — sie sind dunkler als vorher
      (`--ink3` von `#87837c` auf `#6b675e`, 3,46 : 1 → 5,17 : 1).
      Auf dem Windows-Bildschirm bei Tageslicht lesbar? **[nur du]**
- [ ] `referenz/theme-notion.html` daneben halten: dort sind `--ink2`,
      `--ink3` und das Rot nachgezogen. Sieht es noch nach Notion aus,
      oder ist es zu schwer geworden? **[nur du]**

### Gerüste sagen jetzt, was sie nicht können

- [ ] Textbausteine, Appstarter, Workflows, Outliner öffnen —
      über jeder Fläche steht ein gestricheltes Band **Gerüst** mit einem
      Satz dazu **[vorgeprüft]**
      *(Bookmarks stand hier bis Schritt 7 mit dabei und ist jetzt fertig.)*
- [ ] Auf der Leiste in der Modulliste: genau diese vier tragen die Marke
      **Gerüst**, die acht fertigen nicht **[vorgeprüft]**
- [ ] Die Modulliste bricht sauber um, die Marke ragt in keiner Breite über
      die Zeile hinaus **[vorgeprüft]**

### Keine Beschriftung ohne Tat (Fehlerbuch Punkt 9)

- [ ] In Textbausteinen „Kopieren“, in Apps „Starten“ — überall dieselbe
      ehrliche Meldung **[vorgeprüft]**
      *(`⌘1` und die Bookmark-Zeilen standen hier mit; seit Schritt 7
      öffnen sie wirklich und werden dort geprüft.)*

### README stimmt wieder

- [ ] `node werkzeug/pruefen.mjs` prüft neu, ob die drei Zahlen im README
      (Fehlerbucheinträge, angemeldete Module, Gerüste) zur Anwendung
      passen. Zum Ausprobieren eine Zahl im README verfälschen — der Lauf
      muss anschlagen **[vorgeprüft]**

### Offen geblieben, bewusst

- Aufgaben und Kalender haben keine eigene Modulsuche, Kontakte und Notizen
  schon. Zurückgestellt.
- Ein Eintrag ohne Titel zeichnet eine leere Zeile. Nur über eine von Hand
  bearbeitete Sicherung erreichbar. Zurückgestellt.

---

## Dialoge: Ausrichtung und Abstände

Gefunden auf dem iPad, nicht von einer Prüfung. Fehlerbuch Punkt 14.

- [ ] **Termin bearbeiten** öffnen. „Tag“ und „Uhrzeit“ beginnen auf
      derselben Höhe, „Dauer“ und „Kontakt“ ebenso. Der Hinweis
      „Nur diese beiden Werktage.“ steht **unter** dem Auswahlfeld
      **[vorgeprüft in Chromium]**
- [ ] **Neue Notiz** öffnen — dieselbe Prüfung für „Art“/„Datum“ und
      „Uhrzeit“/„Kontakt aus der Liste“ **[vorgeprüft in Chromium]**
- [ ] Das **Datumsfeld** und das **Zeitfeld** enden bündig mit dem Feld
      darüber und darunter, laufen also nicht aus ihrer Spalte.
      **Das ist der Punkt, der auf dem iPad falsch war und den ich hier
      nicht nachstellen kann — bitte dort ansehen** **[nur du]**
- [ ] Ihr Wert steht **links**, nicht mittig **[nur du — auf dem iPad]**
- [ ] In Edge auf Windows: Das Kalendersymbol im Datumsfeld und das
      Uhrsymbol im Zeitfeld sind noch da und öffnen den Wähler.
      `appearance:none` könnte sie theoretisch verschlucken; in Chromium
      tut es das nicht **[nur du]**

---

## Anordnung der Dialogfelder

Vorschlag und Mockup unter `mockups/dialog-anordnung.html`.
Die Ordnung: **Was → Wann → Wer → Dazu**, in allen vier gleich.

- [ ] **Termin:** Titel · Tag (breit) · Uhrzeit + Dauer nebeneinander ·
      Kontakt (breit) · Anmerkung. Die Dauer trägt „Minuten“ **im** Feld
      **[vorgeprüft]**
- [ ] **Aufgabe:** Titel · Fällig am + Uhrzeit nebeneinander ·
      Kategorie + Kontakt · Notizen **[vorgeprüft]**
- [ ] **Kontakt:** Vorname · Nachname · Firma (breit) · Telefon + E-Mail ·
      Notizen · Favorit. Kein Loch mehr neben der E-Mail **[vorgeprüft]**
- [ ] **Notiz, Telefonnotiz:** Titel · Art (breit) · Datum + Uhrzeit ·
      Anrufer + frei eintragen · Text **[vorgeprüft]**
- [ ] **Notiz, Art auf „Allgemeine Notiz“ stellen** — Uhrzeit und die
      beiden Anruferfelder verschwinden, das Datum nimmt die ganze Zeile,
      der Merkkasten unten wechselt den Text mit **[vorgeprüft]**
- [ ] Beim Umschalten bleibt der Schreibzeiger im Auswahlfeld „Art“
      **[vorgeprüft]**
- [ ] **Eine Telefonnotiz mit Anrufer und Uhrzeit auf „allgemein“
      umstellen und speichern.** Danach sichern und die Datei ansehen:
      `zeit`, `kontakt` und `wer` sind leer. Was die Maske nicht zeigt,
      wird nicht gespeichert **[vorgeprüft]**
- [ ] Zurück auf „Telefonnotiz“ — die Felder sind wieder da (leer)
      **[vorgeprüft]**
- [ ] **Dauer:** Das Zahlenfeld hat in Edge Pfeilchen zum Hoch- und
      Runterzählen. Kollidieren die mit dem Wort „Minuten“? In Chromium
      stehen sie davor und es passt **[nur du]**

---

## Anlegen im Planner

Vorschlag und Mockup unter `mockups/planner-anlegen.html`.

- [ ] Der Planner hat **drei runde Plus-Knöpfe**, je einen in der Kopfzeile
      von Vorrat, „Heute“ und „Danach“. Ohne Beschriftung, kreisrund
      **[vorgeprüft]**
- [ ] Zeigen auf einen Knopf nennt seinen Zweck (Titel-Kurzhinweis)
      **[nur du]**
- [ ] **„+“ im Vorrat** legt eine Aufgabe an, ohne Datum, Kategorie To-do.
      Sie erscheint sofort im Vorrat **[vorgeprüft]**
- [ ] **„+“ in „Heute“** legt einen Termin an: Tag vorbelegt, Uhrzeit auf
      der nächsten vollen Stunde **[vorgeprüft]**
- [ ] **„+“ in „Danach“** belegt 09:00 vor — dort gibt es kein „jetzt“
      **[vorgeprüft]**
- [ ] **Klick in eine freie Stunde** legt dort einen Termin an, Tag und
      Uhrzeit aus der angeklickten Stelle **[vorgeprüft]**
- [ ] Beim Zeigen auf eine freie Stunde färbt sie sich ein — sonst wäre
      nicht zu sehen, dass dort etwas geht **[nur du]**
- [ ] **Klick auf einen vorhandenen Block** öffnet ihn und legt *nichts*
      Neues an. Auch nicht, wenn man knapp daneben trifft **[vorgeprüft]**
- [ ] **Auf dem iPad:** Die drei Knöpfe funktionieren. Der Klick in eine
      leere Stunde ebenfalls — nur die Einfärbung beim Zeigen fällt weg,
      weil es dort keinen Zeiger gibt **[nur du]**

### Nicht umgesetzt, bewusst

Das **Ziehen funktioniert auf dem iPad nicht** — iOS Safari feuert die
HTML5-Drag-Ereignisse nicht. Einplanen geht dort über den Dialog: Block
antippen, Tag und Uhrzeit setzen. So entschieden.

---

## Bookmarks dichter — Fassung C

Die Fläche ist umgebaut: Gruppenname links, Chips daneben, Schnellzugriff
oben, Schalter `ordnen ›`. Gemessen bei 808 px Flächenbreite: **315 px**
statt vorher rund 1800.

### Ruhezustand

- [ ] Alle 24 Bookmarks sind **ohne Scrollen** zu sehen **[nur du]**
- [ ] Ein Klick auf einen Chip öffnet in einem **neuen Tab** **[vorgeprüft]**
- [ ] Angeheftete Chips tragen ihr Kürzel und einen Tintenton, die
      übrigen nicht **[vorgeprüft]**
- [ ] **Keine** Nadel, kein Stift, kein „umbenennen" zu sehen **[vorgeprüft]**
- [ ] Im Schnellzugriff stehen acht Felder — vier belegt, vier
      gestrichelt und mit „frei" beschriftet **[vorgeprüft]**
- [ ] Ein Klick auf ein belegtes Feld öffnet **[vorgeprüft]**

### Zustand „Ordnen"

- [ ] `ordnen ›` rechts neben „Alle Bookmarks" schaltet um; der Knopf
      heißt danach `fertig ›` **[vorgeprüft]**
- [ ] Jeder Chip trägt Nadel und Stift, jede Gruppe „umbenennen", jede
      Zeile „+ neues Bookmark" **[vorgeprüft]**
- [ ] Die Nadel heftet an und löst — der Zustand bleibt dabei auf
      „Ordnen" stehen **[vorgeprüft]**
- [ ] Der Stift öffnet den Dialog **[vorgeprüft]**
- [ ] „+ neues Bookmark" in der Zeile *Werkzeug* — im Dialog steht die
      Gruppe schon auf **Werkzeug** **[vorgeprüft]**
- [ ] `fertig ›` schaltet zurück, die Knöpfe verschwinden **[vorgeprüft]**
- [ ] **Seite neu laden** — die Fläche steht wieder im Ruhezustand. Der
      Schalter ist eine Ansicht, kein Datum, und wird nicht gesichert
      **[vorgeprüft]**

### Umbrechen und Ränder

- [ ] Fenster schmaler ziehen — die Chips brechen um, nichts läuft
      seitlich hinaus **[nur du]**
- [ ] Auf dem **iPhone** ansehen: Schnellzugriff zweispaltig, Chips
      untereinander, kein waagerechtes Scrollen **[nur du]**
- [ ] Thema **Basecamp** — Chips grün statt tintenfarben, sonst gleich
      **[vorgeprüft]**
- [ ] Alle Bookmarks löschen — der Leertext nennt den Weg über „Ordnen"
      **[vorgeprüft]**

### Symbole

- [ ] Nadel und Stift sind als **Umrisse** zu sehen, nicht als dunkle
      Blöcke. Beides ist Inline-SVG mit `stroke="currentColor"`;
      Fehlerbuch Punkt 2 **[nur du]**

---

## Vollhöhe auf dem iPhone · **bestätigt**

Fehlerbuch Punkt 15. `100vh` ist auf iOS die Höhe *ohne* die
Safari-Leisten; im Querformat rutschte der Kopf dadurch aus dem
Sichtbaren, und `body{overflow:hidden}` ließ ihn nicht zurückholen.

- [x] iPhone, **Querformat** — die obere Leiste mit Uhrzeit, Sichern und
      dem Themen-Umschalter ist zu sehen
      **[nur du · am 7. August bestätigt]**
- [ ] Dasselbe im Hochformat und auf dem iPad **[nur du]**
- [ ] Ein Dialog im Querformat — Kopf und Fuß beide erreichbar?
      `.dlg` hing am selben Maß **[nur du]**

Am Rechner nicht nachweisbar: Chromium gibt `vh` und `dvh` denselben
Wert. Diese Zeilen können nur vom Gerät kommen.

---

## Schritt 7 — Bookmarks

Der Apps-Teil von Schritt 7 fehlt weiter und wartet auf Schritt 0.

**Am 7. August am eigenen Gerät bestätigt:** Das Ändern einer Adresse
lässt die Anheftung stehen — der Umbau von Adresse auf Kennung trägt
also auch mit echten, aus `localStorage` geladenen Daten, nicht nur mit
den Demodaten im Prüfbrowser.

### Öffnen

- [ ] Im Modul auf **MDN Web Docs** klicken — die Seite öffnet in einem
      **neuen Tab**, das Dashboard bleibt stehen **[nur du]**
- [ ] `⌘1` drücken — dasselbe. Vorher meldete es nur „Noch nicht
      eingebaut“ **[nur du — ⌘ fängt der Browser ab, nicht im Test prüfbar]**
- [ ] Auf der Leiste eine der Bookmark-Kacheln anklicken — öffnet ebenso
      **[vorgeprüft]**
- [ ] In der Leiste `github` tippen und den Treffer mit `↵` nehmen —
      öffnet ebenso **[vorgeprüft]**
- [ ] Ein Bookmark anlegen mit der Adresse `beispiel.de` — geöffnet wird
      `https://beispiel.de`. Eines mit `mailto:x@y.de` — das bleibt
      unverändert **[nur du]**

### Anlegen, Bearbeiten, Löschen

- [ ] „neues Bookmark +“ · Titel und Adresse leer lassen · Speichern —
      die Meldung zeigt auf das Titelfeld, der Dialog bleibt offen
      **[vorgeprüft]**
- [ ] Anlegen mit gesetztem Schalter **Auf die Leiste heften** — der
      Eintrag steht danach sofort auf der Leiste **[vorgeprüft]**
- [x] Ein Bookmark bearbeiten und seine **Adresse ändern** — die
      Anheftung bleibt bestehen. (Genau das ging vor dem Umbau auf `id`
      nicht.) **[vorgeprüft · am 7. August am eigenen Gerät bestätigt]**
- [ ] Ein angeheftetes Bookmark löschen — die Rückfrage nennt den frei
      werdenden Platz, danach rücken die dahinter auf **[vorgeprüft]**

### Anheften

- [ ] Acht Bookmarks anheften, ein neuntes versuchen — „Acht Plätze
      belegt — erst einen lösen“, es passiert nichts weiter **[nur du]**
- [ ] Ein angeheftetes trägt Tinte und zeigt `⌘n`, ein nicht angeheftetes
      steht blass auf „anheften“ **[vorgeprüft]**

### Gruppen

- [ ] „umbenennen“ an einer Gruppe · neuen Namen eintragen — alle
      Bookmarks der Gruppe ziehen mit **[vorgeprüft]**
- [ ] Denselben Namen wie eine vorhandene Gruppe eintragen — beide werden
      zu einer, die Meldung sagt „aufgegangen“ **[vorgeprüft]**
- [ ] Das letzte Bookmark einer Gruppe in eine andere verschieben — die
      leere Gruppe verschwindet von selbst **[vorgeprüft]**

### Der Datenumbau

- [ ] Eine **alte Sicherung** laden, in der die Bookmarks keine `id`
      haben und `pins` Adressen enthält — die Anheftungen stehen danach
      an derselben Stelle **[nur du]**
- [ ] Sichern, alles leeren, wieder laden — 24 Bookmarks, 4 Anheftungen,
      jede zeigt auf ein vorhandenes Bookmark **[vorgeprüft]**

### Erfassen in der Leiste

- [ ] `neuedomain.example/x` tippen — unter „Erfassen“ steht ein Angebot
      **Bookmark** **[vorgeprüft]**
- [ ] `Das ist ein Satz. Mit Punkt` tippen — **kein** Bookmark-Angebot
      **[vorgeprüft]**

---

## Nach jeder Sitzung

Kurzliste, die für jeden künftigen Schritt gilt. `doku/ARBEITSWEISE.md` §5 bis §7.

- [ ] `node werkzeug/pruefen.mjs` läuft ohne Fehler durch
- [ ] `git diff --stat` — für ein Modul 50 bis 200 Zeilen. Über 500 heißt:
      Die Datei wurde umgeschrieben statt ein Block ersetzt → zurücknehmen
- [ ] Die geänderte Fläche per Doppelklick angesehen. Hell und lesbar?
- [ ] **Seite neu laden** — ist die Änderung noch da?
- [ ] Sichern, Laden — kommt alles zurück?
- [ ] `doku/ROADMAP.md`, `STAND.md` und diese Datei nachgezogen

---

## Noch nicht fällig

Platzhalter für die kommenden Schritte, damit nichts verlorengeht.

- **Schritt 4 — Textbausteine:** Ein Baustein mit drei Platzhaltern liegt in vier
  Klicks als fertiger Text in der Zwischenablage. *Braucht Schritt 0*
- **Schritt 6 — Workflows:** Neue Instanz hat sofort alle acht Teilschritte mit leeren
  Werten · Durchlauf bis zum Ende klickbar · überfälliger aktiver Schritt erscheint in
  Leiste und Planner · Klick auf Schritt 6 ändert den Stand **nicht**
- **Schritt 7, Apps-Teil:** Eine App startet auf dem Zielrechner wirklich.
  *Braucht Schritt 0* — die Bookmarks aus Schritt 7 sind erledigt und oben
  abzuhaken.
- **Schritt 8 — Hilfe:** Baut sich aus dem Register auf, ein neues Modul erscheint
  dort von selbst
- **Schritt 9 — Outliner:** `Tab` rückt ein, `Umschalt+Tab` aus
