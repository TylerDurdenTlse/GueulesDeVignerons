# Gueules de Vignerons par RVins — première version

Site vitrine et marchand construit avec Next.js App Router, PostgreSQL et Drizzle ORM. L'interface est en français et comprend une cave filtrable, fiches produits, panier, demandes de commande, Club Épicure, coffrets, formulaires et espace professionnel avec compte et session.

## Démarrage

```bash
npx drizzle-kit push
npx tsx scripts/seed.ts
npm run dev
```

Le script `seed.ts` ajoute 12 **références de démonstration** sans modifier les cuvées déjà présentes. Elles ne représentent pas un stock commercial réel. Les demandes de commande sont enregistrées en base, sans paiement en ligne ; frais de livraison et règlement sont à confirmer hors site.

## Maintenir 350 références sans retoucher le site

1. Exporter le catalogue de votre tableur au format CSV UTF-8. Un en-tête est fourni dans `docs/catalogue-modele.csv`. Les séparateurs `;` et `,` sont acceptés (pour un prix comme `18,90`, préférer `;`).
2. Renseigner les colonnes obligatoires : `slug` (identifiant URL unique et stable), `name`, `producer`, `region`, `appellation`, `color`, `description`, `price` (en euros).
3. Colonnes facultatives : `vintage`, `story`, `tastingNotes`, `pairing`, `stock`, `featured` (`oui`/`non`), `sortOrder` (nombre croissant), `imageUrl` (URL `https://...` ou chemin `/images/...`). Couleurs prévues : `rouge`, `blanc`, `rose`, `bulles`, `sans-alcool`.
4. Importer depuis la racine du projet :

```bash
npx tsx scripts/import-catalogue.ts chemin/vers/mon-catalogue.csv
```

L'import valide tout le fichier puis crée ou met à jour les fiches **dans une transaction** grâce au `slug`. Il marque les références importées comme réelles (`isDemo = false`). Une colonne `imageUrl` vide conserve l'illustration de bouteille. Pour éviter de publier des références fictives, supprimer les 12 exemples lorsque le vrai catalogue est prêt.

Les pages de région et leurs compteurs proviennent automatiquement de la base. Le lien d'une région présente ses **10 premiers coups de cœur**, triés d'abord par `featured`, puis par `sortOrder`; un lien permet de voir toutes les références de la région. La cave complète offre recherche, couleur, prix et pagination.

## Réseaux sociaux

`GET /api/social/feed` fournit les 10 premières **références importées et disponibles** sous forme de JSON (lien, photo, légende suggérée). Les références de démonstration en sont exclues. Un outil comme Make ou Zapier peut interroger ce flux et préparer des brouillons. La validation humaine reste nécessaire avant diffusion, et aucune publication automatique sur Instagram/Meta n'est activée sans comptes et autorisations dédiés.

## Avant une mise en ligne commerciale

- Remplacer le catalogue fictif et valider prix, stocks, photos et domaines partenaires.
- Fournir identité juridique, coordonnées, CGV, politique de livraison et informations RGPD complètes.
- Définir un prestataire de paiement si un règlement immédiat est souhaité ; aujourd'hui, le site enregistre des **demandes de commande** uniquement.
- Mettre en place les notifications email et le suivi interne des commandes/demandes : les enregistrements sont actuellement conservés en PostgreSQL.
- Définir si les inscriptions pro doivent faire l'objet d'une validation manuelle. Dans cette version, l'accès est immédiat après inscription.

Photographies d'ambiance Pexels : Zen Chung, Valeria Boltneva et Tim Durand. Visuels d'accueil et coffrets créés pour la maquette.
