# AGENTS.md - Règles de travail du projet aqua

## Objectif
Ce fichier définit les règles à appliquer quand l'assistant intervient sur ce dépôt.

## Langue et communication
- Répondre en français.
- Être concis, concret, orienté action.
- Avant une modification importante, annoncer en 1-2 phrases ce qui va être fait.
- Après modifications, résumer précisément les fichiers touchés et les commandes utiles.

## Portée des changements
- Modifier uniquement ce qui est nécessaire à la demande.
- Ne pas refactorer hors sujet sans demande explicite.
- Préserver le style existant du projet.
- Ne jamais supprimer du code/fichier sans expliquer pourquoi.

## Validation
- Exécuter les tests/lint pertinents quand possible.
- Si une validation n'est pas possible, l'indiquer explicitement.
- Donner les commandes exactes à lancer pour vérifier.

## Git
- Ne pas faire de commit, tag, push ni release sans demande explicite.
- Ne jamais utiliser de commandes destructrices (`reset --hard`, `checkout --`, suppression massive) sans accord explicite.
- Respecter les changements non liés déjà présents dans la branche.

## Structure du monorepo
Sous-projets principaux:
- `woter-admin`
- `woter-api`
- `woter-frontend`
- `woter-library`

## Règle Library
- `woter-library` doit contenir `src/interfaces` et `src/services`.
- Les contrats partagés sont définis dans `src/interfaces`.
- Les services partagés sont implémentés dans `src/services`.

## Règle API (routes)
- Pour une nouvelle route API dans `woter-api`, créer un dossier dans `src/routes` en prenant `src/routes/authentication` comme modèle, puis mettre à jour `src/server.ts` pour enregistrer la route.
- Toutes les entrées/sorties de routes doivent utiliser des interfaces partagées créées dans `woter-library`.
- Les contrats d'interface doivent être créés/mis à jour dans `woter-library` avant l'implémentation de la route API.

## Règle Frontend/Admin
- Pour `woter-frontend` et `woter-admin`, tous les types d'entrée/sortie des appels API doivent utiliser des interfaces partagées dans `woter-library`.
- Ne pas redéfinir localement des contrats API déjà partagés.
- Créer/mettre à jour d'abord les interfaces dans `woter-library`, puis les importer dans le frontend/admin.

## Scripts et versioning
- Pour bump patch sans commit/tag Git, utiliser:
  - `./bump-all-patch-no-git.sh`
- Pour un script nouveau, le créer à la racine si demandé globalement, sinon dans le sous-projet concerné.

## En cas d'ambiguïté
- Si la demande est ambiguë et impactante, poser une seule question ciblée avant d'agir.
- Sinon, faire l'hypothèse la plus raisonnable et avancer.

## Priorité
1. Sécurité des changements
2. Exactitude fonctionnelle
3. Simplicité
4. Vitesse d'exécution
