# Stand

Notiz zur Übergabe an eine neue Unterhaltung. Ergänzt die übrigen
Dokumente um das, was noch offen ist.

---

## Wo wir stehen

**Zuletzt: der Jahreskalender.** Ein neues Modul 14 mit eigenem Bestand
`Z.jahrestermine`, bewusst getrennt vom Kalender (06) und vom Planner —
in beide Richtungen. Ein Eintrag hat Start- und Enddatum, keine Uhrzeit,
keinen Kontakt, und eine von zwei Kategorien: Urlaub oder sonstiger
Termin. Alle 365 Tage als 12 × 31 Raster.

**Die Fläche ist ein schwebendes Fenster, kein Rumpfbereich.** Es trägt
sich selbst in `dlgOffen` ein, damit Escape und der Klick daneben ohne
zweite Mechanik greifen — geöffnet wird es aber nicht über `dialog()`.
Das beginnt mit `dialogZu()` und schlösse sich selbst, sobald man einen
Tag anklickt; nach dem Speichern stünde man wieder vor der Leiste. Der
Eintrag klappt deshalb **im Fenster** auf. Wer dort etwas ändert, sollte
das wissen: Ein zweiter Dialog über dem Fenster ist konstruktiv
ausgeschlossen, nicht bloß unschön.

**Dabei gefunden und behoben:** Ein Klick auf einen Tag mit zwei
Einträgen öffnete immer nur den ersten. Der zweite war weder zu
bearbeiten noch zu löschen, und ein Löschversuch traf still den
falschen. Der Eingabebereich trägt jetzt einen Streifen mit allen
Einträgen des Tages.

**Davor: der Themen-Umschalter.** Basecamp ist kein zweites File mehr,
sondern ein Knopf im Kopf, der `data-theme="basecamp"` auf `body` setzt.
`referenz/theme-basecamp.html` ist entfallen; es gibt keine zweite
Fassung mehr, die auseinanderlaufen könnte.

**Davor: im Planner lässt sich etwas anlegen.** Bis eben ging das
überhaupt nicht — der Planner konnte nur mit dem umgehen, was schon da
war. Jetzt trägt jede der drei Spalten in ihrer Kopfzeile einen runden
Plus-Knopf, und ein Klick in eine freie Stunde legt dort einen Termin an,
mit Tag und Uhrzeit von der angeklickten Stelle. Der Knopf sitzt im Kopf,
nicht am Fuß: Der Fuß liegt hinter zwölf Stunden Raster.

Zwei Türen mit Absicht — der Knopf ist immer sichtbar und funktioniert
auf dem iPad, der Klick ins Raster ist der schnelle Weg mit der Maus.

**Dabei aufgefallen und nicht behoben:** Das **Ziehen funktioniert auf
dem iPad überhaupt nicht.** Der Planner benutzt HTML5-Drag-and-Drop, und
iOS Safari feuert diese Ereignisse nicht. Einplanen geht dort über den
Dialog — Block antippen, Tag und Uhrzeit setzen. So entschieden; ein
Umbau auf Zeigerereignisse wäre ein eigener Schritt.

**Und davor: die Anordnung der Dialogfelder.** Alle vier folgen jetzt
derselben Ordnung — **Was → Wann → Wer → Dazu**. Datum und Uhrzeit standen
in Aufgabe und Notiz in verschiedenen Zeilen, obwohl sie eine Angabe sind;
die Dauer eines Termins stand neben dem Kontakt statt neben der Uhrzeit;
bei Kontakt und Notiz blieb je eine halbe Zeile leer.

Drei Zusätze am Feldvertrag machen das möglich: `breit` darf eine Funktion
sein, `einheit` setzt die Maßeinheit ins Feld statt in die Beschriftung,
und **`nurWenn` blendet ein Feld aus, das in der gewählten Betriebsart
nichts bedeutet** — eine allgemeine Notiz hat keinen Anrufer und keine
Uhrzeit, also fragt die Maske nicht danach. Ausgeblendete Werte werden
beim Speichern geleert; sonst bliebe an einer allgemeinen Notiz die
Uhrzeit eines früheren Anrufs hängen, vorhanden, aber nirgends zu sehen.
Auch der Merkkasten wechselt mit.

`nurWenn` ist nicht nur für die Notiz gebaut: **Schritt 6 braucht es**,
weil Workflow-Eigenschaften je Teilschritt verschieden sind.

**Davor: die Dialoge sitzen wieder gerade.** Gefunden auf dem iPad, nicht
von einer Prüfung. Zwei Ursachen ohne Zusammenhang: Der erklärende Hinweis
stand **im** Label und schob das Feld nach unten, während das Feld daneben
ohne Hinweis höher begann. Und WebKit gibt Datums- und Zeitfeldern eine
eigene Mindestbreite und zentriert ihren Wert — beides schlägt `width:100%`,
das Feld läuft aus seiner Spalte. Der Hinweis steht jetzt unter dem Feld und
hängt über `aria-describedby` daran; die beiden Feldarten sind gebändigt.
Fehlerbuch Punkt 14.

Die Breiten kann ich hier nicht nachstellen — Chromium zeigt den Fehler
nicht. Nachzusehen ist das auf dem iPad, und in Edge, ob Kalender- und
Uhrsymbol noch da sind.

**Davor: eine Zwischenprüfung des erreichten Stands.** Kein
Roadmap-Schritt — ein Durchgang durch alle Flächen, die Datenwege und die
Farben. Fünf Befunde:

* **Ein Absturz.** Eine Sicherung mit einem Termin ohne `zeit` riss
  `toMin` auf und nahm Leiste **und** Planner gleichzeitig mit — die
  Anwendung war leer, ohne Weg zurück. Behoben auf zwei Ebenen: `toMin`
  verträgt einen fehlenden Wert, und `heile(Z)` zieht Termine einmal
  gerade, beim Start wie beim Laden einer Datei. Fehlerbuch Punkt 12.
* **`--ink3` verfehlte die eigene Kontrastregel** — `#87837c` sind
  3,46 : 1, gefordert sind 4,5. Das Token trägt jede Metazeile, jeden
  Hinweis, jeden Zähler. Jetzt `#6b675e`, 5,17 : 1. In der damaligen
  Notion-Fassung waren `--ink2`, `--ink3` und das Rot ebenso zu hell und
  wurden mitgezogen; diese Fassung ist inzwischen entfallen.
* **Fünf Gerüste sahen fertig aus.** Liste, Knöpfe, Demodaten, und ein
  Klick meldete „Öffne …", „Starte …", „Kopiert" — nichts davon geschah.
  Ein Modul meldet jetzt mit `geruest:"…"` an, was ihm fehlt; `male()`
  setzt daraus ein Band über die Fläche und die Modulliste eine Marke.
  Die Meldungen sagen die Wahrheit. Fehlerbuch Punkt 9.
* **⌘1 bis ⌘8** meldeten „Öffne …" und öffneten nichts. Jetzt „Noch
  nicht eingebaut". Das Öffnen selbst gehört zu Schritt 7 und hängt am
  Browsertest.
* **Das README war überholt** — „zehn Fehler", „neun Module als Gerüst".
  Ursache war eine Ersetzung ohne Prüfung, die nichts traf, nichts tat
  und trotzdem als erledigt abgehakt wurde. `pruefen.mjs` zählt die drei
  Zahlen jetzt selbst nach. Fehlerbuch Punkt 13.

Bewusst offen geblieben: Aufgaben und Kalender haben keine eigene
Modulsuche, Kontakte und Notizen schon. Und ein Eintrag ohne Titel
zeichnet eine leere Zeile — erreichbar nur über eine von Hand bearbeitete
Sicherung.

**Davor: Schritt 5 — Notizen mit Markdown.** Zwei Arten,
Telefonnotiz vorbelegt; Datum und Uhrzeit stehen zusätzlich im Text,
damit sie beim Ausleiten erhalten bleiben. Der Anrufer kommt aus der
Kontaktliste oder wird frei eingetragen. Die Vorschau steht in der
Liste — eine Notiz ist ihr Text. Der Umwandler aus Schritt 2 wurde
erweitert, nicht neu geschrieben.

**Export und Import als `.md`** mit einem Kopfblock, dessen Grenze hart
gezogen ist: `---` in Zeile 1, ein zweites `---` innerhalb von zehn
Zeilen, dazwischen ausschließlich `schlüssel: wert`. Sonst ist alles
Text. Gegengeprüft mit den beiden Fällen aus Fehlerbuch Punkt 5 — Titel
mit Gedankenstrich und ein Text, der selbst mit `---` beginnt.

**Der Schmierzettel** ist ein einzelner Text, groß im Modul und kompakt
in der Leiste, beide auf dieselbe Stelle. Er wäre um ein Haar still
nicht geladen worden: Die Ladeliste prüfte `Array.isArray`, und
`pruefen.mjs` suchte nach `name: [`. Beides ist nachgezogen — der Prüfer
zählt jetzt elf Datenbereiche statt zehn.

Nebenbei behoben: Der Dateiwähler fürs Laden filterte auf `.md`, obwohl
JSON geladen wird, und hätte die Sicherungsdatei ausgeblendet.

**Davor: Schritt 3 — Aufgaben und Termine bearbeiten.** Beide Module
beschreiben ihre Maske nur noch als Liste von `{schl, nm, art}`; eigenen
Dialogcode gibt es nicht mehr. Der Baustein aus Schritt 2 hat sich damit
bewährt — er wurde für Schritt 3 nicht ein einziges Mal angefasst.

Der Tag eines Termins ist eine **Auswahl aus genau zwei Werktagen**, kein
freies Datum. Die Regel steckt in der Maske statt in einer Prüfung
dahinter. Abgehakte Aufgaben ziehen in einen Abschnitt „Erledigt" und
lassen sich einzeln oder gesammelt löschen.

**`fertig` bei Terminen ist entfallen.** Ein vergangener Termin ist
vorbei, nicht abgearbeitet; er bietet unter „Überfällig" zwei Wege
heraus, auf heute holen oder löschen.

Der Planner bekam drei Handgriffe: Klick auf einen Block öffnet den
Dialog, Aufgabenblöcke tragen ein Kästchen, der Vorrat ist anklickbar.
Das Ziehen blieb unangetastet — Termine ließen sich schon vorher zwischen
den beiden Tagen schieben.

**Davor: Schritt 2 — der Dialog als Baustein.** In zwei Ebenen statt
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
nachgereicht worden, und Schritt 6 hatte damit seine Dialogvorlage.

> **Überholt:** Die zweite Fassung unter `referenz/` gibt es nicht mehr —
> das Thema ist ein Umschalter in der Anwendung geworden. Mit ihr ist auch
> die Prüfung „Logik deckungsgleich" entfallen; der Prüflauf sieht heute
> drei Dateien an, nicht vier.

`dashboard.html` läuft. Zwei Oberflächen — Leiste als Einstieg, Planner
als Arbeitsfläche. Elf Module sind angemeldet, davon sechs fertig
(Kontakte, Aufgaben, Kalender, Notizen, Rechner, Code-Beautifier) und
fünf als Gerüst — die sagen das auf ihrer Fläche jetzt selbst. Sichern und Laden über JSON,
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
* **Farbe codiert Dringlichkeit**, nicht Kategorie. **Eine einzige
  Ausnahme:** die beiden Kategorien im Jahreskalender. Sie steht in
  `CLAUDE.md` und ist dort ausdrücklich als nicht übertragbar
  gekennzeichnet — Kategorien anderswo bleiben in Graustufen.
* **Ein zweites Thema, kein zweites File.** Basecamp ist ein Umschalter
  im Kopf. Die Wahl liegt für sich in `localStorage` unter `"thema"`,
  nicht im Objekt `Z`, und taucht deshalb nicht in Sicherung und Export
  auf. Die frühere Notion-Fassung unter `referenz/` ist entfallen.
* **Der Jahreskalender führt einen eigenen Bestand.** Keine
  wechselseitige Anzeige mit Kalender oder Planner. So gewollt, keine
  Lücke.

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

### 2. Ziehen im Planner geht auf dem iPad nicht

Der Planner benutzt HTML5-Drag-and-Drop, iOS Safari feuert diese
Ereignisse nicht. Einplanen geht dort über den Dialog. Ein Umbau auf
Zeigerereignisse wäre ein eigener Schritt — bewusst offen.

### 3. Der Jahreskalender ist noch nicht am Rechner geprüft

Angesehen wurde er nur im Prüfbrowser. Am eigenen Gerät fehlt der Blick
auf die Datumsfelder: Sie zeigten dort US-Format, was an der Spracheinstellung
des Prüfbrowsers liegen dürfte — auf deutschem Edge sollte `22.04.2026`
stehen. Betrifft alle Datumsfelder der Anwendung, nicht nur dieses Modul.

---

## Nächster Schritt

Schritt 6 der Roadmap: **Workflows vollständig**. Der Entwurf liegt seit
Phase 0 unter `referenz/workflow-dialog.html`, das Datenmodell ist
umgestellt, und `felderMalen` wurde in Schritt 2 eigens so gebaut, dass
der Workflow-Dialog es **dreimal** benutzen kann: für die
Instanzeigenschaften, für die Teilschrittliste und für den gewählten
Schritt.

`ANLEITUNG.md` nennt Schritt 6 einen der drei, bei denen eine falsche
Grundentscheidung teuer wird.

Danach Schritt 8 (Hilfe, baut sich aus dem Register auf) und Schritt 9
(Outliner).

Schritt 4 und 7 bleiben zurückgestellt, bis der Browsertest beantwortet
ist.

---

## Für den Einstieg in eine neue Unterhaltung

> Ich baue ein persönliches Dashboard als einzelne HTML-Datei, offline,
> für Windows und Edge. Im Anhang das Projektpaket. Lies CLAUDE.md,
> doku/ARBEITSWEISE.md, doku/ARCHITEKTUR.md und STAND.md, dann sag mir,
> wo wir stehen.
