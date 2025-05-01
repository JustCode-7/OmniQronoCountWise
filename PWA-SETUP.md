# PWA Setup für OmniQronoCountWise

Diese Anleitung beschreibt, wie die PWA-Funktionalität (Progressive Web App) für OmniQronoCountWise eingerichtet wurde und wie sie getestet werden kann.

## Einrichtung

Die Anwendung wurde als PWA konfiguriert, sodass sie auf Geräten installiert werden kann. Folgende Komponenten wurden hinzugefügt:

1. **@angular/service-worker** - Für die Service Worker Funktionalität
2. **manifest.webmanifest** - Definiert Metadaten für die installierbare App
3. **ngsw-config.json** - Konfiguriert den Service Worker
4. **PWA Meta-Tags** - In index.html hinzugefügt
5. **Service Worker Provider** - In app.config.ts registriert

## Icons generieren

Für eine vollständige PWA-Funktionalität werden Icons in verschiedenen Größen benötigt. Im Projekt ist ein einfacher Icon-Generator enthalten, den Sie verwenden können:

1. Öffnen Sie die Datei `icon-generator.html` in einem Browser
2. Passen Sie die Hintergrundfarbe, Textfarbe und den Text an
3. Wählen Sie die gewünschte Größe aus den Buttons
4. Klicken Sie auf "Icon herunterladen"
5. Speichern Sie die heruntergeladene Datei im Verzeichnis `src/assets/icons`
6. Wiederholen Sie den Vorgang für alle benötigten Größen

Alternativ können Sie auch ein Tool wie den [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator) verwenden:

```bash
# Installieren des PWA Asset Generators
npm install -g pwa-asset-generator

# Generieren der Icons aus einem Basis-Icon
pwa-asset-generator ./path/to/your/icon.png ./src/assets/icons --manifest ./src/manifest.webmanifest --index ./src/index.html
```

Die folgenden Icon-Größen werden benötigt und sollten im Verzeichnis `src/assets/icons` abgelegt werden:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## Testen der PWA

Um die PWA-Funktionalität zu testen:

1. Bauen Sie die Anwendung im Produktionsmodus:
   ```bash
   npm run build:prod
   ```

2. Installieren Sie einen lokalen HTTP-Server, falls noch nicht vorhanden:
   ```bash
   npm install -g http-server
   ```

3. Starten Sie den Server im dist-Verzeichnis:
   ```bash
   http-server dist/omni-qrono-count-wise -p 8080
   ```

4. Öffnen Sie die Anwendung in Chrome: http://localhost:8080

5. Öffnen Sie die Chrome DevTools (F12), gehen Sie zum "Application" Tab und überprüfen Sie:
   - Manifest (sollte korrekt geladen sein)
   - Service Worker (sollte registriert und aktiv sein)

6. In Chrome sollte ein "Installieren" Symbol in der Adressleiste erscheinen, mit dem die Anwendung als PWA installiert werden kann.

## Hinweise

- Der Service Worker ist nur im Produktionsmodus aktiv, nicht während der Entwicklung
- Nach Änderungen am Service Worker oder Manifest muss die Anwendung neu gebaut werden
- Beim Testen im Browser müssen Sie möglicherweise den Cache leeren und neu laden
