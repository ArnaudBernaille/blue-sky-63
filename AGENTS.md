# Blue Sky : consignes pour les agents

Site de préparation aux examens FINRA / NASAA, en français, une page HTML autonome par série :

| Fichier | Contenu |
|---|---|
| `index.html` | Accueil : choix de la série. Une carte par série. |
| `serie-63.html`, `serie-63-en.html` | Series 63 (français, anglais) |
| `serie-65.html` | Series 65 (Uniform Investment Adviser Law Exam) |
| `serie-86.html` | Series 86 (Research Analyst, partie I) |
| `serie-87.html` | Series 87 (Research Analyst, partie II : réglementation) |
| `en.html` | Redirection vers `serie-63-en.html` (ancienne adresse) |

Chaque page de série contient le cours (chapitres), les quiz, les examens blancs, les fiches, le glossaire et la page « À retravailler ». La progression est enregistrée dans le navigateur sous la clé `bluesky<numéro>` (par exemple `bluesky86`).

## Agents du projet

Définis dans `.claude/agents/` :

| Agent | Rôle |
|---|---|
| `relecteur-series` | Relecteur indépendant, en lecture seule, de n'importe quel cours (`serie-*.html`) : couverture du programme officiel, exactitude du cours, justesse de chaque corrigé et de chaque calcul. Préciser la série à relire. Son rapport est appliqué par la session qui gère le contenu. |
| `prof-serie-63` | Rédige et corrige le cours Series 63. |
| `controleur-serie-63` | Contrôleur historique du cours Series 63 (lecture seule). |

Après toute création ou modification importante d'un cours, lancer `relecteur-series` sur cette série, puis appliquer son rapport (en vérifiant chaque point avant de le corriger).

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
| 2026-10-03 | 63 | finrapracticetests.com/series-63 (examens 1 à 10, sans corrigé publié) | 100 | 82 couvertes, 6 non couvertes (ajoutées en FR et EN : définition de « State », liste complète des titres de l'USA dont le voting-trust certificate, annuities indexées, formation continue des IAR, règles NASAA sur internet), 12 hors programme ou non vérifiables (secteurs défensifs, diversification, envoi des certificats, surlignage d'un prospectus, rémunération non monétaire des underwriters, omnibus account, titres adossés à des actifs, transparence fiscale, multi-level marketing, record date, délai des confirmations, archivage des sites web). Source de qualité inégale. |
| 2026-10-03 | 86 | Fiche « Crunch Time Facts / Key Formulas » de STC (cdn.stcinteractive.com/courses/8094/Series86CTF.pdf) | ~60 énoncés | Ajouts : économies de gamme, catégories d'émetteurs SEC (filers), intérêts capitalisés, R&D capitalisée et EBITDA, avancement des travaux, minoritaires au compte de résultat, ventes à crédit (DSO), effet après impôt d'une variation de charge, payout = P/E × dividend yield, earnings yield des sociétés en perte, EBITDAR, FCFE à partir du résultat net, parité d'échange, dette qui abaisse d'abord le WACC. Divergence signalée : STC calcule le coût de la dette avec le coupon, le cours privilégie le rendement actuariel et précise d'utiliser le taux donné par l'énoncé. |
| 2026-10-03 | 87 | open-exam-prep.com/practice/series87 | 100 | Environ 68 couvertes ; 6 non couvertes (ajoutées : correction d'un rapport erroné, langage exagéré, comptes chez un autre courtier (Rule 3210), communications hors des canaux de la firme) ; environ 7 hors programme ou relevant de la politique interne (cadeaux, visites de sites, départ d'un analyste) ; environ 19 réponses fausses ou périmées, non reprises : seuil de 70 % (officiel : 74), quiet periods de 40 et 25 jours (ancienne NASD 2711 ; actuel : 10 et 3), « comité de revue des changements de note » obligatoire (absent du texte actuel de la 2241), autorisation préalable des opérations des analystes présentée comme exigée par la 2241, notion de « covered company ». Le cours avertit désormais des chiffres périmés de la NASD 2711. |
| 2026-10-03 | 65 | open-exam-prep.com/practice/series65 | 100 | Environ 76 couvertes, 8 partiellement (rendues explicites), 16 non couvertes (ajoutées : blue sky laws et rôle des lois de 1933/1934, déficit vs dette, rendement en devise, 8-K/proxy/Form 4, GAAP vs IFRS, résultat vs cash-flow, PEG, fréquence de capitalisation, annuity due, nombre de titres pour diversifier, prime de liquidité, fonds monétaires à 1 $, CMO, division d'actions, 529 et bourse d'études, plafond K-12 (montant 2026 à vérifier), Reg BI, plan Rule 10b5-1). Réponse imprécise du site : agent défini comme « a person » (l'USA dit « individual »). |
| 2026-10-03 | 65 | finrapracticetests.com/series-65 (examens 1 à 12, sans corrigé publié) | 120 | Environ 77 couvertes ; environ 29 non couvertes (ajoutées : bilan personnel, R², taux sans risque, commercial paper à escompte et CD négociables, types de prise ferme, DDM sans croissance, date ex-dividende des fonds, spreads et straddles, couverture d'une vente à découvert par un call, risque de longévité et joint and survivor, Wilshire 5000, enregistrement UGMA, 529 = municipal fund securities, dark pools, confirmations (10b-10), marge d'une vente à découvert, voting-trust certificate, offre et vente (dividende en actions, assessable stock), examen écrit ou oral, Form ADV-E, conservation CIP 5 ans et signaux d'alerte AML, sentence arbitrale impayée, scalping, Rule 2210, solicitors, trusted contact) ; environ 14 hors programme, imprécises ou périmées, non reprises : rétention d'honoraires comme custody (seuils non vérifiés), « solicitor brochure » (ancienne règle SEC de sollicitation remplacée par la marketing rule), « customer relationship survey » (le Form CRS est un résumé de la relation), taux le plus volatil, couverture par options d'indice sans données suffisantes, délai de déclaration des teneurs de marché, free-writing prospectus, passive market making, base du markup. |
| 2026-10-03 | 86 | Audit interne de la banque de questions (209 questions relues une à une, 46 calculs refaits en Python) | 209 | Aucune bonne réponse fausse, tous les calculs exacts. 3 corrections mineures : explication d'un distracteur (FCFE), deux distracteurs qui citaient des délais périmés des Schedules 13D/13G. |
