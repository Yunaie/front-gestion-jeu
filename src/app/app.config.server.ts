import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { firebaseConfig } from './app.config';  // Corrigé le nom de fichier

// Configuration pour le rendu côté serveur
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering()
  ]
};

// Fusion des configurations Firebase et Server-Side
export const config = mergeApplicationConfig(firebaseConfig, serverConfig);
