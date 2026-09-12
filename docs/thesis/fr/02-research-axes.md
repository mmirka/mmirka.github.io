---
title: Axes de recherche et problèmes adressés
chapter: 2
lang: fr
source: Chapitre1/Axes-et-Pbm.tex
---

# 2. Axes de recherche et problèmes adressés

<div class="lang-switch" markdown>
[English](../02-research-axes.md){ .lang-pill title="This chapter in English" }
<span class="lang-pill is-current">Français</span>
</div>

## 2.1 Introduction

L'optimisation de l'efficacité énergétique du calcul parallèle possède de
nombreux challenges liés entre autres à la complexité des systèmes de calculs,
ainsi qu'à la diversité des applications parallélisées. En effet, pour
améliorer l'efficacité énergétique d'un calcul, il est nécessaire de considérer
les propriétés du système exécutant ce calcul. Ensuite, chaque calcul aura ses
propres caractéristiques impactant son exécution sur le système considéré.
Ainsi, différents challenges apparaissent, liant la conception du système de
calcul et à l'exécution du calcul parallèle sur ce dernier.

Comme évoqué dans le chapitre précédent, il est possible de classer les
méthodes d'optimisation existantes selon deux approches: l'optimisation à
l'étape de contrôle (ou en-ligne) et l'optimisation à l'étape de la conception
(ou hors-ligne). La première approche correspond à l'ensemble des solutions
s'appliquant durant le fonctionnement du système. Nous nous intéressons plus
précisément aux solutions durant l'exécution d'un calcul, destinées à ajuster
les paramètres systèmes aux besoins du calcul. Ces solutions sont donc centrées
autour du calcul et de son interaction avec le système exécutant. On y retrouve
entre autres les modèles analytiques de codes d'applications permettant
d'anticiper et d'accélérer la prise de décision en ligne, ainsi que les
solutions dynamiques telles que le DVFS et DPM contrôlées généralement par le
système d'exploitation. La seconde approche concerne la conception du système
de calcul. Comme décrit par J.L. Hennessy et D.A. Patterson dans leur
présentation à l'occasion de leur *Turing Award*
[\[75\]](references.md#ref-75), la tendance actuelle va vers une conception
conjointe du système de calcul et des applications exécutables sur le système.
Nous nous concentrons ici sur les solutions centrées autour de l'optimisation
du support du calcul parallèle et regroupons l'ensemble des solutions
matérielles permettant d'améliorer les performances et/ou la consommation
énergétique des systèmes de calcul. On y retrouve entre autres les technologies
de mémoires émergentes, l'optimisation de l'architecture du système de calcul
et de son module d'interconnexion.

Dans le but de définir les problèmes adressés dans cette thèse, nous évoquerons
dans ce chapitre les points qui suivent. Tout d'abord, nous parlerons de
l'efficacité énergétique et des métriques utilisées pour la mesurer. Ensuite,
nous nous intéresserons aux solutions d'optimisation logicielle du calcul
parallèle avant de converger vers le contrôle dynamique du calcul. Nous verrons
alors en quoi le ML peut apporter des solutions innovantes. Enfin, avant de
définir précisément les problèmes adressés, nous évoquerons les challenges de
la conception de systèmes optimisés. Nous nous concentrons plus particulièrement
sur les réseaux sur puce, principale solution choisie pour concevoir le module
d'interconnexion d'un système multi-cœurs, et présentant des problèmes de
consommation énergétique auxquels nous tenterons d'apporter une solution via le
ML.

## 2.2 Mesure de l'efficacité énergétique d'une application parallèle

L'efficacité énergétique a été caractérisée dans la littérature par différentes
mesures (par exemple, FLOPS/W et MIPS/W) en fonction des domaines
informatiques. Dans tous les cas, ces métriques suivent la définition générale:

$$
\text{Efficacité énergétique} = \frac{\text{Quantité de travail par unité de temps}}{\text{Puissance consommée}}
$$

### 2.2.1 Solutions existantes

Plusieurs techniques de mesure ont été proposées au cours des dernières
décennies pour caractériser la consommation énergétique. A ce titre les études
littéraires [\[121\]](references.md#ref-121),
[\[10\]](references.md#ref-10) font un état des lieux des méthodes existantes.
Elles peuvent être distinguées en fonction du niveau d'abstraction du système
de calcul où elles opèrent.

Les auteurs de ces contributions ont fait état d'un certain nombre de
techniques d'acquisition de données de consommation d'énergie par le biais de
capteurs matériels, situés à différents endroits physiques des systèmes. Ces
techniques ont leurs avantages et leurs inconvénients en termes de précision de
mesure, résolution temporelle, coût de déploiement et de leur caractère
intrusif. Elles comprennent des circuits de mesure intégrés dans des composants
matériels tels que les GPU et les CPU; des dispositifs d'instrumentation
insérés dans les nœuds de calcul capables de sonder au niveau des composants ou
des voies d'alimentation; et des compteurs d'énergie qui peuvent recueillir la
charge totale en dehors de l'alimentation électrique du nœud.

Cependant, ces solutions permettent de mesurer uniquement la consommation
énergétique et/ou la puissance consommée, et ne suffisent donc pas à elles
seules pour extraire une mesure d'efficacité énergétique, qui nécessite une
donnée de performance. Habituellement, cette donnée de performance vient des
compteurs de performances, permettant notamment d'extraire le nombre
d'instructions exécutées (#inst., une quantité de travail) et d'en extrapoler
le nombre d'instructions exécutées par seconde (IPS) ou encore le nombre
d'opérations en virgule flottante par seconde (FLOPS), deux données de
performance. Les mesures hybrides d'efficacité énergétique ainsi extrapolées
sont le nombre d'instructions par seconde par watt (IPS/W) et FLOPS par watt.
Cependant, ces mesures caractérisent l'efficacité énergétique du système de
calcul globale (ou partiel selon les compteurs et capteurs disponibles) et sont
donc bruitées par l'ensemble des processus exécutés et ne permettent pas de
caractériser l'efficacité énergétique d'une application précise. En effet, les
compteurs de performances ne permettent pas d'identifier le processus à
l'origine de l'évènement mesuré.

En complément des capteurs et compteurs matériels mentionnés ci-dessus, des
approches logicielles sont également utilisées. L'API de performance (PAPI)
[\[33\]](references.md#ref-33) est une interface de bibliothèque bien connue
(i.e. une couche logicielle) pour les compteurs de performance matériels qui
facilite l'extraction de diverses statistiques d'exécution. D'autre part,
d'autres outils de profilage comprennent les *Tuning and Analysis Utilities*
(TAU) [\[157\]](references.md#ref-157), Score-P
[\[84\]](references.md#ref-84), Scalasca [\[64\]](references.md#ref-64) et
PowMon [\[166\]](references.md#ref-166). Les outils de profilage de la
puissance au niveau logiciel comprennent pTop
[\[53\]](references.md#ref-53), PowerAPI [\[93\]](references.md#ref-93) et
Jalen [\[120\]](references.md#ref-120). Le premier est similaire au programme
"top" de GNU/Linux et fournit des données sur la consommation d'énergie des
processus en cours d'exécution. L'interface de programmation d'applications
PowerAPI et l'architecture de profilage au niveau logiciel Jalen permettent de
surveiller la consommation d'énergie en temps réel. Les informations fournies
par ces outils sont souvent obtenues a posteriori, c'est-à-dire après
l'exécution d'une grande partie (voire de la totalité) d'un programme donné, ce
qui ne laisse que peu de place aux optimisations précoces.

J. C. R. da Silva *et al.* [\[48\]](references.md#ref-48) proposent une
solution centrée sur l'environnement Android permettant une mesure précise de
la consommation énergétique d'une application. En particulier, dans cette
contribution les auteurs proposent une solution permettant de connaître la
consommation énergétique de petites parties de code telles que des boucles ou
des appels de fonction. Cette dimension de lien direct entre le code source
d'une application et sa consommation se détache des solutions classiques
reposant sur les compteurs de performance, ne permettant pas d'associer
directement les mesures avec le code exécuté. Cependant, ce travail reste dédié
à l'environnement Android, et son utilisation nécessite à la fois un module
matériel supplémentaire ainsi que des modifications du code source, ce qui
s'éloigne de notre objectif de solution multi-niveaux et facilement
implémentable.

Enfin, des solutions exploitant la simulation sont proposées afin de déterminer
l'efficacité énergétique de système exécutant une application, à partir de
modèle. Par exemple, A. Butko *et al.* [\[35\]](references.md#ref-35),
[\[36\]](references.md#ref-36) proposent une simulation complète de
l'architecture multi-cœur hétérogène big.LITTLE afin d'explorer les
configurations du système apportant les meilleurs résultats en termes de
performance et efficacité énergétique à l'aide de l'environnement gem5
[\[26\]](references.md#ref-26). Les auteurs ont proposé des simulations
orientées traces [\[37\]](references.md#ref-37),
[\[119\]](references.md#ref-119), afin d'accélérer l'exploration de systèmes à
grande échelle. D'autres solutions se concentrent sur l'analyse de codes
sources afin de prédire la consommation énergétique d'une application en
fonction d'un système de calcul cible. Entre autres, T. Béziers la Fosse
*et al.* [\[92\]](references.md#ref-92) proposent un modèle de caractérisation
énergétique de code source, à partir de données mesurées, et E. Parisi
*et al.* [\[129\]](references.md#ref-129) présentent une solution à base de ML
pour classifier un code source selon son efficacité énergétique. Ces approches
analytiques, basées sur des modèles d'estimation de haut niveau pour les
performances et la consommation d'énergie, pourraient être utilisées pour une
optimisation dynamique antérieure. Malheureusement, ces modèles ne sont pas
nécessairement des approximations fiables pour toutes les plate-formes
d'exécution et restent spécifiques à un système de calcul considéré.

L'approche proposée dans cette thèse fonctionne au niveau logiciel, via le
runtime OpenMP. Les données de performance sont collectées en temps réel à
partir de l'environnement d'exécution OpenMP, soit à la frontière entre la
couche logicielle et la couche matérielle. Cela permet l'implémentation de
cette méthode sur toute plate-forme supportant OpenMP. De plus, ces données de
performances sont spécifiques à l'application considérée, contrairement aux
compteurs de performance e.g. IPS. Les données sur la puissance et l'énergie
consommée dépendent, quant à elles, du support.

### 2.2.2 Métrique spécifique via OpenMP

Nous recherchons donc une solution permettant de mesurer en temps réel
l'efficacité énergétique d'une application. Nous nous intéressons plus
particulièrement aux applications parallèles. Ainsi, notre intérêt se porte sur
les applications OpenMP.

OpenMP est le modèle de programmation pour le calcul parallèle le plus
populaire pour les systèmes à mémoire partagée. Son API supporte les langages
de programmation C/C++ et Fortran. De plus, OpenMP est pris en charge par la
majorité des plate-formes dont Windows et UNIX, ce qui justifie son usage très
largement répandu.

<a id="fig-2-1"></a>

![OpenMP: mécanismes Fork et Join](../../assets/figures/thesis/ch02/fig-2-1.png)

**Fig. 2.1** — OpenMP: mécanismes *Fork* et *Join*.

Le parallélisme sous OpenMP est majoritairement basé sur l'utilisation de
processus légers, aussi appelés threads. Il existe, depuis la version OpenMP
3.1, le mécanisme de gestion de tâches communicantes, mais ce dernier étant
encore peu utilisé, nous ne nous y sommes pas intéressés. Les threads sont la
plus petite unité de traitement qui soit gérée par un système d'exploitation.
OpenMP propose un ensemble de fonctionnalités permettant de contrôler la
parallélisation et la synchronisation de threads. Elles sont toutes basées sur
deux principes fondamentaux: *Fork* et *Join*. Comme illustré sur la figure
[2.1](#fig-2-1), le mécanisme de *Fork* fait la jonction entre une région
séquentielle (thread maître), et une région parallèle où les instructions du
programme sont exécutées en parallèle sur un ensemble de threads travailleurs
formant une équipe. Ensuite, la jonction inverse faisant la transition entre
une région parallèle et une région séquentielle correspond au mécanisme de
*Join*. C'est à ce moment-là que les threads travailleurs d'une même équipe se
synchronisent et sont supprimés pour ne laisser s'exécuter que le thread
maître.

<a id="fig-2-2"></a>

![Schéma explicatif du concept de chunk](../../assets/figures/thesis/ch02/fig-2-2.svg)

**Fig. 2.2** — Schéma explicatif du concept de chunk.

Parmi les fonctionnalités de OpenMP, nous nous intéressons aux boucles
parallélisées (e.g. boucle *for*). À l'intérieur de ces boucles, le workload
est divisé en blocs d'instructions appelés chunks. Ces chunks correspondent aux
itérations de la boucle parallélisée. Ils sont distribués pour exécution aux
différents threads travailleurs créés au lancement de la région parallèle
correspondante. Sur la figure [2.2](#fig-2-2) est illustré le concept de chunk.
Sur ce schéma est représenté un code composé d'une boucle *for*. Cette boucle
est parallélisé grâce à l'unique instruction "#pragma omp parallel for". Cette
instruction indique au runtime OpenMP de démarrer une région parallèle
contenant les threads travailleurs. La région parallèle se termine
automatiquement avec la fin de l'exécution de la boucle. Il existe différentes
stratégies de planification définissant la façon dont les chunks sont répartis
parmi les threads. Elles peuvent être de deux types: statique ou dynamique.
Dans le premier cas, la charge de travail est répartie équitablement parmi les
threads, c'est l'exemple illustré sur la figure [2.2](#fig-2-2). Dans le
second, les chunks sont attribués de façon dynamique, en fonction de la
progression des threads. Cette dernière stratégie, bien qu'induisant un coût de
planification, est prouvée efficace et est d'autant plus utilisée sur des
systèmes hétérogènes tels que les architectures big.LITTLE.

Ainsi, nous proposons d'exploiter la notion de chunks décrite dans OpenMP comme
une unité de mesure permettant de suivre en temps réel l'évolution de
l'exécution d'une application OpenMP parallélisée. Les applications considérées
seront donc celles contenant des boucles *for* parallélisables.

<a id="fig-2-3"></a>

![Étapes d'exécution d'un workload OpenMP](../../assets/figures/thesis/ch02/fig-2-3.png)

**Fig. 2.3** — Étapes d'exécution d'un workload OpenMP.

Sur la figure [2.3](#fig-2-3) sont décrites les différentes étapes d'exécution
d'un workload OpenMP constitué de boucles parallèles, du niveau utilisateur au
niveau matériel. À chaque étape est précisée la granularité de la charge de
travail. Cela démarre donc avec un fichier contenant le code source du
programme et les instructions OpenMP pour la parallélisation, et cela termine
par les compteurs matériels mis à jour durant l'exécution du programme. Le
niveau de granularité supérieur des chunks est facilement visible puisqu'il
correspond au premier niveau de description du workload durant l'exécution de
l'application (c.f. cadre *Run* sur la figure [2.3](#fig-2-3)). Cette
description met en avant les avantages d'utiliser OpenMP qui est compatible
avec la majorité des langages de programmation tels que C/C++, Fortran, etc,
ainsi que la plupart des architectures, contrairement aux compteurs matériels
qui sont spécifiques aux composants matériels (i.e. *hardware-specific*).

## 2.3 Optimisation de l'exécution du calcul parallèle

L'exécution du calcul parallèle peut être optimisée au cours de différentes
activités du cycle de vie du calcul, et à différents niveaux d'abstraction. On
distingue trois étapes au cours de ce cycle: la conception et l'implémentation,
la compilation, et l'étape d'exécution à proprement parler. Pendant la
conception et l'implémentation, des décisions telles que la sélection du
langage/modèle de programmation et la sélection de la stratégie de
parallélisation sont prises en compte. Les optimisations de compilation
comprennent les décisions de sélection des drapeaux d'optimisation du
compilateur et des transformations du code source (telles que le déroulement
des boucles, l'optimisation des nids de boucles, le pipelining et
l'ordonnancement des instructions) de sorte que le programme exécutable soit
optimisé pour atteindre certains objectifs (performance ou énergie) dans un
contexte donné. Les activités d'exécution comprennent les décisions relatives à
la sélection des données optimales et à l'ordonnancement des tâches sur les
systèmes de calcul parallèles, ainsi que les décisions (telles que le DVFS) qui
aident le système à s'adapter au cours de l'exécution du programme et à
améliorer les performances globales et l'efficacité énergétique. Alors que les
activités de conception et de mise en œuvre du logiciel sont réalisées par le
programmeur, les activités logicielles au moment de la compilation et de
l'exécution sont effectuées par des outils (tels que des compilateurs et des
systèmes d'exécution).

### 2.3.1 Optimisation durant la conception et modèles haut-niveaux

Une grande partie de la littérature concerne les approches basées sur des
modèles d'abstraction haut-niveaux permettant de simuler le comportement d'une
application exécutée sur un système de calcul particulier. Avec la complexité
croissante des architectures de calcul d'aujourd'hui, la simulation est devenue
un outil indispensable pour explorer l'espace de conception des systèmes. Dans
le cadre de l'optimisation de l'exécution d'un calcul, ces modèles permettent
d'anticiper le comportement du calcul et de prévoir par exemple des
ordonnancements de tâches particuliers.

Une approche basée SDF (*synchronous dataflow*) est proposée par M. Pelcat
*et al.* [\[133\]](references.md#ref-133). Les auteurs proposent S-LAM, un
modèle simple et précis de description d'architecture à haut-niveaux
d'abstraction, prenant en considération les échanges de données au sein d'une
architecture hétérogène. Ce modèle permet, une fois inclus dans le framework
PREESM [\[132\]](references.md#ref-132) de réaliser le prototypage rapide d'un
déploiement de tâche – i.e. allocation (ou *mapping*) et ordonnancement (ou
*scheduling*) sur un système multi-cœurs sur puce (MPSoC). Le déploiement ainsi
généré peut être donné en entrée d'un simulateur basé en SystemC. De cet
ensemble résulte un processus rapide et précis de prototypage d'algorithme
parallélisé sur une architecture donnée.

Une approche analytique basée sur des horloges abstraites est présentée par
X. An *et al* [\[11\]](references.md#ref-11),
[\[12\]](references.md#ref-12). L'outil CLASSY
[\[11\]](references.md#ref-11) proposé permet la description et l'analyse à
base d'horloge de l'ordonnancement d'applications sur des systèmes composés de
cœurs fonctionnant à différentes fréquences. Un algorithme est proposé pour
réaliser l'ordonnancement automatiquement, en respectant des contraintes
utilisateur. Ce travail a été approfondi [\[12\]](references.md#ref-12) afin
d'inclure, entre autres, une méthode d'exploration de l'espace de conception,
proposant des solutions pareto-optimales. Une méthode pour l'exploration
d'espace de conception est également proposée par K. Latif *et al.*
[\[94\]](references.md#ref-94) pour des applications automobiles. Une approche
orientée graphes et automates est également présentée par X. An *et al*
[\[13\]](references.md#ref-13) pour la conception de contrôleurs fiables pour
la reconfiguration dynamique d'architecture.

Les méthodes décrites précédemment concernent essentiellement les systèmes
embarqués [\[133\]](references.md#ref-133),
[\[13\]](references.md#ref-13), [\[94\]](references.md#ref-94) et MPSoC
[\[11\]](references.md#ref-11), [\[12\]](references.md#ref-12). Cependant, il
existe aussi un intérêt pour la modélisation de systèmes HPC. En effet, comme
décrit par K. Ahmed *et al.* [\[6\]](references.md#ref-6), la modélisation et
la simulation de systèmes HPC sont des outils cruciaux pour la conception de
ces systèmes toujours plus sollicités. Par exemple, dans
[\[168\]](references.md#ref-168) G. Xu *et al.* proposent un modèle pouvant
simuler, sur un PC privé, l'exécution d'un calcul exascale sur un système HPC.
Des travaux plus spécifiques sont également conduits, comme la contribution de
M. Mubarak *et al.* [\[116\]](references.md#ref-116) sur la simulation de
communication au sein de systèmes HPC.

L'ensemble de ces méthodes montre un intérêt certain pour la modélisation
haut-niveau du calcul parallèle, qui permet de simplifier l'analyse de systèmes
pourtant complexes. Cependant, dans cette thèse nous nous intéressons plus
spécifiquement aux approches plus bas niveau, proches du matériel, minimisant
les efforts "hors-ligne". En particulier, les méthodes de modélisation
nécessitent un travail de description des programmes et des systèmes de calcul
dans de nouveaux formats (e.g. SDF, évènements horloge), qui ne sont pas
toujours compatibles pour une optimisation en temps réel.

### 2.3.2 Optimisation durant l'exécution

Nous nous intéressons plus particulièrement aux solutions adressant
l'optimisation durant l'exécution du calcul parallélisé. En effet, la gestion
au niveau du runtime ouvre des perspectives de solutions adaptatives pour un
ajustement en temps réel. De plus, on constate un faible choix d'optimisation
runtime sur les systèmes de calcul commercialisés, sujets pourtant au calcul
parallèle. En effet, on retrouve sur les systèmes commercialisé différents
pilotes (e.g. *intel_pstate*, *acpi-cpufreq*) agissant essentiellement sur la
fréquence de fonctionnement des cœurs (i.e. *Dynamic Voltage-Frequency Scaling*
(DVFS)) ou le mode de puissance (i.e. *Distributed Power Management* (DPM)).
Entre autres, les gouverneurs Linux sont un ensemble de gestionnaires
d'exécution qui permettent de contrôler la configuration du système selon les
besoins logiciels et les contraintes de performance. Il existe par exemple le
gouverneur *performance* avec pour objectif d'exploiter le maximum des
capacités du système, le *powersave* qui à l'inverse cherche à diminuer la
consommation instantanée au prix d'une perte en performance, et le gouverneur
adaptatif *ondemand* [\[127\]](references.md#ref-127) conçu pour adapter les
performances du systèmes en fonction de ses besoins courants. Ces solutions
n'adressent qu'une partie des leviers d'optimisation ne gérant que le DVFS et
DPM. La gestion du mapping et scheduling est généralement prise en charge par
l'OS, ou sous la responsabilité du programmeur.

Les solutions existantes dans les systèmes commercialisés adressent globalement
l'optimisation de l'efficacité énergétique par le prisme du système matériel
(performances et consommation des cœurs, états de fonctionnement des cœurs,
etc.). Nous pensons donc qu'il y a des gains à générer via la conception de
systèmes de contrôle ajustant les paramètres d'exécution du calcul par le
prisme de l'application (i.e. suivi *application-specific*).

## 2.4 Vers le contrôle de l'efficacité énergétique des applications OpenMP

Dans le but d'exploiter le potentiel temps réel des chunks, nous concentrerons
notre étude sur le contrôle d'application OpenMP. Nous adressons donc le
problème du contrôle dynamique d'application OpenMP pour l'optimisation de
l'efficacité énergétique. Contrairement aux méthodes incluses dans les systèmes
commercialisés, nous souhaitons adresser à la fois le contrôle en fréquence
(i.e. DVFS) et l'allocation des ressources (i.e. mapping). Plus de détails sur
l'état de l'art sont donnés section
[3.1](03-state-of-the-art.md#31-efficacité-énergétique-du-calcul-parallèle).

### 2.4.1 Une multitude de paramètres

Le contrôle combiné de la fréquence de fonctionnement et de l'allocation des
ressources peut rapidement s'avérer délicat avec l'augmentation des ressources
disponibles. L'objectif de notre système de contrôle sera de déterminer en
temps réel la meilleure configuration (nombre de cœurs attribués, fréquence des
cœurs) du point de vue de l'efficacité énergétique. Or, dans le cas par exemple
du serveur Intel Xeon utilisé dans nos expérimentations, ce dernier dispose de
20 cœurs physiques et chacun de ces cœurs peuvent être contrôlés pour
fonctionner entre 1.2GHz et 2.2GHz. Cela représente un ensemble de 220
configurations différentes. Si on considère de plus un contrôle en fréquence
individuel des cœurs, le nombre de configurations explose.

Face à ce nombre important de solutions possibles, il n'est pas concevable de
tester chacune des solutions afin de déterminer laquelle optimise l'efficacité
énergétique du calcul. De plus, le contrôleur doit pouvoir s'adapter à un
changement de nature du calcul qui modifiera potentiellement ses
caractéristiques d'efficacité énergétique, et il faudra donc de nouveau tester
l'ensemble des configurations. Dans cet axe de recherche, nous proposons
d'explorer les méthodes de ML et leurs capacités de généralisation et
d'interpolation afin de correctement gérer ces grands ensembles de solutions et
rapidement proposer un contrôleur efficace.

### 2.4.2 Prise de décision automatique et RL

Parmi les méthodes existantes, l'usage d'apprentissage par renforcement (RL)
semble être la solution idéale pour notre contrôleur. En effet, l'apprentissage
par renforcement (RL) est avéré efficace pour les problèmes de prise de
décision. Il garantit théoriquement la convergence globale vers la solution la
plus performante parmi les actions disponibles, bien que le temps de
convergence soit souvent prohibitif. C'est donc une solution intéressante pour
les problèmes de décision non intuitifs, c'est-à-dire les problèmes pour
lesquels aucun modèle de système satisfaisant ne peut être construit.

<a id="fig-2-4"></a>

![Diagramme de concept du RL](../../assets/figures/thesis/ch02/fig-2-4.svg)

**Fig. 2.4** — Diagramme de concept du RL.

Dans l'apprentissage par renforcement, on définit l'algorithme de contrôle (au
sens du code et de ses variables) comme l'*agent*. Ce dernier interagit avec
l'*environnement* pour trouver la solution optimale. L'environnement est décrit
par son *état*. Les interactions de l'agent sur l'environnement sont appelées
*actions*. La figure [2.4](#fig-2-4) illustre le principe de fonctionnement du
RL. L'apprentissage du RL consiste à apprendre par l'expérience. Les actions
menées sont évaluées via une fonction de récompense. On distingue généralement
deux phases de fonctionnement dans l'utilisation de RL: la phase
d'*exploration* durant laquelle l'agent produit des actions plus ou moins
aléatoires afin d'explorer l'ensemble des solutions et de mémoriser un ensemble
de données composé de paires état/action associées à la récompense produite.
Puis un apprentissage est mené à partir de cette expérience d'exploration afin
de laisser l'agent décider de la meilleure action à mener en fonction de l'état
de l'environnement pour obtenir la meilleure récompense. Les problèmes de RL
nécessitent donc une définition minutieuse non seulement de l'*état* et de la
fonction de récompense, mais aussi des actions possibles pour concevoir un
contrôleur satisfaisant, comme décrit dans
[\[23\]](references.md#ref-23) et [\[54\]](references.md#ref-54) pour lesquels
l'espace d'action se repose sur le DVFS et le DPM pour le premier et
l'allocation de tâches pour le second.

Ainsi, nous proposons d'explorer l'usage de RL pour la construction d'un
système de contrôle. L'objectif de ce système de contrôle sera d'apprendre
automatiquement à contrôler de façon optimale une application OpenMP afin de
garantir en permanence la meilleure efficacité énergétique possible. Ce
contrôle agira sur la configuration du système de calcul. Les détails de notre
solution sont apportés dans le
[chapitre 4](04-openmp-energy-efficiency.md).

## 2.5 Conception de systèmes sur puce optimisés

Les sections précédentes ont permis d'évoquer les recherches sur l'optimisation
en-ligne du calcul parallèle, et de converger vers le problème du contrôle
dynamique d'application OpenMP. Cependant, l'efficacité énergétique d'un calcul
repose également sur les caractéristiques du système qui l'exécute. Ainsi, nous
discutons ici de l'optimisation du design des systèmes de calcul. Après une
rapide vue d'ensemble des paramètres de conception, nous nous concentrerons en
particulier sur les systèmes multi-cœurs sur puce (MPSoC), et le module
d'interconnexion qui assure la communication inter-cœurs.

### 2.5.1 Paramètres de conception

#### 2.5.1.1 Architecture et composants

Dans [\[117\]](references.md#ref-117), R. Muralidhar *et al.* font état des
tendances de conception architecturale guidées par la recherche de
l'amélioration de l'efficacité énergétique, dont entre autres le problème de la
gestion du *dark silicon* [\[59\]](references.md#ref-59) et le concept du
calcul énergie-proportionnel [\[17\]](references.md#ref-17). Les auteurs
décrivent notamment les techniques micro-architecturales spécifiques aux
composants présents sur un système de calcul (i.e. CPU, GPU, mémoire, etc.)
permettant une optimisation de ces derniers. L'ensemble de ces techniques est
vaste, comme déjà évoqué en introduction ([chapitre 1](01-introduction.md))
avec l'étude de Ryan Gary Kim *et al.* [\[87\]](references.md#ref-87). Nous
pouvons évoquer en particulier les techniques dédiées à la mémoire, élément
important d'un système de calcul lorsqu'il est question de la consommation
énergétique. De récentes avancées technologiques sont largement explorées dans
la littérature, comme par exemple l'intégration de mémoires non-volatiles
faisant l'objet de divers travaux au sein de l'équipe ADAC
[\[131\]](references.md#ref-131), [\[135\]](references.md#ref-135),
[\[136\]](references.md#ref-136), [\[134\]](references.md#ref-134),
[\[32\]](references.md#ref-32), [\[153\]](references.md#ref-153),
[\[154\]](references.md#ref-154), [\[46\]](references.md#ref-46).

Nous nous concentrons ici sur la conception de MPSoC, qui sont des systèmes
généralement soumis à de fortes contraintes énergétiques de par leur
utilisation courante sur des systèmes embarqués. De plus, ces systèmes sont par
définition conçus sur un unique support silicium, ce qui pose de nombreux
challenges de conception.

#### 2.5.1.2 MPSoC: Un ensemble de IP blocks interconnectés

Un MPSoC, et plus généralement un SoC, consiste en un ensemble de blocs de
propriété intellectuelle (en anglais *IP block*, pour *intellectual property
block*) interconnectés. Le support de communication joue donc un rôle clef dans
les performances d'un système sur puce. Les enjeux de ce module sont d'autant
plus importants sur les MPSoC étant donné leur nombre croissant d'éléments à
interconnecter. La figure [2.5](#fig-2-5) présente une architecture simplifiée
de système sur puce qui consiste en un ensemble de composants aux fonctions
différentes (e.g. CPU pour l'exécution des principales tâches et calculs comme
le système d'exploitation, et DSP pour l'exécution d'applications multimédias
riches en calculs mathématiques), permettant de diversifier les types
d'applications exécutables.

<a id="fig-2-5"></a>

![Exemple d'une architecture de SoC multi-cœurs](../../assets/figures/thesis/ch02/fig-2-5.svg)

**Fig. 2.5** — Exemple d'une architecture de SoC multi-cœurs.

Le module d'interconnexion est l'élément permettant de connecter l'ensemble des
composants présents dans le système et est considéré comme la clef de voûte des
systèmes multi-cœurs. Des études ont d'ailleurs montré qu'à mesure que le
nombre de cœurs augmente, l'interconnexion devient un facteur dominant,
imposant des contraintes de performance et de puissance significatives sur la
performance globale du système [\[31\]](references.md#ref-31). Il est donc
essentiel de disposer d'une interconnexion sur puce optimisée capable de
fournir une bande passante élevée et une faible latence pour le transfert de
données entre les blocs IP.

### 2.5.2 Le NoC: un module d'interconnexion encore coûteux en énergie

Le réseau sur puce (NoC) [\[50\]](references.md#ref-50) est devenu le
principal composant utilisé pour l'interconnexion des SoC multi-cœurs, en
raison de sa flexibilité et de sa facilité d'implémentation
[\[3\]](references.md#ref-3). Avec la complexité croissante des systèmes
multiprocesseurs sur puce (MPSoC) – i.e. l'augmentation du nombre de cœurs dans
la puce, les architectures hétérogènes, etc. – trouver l'équilibre entre les
performances et la puissance des systèmes est une tâche difficile. Les NoC
représentent une part importante de la consommation d'énergie des puces (e.g.
28% de la puissance totale de la puce Intel Terascale 80-chip
[\[80\]](references.md#ref-80), 36% pour le MIT RAW
[\[162\]](references.md#ref-162) et 19% pour la puce *SCORPIO*
[\[51\]](references.md#ref-51)). Ainsi, la conception d'un NoC économe en
énergie permettrait de réduire significativement la consommation des puces
multi-cœurs [\[8\]](references.md#ref-8).

#### 2.5.2.1 Notions sur les NoC

Le NoC se compose de routeurs interconnectés par des liaisons de données. Les
routeurs jouent un rôle clef dans l'acheminement des paquets de leur source
vers leur destination, tandis que les liaisons sont des ensembles de connexions
qui relient les routeurs entre eux et assurent le transfert des données entre
les routeurs. La manière dont les routeurs sont disposés dans le réseau est
régie par la topologie. Les topologies les plus courantes sont le *mesh*, le
*torus* et le *ring*. Lorsqu'on décrit une topologie de NoC, on emploie
généralement le vocabulaire des graphes, en désignant les routeurs comme les
nœuds (ou sommets), et les connexions comme les liens (ou arêtes). Nous verrons
dans le [chapitre 4](04-openmp-energy-efficiency.md) que l'analogie aux
graphes va plus loin.

<a id="fig-2-6"></a>

![Exemple de topologie mesh avec l'architecture des routeurs à buffers d'entrée](../../assets/figures/thesis/ch02/fig-2-6.png)

**Fig. 2.6** — Exemple de topologie *mesh* avec l'architecture des routeurs à
buffers d'entrée. *source:* [\[56\]](references.md#ref-56)

La figure [2.6](#fig-2-6) extraite de la thèse de Charles Effiong
[\[56\]](references.md#ref-56) présente une topologie classique de réseau
*mesh*, ainsi qu'une architecture typique de routeurs à buffers d'entrée
similaire au routeur HERMES [\[114\]](references.md#ref-114). Dans le cadre de
sa thèse, C. Effiong a exploré en détail l'architecture des routeurs pour
proposer sa propre architecture R-NoC inspirée du fonctionnement des
rond-points pour le trafic routier. Dans notre cas, l'architecture des routeurs
ne sera pas explorée, et dépendra essentiellement des simulateurs utilisés
(voire les chapitres de contribution [5](05-gannoc.md) et
[6](06-m-rwgan.md)). Il sera donc essentiellement question de routeurs à
buffers d'entrée classiques tels que celui présenté figure
[2.6](#fig-2-6). Le routeur comporte 5 ports entrées/sorties, désignés {Nord,
Sud, Est, Ouest, Local}, où le port Local connecte le routeur au cœur physique
sous-jacent, via une interface réseau. Les 4 autres ports sont dédiés aux
connexions inter-routeur.

**Topologie:** Les topologies de NoC peuvent être régulières ou irrégulières
[\[3\]](references.md#ref-3). Les topologies régulières sont connectées selon
un modèle (ou motif) spécifique, comme les topologies *mesh, torus, star, ring*
ou encore *tree*. À l'inverse, une topologie irrégulière ne possède pas de
motif particulier. La topologie du réseau affecte de manière significative les
performances globales du réseau [\[49\]](references.md#ref-49). En effet, elle
détermine la longueur du chemin (i.e. nombre de sauts entre deux routeurs) à
parcourir par un message depuis sa source vers sa destination. Un chemin plus
long se traduit par une latence et une consommation d'énergie plus élevées pour
l'envoi d'un message. De plus, la fiabilité est aussi impactée par la
topologie, puisqu'elle spécifie le nombre de chemins alternatifs permettant de
pallier d'éventuels défauts et conflits. Enfin, la topologie spécifie également
le nombre de routeurs présents dans le réseau, ce qui affecte directement la
surface et la puissance consommée et donc le coût du réseau.

**Routage:** Le routage définit le chemin qu'empruntera un message pour
rejoindre sa destination, à partir du routeur émetteur. L'objectif du routage
est donc d'assurer la bonne transmission des données. Il empêche les situations
d'impasse (*deadlock*), de blocage (*live-lock*) et de famine (*starvation*)
[\[5\]](references.md#ref-5). Le deadlock est une dépendance cyclique entre
les nœuds qui accèdent aux ressources et où aucun progrès ne peut être réalisé.
Le live-lock est une situation où un paquet circule dans le réseau mais
n'atteint pas sa destination. En cas de famine, un paquet dans un buffer
demande l'accès à un canal de sortie, mais le canal de sortie est également
alloué à un autre paquet.

Les algorithmes de routage peuvent être classés en deux types: déterministe et
adaptatif [\[139\]](references.md#ref-139). Un routage déterministe signifie
que pour les mêmes routeurs de départ et d'arrivée, le chemin emprunté par deux
messages différents sera identique. Un exemple connu est le routage *XY*
généralement utilisé dans les topologies de type mesh. Ce routage consiste à
transmettre un message en premier lieu sur la dimension *X* (généralement l'axe
Est-Ouest). Une fois que le message a atteint un routeur de même coordonnée *X*
que la destination, il est transmis sur l'axe de la dimension *Y* (généralement
l'axe Nord-Sud). Les routages déterministes sont simples à implémenter,
cependant il sont sujets à des pertes de performances importantes lorsqu'on
atteint un niveau de contention élevé sur le réseau, puisqu'ils ne permettent
pas d'exploiter des chemins alternatifs. Les routages adaptatifs apportent plus
de flexibilité en permettant d'adapter le chemin d'un message en fonction des
différentes conditions de trafic sur le réseau. Alors que ces types de routage
permettent d'améliorer la fiabilité du réseau, leur implémentation est beaucoup
plus complexe puisqu'elle nécessite souvent des systèmes de contrôle
additionnels pour éviter les situations d'impasse, de blocage et de famine.

**Techniques de commutation:** La technique de commutation fait référence au
mécanisme de contrôle du flux des messages entre les routeurs. Les techniques
de commutation de base utilisées dans les NoC sont la commutation de circuits
et la commutation de paquets. La commutation de paquets se divise en trois
grandes catégories : le *wormhole*, le *store-and-forward* et le
*virtual-cut-through*(VCT) [\[5\]](references.md#ref-5). Dans le wormhole, le
paquet est divisé en flit (flit de tête, flit de corps et flit de queue). Le
flit de tête contient les informations de source et de destination, le flit de
corps contient les données qui sont transmises à la destination et le flit de
queue contient les informations de fin de flit. En raison de la nature
"pipelinée" du *wormhole*, cette technique réduit la latence des messages. Dans
la technique *store-and-forward*, le paquet entier est stocké dans le routeur
puis acheminé vers le routeur suivant. Dans la technique du VCT, le paquet est
transmis au routeur suivant s'il s'assure que le paquet entier peut y être
stocké. En raison de la nature du pipeline et de la faible latence, la
technique de commutation par *wormhole* est préférable dans la conception du
routage [\[138\]](references.md#ref-138).

**Trafics et métriques:** Les trafics de NoC peuvent être classés en deux
catégories: les trafics synthétiques et les trafics réels d'application. Les
trafics réels sont des traces provenant de charges de travail d'applications
réelles. On peut citer par exemple les télécommunications, les réseaux et les
applications grand public de la suite de benchmarks E3S
[\[52\]](references.md#ref-52). D'autre part, les trafics synthétiques sont
des trafics expérimentaux utilisés pour évaluer l'architecture de communication
et ils tentent d'imiter des comportements particuliers des trafics
d'application du monde réel. Le trafic synthétique peut être régulier ou
irrégulier. Un exemple de trafic régulier est le modèle de trafic aléatoire (ou
trafic uniforme), où chaque nœud communique avec tous les autres nœuds avec une
probabilité d'envoi égale. Le *hotspot* est un exemple de modèle de trafic
irrégulier, où tous les nœuds communiquent avec un même nœud, i.e. le nœud
*hotspot* du réseau. Un trafic irrégulier crée plus de contention dans le
réseau par rapport à un trafic régulier, ce qui crée un goulot d'étranglement
de communication dans le réseau, se rapprochant de trafics réels (e.g. accès
mémoire). Cependant, ces trafics synthétiques peines à représenter fidèlement
les trafics réels, menant à de mauvais dimensionnements des NoC conçus
uniquement sur la base de ces trafics [\[15\]](references.md#ref-15).

<a id="fig-2-7"></a>

![Courbe de saturation d'un réseau](../../assets/figures/thesis/ch02/fig-2-7.svg)

**Fig. 2.7** — Courbe de saturation d'un réseau.

Afin d'évaluer les performances d'un NoC à supporter un trafic, on définit la
métrique de latence qui désigne le temps moyen que met un message à arriver à
destination après son envoie sur le réseau (i.e. injection sur le nœud source).
La latence dépend de la contention du réseau et de la distance entre les nœuds
de source et de destination du message. On affiche généralement la latence en
fonction de la charge du trafic (souvent définie par le *taux d'injection*)
afin de comparer les performances de différents NoC. Lorsque le taux
d'injection est modifiable, comme notamment avec les trafics synthétiques, il
est possible de tracer la courbe de saturation d'un NoC. Cette courbe permet de
visualiser le seuil de saturation, i.e. le taux d'injection limite à partir
duquel la latence augmente théoriquement à l'infini (réseau saturé). La figure
[2.7](#fig-2-7) présente une courbe typique de saturation, la définition du
seuil de saturation qui caractérise les performances maximales d'un NoC pour un
trafic donnée, et la latence pour un trafic nul qui définit la latence minimale
atteignable sur le réseau.

#### 2.5.2.2 Optimisation des NoC

La charge du trafic traversant les NoC dans un environnement réaliste est
généralement déséquilibrée [\[69\]](references.md#ref-69). Ces variations de
trafic peuvent résulter : 1) de l'hétérogénéité du SoC, c'est-à-dire du type
d'éléments interconnectés du SoC (System on Chip) (e.g. CPU, GPU, contrôleur de
mémoire, etc.) [\[103\]](references.md#ref-103), et 2) du workload de
l'application elle-même s'exécutant sur un SoC hétérogène ou homogène, i.e.
communications inter-tâches [\[169\]](references.md#ref-169). Par conséquent,
une conception de NoC efficace doit tenir compte des caractéristiques du trafic
afin d'éviter un surdimensionnement du NoC coûteux en énergie.

De nombreuses recherches ont été menées sur l'optimisation de l'efficacité
énergétique des NoC. Elles peuvent être classées en deux groupes :

- Optimisation dynamique : comprend toutes les solutions adaptatives qui
  modifient les caractéristiques du NoC au moment de l'exécution. Cela inclut
  les algorithmes de routage adaptatifs, la gestion avancée de l'alimentation
  et le contrôle de flux [\[95\]](references.md#ref-95),
  [\[144\]](references.md#ref-144), [\[143\]](references.md#ref-143).
- Optimisation statique : comprend toutes les optimisations hors ligne qui
  visent à adapter la conception du NoC aux spécificités du SoC ciblé. Cela
  englobe les algorithmes de routage déterministes et les méthodologies de
  conception [\[123\]](references.md#ref-123),
  [\[4\]](references.md#ref-4).

Les deux approches présentent des avantages et des inconvénients.
L'optimisation dynamique permet souvent d'ajuster au mieux les ressources NoC
utilisées à la charge de trafic courante. Malheureusement, l'adaptation
en-ligne nécessite des moyens de surveillance et d'exploitation complexes qui
peuvent détériorer les performances du NoC en raison de la latence de réveil,
par exemple. L'optimisation statique est, par définition, moins flexible. La
complexité de l'optimisation n'est plus gérée au moment de l'exécution mais
pendant la conception du NoC. Pour faire face à cette tâche complexe, les
concepteurs de NoC doivent réduire la multiplicité des problèmes menant à des
configurations de NoC hétérogènes non optimales.

Cette axe de recherche aborde la question de la conception de NoC hétérogènes
optimisés avec des performances quasi optimales. En particulier, il est
question d'exploiter les IA génératives afin de couvrir de grands espaces de
conception où les méthodologies classiques de recherche exhaustive ont échoué
en raison des exigences de temps de calcul inabordables.

### 2.5.3 CAO et IA générative

Il existe un grand nombre de techniques d'apprentissage et d'usage de ces
techniques. De par le problème défini précédemment, nous nous intéressons aux
techniques d'apprentissage pour la CAO (Conception Assistée par Ordinateur). Il
est donc question de générer des designs de NoC optimisés, à l'aide de
techniques d'IA permettant d'explorer un espace de conception très large. Pour
cela, une famille de technique nous semble pertinente: les IA génératives.

Les IA génératives sont apparues durant la dernière décennie et ont montré des
capacités impressionnantes pour construire des modèles précis via un
apprentissage non-supervisé. À partir de cette famille de techniques issue de
l'apprentissage profond, deux principales architectures sont à différencier:
les auto-encoder variationnel (VAE pour *Variational Autoencoder*)
[\[88\]](references.md#ref-88) et les réseaux antagonistes génératifs (GAN pour
*Generative Adversarial Networks*) [\[67\]](references.md#ref-67). La première
architecture est généralement utilisée pour extraire des caractéristiques d'un
ensemble de données. Quant aux GAN, ils sont utilisés pour générer de nouvelles
données, permettant entre autres d'enrichir la base de données (*Data
Augmentation*) et d'explorer un espace de données. L'architecture des GAN s'est
montrée efficace dans différents domaines pour de la génération de données
ayant des caractéristiques similaires à celles du dataset d'origine. En effet,
de la génération de portraits photoréalistes [\[85\]](references.md#ref-85) aux
applications médicales [\[161\]](references.md#ref-161), les GAN montrent
toujours d'impressionnantes capacités d'apprentissage, comme en atteste la
figure [1.4](01-introduction.md#fig-1-4).

L'utilisation des GAN semble donc être une voie pertinente à explorer pour la
construction d'un outil de CAO servant à la création de NoC optimisés.

<a id="fig-2-8"></a>

![Schéma représentatif d'un GAN](../../assets/figures/thesis/ch02/fig-2-8.png)

**Fig. 2.8** — Schéma représentatif d'un GAN.

**Réseaux antagonistes génératifs:** Un GAN est une architecture de réseau de
neurones proposée pour la première fois en 2014 par Ian J. Goodfellow et al.
[\[67\]](references.md#ref-67). Comme illustré sur la figure
[2.8](#fig-2-8), un GAN est constitué d'un *générateur* et d'un
*discriminateur*, deux réseaux de neurones antagonistes. Le discriminateur est
un réseau de neurones ayant pour objectif de distinguer correctement les
données provenant de l'espace des données réelles, des données fausses générées
par le générateur. Et donc le générateur est un réseau de neurones génératif
qui apprend à générer des données dans le domaine des données réelles, de sorte
que le discriminateur les classe comme réelles. Comme décrit sur la figure
[2.8](#fig-2-8), le discriminateur prend en entrée les données réelles et les
données générées (respectivement *X Real* et *X Fake*). Les données réelles
sont extraites d'un dataset d'entraînement, et les fausses proviennent de la
sortie du générateur. Étant équivalent à un classificateur binaire, il en sort
une valeur de probabilité $Y \in [0;1]$. Plus $Y$ est proche de 1, plus la
donnée d'entrée est jugée réaliste par le discriminateur. Sur la figure
[2.8](#fig-2-8), on distingue deux sorties: $Y_{real}$ et $Y_{fake}$,
respectivement les sorties du discriminateur pour les données réelles et les
données générées.

Durant l’entraînement, la progression de l’un induira la progression de
l’autre. Il y a donc une amélioration conjointe comparable à deux joueurs
opposés l’un à l’autre. In fine, nous sommes intéressés par le générateur, qui
est censé produire des données réalistes.

Les deux réseaux sont donc entraînés simultanément et de façon indépendante. Le
discriminateur suit un entraînement supervisé, où les données provenant de la
base de données sont étiquetées comme *réelles* et celles provenant de la
sortie du générateur sont étiquetées comme *fausses*. En parallèle, le
générateur suit un entraînement non-supervisé, où son unique but est que le
discriminateur reconnaisse ses données générées comme *réelles*. Le générateur
prend en entrée un vecteur aléatoire $z$ issu d'un espace aléatoire $Z$, appelé
*Noise*. À partir de ce "bruit", il apprend à produire de fausses données. Pour
formaliser cela, notons $G$ et $D$ les modèles générateur et discriminateur. On
note $x$ la donnée réelle en entrée du discriminateur. Nos deux modèles ont
chacun un objectif qui leur est propre, formant ainsi ce qui peut s'apparenter
à jeux à deux joueurs appliquant la règle *minimax* décrite en Eq.
[2.1](#eq-2-1) [\[67\]](references.md#ref-67):

<a id="eq-2-1"></a>

$$
\underset{G}{min}~~\underset{D}{max}~  (\underset{x\sim p_{data}(x)}{\mathbb{E}} [log(D(x))] +  \underset{z\sim p_{z}(z)}{\mathbb{E}}[log(1-D(G(z)))]~)
\tag{2.1}
$$

où $\mathbb{E}[X]$ décrit l'espérance de $X$, $p_{data}$ est la distribution de
la base de données, $p_{z}$ est la distribution du bruit d'entrée et la
notation $y\sim p_{y}(y)$ décrit une variable $y$ de densité de probabilité
$p_{y}$.

Ainsi, le générateur apprend à générer des données pour tromper le
discriminateur, et le discriminateur apprend à différencier correctement ses
entrées. Au cours de l'entraînement, ce processus convergera vers un jeu à
somme nulle. Chaque amélioration de l'un des réseaux provoquera une
détérioration de l'apprentissage du second.

Un tel mécanisme d'apprentissage s'avère particulièrement sensible durant la
période d'entraînement. De ce fait, la convergence de l'apprentissage est
souvent considérée difficile à obtenir. Pour améliorer cela, Arjovsky *et al.*
proposent le Wasserstein GAN (WGAN) [\[14\]](references.md#ref-14) utilisant la
distance de Wasserstein comme fonction de perte, présentée sous le nom de loss
de Wasserstein (W-loss). Dans ce modèle, le discriminateur ne se comporte plus
comme un classificateur binaire. En effet, en utilisant le W-loss, la sortie de
ce bloc n'est plus comprise entre [0, 1] comme dans le GAN conventionnel, mais
entre [$-\infty$, $+\infty$]. Cette nouvelle sortie peut s'interpréter comme
une mesure du "réalisme" ou "irréalisme" des données évaluées. De part ce
changement de concept, le réseau discriminateur est renommé réseau critique
pour garder une dénomination cohérente, et sera noté $C$.

Cependant, pour garantir sa stabilité, le W-loss doit satisfaire la contrainte
de Lipschitz [\[175\]](references.md#ref-175). Cette contrainte était
initialement respectée grâce à une technique de bornement des pondérations
(i.e. *weight clipping*) [\[14\]](references.md#ref-14). Malheureusement, cette
technique brutale restreint les capacités d'apprentissage du modèle en limitant
la plage de valeurs des poids du réseau de neurones. Ainsi, Gulrajani *et al.*
ont proposé le *WGAN-GP* [\[70\]](references.md#ref-70), améliorant la façon
dont est garantie la contrainte de Lipschitz dans le WGAN. Leur méthode
consiste à inclure une pénalité de gradient (*gradient penalty*, GP ) dans
l'entraînement. La fonction de perte du générateur ne change pas par rapport à
celle du WGAN, et la fonction de perte du critique ($L_C$) est modifiée comme
suit:

<a id="eq-2-2"></a>

$$
L_C(x_i,G(z_i)) = \underbrace{C(G(z_i)) -C(x_i)}_{\text{original critic loss}} + \underbrace{ \alpha(\|\nabla_{\hat{x}_i}C(\hat{x}_i)\|_2 - 1 )^2}_{\text{gradient penalty}}
\tag{2.2}
$$

où $G$ et $C$ sont les modèles générateur et critique, $\nabla$ est l'opérateur
de gradient usuel, $x_i$ et $z_i$ représentent respectivement un élément de la
base de données et de l'espace aléatoire,
$\hat{x}_i = \epsilon x_i + (1-\epsilon)G(z_i)$ avec $\epsilon \sim U[0,1]$
un nombre aléatoire. Le
coefficient $\alpha$ a pour valeur 10, d'après le papier d'origine
[\[70\]](references.md#ref-70).

Cette architecture améliorée de GAN sera celle utilisée comme point de départ
pour construire nos propres modèles.

## 2.6 Problèmes

Nous résumons ici les problèmes adressés dans cette thèse, suite au contexte
développé précédemment.

### 2.6.1 Optimisation en temps réel d'applications OpenMP via le RL

Le développement de méthodes d'optimisation du runtime sur des systèmes de
calcul parallèles expose les outils de gestion à un grand nombre de paramètres.
Par exemples, pour un système multi-cœurs hétérogène exécutant un calcul
parallélisé on retrouvera la liste suivante, non-exhaustive, de paramètres de
configuration: nombre de CPU, type de CPU, vitesse de cœur de CPU, taux de
parallélisme, niveau hiérarchique de l'accès mémoire, nombre de threads, etc.
Trouver l'ensemble optimal de paramètres pour un contexte spécifique n'est pas
une tâche triviale, c'est pourquoi l'essor des techniques d'apprentissage nous
intéresse particulièrement.

Comme le démontre l'étude de S. Memeti *et al.*
[\[102\]](references.md#ref-102), les techniques d'apprentissage ouvrent des
perspectives d'amélioration des méthodes d'optimisation du calcul parallélisé.
De la conception à l'exécution du workload, l'IA permet de faciliter
l'exploration et la sélection des paramètres d'optimisation. Dans cet axe, nous
ciblons l'optimisation de l'exécution de calculs parallèles et nous nous
intéresserons plus particulièrement aux techniques d'apprentissage par
renforcement permettant d'implémenter des solutions adaptatives et
automatiques.

Enfin, la portabilité des solutions d'optimisation étant un enjeu majeur de la
conception de méthodes de contrôle, nous choisissons d'étudier les calculs
parallélisés avec OpenMP. En effet, ce modèle de programmation est de loin le
plus utilisé, supportant différents langages de programmation, et supporté par
la majorité des plate-formes d'exécution. Ainsi, en agissant au niveau du
runtime OpenMP, nous garantissons la portabilité des solutions proposées. De
plus, cela nous permet de tirer profits du planificateur OpenMP, supportant
différent mode de planification dont le mode dynamique conçu pour réduire le
temps d'exécution d'un calcul parallèle, pour un coût supplémentaire de temps
de planification négligeable.

Dans cet axe de recherche, nous adressons le problème du contrôle dynamique de
l'exécution d'un workload OpenMP parallèle pour l'optimisation de l'efficacité
énergétique du système. Nous choisissons d'explorer l'apprentissage par
renforcement afin de proposer une solution adaptative pour la prise de
décision. Ainsi, nous allons tenter de répondre aux interrogations suivantes:

- *Comment exploiter les chunks pour suivre l'évolution de l'efficacité
  énergétique d'applications OpenMP ?*
- *Comment exploiter les techniques d'apprentissage par renforcement pour
  construire un contrôle adaptatif de calculs parallélisés avec OpenMP ?*

Nous précisons notre positionnement sur cet axe de recherche dans la section
[3.1](03-state-of-the-art.md#31-efficacité-énergétique-du-calcul-parallèle) du
[chapitre 3](03-state-of-the-art.md). Les solutions apportées sont développées
dans le [chapitre 4](04-openmp-energy-efficiency.md).

### 2.6.2 Conception de réseaux sur puce optimisés via les GAN

L'optimisation des designs de NoC est un enjeu majeur dans la conception de SoC
optimisés. Entre autres, nous remarquons que l'optimisation de la consommation
énergétique des systèmes sur puce doit impérativement passer par l'amélioration
des NoC, à l'origine d'une partie non négligeable de l'énergie consommée par le
système. Cependant, en considérant des topologies irrégulières et des NoC
hétérogènes, l'espace de conception de ces réseaux de communication croît
exponentiellement avec respectivement la taille du réseau (corrélée au nombre
d'éléments du SoC) et le nombre de paramètres considérés. Aussi, nous devons
nous confronter à la problématique précédente: comment rechercher une solution
optimale lorsque l'espace de conception est bien trop grand pour être étudié de
manière exhaustive, sachant que les simplifications liées à la recherche
analytique introduisent un biais trop important pour l'obtention d'une solution
fortement optimisée.

Ainsi, une solution permettant de réduire automatiquement l'espace de
conception selon des critères d'optimisation des NoC est nécessaire pour
permettre de concevoir des NoC optimisés.

Dans cet axe, nous tenterons de répondre aux interrogations suivantes:

- *Comment accélérer la recherche de solutions optimales en réduisant l'espace
  de conception ?*
- *Comment diversifier/multiplier les objectifs d'optimisation de cette
  réduction de l'espace de conception ?*

Nous précisons notre positionnement sur cet axe de recherche dans la section
[3.2](03-state-of-the-art.md#32-conception-de-noc-optimisés-au-niveau-matériel) du
[chapitre 3](03-state-of-the-art.md). Les solutions apportées sont développées
dans les chapitres [5](05-gannoc.md) et [6](06-m-rwgan.md).
