# Dashboard Clash Royale - 300 partiates

Application Next.js (App Router) pour suivre les performances en Guerre de Clans du clan **300 partiates** (`#Q8ULRC`).

## Lancer le projet

1. Installer les dépendances:
   ```bash
   npm install
   ```
2. Créer `.env.local` depuis `.env.example` puis renseigner la clé API Clash Royale.
3. Démarrer en local:
   ```bash
   npm run dev
   ```

## Variables d'environnement

- `CLASH_ROYALE_API_TOKEN`: clé API officielle Clash Royale.
- `CLAN_TAG`: tag du clan sans `#` (valeur par défaut: `Q8ULRC`).

## Déploiement Vercel

Le projet est prêt pour Vercel. Ajouter les variables d'environnement dans les settings du projet Vercel.
