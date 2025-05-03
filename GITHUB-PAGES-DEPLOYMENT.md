# GitHub Pages Deployment für OmniQronoCountWise

Diese Dokumentation beschreibt, wie die Angular-Anwendung OmniQronoCountWise auf GitHub Pages bereitgestellt wird.

## Automatische Bereitstellung mit GitHub Actions

Die Anwendung wird automatisch auf GitHub Pages bereitgestellt, wenn Änderungen in den `main`-Branch gepusht werden. Dies wird durch einen GitHub Actions Workflow erreicht, der in der Datei `.github/workflows/deploy.yml` definiert ist.

Der Workflow führt folgende Schritte aus:
1. Checkout des Codes
2. Einrichtung von Node.js
3. Installation der Abhängigkeiten
4. Build der Anwendung mit Produktionskonfiguration
5. Bereitstellung auf dem `gh-pages`-Branch

Die bereitgestellte Anwendung ist dann unter `https://[username].github.io/OmniQronoCountWise/` verfügbar, wobei `[username]` durch den GitHub-Benutzernamen ersetzt werden muss.

## Manuelle Bereitstellung

Für eine manuelle Bereitstellung kann der folgende Befehl verwendet werden:

```bash
npm run deploy
```

Dieser Befehl:
1. Baut die Anwendung mit Produktionskonfiguration
2. Setzt die Base-Href auf `/OmniQronoCountWise/`
3. Verwendet angular-cli-ghpages, um die Anwendung auf GitHub Pages bereitzustellen

## Konfiguration für GitHub Pages

Folgende Konfigurationen wurden für die GitHub Pages-Bereitstellung vorgenommen:

1. **Base-Href**: Die Anwendung verwendet `/OmniQronoCountWise/` als Base-Href, um korrekt auf GitHub Pages zu funktionieren.

2. **404.html**: Eine 404.html-Datei wurde hinzugefügt, um Client-seitiges Routing zu unterstützen. Diese Datei leitet Anfragen an die index.html-Datei weiter und erhält dabei die URL-Parameter.

3. **angular-cli-ghpages**: Das Paket `angular-cli-ghpages` wurde als Entwicklungsabhängigkeit installiert, um die Bereitstellung zu vereinfachen.

## GitHub Repository-Einstellungen

Nach der ersten Bereitstellung müssen folgende Einstellungen im GitHub Repository vorgenommen werden:

1. Gehe zu den Repository-Einstellungen
2. Wähle "Pages" im Seitenmenü
3. Unter "Source", wähle den `gh-pages`-Branch
4. Klicke auf "Save"

## Progressive Web App (PWA)

Die Anwendung ist als Progressive Web App (PWA) konfiguriert, aber der Service Worker ist derzeit für die Entwicklung deaktiviert. Für die Produktionsbereitstellung kann der Service Worker aktiviert werden, indem:

1. In `angular.json` der Wert von `"serviceWorker"` auf `true` gesetzt wird
2. In `src/app/app.config.ts` der Service Worker mit `enabled: !isDevMode()` konfiguriert wird

Beachten Sie, dass für die vollständige PWA-Funktionalität die Icon-Dateien generiert und im Verzeichnis `src/assets/icons` platziert werden müssen, wie in der Datei `README-FIX.md` beschrieben.