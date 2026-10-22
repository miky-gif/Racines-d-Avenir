# Prompts de génération des images — Racines d'Avenir

Chaque image générée s'enregistre dans `src/assets/photos/` sous le **nom
de fichier indiqué** (en `.jpg` ou `.webp`), puis `npm run build` l'intègre
automatiquement à la bonne place.

Les prompts sont en anglais : les générateurs (Midjourney, Flux, Imagen,
DALL·E, Higgsfield, Firefly…) les suivent mieux ainsi.

---

## 1. Bloc de style commun — à coller à la fin de CHAQUE prompt

```
Authentic documentary photography in Yaoundé, Cameroon. Real Cameroonian people with natural expressions, not posing for the camera unless stated. Learners wear deep forest-green work uniforms or polo shirts (#0F4D35); small touches of warm sunflower yellow (#F2B134) in the scene (a tool handle, a helmet, a cloth). Soft natural daylight, warm and hopeful mood, cream and sage-green tones, gentle film grain, 35mm lens, shallow depth of field. Clean, uncluttered background. No text, no logos, no watermark.
```

**Prompt négatif** (si l'outil le permet) :

```
text, letters, logo, watermark, distorted hands, extra fingers, deformed faces, plastic skin, oversaturated, stock-photo cliché, cartoon, 3D render, dark gloomy lighting
```

**Cohérence** : générez une série en conservant la même graine (seed) ou
la même image de référence de style, pour que les photos se ressemblent
d'une page à l'autre.

---

## 2. Photos plein cadre du haut de page (format 16:9 — 2400 × 1350 px)

> Composition : la carte crème du site recouvre **le bas et la gauche** de
> l'image. Placez le sujet principal **dans le tiers droit et la moitié
> haute**, et laissez la gauche plus calme.

| Fichier | Prompt |
| --- | --- |
| `accueil-hero.jpg` | A smiling young Cameroonian woman in a dark green workshop uniform learning car mechanics, holding a wrench near an open car engine, bright training workshop, subject placed on the right third of the frame, calm blurred background on the left, wide 16:9 shot |
| `qui-hero.jpg` | Electrical training workshop: a group of young Cameroonian apprentices in green uniforms around their trainer who shows them an electrical panel, warm daylight from large windows, group placed on the right half of the frame, wide 16:9 shot |
| `form-hero.jpg` | A focused young Cameroonian apprentice carpenter in a green apron planing a wooden board, sawdust floating in the light, carpentry workshop, subject on the right third, wide 16:9 shot |
| `detail-hero.jpg` | A young Cameroonian learner in a green polo shirt plugging network cables into a server rack, coloured RJ45 cables, IT training room, close-medium shot, subject on the right side, wide 16:9 shot |
| `parcours-hero.jpg` | A confident young Cameroonian woman, former apprentice, standing in the small business where she now works, wearing work clothes, arms relaxed, proud smile, placed on the right third, wide 16:9 shot |
| `part-hero.jpg` | A Cameroonian business owner in a shirt and a young apprentice in a green uniform discussing in front of a car in a mechanical workshop, handshake moment, placed on the right half, wide 16:9 shot |
| `actu-une.jpg` | Welcoming new learners at a vocational training centre in Yaoundé: young people with registration folders talking with a smiling staff member in the courtyard, morning light, festive yet simple atmosphere, wide 16:9 shot |

---

## 3. Accueil

| Fichier | Format | Prompt |
| --- | --- | --- |
| `accueil-qui.jpg` | 4:5 (1200 × 1500) | Young Cameroonian learners in a computer training room with their trainer leaning over a screen to help, attentive faces, vertical portrait framing |

### Carrousel « Choisissez votre métier » — format 2:3 vertical (1000 × 1400 px)

> Le haut de la carte porte une pastille ronde et le bas un bandeau blanc :
> gardez le sujet **au centre** de l'image.

| Fichier | Prompt |
| --- | --- |
| `rail-1.jpg` | IT and networking workshop: young Cameroonian learner repairing an open desktop computer, vertical framing |
| `rail-2.jpg` | Accounting training: young Cameroonian woman working with a calculator, ledger and laptop at a tidy desk, vertical framing |
| `rail-3.jpg` | Health training: young Cameroonian nursing assistant in green scrubs taking a blood pressure reading on a training mannequin, vertical framing |
| `rail-4.jpg` | Retail and sales training: young Cameroonian learner arranging products on a shop shelf and smiling at a customer, vertical framing |
| `rail-5.jpg` | Office administration training: young Cameroonian learner filing documents in a bright office, folders and binders, vertical framing |
| `rail-6.jpg` | Beauty training: young Cameroonian learner braiding a client's hair in a modern salon, vertical framing |
| `rail-7.jpg` | Catering training: young Cameroonian cook in a green apron plating a dish in a professional kitchen, vertical framing |
| `rail-8.jpg` | Masonry training: young Cameroonian apprentice in a yellow helmet laying bricks with a trowel on a construction site, vertical framing |
| `rail-9.jpg` | Mechanics training: young Cameroonian apprentice working under the hood of a car, vertical framing |
| `rail-10.jpg` | Carpentry training: young Cameroonian apprentice assembling a wooden chair in a workshop, vertical framing |

---

## 4. Nos formations — vignettes carrées (1:1 — 1000 × 1000 px)

> Sujet **centré**, cadrage plus serré que le carrousel (gros plan sur le
> geste métier) pour ne pas doublonner avec l'accueil.

| Fichier | Prompt |
| --- | --- |
| `fil-1.jpg` | Close-up of hands crimping an RJ45 network cable, IT workshop, square framing |
| `fil-2.jpg` | Close-up of hands using a calculator next to an accounting ledger and invoices, square framing |
| `fil-3.jpg` | Close-up of a stethoscope and hands of a young nursing assistant in green scrubs, square framing |
| `fil-4.jpg` | Close-up of hands handing a paper shopping bag to a customer at a small shop counter, square framing |
| `fil-5.jpg` | Close-up of hands typing on a keyboard next to neatly stacked files, office, square framing |
| `fil-6.jpg` | Close-up of hands braiding hair in a salon, square framing |
| `fil-7.jpg` | Close-up of hands garnishing a plate of Cameroonian food in a professional kitchen, square framing |
| `fil-8.jpg` | Close-up of hands spreading mortar with a trowel on a brick wall, square framing |
| `fil-9.jpg` | Close-up of greasy hands tightening an engine part with a wrench, square framing |
| `fil-10.jpg` | Close-up of hands sanding a wooden plank in a carpentry workshop, square framing |

---

## 5. Qui sommes-nous

| Fichier | Format | Prompt |
| --- | --- | --- |
| `qui-equipe.jpg` | 1:1 (1400 × 1400) | The teaching and administrative team of a Cameroonian vocational training centre, eight men and women of various ages, some in green polo shirts, standing together in a sunny courtyard, friendly group photo |

---

## 6. Le parcours vers l'emploi — format 4:5 (1200 × 1500 px)

> Ces images sont recadrées en arche ; sujet **au centre**.

| Fichier | Prompt |
| --- | --- |
| `parcours-1.jpg` | Practical training session: a trainer demonstrating a technical gesture to a small group of young Cameroonian apprentices in green uniforms, workshop, vertical framing |
| `parcours-2.jpg` | Internship: a young Cameroonian intern in a green polo shirt working alongside an experienced tutor in a real company workshop, tutor explaining, vertical framing |
| `parcours-3.jpg` | A young Cameroonian former apprentice running his own small repair shop, serving a customer, proud and confident, vertical framing |

### Témoignages — portraits carrés (1:1 — 800 × 800 px, affichés en cercle)

> ⚠️ Voir la remarque en bas de page. Visage **centré**, épaules visibles.

| Fichier | Prompt |
| --- | --- |
| `temoin-1.jpg` | Headshot portrait of a young Cameroonian woman around 22, IT technician, friendly smile, plain sage-green background, square framing |
| `temoin-2.jpg` | Headshot portrait of a young Cameroonian man around 26, garage owner, work shirt, confident smile, plain sage-green background, square framing |
| `temoin-3.jpg` | Headshot portrait of a young Cameroonian woman around 25, caterer wearing a chef jacket, warm smile, plain sage-green background, square framing |

---

## 7. Actualités — format 4:3 (1600 × 1200 px)

| Fichier | Prompt |
| --- | --- |
| `actu-1.jpg` | Graduation ceremony: young Cameroonian graduates proudly holding their certificates with their families applauding, outdoor ceremony with green and yellow decorations |
| `actu-2.jpg` | Newly equipped mechanics workshop with modern engines on stands and tidy tool walls, two apprentices in green uniforms discovering it |
| `actu-3.jpg` | Open day: visitors of all ages watching a live demonstration in a vocational training workshop, curious faces |
| `actu-4.jpg` | Former carpentry apprentice in his own workshop in Yaoundé, with two employees working on furniture behind him |
| `actu-5.jpg` | Job fair: young Cameroonian learners talking with recruiters at stands in a large hall, CVs in hand |
| `actu-6.jpg` | Scholarship recipients: a group of motivated young Cameroonian learners receiving tool kits from a foundation representative |

---

## 8. Logos partenaires — à ne PAS générer

`logo-1` à `logo-6` doivent être les **vrais logos** des entreprises
partenaires (PNG ou SVG transparent, ~600 × 240 px). Un faux logo généré
par IA serait trompeur.

---

## Remarque importante sur l'authenticité

Les **témoignages** (Aïcha N., Brice T., Mireille E.) et la **photo de
l'équipe** présentent des personnes réelles du centre. Des visages générés
par IA à ces emplacements laisseraient croire aux visiteurs qu'il s'agit de
vraies personnes. Pour ces 4 images, privilégiez de vraies photos (même
prises au smartphone, en lumière naturelle). Les images d'ambiance des
ateliers et des métiers peuvent, elles, être générées sans problème.

## Récapitulatif

| Groupe | Nombre | Format |
| --- | --- | --- |
| Haut de page (hero) | 7 | 16:9 |
| Accueil (qui) | 1 | 4:5 |
| Carrousel filières | 10 | 2:3 |
| Vignettes formations | 10 | 1:1 |
| Équipe | 1 | 1:1 |
| Parcours | 3 | 4:5 |
| Témoignages | 3 | 1:1 |
| Actualités | 6 | 4:3 |
| **Total à générer** | **41** (dont 4 à remplacer de préférence par de vraies photos) | |
| Logos (fournis par les partenaires) | 6 | — |
