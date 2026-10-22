# Racines d'Avenir — site vitrine

Site statique (HTML, CSS, JavaScript natif) reproduisant la maquette
`export-v2/`. Aucune dépendance : seul Node.js ≥ 18 est nécessaire pour
générer le site.

## Générer le site

```sh
npm run build        # ou : node scripts/build.js
```

Le site prêt à publier est produit dans **`dist/`**. On peut l'ouvrir
directement (`dist/index.html`) ou le déposer tel quel chez n'importe quel
hébergeur (OVH, Netlify, GitHub Pages, serveur Apache/Nginx…).

## Pages

| Fichier généré                        | Page de la maquette |
| ------------------------------------- | ------------------- |
| `index.html`                          | Accueil             |
| `qui-sommes-nous.html`                | Qui sommes-nous     |
| `nos-formations.html`                 | Nos formations      |
| `formation-informatique-reseaux.html` | Formation (détail)  |
| `parcours.html`                       | Parcours            |
| `partenaires.html`                    | Partenaires         |
| `actualites.html`                     | Actualités          |
| `contact.html`                        | Contact             |

## Organisation des sources

```
src/
  pages/        contenu de chaque page (balisage de la maquette)
  partials/     gabarit HTML commun, en-tête, pied de page
  data/         listes affichées par les pages (filières, articles,
                modules, témoignages…)
  assets/
    css/        polices + styles communs
    js/site.js  interactions (menu, filtres, carrousels, formulaires…)
    fonts/      Poppins, Caveat, JetBrains Mono (auto-hébergées)
    img/        favicon, QR code
    photos/     photos du site (voir LISEZMOI.md)
scripts/build.js   générateur
```

Dans `src/pages/`, la syntaxe de la maquette est conservée :

- `<dc-import name="Icon" icon="Sprout" size="28">` → icône Lucide en SVG
  (le dernier tracé prend la couleur d'accent, comme dans la maquette) ;
- `<image-slot id="accueil-hero" placeholder="…">` → photo
  `src/assets/photos/accueil-hero.jpg` si elle existe, sinon emplacement vide ;
- `<sc-for list="{{ … }}" as="x">`, `<sc-if value="{{ … }}">`, `{{ … }}` →
  boucles et conditions alimentées par `src/data/<page>.js` ;
- `style-hover="…"` / `style-focus="…"` → classes générées dans
  `assets/css/states.css`.

## Animations

Définies dans `src/assets/css/motion.css` et `src/assets/js/site.js`.
Elles se pilotent par des attributs dans les pages :

| Attribut / classe   | Effet                                                  |
| ------------------- | ------------------------------------------------------ |
| `data-hero`         | entrée en cascade de la carte, zoom et parallaxe photo |
| `data-reveal`       | le bloc apparaît en glissant au défilement             |
| `data-stagger`      | les enfants apparaissent un par un                     |
| `data-count="78"`   | compteur animé jusqu'à la valeur                       |
| `.tl-progress`      | ligne de frise qui se remplit (parcours)               |
| `.bar-fill`         | jauge qui se remplit                                   |

Automatiquement : titres `h2` mot à mot, soulignés jaunes dessinés, formes
« feuilles » flottantes avec parallaxe, dévoilement des photos, en-tête qui
se retire au défilement, barre de progression, fondu entre les pages.
Tout est désactivé si l'utilisateur a demandé à réduire les animations.

## Images

⚠️ Ne déposez jamais d'images dans `dist/` : ce dossier est entièrement
effacé et régénéré à chaque `npm run build`.

1. Placez les images sources (PNG/JPG, même lourdes) dans
   `images-originales/`.
2. Indiquez quel fichier va dans quel emplacement dans la table
   `AFFECTATIONS` de `scripts/optimiser-photos.js`.
3. Lancez `node scripts/optimiser-photos.js` : les images sont
   redimensionnées et converties en WebP dans `src/assets/photos/`
   (≈ 80 Ko par photo au lieu de 2 Mo). Edge ou Chrome doit être installé.
4. Lancez `npm run build`.

Si un recadrage coupe un visage, ajustez son point focal dans
`src/data/photos.js` (ex. `'accueil-hero': '76% 25%'` = 76 % depuis la
gauche, 25 % depuis le haut).

Les prompts de génération de chaque photo sont dans
[docs/prompts-images.md](docs/prompts-images.md).

## Formulaires

Les formulaires (contact, partenariat, newsletter) affichent leur message de
confirmation sans rien envoyer tant qu'aucune destination n'est configurée.
Pour recevoir les messages, ajoutez un attribut `action` à la balise
`<form>` (par exemple un point d'accès Formspree, Getform ou un script PHP) :

```html
<form data-form="contact" method="post" action="https://formspree.io/f/XXXXXXX">
```

Les données sont alors envoyées en `POST` ; un message d'erreur s'affiche si
l'envoi échoue.

## Reste à fournir

- les photos (47 emplacements, listés à chaque génération) et les logos
  partenaires ;
- les liens des réseaux sociaux, de la brochure PDF et des articles
  (actuellement `href="#"`) ;
- la page « Mentions légales » ;
- les fiches détaillées des 9 autres filières (la maquette n'en détaille
  qu'une : toutes les cartes y renvoient pour l'instant).
