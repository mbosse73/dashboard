# Stand

**Zuletzt: Wartung — vier Fehler behoben.**

Eine Durchsicht der Anwendung hat vier Fehler gefunden, alle in
Bestehendem, keiner in einem neuen Modul.

Der schwerste: **Der SQL-Formatierer gab kaputtes SQL aus und meldete
Erfolg dabei.** Sechs Schreibweisen waren betroffen, darunter `->>`
und `1.5e10`. Die Rückprobe konnte es nicht sehen, weil sie die
falsche Eigenschaft prüfte. Sie wacht jetzt auch über Zwischenräume und
verweigert bei allem, was sie nicht kennt.

Dazu: Der Meldungszettel ging nach dem Sichern nie wieder weg. Die
Tastenkürzel trugen das Mac-Zeichen `⌘` auf einer Anwendung für
Windows. Und Beispieldaten wurden in zehn Bereichen nach zwei
verschiedenen Regeln erkannt.

Neu im Prüflauf: **Kontrast.** Vierzehn Paare je Thema, gerechnet. Er
fand sofort, dass zwei Referenzdateien noch den alten `--ink3` mit
3,46 : 1 trugen.

Zwei Vorschläge sind bewusst nicht umgesetzt: die Umstellung von
Pixeln auf `rem` und das Verlegen der Modulliste. Begründung in
`doku/SPEC.md`.

---

**Davor: Modul 17 — Einstellungen.**

Sechs Einstellungen und zwei Knöpfe. Von vierzehn Modulen sind zwölf
fertig; Gerüst sind nur noch Textbausteine (05) und Workflows (13).

Drei Vorschläge aus dem Entwurf sind nicht gebaut worden: das
voreingestellte PDF-Format und alles zum Planner auf Ihren Wunsch —
und **„Wochenende mitzählen"**, weil es nicht zu bauen war, ohne den
Planner anzufassen. Ich hatte im Entwurf das Gegenteil behauptet; das
ist zurückgenommen und in `doku/ROADMAP.md` festgehalten.

**Das dritte Thema fehlt noch.** Die Einstellungen bieten Standard und
Basecamp an. Ein dritter Knopf käme erst, wenn es das Thema gibt — ein
Knopf ohne Wirkung wäre Fehlerbuch 9.

---

**Davor: Der Apps-Teil von Schritt 7 — Anlegen, Bearbeiten, Löschen.**

Damit ist Schritt 7 vollständig. Der Appstarter meldet sich nicht mehr
als Gerüst an; von dreizehn Modulen sind elf fertig, zwei sind Gerüst
(Textbausteine und Workflows).

Dabei kam ein Widerspruch zwischen zwei Dokumenten heraus:
`doku/ROADMAP.md` behauptete, auch das **Starten** fehle noch. Es trug
seit dem Browsertest, und `doku/SPEC.md` sagte es richtig — die Roadmap
war nicht nachgezogen worden. Richtiggestellt, mit einer Notiz an der
Stelle.

---

**Davor: SQL im Code-Beautifier (Modul 16).**

Der Beautifier formatiert jetzt auch SQL und erkennt es in der Leiste.
Drei Vorgaben bestimmten die Umsetzung: `CASE` bricht um, SQL wird
erkannt, und **Tabellen- und Spaltennamen dürfen sich nicht ändern,
auch nicht im Schriftfall**.

Die letzte war die folgenreichste. Sie hat die Liste der
großzuschreibenden Wörter von rund siebzig auf vierundzwanzig
zusammengestrichen — Datentypen und Wörter wie `TEXT`, `DATE`, `KEY`,
`NAME`, `ROW` sind heraus, weil eine Spalte so heißen darf. Und sie hat
eine zweite Prüfung in die Rückprobe gebracht, die vorher gar nicht
sehen konnte, ob ein Name umgeschrieben wurde.

`werkzeug/sql.mjs` bleibt als Prüfstand liegen: derselbe Code, außerhalb
der Anwendung ausführbar. Wer die Regeln ändert, kann sie dort ohne
Browser durchspielen.

---

**Davor: Schritt 9 — der Outliner, in drei Stufen.**

Aus einer mitgebrachten Outliner-App wurde der Funktionsumfang Punkt für
Punkt durchgegangen und entschieden. Umgesetzt ist die schlanke Fassung,
erweitert um Fokusmodus, Notizzeile, Rückgängig, Gantt, Mindmap und
PDF-Ausgabe mit Formatwahl.

* **9a** Datenmodell mit `id`, flache Ebene `e`, Migration in `heile()`,
  Anlegen, Ein- und Ausrücken, Verschieben, Klappen, Notizzeile,
  Fokusmodus mit Pfad, Rückgängig
* **9b** eigene Fristen und Zeiträume, getippt (`@20.8.`,
  `@20.8...31.8.`, `@morgen`), dazu der Gantt
* **9c** Mindmap, PDF ohne Bibliothek und ohne Druckdialog,
  Blattformat A4 bis A0 zur Wahl

**Getrennt geblieben:** Die Fristen des Outliners erscheinen nicht im
Planner, nicht im Kalender (06) und nicht im Jahreskalender (14).

**Rückgängig gibt es nur hier** — sonst nirgends im Dashboard. Das ist
bewusst so und wird jemanden irgendwann wundern.

## Was der Mensch noch prüfen muss

Drei Dinge sind am Zielrechner **nicht bestätigt**:

1. **Lädt Edge das PDF herunter?** Der Weg ist derselbe wie beim Sichern,
   der funktioniert — mit dieser Dateiart aber ungesehen.
2. **`Strg+Y`** — manche Browser belegen es selbst.
3. `F1` und `⇧F1` der Hilfe, seit Schritt 8 offen.

Die vollständige Liste steht in `qs/PRUEFUNGEN.md` unter „Schritt 9".

## Offen

* **Schritt 4** (Textbausteine) und der Apps-Teil von **Schritt 7**
* **Die Tastenprüfung** in `browsertest.html`
* **Schritt 6** — Workflows, zuletzt
* Der Jahreskalender ist am eigenen Gerät noch nie angesehen worden
* Alte Branches auf GitHub aufräumen — nur vom Menschen möglich

---

## Wo wir stehen

**Der Browsertest ist bestanden — alle Prüfungen (7. August 2026).**
localStorage, Zwischenablage, eine andere lokale Datei öffnen, `tel:` und
`mailto:`. **Damit ist nichts mehr blockiert**, und keiner der drei
Notwege wird gebraucht, die seit Beginn in den Dokumenten standen:

* **Schritt 4, Textbausteine** darf `navigator.clipboard.writeText`
  benutzen. Das versteckte Textfeld entfällt.
* **Schritt 7, Apps** darf `window.open` benutzen. Der anklickbare
  Verweis als Notweg entfällt.
* **Die Kontaktkacheln** übergeben wirklich an Telefon und Mail — die
  beiden Knöpfe sind keine Attrappen.

Der Test bleibt in `browsertest.html` stehen; auf einem neuen Rechner
oder nach einem Edge-Wechsel ist er wieder fällig.

Für die geplante Pinnwand ändert das etwas: Eine App darf jetzt auf einen
Platz, weil sie sich auch öffnen lässt. Meine Ankündigung, den Appstarter
vorerst wegzulassen, ist hinfällig.

---

**Zuletzt: die Hilfe.** Zwei Flächen. Die **Hilfe** ist Modul 10 mit
Index links, Inhalt rechts und eigenem Suchfeld. Die **Schnellhilfe** ist
ein schwebendes Fenster mit allen Tastenkürzeln. `F1` öffnet die
Schnellhilfe, `⇧F1` die Hilfe.

**Die beiden Suchen sind konstruktiv getrennt.** Das Hilfe-Modul meldet
**kein `suche`** an. Es kann in der Leiste gar nicht auftauchen — nicht
„es tut es nicht", sondern „es kann nicht". Sein Feld hat einen eigenen
Zustand `hiSuche` außerhalb von `Z`.

**Zwei Tabellen, die je zweimal benutzt werden.** `TASTEN` schaltet die
Tasten und füllt die Schnellhilfe. `MUSTER` liefert `deuten()` seine
Regeln und der Hilfe ihre Beschreibung. Ein Kürzel kann dadurch nicht in
der Liste stehen, ohne zu wirken — Fehlerbuch Punkt 9 in Bauform.

**Jedes Modul beschreibt sich selbst**, über `hilfe` im eigenen Block.
Der Text steht neben dem Code, den er beschreibt. `pruefen.mjs` verlangt
ihn und prüft drei Regeln: höchstens 20 Wörter je Satz, höchstens ein
Komma, mindestens 40 Zeichen. **Gegen alle drei Verstöße erprobt**, bevor
sie eingebaut wurden: fehlender Text, echter Schachtelsatz, `"TODO"`.

**Offen:** `F1` und `⇧F1` sind am Zielrechner nicht bestätigt. Die Liste
schreibt „noch nicht bestätigt" dazu — eine Beschriftung ohne
nachgewiesene Tat wäre Fehlerbuch Punkt 9. Die Tastenprüfung in
`browsertest.html` ist als eigener Schritt vorgemerkt.

---

**Davor: die Leiste als Pinnwand.** Statt „acht angeheftete Bookmarks"
gibt es **zwölf Plätze**, auf denen alles liegen darf — Webseiten wie
Apps, später auch Textbausteine. Die Überschrift heißt **„Häufig
benutzt"**. `⌘1` bis `⌘8` liegen auf den ersten acht; mehr freie
Tastenkombinationen gibt es nicht.

**Der Modulvertrag wächst um `heftbar`.** Ein Modul gibt beim Anmelden
an, was es zum Anheften anbietet — Zeichen, Liste, Öffnen. Die Leiste
fragt das Register und kennt kein Modul beim Namen. Der teurere Weg, aber
der einzige, der die harte Regel wahrt: Ein weiteres anheftbares Modul
kostet in der Leiste jetzt **keine Zeile**.

**Der Appstarter startet wirklich** und ist anheftbar. Beides erst durch
den bestandenen Browsertest möglich.

**Zwei Fehler, die das Durchspielen gefunden hat, nicht der Betrieb.**
Die Migration von `pins` läuft in zwei Stufen — Adresse → Kennung,
Kennung → Objekt —, und Stufe 1 fraß zunächst jeden Platz, der schon die
neue Form hatte. Eine Sicherung von morgen hätte beim Laden alle
Anheftungen verloren. Sechs Sicherungsformen durchgespielt, darunter eine
mutwillig kaputte.

**Die Pinnwand steht links, nicht rechts — gegen die frühere
Entscheidung.** Rechts trug die Spalte sie nicht: Mit Favoriten, Pinnwand
und Modulliste scrollte die Leiste **ab dem sechsten belegten Platz**,
und das hätte zurückgenommen, was der Vorgang davor gerade behoben hatte.
Dichteres Raster und Chips brachten nur 16 bis 24 px — zu wenig. Links
sind es bei voller Belegung 652 gegen 561 px, und nichts scrollt.
Zurückzudrehen ist das eine Zeile.

---

**Davor: die Breite auf 24 Zoll.** Alle zwölf Modulflächen benutzten
860 px und ließen 1060 px leer, während drei von ihnen scrollten. Der
Planner machte das Gegenteil und nahm alle 1920 px — ein halbstündiger
Termin bekam einen Block von 767 px.

**Die naheliegende Lösung war falsch und wurde gemessen verworfen.** Den
Deckel von 860 auf 1180 zu setzen bringt allein: Leiste −66 px, Notizen
−19, Aufgaben ±0. Diese Flächen sind gestapelte Abschnitte, keine
Raster — ein Stapel wird nicht kürzer, wenn man ihn breiter macht. Was
hilft, ist **Zweispaltigkeit**: 1181 auf 895 px, kein Rollbalken mehr.

Die Leiste ist im Ruhezustand zweispaltig ab 1100 px — links was
auffordert, rechts wonach man greift. **Das Suchergebnis bleibt
einspaltig:** Treffer sind nach Rang geordnet, und `↵` nimmt den obersten.

**Der Planner** ist auf 1480 px gedeckelt und zentriert, der Vorrat wächst
über `clamp(262px,21vw,400px)` nur mit dem Fenster. Und er **füllt jetzt
die Höhe** — er war 786 px hoch, gleich wie groß das Fenster war, weil
`.rumpf` kein Flex-Behälter ist und `flex:1` deshalb ins Leere lief. Bei
1300 px Fensterhöhe blieben 459 px leer.

**Der Kopf** rückt über `padding-inline` auf dieselben 1480 px ein; vorher
lagen bei 1920 px 348 px zwischen Umschalter und Inhalt.

**Zwei eigene Fehler dabei**, beide im Fehlerbuch: `margin:0 auto` an
einem Flex-Element schaltet das Strecken ab, die Tagesspalten kamen mit
151 statt 540 px heraus (Punkt 16). Und ich hatte die Blockhöhen für den
Entwurf bei 860 px gemessen statt bei der späteren Spaltenbreite von
542 — im Plan standen 646 px, gemessen wurden 909.

**Offen als Vorgang 2:** die Leiste als Pinnwand mit zwölf Plätzen, über
das Register auch für Apps.

> **Überholt:** Vorgang 2 ist gebaut, siehe ganz oben. Die Pinnwand steht
> dabei links statt rechts — der Grund steht dort.

**Davor: die Bookmark-Fläche ist dichter.** Aus rund 1800 Pixeln für
24 Bookmarks sind **315** geworden. Gruppenname links als
Randbeschriftung, die Bookmarks daneben als Chips; darüber ein
Schnellzugriff mit den acht Plätzen, freie gestrichelt gezeigt.

**Die maßgebliche Breite ist 808 px, nicht die des Bildschirms.**
`.mitte{max-width:860px}` deckelt die Modulfläche, davon 52 px Rand. Das
hat die Entscheidung gedreht: Ein Kartenraster wäre bei 904 px die
dichteste Fassung gewesen, braucht dafür aber vier Spalten und bekommt
bei 808 px drei — 483 statt 333 px. Chips brauchen keine Spalten, sie
brechen um. Drei Fassungen mit gemessenen Höhen stehen in
`mockups/schritt-bookmarks-dicht.html`.

Nebenbei aufgefallen: `.weit{max-width:1180px}` in der Gestalt wird von
**niemandem** benutzt — totes CSS. Damit ließe sich die Fläche
verbreitern. Bewusst nicht angefasst: 860 px sind eine Lesebreite für die
ganze Anwendung.

> **Überholt:** Inzwischen angefasst. `.mitte` trägt die 1180 px selbst,
> die tote Regel ist entfallen. Die Lesebreite ist damit nicht aufgegeben,
> sondern an den Fließtext gewandert: `.hinweis` und `.leer` bleiben bei
> 78 Zeichen.

**Zwei Zustände statt eingeblendeter Knöpfe.** Im Ruhezustand öffnet ein
Klick, mehr nicht; `ordnen ›` blendet Nadel, Stift, „umbenennen" und
„+ neues Bookmark" ein. Beim Überfahren einzublenden wäre naheliegend und
auf dem iPad unbrauchbar — dort gibt es kein Überfahren, derselbe Fehler
wie beim Ziehen im Planner. `mkOrdnen` liegt außerhalb von `Z`: Ansicht,
keine Daten.

**Davor: Bookmarks sind fertig geworden.** Anlegen, Bearbeiten, Löschen,
Anheften und Lösen, Gruppen umbenennen und zusammenlegen. Öffnen in einem
neuen Tab — aus dem Modul, aus der Suche, von den Kacheln der Leiste und
über ⌘1 bis ⌘8. Das Gerüstband ist weg, die Meldungen sagen die Wahrheit.

**Das ging ohne den Browsertest.** Der betrifft das Öffnen einer *lokalen*
Datei, und Bookmarks zeigen auf `http(s)`. Der Apps-Teil von Schritt 7
wartet weiter — dort steht `file:///C:/…`, und ob Edge das aus einer lokal
geöffneten Datei zulässt, ist die Frage, die der Test beantwortet.

**Am eigenen Gerät bestätigt (7. August):** Das Ändern einer Adresse
lässt die Anheftung stehen. Und die obere Leiste ist auf dem iPhone im
Querformat wieder da — der Wechsel von `100vh` auf `100dvh` trägt.
Beides war von hier aus nicht nachweisbar: Chromium gibt `vh` und `dvh`
denselben Wert, und der Prüfbrowser kennt nur die Demodaten.

**Ein Datenumbau steckt darin:** Bookmarks hatten keine `id`, sie wurden
über ihre Adresse erkannt, und `pins` merkte sich ebenfalls die Adresse.
Sobald sich eine Adresse bearbeiten lässt, trägt das nicht mehr — die
Anheftung risse ab, und zwei Marken mit derselben Adresse wären nicht zu
unterscheiden. `heile()` zieht das jetzt nach: `id` vergeben, `pins` von
Adresse auf `id` umstellen, ins Leere zeigende Plätze streichen. Die
Vorgabe läuft absichtlich durch denselben Weg statt fertige `id` mitzu-
bringen — so wird er bei jedem Start benutzt und kann nicht verrotten.

**Eine Gruppe ist kein eigener Datensatz**, sondern das Feld `g`. Sie
entsteht mit dem ersten Bookmark darin und geht mit dem letzten.
Umbenennen ändert `g` an allen; trägt man den Namen einer vorhandenen
Gruppe ein, werden beide zu einer. Ein Löschen der Gruppe gibt es nicht —
es wäre ein Löschen ihrer Bookmarks unter falschem Namen.

**Davor: der Jahreskalender.** Ein neues Modul 14 mit eigenem Bestand
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
  > **Überholt:** Sie öffnen inzwischen wirklich. Am Browsertest hing das
  > nie — der betrifft lokale Dateien, Bookmarks zeigen auf `http(s)`.
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
fünf als Gerüst — die sagen das auf ihrer Fläche jetzt selbst.
> **Überholt:** Inzwischen sind es zwölf Module, acht davon fertig.
> Die tagesaktuelle Zahl steht im README und wird von `pruefen.mjs`
> gegen die Anwendung gezählt.

Sichern und Laden über JSON,
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

Schritt 8 der Roadmap: **Hilfe**. Sie baut sich aus dem Modulregister auf
— alle angemeldeten Module, ihre Tastenkürzel, die Eingabemuster der
Leiste — und wird nicht von Hand gepflegt. Klein, in sich abgeschlossen,
und sie prüft nebenbei, ob das Register alles hergibt, was es hergeben
soll.

Danach Schritt 9 (Outliner). Schritt 4 und 7 bleiben zurückgestellt, bis
der Browsertest beantwortet ist.

**Schritt 6 — Workflows kommt zuletzt.** So entschieden: Er ist der
größte, der einzige mit eigenem Datenmodell aus Vorlage, Instanz und
aktivem Teilschritt, und `ANLEITUNG.md` nennt ihn einen der drei, bei
denen eine falsche Grundentscheidung teuer wird. Das Vorarbeiten ist
getan und verfällt nicht: Der Entwurf liegt seit Phase 0 unter
`referenz/workflow-dialog.html`, das Datenmodell ist umgestellt, und
`felderMalen` wurde in Schritt 2 eigens so gebaut, dass der
Workflow-Dialog es **dreimal** benutzen kann — für die
Instanzeigenschaften, für die Teilschrittliste und für den gewählten
Schritt. `nurWenn` aus dem Dialogschritt wartet ebenfalls darauf.

---

## Für den Einstieg in eine neue Unterhaltung

> Ich baue ein persönliches Dashboard als einzelne HTML-Datei, offline,
> für Windows und Edge. Im Anhang das Projektpaket. Lies CLAUDE.md,
> doku/ARBEITSWEISE.md, doku/ARCHITEKTUR.md und STAND.md, dann sag mir,
> wo wir stehen.
