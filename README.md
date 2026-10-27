# Racines d'Avenir — site vitrine

Site statique (HTML, CSS, JavaScript natif) de l'institut de formation
professionnelle Racines d'Avenir. Aucune dépendance : seul Node.js ≥ 18 est
nécessaire pour générer le site.

## Générer le site

```sh
npm run build        # ou : node scripts/build.js
```

Le site prêt à publier est produit dans **`dist/`** (déployé tel quel par
Vercel, voir `vercel.json`). On peut aussi l'ouvrir directement
(`dist/index.html`).

## Où modifier quoi

| Je veux changer…                                        | Fichier                     |
| ------------------------------------------------------- | --------------------------- |
| Nom, sigle, téléphone, WhatsApp, e-mail, horaires, réseaux | `src/data/site.js`       |
| Le catalogue : formations, durées, CQP, programmes, débouchés | `src/data/formations.js` |
| Les diapositives de la bannière d'accueil               | `src/data/index.js`         |
| Le parcours, l'accompagnement, les témoignages          | `src/data/parcours.js`      |
| Les engagements partenaires et la Fondation             | `src/data/partenaires.js`   |
| Les articles d'actualité                                | `src/data/actualites.js`    |
| Le texte d'une page                                     | `src/pages/<page>.html`     |
| La mise en page des fiches formation                    | `src/pages/_formation.html` |

Ajouter une formation dans `src/data/formations.js` crée automatiquement sa
fiche (`formation-<slug>.html`), sa carte dans le catalogue, son entrée dans
le carrousel de l'accueil et dans la liste du formulaire de préinscription.

Les informations encore provisoires sont listées dans
[docs/validation-client.md](docs/validation-client.md).

## Pages

| Fichier généré            | Page                                            |
| ------------------------- | ----------------------------------------------- |
| `index.html`              | Accueil (bannière en carrousel)                 |
| `qui-sommes-nous.html`    | Qui sommes-nous                                 |
| `nos-formations.html`     | Catalogue avec filtres (`?domaine=numerique`…)  |
| `formation-<slug>.html`   | Une fiche par formation (17 fiches)             |
| `parcours.html`           | Le parcours vers l'emploi                       |
| `partenaires.html`        | Entreprises, partenaires et Fondation           |
| `actualites.html`         | Actualités                                      |
| `contact.html`            | Contact et préinscription (`?formation=<slug>`) |

## Organisation des sources

```
src/
  pages/        contenu de chaque page ; _formation.html = gabarit des fiches
  partials/     gabarit HTML commun, en-tête, pied de page
  data/         configuration et contenus (voir tableau ci-dessus)
  assets/
    css/        polices, styles communs (site.css), animations (motion.css)
    js/site.js  interactions et animations
    fonts/      Poppins, Caveat, JetBrains Mono (auto-hébergées)
    img/        favicon, QR code
    photos/     photos optimisées (générées par scripts/optimiser-photos.js)
images-originales/  photos sources en pleine qualité
scripts/
  build.js             générateur du site
  optimiser-photos.js  conversion des photos en WebP
docs/
  validation-client.md éléments à faire valider par le client
  prompts-images.md    prompts de génération des photos
```

Dans `src/pages/` :

- `<dc-import name="Icon" icon="Sprout" size="28">` → icône Lucide en SVG
  (le dernier tracé prend la couleur d'accent), `icon="WhatsApp"` compris ;
- `<dc-import name="Logo">` → logo de l'institut (variante `light` sur fond vert) ;
- `<image-slot id="f-carrelage" placeholder="…">` → photo
  `src/assets/photos/f-carrelage.webp` si elle existe, sinon emplacement vide ;
- `<sc-for list="{{ … }}" as="x">`, `<sc-if value="{{ … }}">`, `{{ … }}` →
  boucles et conditions alimentées par `src/data/` (`site` et `catalogue`
  sont disponibles sur toutes les pages) ;
- `style-hover="…"` / `style-focus="…"` → classes générées dans
  `assets/css/states.css`.

## Animations

Définies dans `src/assets/css/motion.css` et `src/assets/js/site.js` :

| Attribut / classe   | Effet                                                  |
| ------------------- | ------------------------------------------------------ |
| `data-hero`         | entrée en cascade de la carte, zoom et parallaxe photo |
| `data-slider`       | bannière en carrousel (auto, pause, flèches, glisser)  |
| `data-reveal`       | le bloc apparaît en glissant au défilement             |
| `data-stagger`      | les enfants apparaissent un par un                     |
| `data-count="78"`   | compteur animé jusqu'à la valeur                       |
| `.tl-progress`      | ligne de frise qui se remplit (parcours)               |

Automatiquement : titres `h2` mot à mot, soulignés jaunes dessinés, formes
« feuilles » flottantes, dévoilement des photos, en-tête qui se retire au
défilement, barre de progression, bouton WhatsApp flottant, fondu entre les
pages. Tout est désactivé si l'utilisateur a demandé à réduire les animations.

## Images

⚠️ Ne déposez jamais d'images dans `dist/` : ce dossier est entièrement
effacé et régénéré à chaque `npm run build`.

1. Placez les images sources dans `images-originales/`. Nommez-les comme
   l'emplacement qu'elles remplissent (ex. `hero-couture.png`,
   `f-plomberie.png`) : elles sont reconnues automatiquement. Sinon,
   indiquez l'affectation dans la table `AFFECTATIONS` de
   `scripts/optimiser-photos.js`.
2. Lancez `node scripts/optimiser-photos.js` (Edge ou Chrome requis) : les
   images sont redimensionnées et converties en WebP dans
   `src/assets/photos/`.
3. Lancez `npm run build`. La liste des emplacements encore vides s'affiche.

Si un recadrage coupe un visage, ajustez son point focal dans
`src/data/photos.js` (ex. `'hero-couture': '72% 35%'` = 72 % depuis la
gauche, 35 % depuis le haut).

## Formulaires

Les formulaires (préinscription, partenariat, newsletter) affichent leur
message de confirmation sans rien envoyer tant qu'aucune destination n'est
configurée. Pour recevoir les messages, ajoutez un attribut `action` à la
balise `<form>` (par exemple un point d'accès Formspree ou un script PHP) :

```html
<form data-form="contact" method="post" action="https://formspree.io/f/XXXXXXX">
```

Les liens de la forme `contact.html?formation=couture-africaine#formulaire`
préremplissent la préinscription ; `partenaires.html?engagement=Fondation`
présélectionne le type d'engagement.
