# Prompts de génération des images — Racines d'Avenir (version 2)

**Mode d'emploi**

1. Générez l'image avec le prompt indiqué + le bloc de style commun (§1).
2. Enregistrez-la dans `images-originales/` sous le **nom de fichier indiqué**
   (ex. `hero-couture.png`) — elle est reconnue automatiquement.
3. Lancez `node scripts/optimiser-photos.js` puis `npm run build`.

Les prompts sont en anglais : les générateurs les suivent mieux ainsi.

---

## 1. Bloc de style commun — à ajouter à la fin de CHAQUE prompt

```
Authentic documentary photography in a modern vocational training institute in Africa. Real African people with natural, confident expressions. The person wears the institute uniform: a deep forest-green (#0F4D35) polo shirt or work coat with golden-yellow (#F2B134) collar and golden-yellow sleeve cuffs, no logo, no text. Workplace, tools and background strictly consistent with the trade shown, clean and well organised. Soft natural daylight, warm and hopeful mood, cream and sage-green tones, gentle film grain, 35mm lens, shallow depth of field. No flags, no signs, no text, no logos, no watermark.
```

**Prompt négatif** (si l'outil le permet) :

```
flag, national flag, text, letters, sign, signboard, logo, watermark, distorted hands, extra fingers, deformed faces, plastic skin, oversaturated, cartoon, 3D render, dark gloomy lighting, unrelated tools, car garage in background (except for mechanics), cluttered background
```

**Règles retenues avec le client**

- Personne **clairement visible**, dans son environnement de travail.
- Mettre en avant **des femmes dans les métiers techniques** (BTP, électricité…).
- **Aucun drapeau** et aucune enseigne (« Centre de formation… ») : l'institut
  a une ambition panafricaine et son nom définitif reste à valider.
- Outils et arrière-plan **cohérents avec le métier** (pas de matériel de
  garage derrière une coiffeuse, etc.).
- Tenue : vert profond avec **col et poignets jaune-or**.

---

## 2. Bannière d'accueil — 4 visuels (16:9, 2400 × 1350 px) — PRIORITÉ 1

> Composition impérative : la photo occupe tout l'écran et le texte du site
> est posé sur **la moitié gauche**, assombrie par un dégradé vert foncé. La
> personne doit se trouver **dans la moitié droite**, visage bien visible ; la
> moitié gauche doit rester calme (mur, flou, atelier) et plutôt sombre.
> Tant que ces photos manquent, le site affiche une photo provisoire.

| Fichier | Prompt |
| --- | --- |
| `hero-carrelage.png` | A confident young African woman tiler kneeling on a bright construction site, laying large floor tiles with a rubber mallet and a spirit level, tile spacers visible, she smiles at the camera, she is placed in the RIGHT half of the frame, calm blurred background on the left, wide 16:9 shot |
| `hero-couture.png` | A young African woman seamstress in her sewing workshop, guiding colourful wax-print fabric under a sewing machine, rolls of African fabrics and a dress form behind her, she is placed in the RIGHT half of the frame, soft empty wall on the left, wide 16:9 shot |
| `hero-esthetique.png` | A young African beautician in a clean, modern beauty institute performing a facial treatment on a smiling client lying on a treatment bed, skincare products on a trolley, the beautician is in the RIGHT half of the frame, calm background on the left, wide 16:9 shot |
| `hero-comptabilite.png` | A young African man accountant at a bright office desk, working on a laptop with a calculator and neat invoices, looking at the camera with a confident smile, he is placed in the RIGHT half of the frame, soft blurred office on the left, wide 16:9 shot |

---

## 3. Formations — une photo verticale par formation (4:5, 1200 × 1500 px)

> Utilisée en carte (catalogue, carrousel) et en arche sur la fiche :
> sujet **centré**, visage visible, geste métier au premier plan.

### Photos manquantes — PRIORITÉ 2

| Fichier | Prompt |
| --- | --- |
| `f-carrelage.png` | A young African woman tiler applying tile adhesive with a notched trowel on a bathroom wall, laying white wall tiles, vertical framing |
| `f-plomberie.png` | A young African plumber installing a washbasin and connecting PPR water pipes under a sink, pipe cutter and wrench nearby, vertical framing |
| `f-menuiserie-metallique.png` | A young African metalworker wearing a welding helmet lifted up, welding a decorative steel gate in a metal workshop, sparks, protective gloves, vertical framing |
| `f-menuiserie-aluminium.png` | A young African technician assembling an aluminium sliding window frame on a workbench, aluminium profiles and glass panel nearby, vertical framing |
| `f-couture-africaine.png` | A young African woman tailor taking measurements of a client with a tape measure in a bright sewing workshop full of wax-print fabrics, vertical framing |
| `f-esthetique.png` | A young African beautician doing a manicure in a clean nail salon, nail polish bottles neatly arranged, vertical framing |
| `f-cosmetique.png` | A young African woman preparing natural shea butter cream in a small clean cosmetics lab, glass jars, scale, natural ingredients, wearing gloves and hair cap, vertical framing |
| `f-developpement-web.png` | A young African developer coding on a laptop and a second screen showing a website, in a modern bright computer room, vertical framing |

### Photos existantes à régénérer pour harmoniser les tenues — PRIORITÉ 3

Même cadrage, en appliquant la tenue vert/jaune-or :

| Fichier | Prompt |
| --- | --- |
| `f-electricite.png` | A young African woman electrician wiring a residential electrical panel, multimeter in hand, safety gloves, vertical framing |
| `f-maconnerie.png` | A young African mason building a brick wall with a trowel on a construction site, yellow safety helmet, vertical framing |
| `f-coiffure.png` | A young African hairdresser braiding a client's hair in a modern hair salon, combs and hair products on the counter, mirror, vertical framing |
| `f-restauration.png` | A young African cook in a professional kitchen plating a Cameroonian dish, stainless steel kitchen, vertical framing |
| `f-comptabilite.png` | A young African accounting student working with a calculator, ledger and laptop at a tidy desk, vertical framing |
| `f-secretariat-bureautique.png` | A young African administrative assistant filing documents and answering the phone in a bright office, vertical framing |
| `f-sante.png` | A young African nursing assistant in green scrubs with golden-yellow trim, taking a patient's blood pressure in a clean care room, vertical framing |
| `f-maintenance-informatique.png` | A young African IT technician repairing an open desktop computer, screwdriver in hand, network cables on the bench, vertical framing |
| `f-numerique-ia.png` | A young African woman entrepreneur using a smartphone and a laptop to create social media posts for her small business, vertical framing |

---

## 4. Autres pages

| Fichier | Format | Prompt |
| --- | --- | --- |
| `form-hero.png` | 16:9 | A diverse group of young African learners in the institute uniform walking through a bright training workshop with sewing machines, tiles and electrical panels, smiling, group placed on the right half, wide shot |
| `qui-equipe.png` | 1:1 | The teaching and administrative team of a vocational training institute, eight men and women of various ages, some in the green uniform with golden-yellow collars, standing together in a sunny courtyard, no sign, no flag |
| `parcours-3.png` | 4:5 | A proud young African woman in her own small sewing workshop, finished dresses on hangers, serving a client, vertical framing |
| `actu-1.png` | 4:3 | Graduation ceremony at a vocational institute: young African graduates in green and golden-yellow holding their certificates, families applauding |
| `actu-4.png` | 4:3 | A young African woman entrepreneur in her sewing workshop with two employees working on sewing machines behind her |
| `actu-6.png` | 4:3 | Young African learners receiving tool kits from a foundation representative in a bright workshop, smiling |

---

## 5. À ne PAS générer

- **Logos partenaires** (`logo-1` à `logo-6`) : vrais logos fournis par les entreprises.
- **Témoignages** (`temoin-1` à `temoin-3`) et, idéalement, **photo d'équipe** :
  ils représentent de vraies personnes de l'institut. Des visages générés par IA
  laisseraient croire aux visiteurs qu'il s'agit de vraies personnes : utilisez
  de vraies photos (même prises au smartphone, en lumière naturelle).

## Récapitulatif

| Priorité | Contenu | Nombre |
| --- | --- | --- |
| 1 | Bannière d'accueil | 4 |
| 2 | Formations sans photo | 8 |
| 3 | Formations à harmoniser | 9 |
| — | Autres pages | 6 |
| **Total** | | **27** |
