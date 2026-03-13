# Woter Admin - Règles

## Objectif
Ce fichier définit les règles de travail pour les changements admin dans `woter-admin`.

## Contrats partagés (obligatoire)
- Tous les types d'entrée/sortie des appels API doivent venir de `woter-library`.
- Ne pas redéfinir localement un contrat API déjà partagé.
- Créer ou mettre à jour le contrat dans `woter-library` avant d'implémenter côté admin.

## PrimeNG (obligatoire pour l'UI)
- Utiliser PrimeNG comme bibliothèque UI principale.
- Référence d'installation: `https://primeng.org/installation`.
- Dépendances attendues: `primeng`, `@primeuix/themes`, `primeicons`, `@angular/animations`.
- Configuration globale attendue dans `src/app/app.config.ts`:
  - `provideAnimationsAsync()`
  - `providePrimeNG({ theme: { preset: Aura } })`
- Importer `primeicons` dans `src/styles.css`.
- Préférer les composants PrimeNG (`p-button`, `p-card`, `p-tag`, `p-dialog`, etc.) plutôt que des composants HTML custom quand un composant PrimeNG existe.

## Implémentation
- Préférer une couche service fortement typée pour les appels API.
- Garder le mapping backend -> modèle UI explicite.
