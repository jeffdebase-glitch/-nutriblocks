# Assiette — V2 (journal alimentaire Apple-friendly)

Application autonome de suivi et planification alimentaire, en français, utilisable dans un navigateur sur téléphone. La V2 contient une interface d'ajout express avec 14 aliments/portions préremplis, sans recopier la marque ni les ressources de YAZIO.

## Ajout express

Les 14 tuiles « Mes essentiels » affichent immédiatement la quantité habituelle : 300 g poulet cru, 100 g avoine, 400 ml lait d’amandes sans sucre, 200 g riz basmati cru, 30 g whey ESN (référence à préciser), 10 ml huile d’olive, 300 g fromage blanc 0 %, 250 g poivron vert cru, 300 g courgettes crues, 150 g champignons crus, 100 g maïs à popcorn, 500 g pommes de terre crues, 1 œuf entier, 100 g blanc d’œuf.

Au **premier ajout**, l'application demande les quatre valeurs nutritionnelles (kcal, protéines, glucides, lipides) par 100 g, 100 ml ou par pièce selon le produit. Ces nombres ne sont pas préremplis arbitrairement : ils dépendent de la marque, de la référence et/ou de la préparation. Après enregistrement, la fiche est conservée dans ce navigateur et un nouvel appui ajoute directement la portion préconfigurée. Les repas peuvent toujours être modifiés après ajout.

## Fonctionnalités et limites

- Aujourd’hui : totaux calories/macros, quatre repas, ajout express.
- Planifier : repas prévus vs consommés, dates et copie de journées.
- Historique : journées passées et détail des aliments.
- Recherche : aliments personnels et, si Internet est disponible, produits Open Food Facts à valider sur l’emballage.
- Unités : grammes, millilitres et pièces (valeurs par pièce pour un œuf entier).
- Sauvegarde : export JSON, import JSON, export CSV, suppression locale.
- Design mobile iPhone, mode sombre.

**Données privées** : les repas ne sont pas publiés sur GitHub. Ils sont stockés uniquement dans le navigateur local (`localStorage`), **sans** sauvegarde serveur, compte, synchronisation multiappareils ou connexion ChatGPT. Sauvegarder le journal en JSON régulièrement. Effacer les données du navigateur peut effacer l'historique. Une nouvelle adresse web aura un stockage local distinct.

**Pas de confusion avec YAZIO** : cette app ne lit pas le journal YAZIO. Elle constitue un carnet indépendant.

## Déploiement

Cette version se compose d’un seul fichier autonome `index.html`. GitHub héberge le code source, **pas automatiquement un site public**. Pour une URL `github.io`, il faut que GitHub Pages soit activé sur un dépôt/une branche compatible. Le connecteur GitHub actuellement disponible en conversation ne permet pas d'activer l'hébergement Pages.

## Crédit

Prototype original rédigé pour Assiette V2. Pas de dépendance externe pour l'interface et les calculs. Les recherches Open Food Facts sont déclenchées uniquement par l'utilisateur.