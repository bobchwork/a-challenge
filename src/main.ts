import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

// Register service worker, only if supported by the browser. Here we add the condition to validate it is PROD
if (environment.production) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/ngsw-worker.js')
        .then((registration) => {
          console.log(
            'Service Worker registered with scope:',
            registration.scope,
          );
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
}
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
