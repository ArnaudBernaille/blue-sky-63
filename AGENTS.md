# Blue Sky : consignes pour les agents

Site de préparation aux examens FINRA / NASAA, en français, une page HTML autonome par série :

| Fichier | Contenu |
|---|---|
| `index.html` | Accueil : choix de la série. Une carte par série. |
| `serie-63.html`, `serie-63-en.html` | Series 63 (français, anglais) |
| `serie-86.html` | Series 86 (Research Analyst, partie I) |
| `en.html` | Redirection vers `serie-63-en.html` (ancienne adresse) |

Chaque page de série contient le cours (chapitres), les quiz, les examens blancs, les fiches, le glossaire et la page « À retravailler ». La progression est enregistrée dans le navigateur sous la clé `bluesky<numéro>` (par exemple `bluesky86`).

## Règle absolue : ne jamais inventer

- N'écris jamais un fait (règle, chiffre, délai, seuil, format d'examen) que tu n'as pas vérifié.
- Si tu n'es pas sûr, dis-le explicitement dans ton compte rendu (« non vérifié », avec ce qu'il faudrait vérifier et où), et dans le cours si l'apprenant doit le savoir.
- La source de référence est le document officiel : content outline FINRA ou plan d'examen NASAA, puis les textes eux-mêmes (lois, règles SEC / FINRA / NASAA). Un site de préparation privé n'est jamais une source suffisante pour une règle.

## Procédure pour créer le cours d'une nouvelle série

1. **Programme officiel.** Télécharge le content outline officiel (finra.org ou nasaa.org) : nombre de questions notées et de pré-test, durée, seuil, frais, prérequis, fonctions ou sections et leur pondération, liste des sujets. Garde-le comme référence.
2. **Structure.** Crée `serie-<numéro>.html` sur le modèle des séries existantes (même CSS, même moteur JS). Change : `CH`, `SECT` (sections officielles, chapitre lié, questions notées, questions par examen blanc), `N_EXAM`, `N_SCORED`, `PASS`, `DUR`, `EXAMS`, la clé `localStorage`, la barre de séries (`nav.series`), et les textes qui citent des chiffres d'examen.
3. **Cours.** Un chapitre par grand thème du programme, en français, termes d'examen en anglais (`<em class="t">`), avec exemples déroulés (`.box.ex`), pièges (`.box.trap`), cas pratiques (`.box.case`) et « À retenir » (`.box.keep`). Vérifie chaque calcul.
4. **Entraînement.** Questions originales en anglais, quatre choix, explication en français qui justifie la bonne réponse et chaque distracteur. Quiz par chapitre (`x: 0`) et au moins un examen blanc complet de questions absentes des quiz (`x: 1`), réparti selon la pondération officielle. Ne recopie jamais de questions d'une banque commerciale ni de « dumps » d'examen réel.
5. **Révision.** Page de chiffres clés ou de formules, fiches, glossaire anglais → français.
6. **Accueil.** Ajoute la carte de la série dans `index.html`, et le lien dans la barre `nav.series` de toutes les séries.
7. **Tests.** Syntaxe JS (`node --check` sur le script extrait), identifiants HTML référencés par le JS présents, examens blancs qui se lancent et se notent, rendu à 400 px de large.
8. **Contrôle par examens blancs externes** (étape suivante, obligatoire).

## Contrôle par examens blancs externes (pour chaque série, à refaire régulièrement)

But : vérifier que l'apprenant peut répondre à toute question d'entraînement crédible avec le seul contenu du cours.

1. **Chercher** sur internet des examens blancs ou questions d'entraînement publics et gratuits de la série (sites de préparation, exemples officiels FINRA / NASAA s'il y en a). Exclure les sites de « dumps » qui prétendent diffuser de vraies questions d'examen.
2. **Récupérer** les questions avec leur réponse (le texte brut est souvent dans la page, par exemple dans les données Next.js `self.__next_f`). Note la source et la date.
3. **Pour chaque question**, vérifier dans le cours (recherche par mots-clés, puis lecture de la section) :
   - **Couverte** : le cours donne de quoi trouver la bonne réponse → rien à faire, question suivante.
   - **Non couverte** : ajouter la notion au cours, dans le chapitre concerné (texte, et si utile glossaire, fiche, question de quiz). Ne copie pas la question du site.
   - **Réponse du site douteuse** : ne pas aligner le cours sur le site. Vérifier dans la source officielle ; si le site se trompe, ne rien changer et le signaler dans le compte rendu. Si on ne peut pas trancher, le dire.
4. **Garder les identifiants stables** : les nouvelles questions de quiz s'ajoutent en **fin** de banque (`Q`), pour ne pas décaler les identifiants des questions existantes (la progression des apprenants en dépend).
5. **Version anglaise** : si la série a une version anglaise, y reporter les mêmes ajouts.
6. **Tester** de nouveau (étape 7 ci-dessus).
7. **Compte rendu** : sources consultées, nombre de questions vérifiées, notions ajoutées (où), questions dont la réponse publiée paraît fausse, points non vérifiés.

## Journal des contrôles

| Date | Série | Source | Questions | Résultat |
|---|---|---|---|---|
| 2026-10-03 | 86 | open-exam-prep.com/practice/series86 | 100 | 73 couvertes, 7 partiellement (rendues explicites), 20 non couvertes (ajoutées). Ajouts : recherche primaire / secondaire, fournisseurs de données, vérification des sources, MNPI, barrières d'information, Reg FD, Reg AC, expositions de change, PMI, 8-K changement de contrôle, éliminations intragroupe, différences fiscales permanentes, plus-values ponctuelles, coûts semi-variables, capacité et capex, Monte Carlo, bénéfice normalisé, dette en valeur de marché, choix des comparables, coût de la dette (YTM), alternatives au CAPM, unlevered FCF, TRI d'un LBO, transactions comparables et cours non affecté, valorisation par l'actif, options réelles. Réponses du site jugées douteuses : #039 (valeur terminale actualisée : 2 496 ÷ 1,09³ ≈ 1 927, pas 2 163), #068 (intérêts minoritaires exclus de l'EV, contraire à l'usage). Énoncés ambigus : #091 (dette cotée à 90 %, mais la réponse attendue prend la valeur comptable), #065 (méthode d'amortissement sans effet sur le FCFF, vrai seulement hors effet fiscal). |
| 2026-10-03 | 63 | open-exam-prep.com/practice/series63 | 100 | 95 couvertes, 3 partiellement (rendues explicites), 2 non couvertes (ajoutées). Ajouts (FR et EN) : options sur devises cotées, bank holding company non exemptée, titres OTC non federal covered, hedge clause, blanket recommendation. Réponses du site non reprises : agent enregistré dans son seul État de résidence (contraire à la règle du lieu d'activité enseignée). Non vérifiées, à contrôler dans l'USA de 1956 et les règles NASAA : audience « sous 15 jours » après la demande, subpoena « valable pour des documents dans tout État », information sur les honoraires de performance « orale et écrite ». |
