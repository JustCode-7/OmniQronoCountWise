# Fehlerbehebung für GitHub Pages Deployment

## Problem
Bei dem GitHub Pages Deployment wurde immer nur die README des Repositories angezeigt statt der deployten Anwendung.

## Ursache
Das Problem wurde durch eine Inkonsistenz in der Konfiguration des Base-Href-Pfades verursacht:

1. In der Datei `.github/workflows/deploy.yml` wurde der Base-Href als `/omni-qrono-count-wise/` (kleingeschrieben mit Bindestrichen) konfiguriert.
2. In anderen Dateien wie `package.json` (deploy-Script) und `src/404.html` wurde jedoch `/OmniQronoCountWise/` (gemischte Groß-/Kleinschreibung) verwendet.

Diese Inkonsistenz führte dazu, dass die Anwendung nach Ressourcen am falschen Speicherort suchte, was zur Anzeige der README-Datei anstelle der Anwendung führte.

## Lösung
Die Lösung bestand darin, den Base-Href in der GitHub Actions Workflow-Datei zu korrigieren:

```yaml
# Vorher
- run: npm run build:prod -- --base-href /omni-qrono-count-wise/ --deploy-url /omni-qrono-count-wise/

# Nachher
- run: npm run build:prod -- --base-href /OmniQronoCountWise/ --deploy-url /OmniQronoCountWise/
```

Diese Änderung stellt sicher, dass die Anwendung korrekt auf GitHub Pages bereitgestellt wird und alle Ressourcen am richtigen Speicherort gefunden werden.

## Wichtige Hinweise für GitHub Pages Deployments
1. **Konsistente Benennung**: Stellen Sie sicher, dass der Repository-Name in allen Konfigurationsdateien konsistent verwendet wird, insbesondere bei:
   - Base-Href in Build-Befehlen
   - Deploy-URL in Build-Befehlen
   - Pfaden in 404.html für Client-seitiges Routing
   - Skripten in package.json

2. **Groß-/Kleinschreibung beachten**: GitHub Pages ist case-sensitive, daher muss die Groß-/Kleinschreibung des Repository-Namens in allen Pfaden exakt übereinstimmen.

3. **Korrekte Ausgabestruktur**: Bei Verwendung des neueren Angular-Builders "@angular-devkit/build-angular:application" wird ein zusätzliches "browser"-Verzeichnis im Ausgabepfad erstellt. Stellen Sie sicher, dass der richtige Pfad für die Bereitstellung verwendet wird.