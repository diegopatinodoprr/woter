# Woter Frontend - Règles

## Objectif
Ce fichier définit les règles de travail pour les changements frontend dans `woter-frontend`.

## Collaboration
- Répondre en français, de façon concise et orientée action.
- Avant une modification importante, annoncer en 1-2 phrases ce qui sera fait.
- Après modification, résumer les fichiers touchés et les commandes de vérification.

## Contrats partagés (obligatoire)
- Tous les types d'entrée/sortie des appels API doivent venir de `woter-library`.
- Ne jamais redéfinir localement un contrat API déjà partagé.
- Créer ou mettre à jour le contrat dans `woter-library` avant d'implémenter côté frontend.
- Les interfaces partagées doivent être préfixées par `I...`.

## Organisation des appels API
- Tous les appels API doivent être dans `src/app/services`.
- Le nom du service doit suivre le nom de la route backend (ex: route `user` -> `services/user.service.ts`).
- Le composant ne doit pas faire d'appel HTTP direct si un service dédié existe.

## Écrans et modules
- Chaque nouvel écran demandé doit avoir un module dédié.
- Créer des composants supplémentaires uniquement si nécessaire (sections UI, composants réutilisables, séparation de responsabilités).
- Respecter une structure claire par feature (module + composants + routing si nécessaire).

## Implémentation
- Favoriser une couche service fortement typée.
- Garder le mapping backend -> modèle UI explicite.
- Préserver le style existant (Angular + conventions du projet), sans refactor hors sujet.

## Validation
- Exécuter la validation pertinente quand possible:
  - `npm run build`
  - `npm run test`
- Si une validation n'est pas possible, l'indiquer explicitement dans le retour.
