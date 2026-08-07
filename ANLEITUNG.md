# Anleitung

Diese Datei ist für dich, nicht für Claude Code. Sie beschreibt, was du
tust — nicht, was das Programm können soll.

---

## Teil 1 — Einmalige Einrichtung

### 1.1 Ordner anlegen

Das Paket entpacken nach `C:\Dashboard`. Der Inhalt muss direkt dort
liegen, nicht in einem Unterordner. Prüfen: `C:\Dashboard\CLAUDE.md` muss
existieren.

### 1.2 Git einrichten

Ohne Git ist jede Änderung endgültig. PowerShell öffnen:

```powershell
cd C:\Dashboard
git init
git add .
git commit -m "Ausgangsstand"
```

Ist Git nicht installiert: von `git-scm.com` holen, Standardeinstellungen
durchklicken.

### 1.3 Claude Code installieren

```powershell
irm https://claude.ai/install.ps1 | iex
```

Danach PowerShell **schließen und neu öffnen**, sonst wird der Befehl
nicht gefunden. Prüfen:

```powershell
claude --version
```

### 1.4 Erster Start

```powershell
cd C:\Dashboard
claude
```

Beim ersten Mal: `/login` eingeben, im Browser anmelden, danach den Ordner
als vertrauenswürdig bestätigen.

Zum Beenden `/exit` oder das Terminal schließen.

---

## Teil 2 — Der Browsertest, vor allem anderen

`C:\Dashboard\browsertest.html` im Explorer **doppelklicken**. Nicht in ein
offenes Edge-Fenster ziehen — das verfälscht das Ergebnis.

Alle Knöpfe der Reihe nach drücken. Drei Antworten notieren:

| Prüfung | dein Ergebnis |
|---|---|
| localStorage nutzbar | |
| Zwischenablage | |
| Andere lokale Datei öffnen | |

Diese drei in `doku/ROADMAP.md` unter Schritt 0 eintragen. Sie bestimmen,
wie Textbausteine und Appstarter später gebaut werden.

**Ohne diesen Test nicht mit Schritt 4 oder 7 anfangen.**

---

## Teil 3 — Der Ablauf jeder Sitzung

Immer dieselben acht Handgriffe. Beispiel für Schritt 1:

### 3.1 Sitzung öffnen

```powershell
cd C:\Dashboard
claude
```

### 3.2 Auftrag geben

Eintippen oder einfügen:

```
Lies CLAUDE.md, doku/ARBEITSWEISE.md und doku/ARCHITEKTUR.md.
Setze Schritt 1 aus doku/ROADMAP.md um.
Zeige zuerst Plan und Mockup und warte auf meine Zustimmung.
Ändere nur den Modulblock zwischen /* ===== MODUL kontakte ===== */
und /* ===== ENDE kontakte ===== */.
```

Der letzte Halbsatz ist der wichtigste. Claude Code soll nach Plan und
Mockup **anhalten**, nicht durchlaufen. Der Mockup liegt danach unter
`mockups/` und lässt sich per Doppelklick ansehen — dort entscheidest du
über die Gestalt, solange das noch nichts gekostet hat.

`doku/ARBEITSWEISE.md` ist die Anleitung für Claude Code — dasselbe für
die andere Seite. Darin steht auch, was es dir nach jedem Schritt melden
soll und was du im Browser prüfen musst.

Für die späteren Schritte nur die Nummer und den Modulnamen tauschen.

### 3.3 Plan lesen und freigeben

Claude Code zeigt erst, was es vorhat. Lies das wirklich. Zwei Dinge, bei
denen du eingreifen solltest:

* Es will Dateien aufteilen oder einen Build-Schritt einführen → ablehnen,
  auf `CLAUDE.md` verweisen
* Es will mehr als den einen Schritt erledigen → auf den einen begrenzen

### 3.4 Umsetzen lassen

Freigeben. Bei Rückfragen antworten.

### 3.5 Größe der Änderung prüfen

```powershell
git diff --stat
```

Für ein Modul sollten grob 50 bis 200 geänderte Zeilen herauskommen. Sind
es 500 oder mehr, wurde die Datei umgeschrieben statt ein Block ersetzt.
Dann:

```powershell
git checkout dashboard.html
```

und den Auftrag deutlicher stellen.

### 3.6 Prüflauf

```powershell
node werkzeug/pruefen.mjs
```

Muss ohne Fehler durchlaufen. Meldet er etwas, Claude Code die Ausgabe
zeigen und beheben lassen.

### 3.7 Selbst hinsehen

**Der wichtigste Schritt.** `dashboard.html` doppelklicken und die
geänderte Stelle ansehen.

Sämtliche schwarzen Flächen aus dem Fehlerbuch haben den Syntaxcheck
bestanden. Ein grüner Haken sagt nichts über die Darstellung.

Konkret durchgehen:
* Ist die Fläche hell und lesbar?
* Funktioniert das Anlegen, Ändern und Löschen?
* **Seite neu laden — ist die Änderung noch da?**
* Auf „Sichern" drücken, Datei laden, sind alle Daten zurück?

### 3.8 Festschreiben

```powershell
git add .
git commit -m "Kontakte vollstaendig"
```

Dann in `doku/ROADMAP.md` den Schritt als erledigt markieren und in
`STAND.md` eintragen, was sich geändert hat.

### 3.9 Sitzung beenden

```
/clear
```

oder Terminal schließen. Nicht mehrere Schritte in einer Sitzung — die
Unterhaltung wird sonst zu lang und Claude Code verliert den Überblick.

---

## Teil 4 — Die Reihenfolge

Ausführlich in `doku/ROADMAP.md`. Hier die Kurzfassung mit Begründung:

| # | Schritt | warum an dieser Stelle |
|---|---------|------------------------|
| 0 | Browsertest | drei Antworten blockieren sonst Schritt 4 und 7 |
| 1 | Kontakte | alles verweist darauf |
| 2 | Dialog-Baustein | aus Schritt 1 herausziehen, nicht vorher erfinden |
| 3 | Aufgaben und Termine | erste Nutzung des Bausteins |
| 4 | Textbausteine | braucht Antwort zur Zwischenablage |
| 5 | Notizen mit Markdown | größter einzelner Brocken |
| 6 | Workflows | braucht den Baustein aus Schritt 2 |
| 7 | Bookmarks und Apps | braucht Antwort zum Dateiöffnen |
| 8 | Hilfe | baut sich aus dem Register auf |
| 9 | Outliner | eigenständig, jederzeit möglich |

**Bei drei Schritten den Planungsmodus besonders ernst nehmen:** 2, 5
und 6. Dort wird eine falsche Grundentscheidung teuer.

---

## Teil 5 — Wenn etwas schiefgeht

### Große Bereiche sind schwarz

`doku/FEHLERBUCH.md`, Punkte 1 und 2. Zwei Ursachen: fehlendes
`color-scheme: light`, oder eine Fläche ohne eigenen Hintergrund.

### Änderungen verschwinden beim Neuladen

Fehlerbuch Punkt 4. Meist wurde `bewahre()` vergessen, oder die Daten
liegen außerhalb von `Z`.

Wenn ein neues Modul dazukam, ist fast immer eines von beiden vergessen
worden:
* der Datenbereich in `vorgabe()`
* der Schlüssel in der Liste im Ladevorgang

### Claude Code schlägt eine Aufteilung in mehrere Dateien vor

Normal. Werkzeuge sind auf übliche Projekte trainiert. Ablehnen und auf
`CLAUDE.md` verweisen.

### Die Datei ist kaputt

```powershell
git checkout dashboard.html
```

Bringt den letzten Commit zurück. Deshalb Teil 3.8 nach jedem Schritt.

### Du weißt nicht mehr, wo du warst

`STAND.md` lesen. Wenn sie nicht mehr stimmt, hast du Teil 3.8 übersprungen.

---

## Teil 6 — Arbeiten über GitHub

Wenn das Projekt in einem GitHub-Repository liegt, gibt es zwei Wege.

### 6.1 Vom eigenen Rechner (empfohlen)

```powershell
cd C:\Dashboard
git pull
claude
```

Nach jedem Schritt:

```powershell
git add .
git commit -m "Schritt 1: Kontakte vollstaendig"
git push
```

Vor dem Commit immer `node werkzeug/pruefen.mjs`.

### 6.2 Claude Code on the web

In der Claude-App unter **Code** eine Sitzung auf dem Repository starten.
Die Arbeit läuft dann auf Anthropics Infrastruktur; am Ende entsteht ein
Branch mit einem Pull Request.

Dein Ablauf ändert sich dadurch:

1. Auftrag geben wie in Teil 3.2
2. Warten, bis der Pull Request steht
3. **Auf GitHub den Diff durchsehen** — besonders den Umfang
4. `dashboard.html` aus dem Branch herunterladen und **im Browser ansehen**
5. Passt es, zusammenführen. Passt es nicht, den Branch verwerfen

Punkt 4 lässt sich nicht überspringen. Ein Pull Request kann grün sein und
trotzdem eine schwarze Fläche enthalten.

**Bequemer für Punkt 4:** GitHub Pages einschalten und den Branch als
Quelle wählen. Dann liegt die Datei nach etwa einer Minute unter einer
Adresse, die du direkt öffnest.

**Aber:** Über GitHub Pages läuft alles über `https://`, nicht über
`file://`. Das Verhalten von localStorage, Zwischenablage und Appstarter
ist dort ein anderes. Für Aussehen und Ablauf reicht es, für die drei
Punkte aus dem Browsertest nicht.

### 6.3 Zeilenenden

Die Datei `.gitattributes` sorgt dafür, dass Windows keine CRLF-Zeilenenden
einträgt. Ohne sie zeigt jeder Diff die gesamte Datei als geändert und die
Versionsverwaltung wird wertlos. Nicht löschen.

---

## Teil 7 — Vom Handy mitverfolgen

Im Projektordner statt `claude`:

```powershell
claude --remote-control "Dashboard"
```

QR-Code mit dem Handy scannen, oder in der Claude-App unter **Code** die
Sitzung wählen.

* Das Terminal am PC muss offen bleiben
* Der PC braucht Internet — nur das fertige Dashboard läuft offline
* Zum Verfolgen und Freigeben geeignet, nicht zum Schreiben langer Vorgaben

---

---

## Teil 8 — Neue Unterhaltung im Claude-Chat

Falls du zwischendurch etwas entwerfen oder besprechen willst:

Das Paket als Zip anhängen und schreiben:

> Ich baue ein persönliches Dashboard als einzelne HTML-Datei, offline,
> für Windows und Edge. Im Anhang das Projektpaket. Lies CLAUDE.md,
> doku/ARBEITSWEISE.md, doku/ARCHITEKTUR.md und STAND.md, dann sag mir,
> wo wir stehen.

Wichtig: Halte `STAND.md` aktuell. Sie veraltet schneller als die übrigen
Dokumente und führt sonst in eine Richtung, die du längst entschieden hast.
