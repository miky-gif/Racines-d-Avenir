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
Son niveau (BEPC / Probatoire, Baccalauréat, Bac+ / Supérieur) est déduit du
niveau d’entrée `niv` : « Bac+1 », « Bac+2 »… → Supérieur ; « Bac » →
Baccalauréat ; sinon BEPC / Probatoire.

Les informations encore provisoires sont listées dans
[docs/validation-client.md](docs/validation-client.md).

## Pages

| Fichier généré            | Page                                            |
| ------------------------- | ----------------------------------------------- |
| `index.html`              | Accueil (bannière en carrousel)                 |
| `qui-sommes-nous.html`    | Qui sommes-nous                                 |
| `nos-formations.html`     | Catalogue avec filtres (`?domaine=sante`, `?cycle=bac`, `?duree=module`) |
| `formation-<slug>.html`   | Une fiche par formation (24 fiches)             |
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

## Version anglaise (FR / EN)

Chaque page est générée deux fois : en français dans `dist/`, et en
anglais dans `dist/en/` (ex. `/parcours` ↔ `/en/parcours`). Le sélecteur
🇫🇷 FR / 🇬🇧 EN de la barre de navigation mène à la même page dans l'autre
langue.

Les traductions sont dans **`src/i18n/en.json`**, sous la forme
`"texte français": "English text"`. Quand un texte français est ajouté ou
modifié, `npm run build` liste les textes sans traduction : il suffit de
les ajouter à ce fichier (tant qu'ils manquent, ils restent en français sur
la version anglaise). Les textes générés par le script (menu, erreurs
d'envoi…) sont traduits dans `src/assets/js/site.js`.

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
2. Lancez `npm run photos` (Edge ou Chrome requis) : les
   images sont redimensionnées et converties en WebP dans
   `src/assets/photos/`.
3. Lancez `npm run build`. La liste des emplacements encore vides s'affiche.

Si un recadrage coupe un visage, ajustez son point focal dans
`src/data/photos.js` (ex. `'hero-couture': '72% 35%'` = 72 % depuis la
gauche, 35 % depuis le haut).

## Référencement (SEO)

Géré automatiquement par `scripts/seo.js` à chaque `npm run build` :

- **Titre et description** de chaque page : en tête du fichier
  `src/pages/<page>.html` (`title:` / `description:`). Visez environ 60
  caractères pour le titre et 150 pour la description, avec le métier et la
  ville. La traduction anglaise se met dans `src/i18n/en.json` comme le reste.
- **Adresse canonique** et **hreflang** FR / EN sur chaque page.
- **Open Graph** : titre, description et image affichés quand un lien est
  partagé sur WhatsApp, Facebook, LinkedIn…
- **Données structurées** (schema.org) : l'établissement sur toutes les pages,
  une fiche `Course` et un fil d'Ariane sur chaque formation, la liste des
  formations sur le catalogue.
- **`sitemap.xml`** (pages FR et EN) et **`robots.txt`**.
- **Page 404** (`src/pages/404.html`), exclue de l'indexation.

L'adresse du site utilisée dans ces balises est le champ `url` de
`src/data/site.js` (`https://racinesdavenir.com`). La variable d'environnement
`SITE_URL` la remplace si besoin (par exemple pour un site de test).

**Images de partage** (1200 × 630, dans `src/assets/partage/`) : une image
générale et une par formation, en français et en anglais. Après un changement
de photo, de nom ou de durée d'une formation, relancez :

```bash
npm run partage
```

Une page se retire de l'indexation en ajoutant `noindex: oui` dans son en-tête.

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
