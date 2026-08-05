## Schritt

<!-- Nummer und Name aus doku/ROADMAP.md, etwa „Schritt 1 — Kontakte vollständig".
     Ein Pull Request je Roadmap-Schritt, Branch `schritt-1-kontakte`. -->

## Geänderte Blöcke

<!-- Namentlich, nicht „diverse". Welche Markerblöcke, welche nummerierten
     Abschnitte aus doku/ARCHITEKTUR.md.
     Beispiel: Modulblock kontakte, dazu Abschnitt 2 (Datenbereich). -->

## Umfang

<!-- Ausgabe von `git diff --stat` hier einsetzen.

     Für ein Modul sind 50 bis 200 geänderte Zeilen normal.
     Über 500 heißt: Die Datei wurde umgeschrieben statt ein Block
     ersetzt — dann zurücknehmen, nicht zusammenführen. -->

```
```

## Prüflauf

<!-- Ausgabe von `node werkzeug/pruefen.mjs` hier einsetzen.
     Muss ohne Fehler durchlaufen, Rückgabewert 0. -->

```
```

## Im Browser zu prüfen

<!-- Konkrete Handgriffe, nicht „bitte ansehen".

     Der Prüflauf sagt nichts über die Darstellung: Sämtliche schwarzen
     Flächen aus doku/FEHLERBUCH.md haben ihn bestanden. dashboard.html
     per Doppelklick in Edge öffnen, nicht in ein offenes Fenster ziehen. -->

1.
2. Ist die Fläche hell und lesbar?
3. Seite neu laden — ist die Änderung noch da?
4. Sichern, Laden — kommt alles unverändert zurück?

## Neuer Datenbereich

<!-- Falls ja: Beide Stellen nennen — `vorgabe()` und die Liste im
     Ladevorgang (Abschnitt 9). Fehlt eine davon, funktioniert das Modul,
     seine Daten überleben aber kein Laden einer Sicherung.
     Falls nein: „keiner". -->

## Bewusst nicht umgesetzt

<!-- Was zum Schritt gehört hätte, aber woandershin gehört. -->

## Nachgezogen

- [ ] `doku/ROADMAP.md` — Schritt als erledigt markiert
- [ ] `STAND.md` — was sich geändert hat
- [ ] `werkzeug/pruefen.mjs` — falls eine neu gefundene Regel prüfbar ist
- [ ] `doku/FEHLERBUCH.md` — falls ein neuer Fehlertyp aufgetreten ist
