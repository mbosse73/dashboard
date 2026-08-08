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

## Schritt 0 — Browsertest · **erledigt am 7. August 2026**

Alle Prüfungen bestanden: localStorage, Zwischenablage, andere lokale
Datei öffnen, `tel:` und `mailto:`. **Keiner der Notwege wird gebraucht.**
Die Haken unten stehen deshalb.

`browsertest.html` per Doppelklick öffnen, alle Knöpfe der Reihe nach drücken.

- [x] **localStorage nutzbar** — Abschnitt „Speicherwege“, läuft ohne Knopfdruck **[nur du]**
      → Ergebnis: **ja**
- [x] **Zwischenablage** — Knopf „Kopieren testen“ **[nur du]**
      → Ergebnis: **ja**, der gerade Weg über `navigator.clipboard`
- [x] **Andere lokale Datei öffnen** — Knopf „Appstart testen“, vorher eine beliebige
      `test2.html` danebenlegen **[nur du]**
      → Ergebnis: **ja**, `window.open` genügt
      → Ergebnis: `________`  ·  Bei *nein*: Appstarter braucht einen Link statt `window.open`
- [x] **Anrufen und Mailen** — Knöpfe „Anruf-Übergabe“ und „Mail-Übergabe“ **[nur du]**
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

## Schritt 8 — die Hilfe

### Die Hilfe

- [ ] Leiste · Modul **Hilfe** öffnen. Links steht ein Index mit sechs
      Einträgen, rechts der Inhalt **[vorgeprüft]**
- [ ] Alle elf Module stehen unter „Module", mit Nummer, Erklärung und
      Gerüst-Marke **[vorgeprüft]**
- [ ] Die Erklärungen sind **verständlich**. Kurze Sätze, keine
      Verschachtelung **[nur du — das kann keine Prüfung sagen]**
- [ ] Ein Klick im Index springt zum Abschnitt **[nur du]**

### Die beiden Suchen bleiben getrennt

- [ ] In der Hilfe `platz` tippen — zwei Abschnitte bleiben übrig, der
      Index zeigt nur diese **[vorgeprüft]**
- [ ] `zzz` tippen — der Leertext sagt, dass die Hilfe nur sich selbst
      durchsucht **[vorgeprüft]**
- [ ] In der **Leiste** `hilfe` tippen — es erscheint **kein**
      Hilfe-Treffer. Das Modul meldet kein `suche` an **[vorgeprüft]**
- [ ] Von der Hilfe zur Leiste wechseln und zurück — der Suchtext der
      Hilfe ist weg, die Leiste unberührt **[nur du]**

### Die Schnellhilfe

- [ ] `F1` drücken — ein Fenster mit allen zehn Kürzeln geht auf
      **[nur du — F1 könnte von Edge abgefangen werden]**
- [ ] `Esc` schließt. `F1` schließt ebenfalls **[vorgeprüft]**
- [ ] Klick neben das Fenster schließt **[vorgeprüft]**
- [ ] „Zur ausführlichen Hilfe" wechselt zur Modulfläche **[nur du]**
- [ ] `⇧F1` öffnet die Hilfe **[nur du]**

### Die Kürzel stimmen mit der Wirklichkeit überein

- [ ] Jedes Kürzel aus der Liste **einmal drücken**. Jedes tut, was
      danebensteht **[nur du]**
- [ ] `F1` und `⇧F1` tragen den Vermerk „noch nicht bestätigt". Sobald
      die Tastenprüfung läuft, fällt er weg **[vorgeprüft]**
- [ ] `⌘K` und `⌘P` laufen jetzt über die Tabelle statt über eine
      `if`-Kette — sie wirken unverändert **[vorgeprüft]**

### Die Eingabemuster deuten noch

- [ ] `Rückruf Kanzlei ? mo 14:30 @meier` in der Leiste — Aufgabe,
      Nachverfolgen, Montag, 14:30, Kontakt Meier **[vorgeprüft]**
- [ ] Die sechs Muster in der Hilfe stimmen mit dem überein, was die
      Leiste tut **[nur du]**

### Der Prüflauf verlangt Hilfetexte

- [ ] `node werkzeug/pruefen.mjs` meldet „alle Hilfetexte vorhanden und
      kurz gebaut" **[vorgeprüft]**
- [ ] Zum Ausprobieren ein `hilfe` entfernen — der Lauf schlägt an und
      nennt das Modul **[vorgeprüft]**
- [ ] Einen Schachtelsatz eintragen — der Lauf nennt Wortzahl und
      Kommazahl **[vorgeprüft]**

---

## Die Pinnwand · Vorgang 2

Zwölf Plätze, „Häufig benutzt", links unter dem Schmierzettel. Auf ihnen
liegen Webseiten **und** Apps.

### In der Leiste

- [ ] Der Block heißt **„Häufig benutzt"** und steht **links**, unter dem
      Schmierzettel **[vorgeprüft]**
- [ ] Belegte Plätze tragen ihr Kürzel, ein Zeichen für die Herkunft und
      den Namen. Ein gestricheltes Feld nennt die Restzahl **[vorgeprüft]**
- [ ] Ein Klick auf einen Platz öffnet — Webseite in einem neuen Tab, App
      als lokale Datei **[nur du]**
- [ ] `⌘1` bis `⌘8` öffnen die ersten acht. `⌘9` tut nichts — es gibt
      keine Kombination dafür
      **[nur du — ⌘ fängt der Browser ab, nicht im Test prüfbar]**
- [ ] Alle zwölf belegen. Die Leiste **scrollt nicht** **[vorgeprüft]**

### Anheften

- [ ] Modul Bookmarks · `ordnen ›` · Nadel an einem Chip — der Eintrag
      erscheint in der Leiste **[vorgeprüft]**
- [ ] Modul Appstarter · „anheften" an einer App — dasselbe, mit dem
      Fenster-Zeichen statt der Weltkugel **[vorgeprüft]**
- [ ] Beide stehen im selben Streifen, nicht in zwei getrennten
      **[vorgeprüft]**
- [ ] Einen dreizehnten anheften — „12 Plätze belegt — erst einen lösen",
      es passiert nichts weiter **[vorgeprüft]**
- [ ] Im Modul Bookmarks zeigt „Häufig benutzt" alle zwölf Plätze, freie
      gestrichelt **[vorgeprüft]**

### Der Appstarter startet

- [ ] Eine App anklicken — sie öffnet sich wirklich. Vorher meldete das
      Modul nur „Noch nicht eingebaut" **[nur du]**
- [ ] Das Gerüstband sagt jetzt „Starten und Anheften tragen. Anlegen,
      Bearbeiten und Löschen fehlen noch." **[vorgeprüft]**

### Die Migration — der heikelste Teil

- [ ] **Eine Sicherung von vor Schritt 7 laden**, in der `pins` Adressen
      enthält. Die Anheftungen stehen danach an derselben Stelle
      **[nur du]**
- [ ] **Eine Sicherung von gestern laden**, in der `pins` blanke
      Kennungen enthält. Dasselbe **[nur du]**
- [ ] Heute sichern, alles leeren, wieder laden — zwölf Plätze,
      unverändert **[vorgeprüft]**
- [ ] Ein angeheftetes Bookmark löschen — der Platz wird frei, die
      dahinter rücken auf **[vorgeprüft]**
- [ ] Eine Sicherung mit einem Platz auf ein nicht vorhandenes Modul
      laden — er fällt weg, die Meldung sagt es **[vorgeprüft]**

*Sechs Sicherungsformen sind im Prüfbrowser durchgespielt worden:
Adressen, blanke Kennungen, Objekte, gemischt, mutwillig kaputt, leer.
Dabei kam heraus, dass Stufe 1 der Migration zunächst jeden Platz fraß,
der schon die neue Form hatte.*

### Zeichen

- [ ] Weltkugel und Fenster sind **Umrisse**, keine dunklen Blöcke.
      Beides Inline-SVG mit `stroke="currentColor"`; Fehlerbuch Punkt 2
      **[nur du]**

---

## Die Breite auf 24 Zoll · Vorgang 1

Gemessen bei 1920 × 950 — im Rumpf bleiben 895 px.

### Die Leiste, Ruhezustand

- [ ] Alle sechs Blöcke sind **ohne Scrollen** zu sehen: links
      Überfälliges, nächster Termin, Schmierzettel — rechts Favoriten,
      Bookmarks, Module **[nur du]**
- [ ] Die Modulliste ist vollständig. Vorher lagen 286 px unter der
      Kante **[nur du]**
- [ ] Beide Spalten beginnen auf derselben Höhe **[vorgeprüft]**

### Umbrechen

- [ ] Fenster auf unter 1100 px ziehen — alles steht wieder
      **untereinander**, in der alten Reihenfolge **[nur du]**
- [ ] Bei 1024, 852 und 390 px läuft nichts seitlich hinaus
      **[vorgeprüft]**
- [ ] Auf dem iPhone ansehen — einspaltig wie bisher **[nur du]**

### Das Suchergebnis bleibt schmal

- [ ] `meier` eintippen. Die Treffer stehen **einspaltig** und rund
      860 px breit, nicht über die volle Fläche **[vorgeprüft]**
- [ ] Feld leeren — die Fläche wird wieder zweispaltig **[vorgeprüft]**
      *Der Grund: Treffer sind nach Rang geordnet, und `↵` nimmt den
      obersten. In zwei Spalten stünde der zweitbeste daneben statt
      darunter.*

### Der Planner

- [ ] Die Spaltenränder reichen bis zum **unteren Rand** der Fläche.
      Vorher hörten sie mitten im Bild auf **[nur du]**
- [ ] Die Terminblöcke sind schmaler als vorher — ein halbstündiger
      Standup füllt nicht mehr die halbe Breite **[nur du]**
- [ ] Der Aufgabenvorrat links ist breiter; „Rückruf Kanzlei · Nach-
      verfolgen · ohne Frist · Eva Bergmann" bricht weniger um **[nur du]**
- [ ] Fenster auf 1280 px ziehen — die Tagesspalten sind **nicht**
      schmaler als vor der Änderung **[vorgeprüft]**
- [ ] Ziehen funktioniert unverändert: Aufgabe aus der Liste auf eine
      Stunde, und wieder zurück **[nur du]**

### Der Kopf

- [ ] Der Themen-Umschalter steht näher am Inhalt, nicht mehr in der
      Ecke. Die helle Leiste selbst läuft weiter über die volle Breite
      **[nur du]**

### Übergreifend

- [ ] Thema **Basecamp** — dieselbe Anordnung, andere Farben
      **[vorgeprüft]**
- [ ] Alle Modulflächen einmal öffnen: nichts läuft seitlich hinaus,
      erklärender Text bleibt schmal **[nur du]**
- [ ] Seite neu laden — unverändert **[vorgeprüft]**
- [ ] Sichern, laden — unverändert. Es hat sich nichts an den Daten
      geändert, das muss also durchlaufen **[vorgeprüft]**

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

Der Apps-Teil von Schritt 7 fehlt weiter — seit dem bestandenen
Browsertest aber nicht mehr blockiert.

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
  Klicks als fertiger Text in der Zwischenablage. *Schritt 0 bestanden,
  der gerade Weg über `navigator.clipboard` ist frei*
- **Schritt 6 — Workflows:** Neue Instanz hat sofort alle acht Teilschritte mit leeren
  Werten · Durchlauf bis zum Ende klickbar · überfälliger aktiver Schritt erscheint in
  Leiste und Planner · Klick auf Schritt 6 ändert den Stand **nicht**
- **Schritt 7, Apps-Teil:** Eine App startet auf dem Zielrechner wirklich.
  *Schritt 0 bestanden, `window.open` ist frei* — die Bookmarks aus
  Schritt 7 sind erledigt und oben abzuhaken.
- **Schritt 8 — Hilfe:** Baut sich aus dem Register auf, ein neues Modul erscheint
  dort von selbst
- **Schritt 9 — Outliner:** `Tab` rückt ein, `Umschalt+Tab` aus

---

## Schritt 9 — der Outliner

`dashboard.html` per **Doppelklick** in Edge, dann Leiste → Outliner.

### Gliederung

1. In eine Zeile tippen, `↵` drücken — teilt sie an der Schreibmarke?
2. `Tab` im neuen Knoten — rückt er ein? `⇧Tab` — wieder heraus?
3. Ein Knoten **mit** Unterknoten: `Tab` und `⇧Tab` — kommen die
   Unterknoten mit?
4. `Tab` beim **ersten** Knoten unter seinem Elternteil — sagt er
   „Kein Knoten darüber auf gleicher Ebene"?
5. `Alt+↑` und `Alt+↓` — verschiebt sich der Knoten samt allem darunter?
6. `⌫` am Zeilenanfang — verbindet er mit der Zeile darüber? Bei einem
   Knoten **mit** Unterknoten: lehnt er ab und sagt es?
7. Klick aufs Dreieck — klappt zu, Zähler `+2` erscheint?
8. `Strg+.` — dasselbe über die Tastatur?
9. `⇧↵` — öffnet sich die Notizzeile? `↵` darin — zurück in den Knoten?
   `⌫` in der leeren Notiz — verschwindet sie?
10. Klick auf den Punkt eines Knotens mit Unterknoten — springt er
    hinein? Steht der Pfad oben? Führt er zurück?

### Rückgängig

11. Mehrere Änderungen, dann `Strg+Z` **mehrfach** — geht jede zurück?
12. `Strg+⇧+Z` und `Strg+Y` — stellen beide wieder her?
    **`Strg+Y` ist am Zielrechner noch nicht bestätigt.**
13. Einen ganzen Satz tippen, dann einmal `Strg+Z` — ist der ganze Satz
    weg, nicht nur ein Buchstabe?

### Fristen

14. ` @20.8.` an eine Zeile hängen, dann `Tab` — erscheint die Marke?
15. ` @morgen` tippen, Zeile verlassen — steht dort jetzt das
    ausgeschriebene Datum?
16. ` @20.8...31.8.` — wird ein Zeitraum daraus, keine Frist?
17. Ein Datum in der **Vergangenheit** — ist die Marke rot?
18. Eine Mailadresse in eine Zeile schreiben — bleibt sie unangetastet?

### Gantt und Mindmap

19. Auf **Gantt** schalten — Balken für Zeiträume, Rauten für Fristen,
    offener Rahmen bei Elternpunkten ohne eigenes Datum?
20. Steht die rote Heute-Linie an der richtigen Stelle?
21. Einen Zweig **zuklappen**, dann in den Gantt — sind seine Fristen
    weiterhin da? (Sie müssen es sein.)
22. In einen Knoten **hineinspringen**, dann in den Gantt — zeigt er nur
    noch diesen Zweig? (Das muss er.)
23. Auf **Mindmap** schalten — überdeckt sich nichts? Liegen Linien und
    Kästen aufeinander?

### PDF

24. „Als PDF ausgeben …" — geht der Dialog auf?
25. Mit **A4** ausgeben — **lädt Edge die Datei überhaupt herunter?**
    Das ist am Zielrechner noch nicht bestätigt.
26. Die Datei öffnen: Umlaute richtig? „Rabattlogik prüfen", nicht
    „Rabattlogik pr?fen"?
27. Mit **A2** ausgeben — größere Schrift, ein Blatt?
28. Eine Gliederung mit **vielen** Zeilen anlegen, dann A4 — bricht sie
    um? Steht auf Blatt 2 die Namensspalte? Steht „Blatt 2 von 3"?
29. Eine Frist ein Jahr in die Zukunft setzen — wird die Achse gröber
    (Monate statt Wochen)?
30. Mindmap als PDF mit „von selbst wählen" — nennt die Fußzeile das
    gewählte Format?

### Zusammenspiel

31. Sichern, Seite neu laden, Laden — kommt die Gliederung samt Notizen,
    Fristen und zugeklappten Zweigen zurück?
32. In der **Leiste** einen Knotentext tippen — erscheint ein
    Gliederungs-Treffer? Führt er in den Outliner?
33. In der **Hilfe** nach „Outliner" suchen — stehen alle Tasten da?
34. Planner, Kalender und Jahreskalender öffnen — taucht **keine**
    Outliner-Frist dort auf?

---

## Schritt 16 — SQL im Code-Beautifier

`dashboard.html` per **Doppelklick** in Edge.

### Erkennung in der Leiste

1. `select id from kunden where a=1` tippen — erscheint „SQL einrücken"?
2. `Ich soll etwas selektieren und dann melden` — erscheint **kein**
   Angebot? (Das Wort „selektieren" steht nicht am Anfang.)
3. Nur `select` tippen — **kein** Angebot? (Zu kurz.)
4. `{"a":1,"b":[2,3]}` — erscheint „JSON einrücken", **nicht** SQL?
5. Ein Treffer angeklickt: Öffnet sich der Beautifier mit der richtigen
   Art vorgewählt und dem Text schon im Feld?

### Namen bleiben, wie sie stehen

Das ist der wichtigste Abschnitt. Diese Zeile einsetzen und formatieren:

```
select date, text, key, name, [Vor Name], left(name,3) from Kunden_Stamm where Status='offen'
```

6. Stehen `date`, `text`, `key`, `name` danach immer noch **klein**?
7. Ist aus `left(name,3)` **nicht** `LEFT(...)` geworden?
8. Steht `Kunden_Stamm` unverändert da, mit großem K und großem S?
9. Steht `Status` unverändert da, nicht `STATUS`?
10. Ist `[Vor Name]` unangetastet, samt Leerzeichen?

### Formatieren

11. Eine Abfrage mit `LEFT JOIN … ON … AND …` — steht `ON` eingerückt
    unter dem Verbund, das `AND` darunter?
12. Eine Abfrage mit `CASE WHEN … THEN … ELSE … END` — bricht sie um?
    Bleibt `THEN` bei seinem `WHEN`?
13. Eine Unterabfrage in Klammern — bricht die Klammer um?
14. `count(*)` — bleibt es zusammen, ohne Umbruch?
15. Ein Text mit Apostroph: `'Müller''s Firma'` — bleibt er unverändert?
16. Ein Kommentar `-- so` und `/* so */` — bleiben beide erhalten?
17. Zwei Anweisungen mit `;` — steht eine Leerzeile dazwischen?

### Wenn es nicht geht

18. Etwas eingeben, das kein SQL ist (ein deutscher Satz) — kommt eine
    Ausgabe oder eine Meldung? Beides ist zulässig, **verschwinden darf
    nichts**.
19. Auf JSON umschalten und ungültiges JSON formatieren — erscheint die
    rote Meldung, und bleibt das Ausgabefeld leer?

### Zusammenspiel

20. Zwischen JSON und SQL hin- und herschalten — bleibt die Eingabe
    stehen, wird das Ergebnis geleert?
21. Beide Themen ansehen — ist der Schalter in Basecamp lesbar?

---

## Schritt 7, Apps-Teil — Anlegen, Bearbeiten, Löschen

Leiste → Appstarter.

1. „Neue App" — geht der Dialog auf? Stehen die Felder in der Reihenfolge
   Titel, Pfad, Wozu, Anheften? Nimmt keines davon nur eine halbe Zeile
   allein ein?
2. Ohne Titel speichern — wird das Titelfeld beanstandet und gezeigt?
3. Ohne Pfad speichern — dasselbe für den Pfad?
4. Eine App mit Titel und Pfad anlegen, „Auf die Leiste heften" an —
   erscheint sie in der Liste **und** unter „Häufig benutzt" in der
   Leiste?
5. Sie **starten** — öffnet sich die Datei? (Nur mit einem Pfad, den es
   auf Ihrem Rechner wirklich gibt.)
6. „bearbeiten", Titel ändern, speichern — ändert sich auch die
   Beschriftung auf dem Platz?
7. „bearbeiten", Haken bei „Auf die Leiste heften" entfernen —
   verschwindet der Platz?
8. Löschen: Nennt die Rückfrage den freiwerdenden Platz? Sagt sie, dass
   die Datei selbst bleibt?
9. Nach dem Löschen: Rückt das, was hinter dem Platz lag, auf?
10. Zwölf Plätze belegen, dann eine dreizehnte App anheften — kommt die
    Meldung „12 Plätze belegt, nicht angeheftet"?
11. In der Leiste `file:///C:/Tools/x.html` tippen — erscheint „als neue
    App anlegen"? Ist der Pfad im Dialog schon eingetragen?
12. In der Leiste ein gewöhnliches Wort tippen — erscheint **kein**
    App-Angebot?
13. Alle Apps löschen — steht dort ein Satz, der den Weg zeigt, statt
    einer leeren Fläche?
14. Sichern, neu laden, Laden — kommt alles zurück?

---

## Modul 17 — Einstellungen

Leiste → Einstellungen.

### Anzeige

1. **Thema** umschalten — ändert sich die Fläche? Ändert sich auch der
   Umschalter oben im Kopf mit?
2. **Schriftgröße** auf *Groß* — wird alles größer, und bleibt die
   Seite **ohne senkrechten Rollbalken**? Das ist der wichtigste Punkt.
3. Bei *Groß*: einen Dialog öffnen — ist er auch größer?
4. **Schriftgröße** auf *Klein* — dasselbe in die andere Richtung.
5. Seite neu laden — bleibt die Schriftgröße erhalten?
6. **Startfläche** auf *Planner*, dann neu laden — startet die App im
   Planner?

### Arbeit

7. Eine Aufgabe mit Frist **heute** anlegen. **Überfällig ab** auf
   *am Tag selbst* — wird sie rot? Steht bei ihr „überfällig"?
8. Zurück auf *am Tag danach* — ist sie wieder normal?
9. Sichern, neu laden, Laden — kommt der Wert zurück? (Er steht in der
   Sicherung, anders als die Anzeige-Einstellungen.)

### Leiste

10. Einzelne Haken entfernen — verschwinden die Blöcke aus der Leiste?
11. **Alle sechs** entfernen — steht dort ein Satz und ein Knopf zurück
    in die Einstellungen? Die Leiste darf nie leer sein.
12. Haken wieder setzen — kommt alles zurück?

### Daten

13. **Erinnerung ans Sichern** auf *nach 3 Tagen*. Wenn Sie länger nicht
    gesichert haben: steht die Zeile oben?
14. Auf *aus* — verschwindet sie?
15. **Beispieldaten entfernen**: Zählt die Rückfrage alle Bereiche auf,
    auch die Bookmarks?
16. Nach dem Entfernen: Sind die Beispiel-Bookmarks weg **und** die
    Plätze frei, die auf sie zeigten?
17. Etwas selbst Angelegtes bleibt stehen?
18. **Alles zurücksetzen**: Kommen die Beispieldaten zurück?
19. Beide Rückfragen mit *Doch nicht* verlassen — bleibt alles?

### Was nicht sein soll

20. Ein drittes Thema wird **nicht** angeboten. Es ist noch nicht
    gebaut.
21. Für die Planner-Stunden gibt es **keine** Einstellung. Ein Termin um
    19:30 erscheint dort weiterhin nicht.

---

## Wartung — die vier Fehler

### Tastenkürzel

1. Steht irgendwo noch ein `⌘`? Leiste, Kacheln, Hilfe, Outliner
   durchsehen. Es darf keines mehr geben.
2. Hilfe öffnen: Heißt es überall `Strg`, `Umschalt`, `Rücktaste`?
3. Über der Pinnwand steht „Strg+1 bis Strg+8". Drücken Sie
   **Strg+1** — öffnet sich der erste Platz?
4. Sind die Kacheltitel wieder vollständig? „MDN Web Docs" war
   abgeschnitten.

### Meldungszettel

5. Erinnerung ans Sichern auf *nach 3 Tagen*, dann so lange nicht
   sichern (oder die Uhr vorstellen), bis das Banner erscheint.
6. Auf **Sichern** drücken. **Verschwindet das Banner sofort?** Das war
   der Fehler.
7. In den Einstellungen die Erinnerung auf *aus* — verschwindet es auch
   dann?

### SQL

8. Beautifier öffnen, `select data->>'x' from t` formatieren.
   Steht `data ->> 'x'` da — mit dem Pfeil **an einem Stück**?
9. `select 1.5e10 as x from t` — bleibt `1.5e10` zusammen?
10. `select tags @> '{a}' from t` — bleibt `@>` zusammen?
11. `select a?|b from t` — hier muss der Formatierer **verweigern** und
    sagen, dass er die Schreibweise nicht kennt. Eine Verweigerung ist
    hier das richtige Ergebnis.
12. Eine Ihrer echten Abfragen formatieren. Bleiben Tabellen- und
    Spaltennamen Zeichen für Zeichen gleich?

### Beispieldaten

13. Einstellungen → Beispieldaten entfernen. Nennt die Rückfrage jetzt
    auch den Satz über **bearbeitete Beispiele**?
14. Ein Beispiel bearbeiten (etwa einen Kontakt umbenennen), dann
    entfernen: Es verschwindet **mit**. So ist es gewollt — die
    Rückfrage sagt es vorher.
15. Nach dem Entfernen: Sind die 24 Beispiel-Bookmarks weg und die
    Plätze frei?
16. **Wichtig für vorhandene Sicherungen:** Eine ältere Sicherung
    laden. Stehen die angehefteten Plätze noch richtig? Die Bookmarks
    haben ihre Kennung jetzt aus `vorgabe()` statt aus `heile()`; die
    Werte sind dieselben, aber das gehört einmal am eigenen Gerät
    gesehen.

### Erfassen-Hinweis

17. In der Leiste `Angebot Hansen prüfen` tippen. Steht unter den
    Angeboten eine Zeile „Geht auch: …"?
18. Weiter tippen: `Angebot Hansen morgen 14:30 @kowalski`. Wird der
    Hinweis **kürzer**? Es soll nur noch stehen, was fehlt.
19. Ist die Zeile leise genug — zieht sie den Blick vom obersten
    Treffer weg?

### Modulliste

20. Endet die Liste rechts mit „17 Einstellungen"? Der Planner steht
    **darunter**, abgesetzt und ohne Nummer.

