# Prompts de génération des images — Racines d'Avenir (version 3 — cahier des modifications)

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

## 2. Bannière d'accueil (16:9, 2400 × 1350 px) — PRIORITÉ 1

> Composition impérative : la photo occupe tout l'écran et le texte du site
> est posé sur **la moitié gauche**, assombrie par un dégradé vert foncé. La
> personne doit se trouver **dans la moitié droite**, visage bien visible ; la
> moitié gauche doit rester calme (mur, flou, atelier) et plutôt sombre.

Ce que le client a demandé : on garde la 1ʳᵉ image (femme qui pose du
carrelage) et le principe du carrousel. La couture « trop classique » est
remplacée par du **stylisme haut de gamme**, et on ajoute de la **diversité
masculine**, de préférence un **homme en esthétique**.

| Fichier | État | Prompt |
| --- | --- | --- |
| `hero-carrelage.png` | ✅ gardée | — |
| `hero-couture.png` | ✅ en place | A young African fashion designer in a high-end, modern couture studio, adjusting an elegant contemporary African evening gown on a dress form, luxurious wax-print and silk fabrics, large cutting table, professional sewing machines, mood boards and sketches on the wall, refined lighting, premium fashion-house atmosphere, the designer is placed in the RIGHT half of the frame, calm darker background on the left, wide 16:9 shot |
| `hero-esthetique.png` | ✅ en place | A young African MAN beautician in a clean, modern beauty institute performing a facial treatment on a relaxed client lying on a treatment bed, skincare products neatly arranged on a trolley, professional and caring gesture, he is placed in the RIGHT half of the frame, calm background on the left, wide 16:9 shot |
| `hero-comptabilite.png` | ✅ gardée | — |

Variante facultative pour la couture, si le client préfère un homme à cet
endroit : `A young African MAN fashion designer and tailor in a high-end modern couture studio, draping fabric on a dress form…` (même suite).

---

## 3. Formations — une photo verticale par formation (4:5, 1200 × 1500 px)

> Utilisée en carte (catalogue, carrousel) et en arche sur la fiche :
> sujet **centré**, visage visible, geste métier au premier plan.

### Santé & paramédical — PRIORITÉ 1

Le client veut des **visuels médicaux professionnels**, avec des personnes en
**blouse médicale**. Pour ces quatre fiches, ajoutez au bloc de style :
`wearing a clean white medical coat (or green scrubs) with golden-yellow trim`.

| Fichier | État | Prompt |
| --- | --- | --- |
| `f-aide-soignant.png` | ✅ en place | — |
| `f-auxiliaire-vie.png` | ✅ en place | A young African care assistant in a medical coat helping an elderly woman walk with a cane in a bright, clean living room, kind and reassuring gesture, both smiling, vertical framing |
| `f-vendeur-pharmacie.png` | ✅ en place | A young African pharmacy sales assistant in a white medical coat behind the counter of a modern, well-lit pharmacy, advising a customer and holding a box of medicine, neat shelves of health products behind, vertical framing |
| `f-delegue-medical.png` | ✅ en place | A young African medical sales representative in a smart suit, presenting a medicine on a tablet to a doctor in a white coat in a modern medical office, professional handshake atmosphere, vertical framing |

### Informatique — PRIORITÉ 2

| Fichier | État | Prompt |
| --- | --- | --- |
| `f-creation-sites-internet.png` | ✅ en place | A young African woman web designer building a website on a large screen showing a page layout and colour palette, laptop and sketches of wireframes on the desk, modern bright computer room, vertical framing |
| `f-programmation.png` | ✅ en place — ⚠️ logo « VITRE TECH » sur le polo/la tasse, à retoucher | A young African programmer writing code on two screens (code editor and database diagram), focused, notebook with algorithm drawings, modern computer lab, vertical framing |
| `f-developpement-applications.png` | ✅ en place | A young African mobile app developer testing an application on a smartphone next to a laptop showing app interface designs and code, modern tech workspace, vertical framing |
| `f-reseaux-cybersecurite.png` | ✅ en place — ⚠️ logo « VITRE TECH » sur le polo/la tasse, à retoucher | (amélioration possible : technician in a server room in front of a network rack, monitoring screens with security dashboards) |

### Autres formations

| Fichier | État | Prompt |
| --- | --- | --- |
| `f-menuiserie-aluminium.png` | ✅ en place — ⚠️ logo « VITRE TECH » sur le polo/la tasse, à retoucher | A young African technician assembling an aluminium sliding window frame on a workbench, aluminium profiles and glass panel nearby, vertical framing |

Les autres fiches ont déjà leur photo.

---

## 3 bis. Qui sommes-nous — section « Notre équipe » — ✅ en place

Image intégrée : `Équipe professionnelle africaine en formation.png` (formateurs
uniquement). Prompt conservé ci-dessous pour une éventuelle régénération.

Fichier : **`qui-equipe.png`**, format **carré 1:1 (2048 × 2048 px)**. La photo
occupe la moitié gauche de la section sur ordinateur et toute la largeur sur
mobile, où elle est recadrée : le groupe doit être **centré**, avec de la marge
autour.

L'image actuelle mélange des formateurs et des apprenants. La nouvelle doit
montrer **uniquement l'équipe** : des adultes expérimentés, sans aucun jeune en
polo d'apprenant. Pour qu'on ne les confonde pas avec les élèves, les formateurs
**ne portent pas le polo vert à col jaune des apprenants** : chacun porte la
tenue de son métier.

⚠️ N'ajoutez **pas** le bloc de style commun du §1 : sa phrase sur l'uniforme
ferait réapparaître le polo des apprenants. Le prompt ci-dessous est complet.

```
Group portrait of the teaching staff of a modern vocational training institute in Africa: eight experienced African trainers and staff members, men and women aged 35 to 60, standing together in two relaxed rows and smiling with confidence and warmth. They are professionals, clearly adults, not students. Each trainer wears the professional attire of the trade they teach: a white chef jacket (cooking), a white medical coat with a stethoscope (healthcare), a work vest with a safety helmet held under the arm (construction), an electrician's work shirt with a multimeter clipped on, a tailor with a tape measure around the neck and an elegant African-print outfit, a beautician in a clean grooming tunic, an IT trainer in a smart shirt holding a laptop, and a female director in a dark forest-green (#0F4D35) blazer with a discreet golden-yellow (#F2B134) pocket square. Accents of forest green and golden yellow in their clothes, no uniforms with polo shirts. Setting: bright, tidy training workshop softly blurred behind them, with hints of sewing machines, tiles and electrical panels. The group is centred in a square frame with space around it. Authentic documentary photography, real African people with natural expressions, soft natural daylight, warm and hopeful mood, cream and sage-green tones, gentle film grain, 50mm lens. No flags, no signs, no text, no logos, no watermark.
```

**Prompt négatif** :

```
students, learners, teenagers, young people, children, school uniform, polo shirt with yellow collar, crowd, flag, national flag, text, letters, sign, signboard, logo, brand, watermark, distorted hands, extra fingers, deformed faces, plastic skin, oversaturated, cartoon, 3D render, dark lighting, people cut off at the edges
```

Variante possible si le générateur gère mal huit personnes : *« six experienced
African trainers… »*, en retirant deux tenues de la liste.

Une fois l'image produite, déposez-la dans `nouveaux images/` (ou directement
dans `images-originales/qui-equipe.png`) et demandez l'intégration.

---

## 4. À ne PAS générer

- **Logos partenaires** (`logo-1` à `logo-6`) : vrais logos fournis par les entreprises.
- **Témoignages** (`temoin-1` à `temoin-3`) et, idéalement, **photo d'équipe** :
  ils représentent de vraies personnes de l'institut. Des visages générés par IA
  laisseraient croire aux visiteurs qu'il s'agit de vraies personnes : utilisez
  de vraies photos (même prises au smartphone, en lumière naturelle).
  L'image d'équipe du §3 bis sert de **visuel provisoire** jusqu'à la photo réelle.

## Récapitulatif

Toutes les photos de formations et de la bannière sont en place (images du
1ᵉʳ novembre 2026). Reste à faire :

| Priorité | Contenu | Nombre |
| --- | --- | --- |
| 1 | Retirer le logo « VITRE TECH » (polo, tasse) : programmation, menuiserie aluminium, réseaux et cybersécurité — retouche (gomme / inpainting) ou régénération en ajoutant « plain polo shirt, no logo, no brand » | 3 |
| 2 | Logos partenaires et portraits des témoignages : vraies images à fournir | 9 |
