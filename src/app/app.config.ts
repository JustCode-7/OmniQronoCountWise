import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';

import { routes } from './app.routes';
import { provideAnimations } from "@angular/platform-browser/animations";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideAnimations(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: false, // Disabled for development to prevent errors with missing icon files
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};
