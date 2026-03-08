Rôle : Agis en tant qu'expert Développeur Fullstack spécialisé en React et Next.js.
Objectif : Créer une application web (Dashboard) pour le clan Clash Royale nommé « 300 partiates » (Tag : #Q8ULRC) afin de suivre les performances en Guerre de Clans. L'application sera déployée sur Vercel.
Fonctionnalités requises :
Connexion API : Utilise l'API officielle de Clash Royale (developer.clashroyale.com) pour récupérer les données du clan et des membres.
Page Liste des Membres : Affiche un tableau avec le nom, le rang dans le clan, et le niveau des trophées.
Section Guerre de Clans :
Récupère les données de la « River Race » actuelle et passée.
Affiche le score de guerre (médailles) pour chaque membre.
Implémente des filtres de temps : « 1 semaine », « 1 mois » et « Historique complet ».
Interface (UI) : Utilise Tailwind CSS pour un design moderne et responsive. Ajoute un mode sombre (dark mode).
Déploiement : Structure le projet pour qu'il soit prêt à être importé sur Vercel (inclure un fichier next.config.js si nécessaire pour les variables d'environnement comme la clé API).
Contraintes techniques :
Utilise React avec le framework Next.js (App Router).
Gère les appels API côté serveur (Server Components) pour sécuriser la clé API.
Ajoute une barre de recherche pour trouver un membre spécifique par son nom ou son tag
.
Format de sortie attendu : Donne-moi la structure des dossiers, le code du composant principal du tableau de bord, et la logique de l'appel API pour récupérer les statistiques de guerre.