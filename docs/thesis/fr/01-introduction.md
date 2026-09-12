---
title: Introduction
chapter: 1
lang: fr
source: Chapitre0/Introduction.tex
---

# 1. Introduction

<div class="lang-switch" markdown>
[English](../01-introduction.md){ .lang-pill title="This chapter in English" }
<span class="lang-pill is-current">Français</span>
</div>

## 1.1 Systèmes de calcul

### 1.1.1 De la quête de performance

Depuis l'apparition des premiers microprocesseurs dans les années 1970, les
performances des CPU monolithiques n'ont cessé de croître, conséquence direct
de l'augmentation de la densité de transistors suivant l'allure prédite par la
loi de Moore, i.e. le nombre de transistors présents sur un microprocesseur
double tous les deux ans. Cependant, les sources traditionnelles
d'amélioration des performances – e.g. parallélisme d'instruction
(instructions indépendantes pouvant être exécutées en parallèle par
différentes unités de calcul) et augmentation de la fréquence d'horloge –
semblent avoir atteint leur limite. En effet, des contraintes physiques telles
que la chaleur dissipée par le système doivent être respectées afin d'assurer
l'intégrité du système. Ainsi, dû à ces limitations, il s'avère inefficace
d'augmenter la fréquence de fonctionnement ainsi que la densité du nombre de
transistors. On notera sur la figure [1.1](#fig-1-1) que la fréquence de
fonctionnement des CPU commercialisés stagne autour de 4 GHz depuis 2005,
confirmant ces limitations.

<a id="fig-1-1"></a>

![Évolution sur 48 ans des microprocesseurs commercialisés](../../assets/figures/thesis/ch01/fig-1-1.svg)

**Fig. 1.1** — Évolution sur 48 ans des microprocesseurs commercialisés.
*source :* [\[147\]](references.md#ref-147)

En réponse à ces fortes contraintes, la conception des systèmes de calcul est
entrée, au début des années 2000, dans l'ère des systèmes multi-cœurs
[\[130\]](references.md#ref-130). Cette transition a permis aux performances
des systèmes de continuer de croître via l'augmentation du nombre de CPU (i.e.
cœur). Ainsi, la taille des cœurs est maintenue voire réduite, au profit d'un
plus grand nombre de cœurs permettant l'accroissement global du nombre de
transistors sur un même support silicium (voire figure [1.1](#fig-1-1)).
L'augmentation des performances est ainsi maintenue, tout en respectant les
contraintes physiques évoquées précédemment. On remarque d'ailleurs sur la
figure [1.1](#fig-1-1) une forte croissance du nombre de cœurs implémentés sur
un même multiprocesseurs depuis 2005 – i.e. fin de l'augmentation de la
fréquence d'horloge.

### 1.1.2 Vers la quête d'efficacité énergétique

De nos jours, ce ne sont plus seulement les performances qui motivent les
travaux de recherches sur les systèmes de calcul, mais aussi la consommation
énergétique. Ainsi, les progrès tendent vers l'amélioration de l'efficacité
énergétique, définie comme la quantité de travail effectué relative à
l'énergie dépensée à la tâche, i.e. $\frac{Performance}{Puissance}$. Améliorer
l'efficacité énergétique d'un système de calcul consiste donc à réduire la
quantité d'énergie consommée et/ou augmenter les performances du système. Le
développement des systèmes multi-cœurs s'est avéré utile dans cette quête pour
l'efficacité énergétique. Par exemple, des études ont montré que l'utilisation
d'un système double-cœur à 80 % de sa fréquence maximale permet de quasiment
doubler les performances du système comparé à un processeur à un seul cœur
fonctionnant à 100 % de sa fréquence maximale, pour une consommation
énergétique similaire [\[165\]](references.md#ref-165). Pour ces raisons
évidentes d'amélioration de l'efficacité énergétique, les architectures
multi-cœurs se retrouvent sur tout type de systèmes de calcul, allant des
systèmes embarqués aux systèmes distribués tels que les clusters de calcul.

Cependant, à cet usage multi-niveaux s'ajoute une complexité croissante des
systèmes multi-cœurs. Il est désormais question de systèmes *manycore*
possédant de la dizaine à plusieurs milliers de cœurs, ainsi que de systèmes
hétérogènes composés de ressources aux performances, besoins et usages
différents. Ainsi, de nouveaux enjeux existent pour pouvoir optimiser ces
systèmes de calcul, allant des problématiques de conception aux défis liés à
leur utilisation et contrôle.

## 1.2 L'optimisation du calcul parallèle

Les performances du calcul parallèle sont directement liées aux ressources de
calcul sur lesquelles la charge de travail est partagée et exécutée. Ainsi, la
complexité des systèmes multi-cœurs ne cessent de croître, et les systèmes
*manycore* – i.e. possédant des centaines d'unités de calcul – pourrait
bientôt devenir la norme. En effet, on peut citer le processeur AMD EPYC 7H12
commercialisé en 2019, possédant 64 cœurs physiques et 128 cœurs logiques,
permettant à un particulier de s'offrir la puissance d'un serveur sur un
unique processeur. Ce développement du nombre de ressources permet d'atteindre
des niveaux de parallélisme jusqu'alors réservés aux clusters de calcul.
Cependant, afin de profiter au mieux de ces ressources grandissantes pour
garantir une efficacité énergétique optimale, un ensemble de paramètres de
conception et de contrôle doivent être considérés.

### 1.2.1 Un ensemble de paramètres grandissant

<a id="fig-1-2"></a>

![Une partie des leviers à considérer pour l'optimisation d'un système de calcul parallèle](../../assets/figures/thesis/ch01/fig-1-2.png)

**Fig. 1.2** — Une partie des leviers à considérer pour l'optimisation d'un
système de calcul parallèle. Figure extraite de
[\[87\]](references.md#ref-87)

Sur la figure [1.2](#fig-1-2) extraite de l'étude de Ryan Gary Kim *et al.*
[\[87\]](references.md#ref-87) sur le design de systèmes many-cœurs dédiés à
l'apprentissage machine, les auteurs font une classification simple mais
suffisamment complète pour démontrer la difficulté de l'optimisation des
systèmes de calcul complexes. En effet, les leviers d'optimisation sont
classés selon deux catégories complémentaires: 1) l'optimisation de la
conception du système, 2) l'optimisation du contrôle du système durant
l'exécution du calcul.

**L'étape de conception** L'étape de conception du système de calcul joue un
rôle primordial pour les performances énergétiques que possédera ce dernier.
Les méthodes d'optimisation du design peuvent être réparties selon la partie
du système adressée. On distingue généralement trois parties dans un système
de calcul, avec leurs paramètres respectifs comme illustré sur la figure
[1.2](#fig-1-2):

- *Partie calculatoire:* Cette partie du système concerne les cœurs de calcul
  de la plate-forme. Les paramètres de conception comprennent le nombre de
  ressources de calcul, l'architecture de chacune de ces ressources (CPU, GPU,
  etc.), la répartition de ces ressources (i.e. système homogène ou
  hétérogène), ou encore le jeu d'instruction (e.g. *complex instruction set
  computer* (CISC), *reduced instruction set computer* (RISC)).
- *Partie mémoire:* Il s'agit du sous-système qui coordonne les accès aux
  données dans le système. Les paramètres de conception comprennent la
  hiérarchie (e.g. structure allant des cœurs de calcul à la mémoire
  principale, nombre de niveaux de caches, etc.), le type de gestion de la
  mémoire (e.g. mémoire distribuée ou partagée), ou encore les technologies
  utilisées avec un intérêt particulier pour les mémoires émergentes
  magnétiques lorsqu'il est question de faible consommation.
- *Partie communication:* Cela concerne le module d'interconnexion du système,
  assurant les échanges entre les différents composants. Ces échanges
  permettent entre autres la coordination entre les différents cœurs de
  calcul, et est donc un élément particulièrement sensible concernant le
  calcul parallélisé. Les paramètres de conception comprennent la topologie du
  système d'interconnexion (bus, ring, mesh, etc.), l'architecture des
  routeurs (e.g. taille et type de buffers, nombre d'étages de pipeline) et le
  type de connexion (e.g. avec ou sans lien physique, bande-passante, uni ou
  bidirectionnelle).

Ces ensembles de solutions ne sont évidemment pas totalement distincts, et il
est possible d'adresser simultanément plusieurs de ces groupes. Par exemple,
la conception des buffers d'un routeur de la couche communication peut être
vue comme une problématique liée à l'aspect mémoire.

**L'étape de contrôle** En complément de l'optimisation du design du système
de calcul, ce dernier doit être ajusté en temps réel pour s'adapter aux
conditions de fonctionnement variables. Comme illustré figure
[1.2](#fig-1-2), les différents leviers d'optimisation en cours de
fonctionnement peuvent globalement se répartir selon les catégories suivantes:

- *Gestion du support:* Cela concerne essentiellement le contrôle dynamique
  des paramètres des parties calculatoires et communication du système. Pour
  la partie calculatoire, on retrouve entre autres la sélection dynamique de
  la paire fréquence/tension de fonctionnement (DVFS) par cœur ou par
  processeur entier selon l'architecture, la gestion dynamique de la puissance
  (DPM) et la reconfiguration des cœurs de calcul. Pour la partie
  communication, on citera également la gestion de la fréquence de
  fonctionnement, mais aussi le routage adaptatif ou encore l'arbitrage de la
  communication.
- *Gestion des applications:* Cette catégorie regroupe les méthodes de gestion
  permettant d'adapter l'application aux caractéristiques du système. Cela
  comprend entre autres l'allocation des ressources aux tâches d'exécution
  (i.e. *task mapping*) et l'ordonnancement des tâches (*task scheduling*).

### 1.2.2 Des méthodes classiques limitées

Il est maintenant clair que l'espace de conception (la combinaison des
décisions de conception et des politiques de contrôle et d'exécution du
calcul) explose à mesure que le nombre standard de ressources augmente. La
figure [1.2](#fig-1-2) montre un petit échantillon des leviers de conception
disponibles aujourd'hui, tels que l'architecture des cœurs, l'architecture de
la mémoire, l'allocation de tâches et le routage adaptatif. Chacun de ces
leviers possède un grand nombre de paramètres découlant sur un espace de
solutions où la recherche de la combinaison optimale est un challenge. En
effet, les méthodes d'exploration exhaustive de l'espace de conception ne sont
plus envisageables aux regards du temps de calcul (i.e. problèmes
NP-difficiles) et les techniques heuristiques devant répondre à ce problème
sont sous-optimales. De plus, les méthodes heuristiques reposent généralement
sur un ensemble d'hypothèses permettant de simplifier le problème, et
requièrent donc le travail d'un expert afin de définir ces simplifications. De
ce fait, ces méthodes ne garantissent pas l'obtention de solutions optimales
et sont potentiellement sujettes à des biais de définition et des
simplifications trop importantes. Par exemple, l'allocation de tâches est une
méthode intéressante pour optimiser l'utilisation des ressources du système en
fonction des tâches à accomplir. Cependant, lorsqu'il est question de trouver
l'allocation optimale, on fait face à un problème NP-difficile
[\[29\]](references.md#ref-29). Dans [\[78\]](references.md#ref-78), Hoefler
*et al.* exposent un ensemble de méthodes heuristiques développées pour
l'allocation de tâches, et concluent sur une liste non exhaustive de
challenges, dont l'incapacité à gérer des espaces de solutions toujours plus
grands.

Les techniques d'apprentissage, et en particulier les réseaux de neurones
montrent des capacités d'abstraction et de généralisation intéressantes,
pouvant potentiellement pallier les limites des méthodes classiques pour la
considération d'un espace de conception grand. Cette observation est partagée
avec les auteurs de [\[87\]](references.md#ref-87) qui explorent le secteur
des systèmes "domain specific". Les techniques d'apprentissage machine sont
donc à étudier afin de répondre au problème du nombre de paramètres.

## 1.3 Techniques d'apprentissage

### 1.3.1 Notions de base et hiérarchie des techniques

<a id="fig-1-3"></a>

![IA: vue d'ensemble](../../assets/figures/thesis/ch01/fig-1-3.svg)

**Fig. 1.3** — IA: vue d'ensemble

Le domaine de l'intelligence artificielle (IA) et plus particulièrement
l'utilisation des techniques d'apprentissage s'est particulièrement développé
ces dernières décennies. Pour bien comprendre la hiérarchie de ces techniques,
une illustration est proposée figure [1.3](#fig-1-3). On représente l'IA comme
un domaine de la science qui consiste à programmer des systèmes pour qu'ils
réalisent des tâches nécessitant habituellement l'intervention de
l'intelligence humaine. Dans ce domaine s'est développé un ensemble
d'algorithmes et de méthodes permettant d'apprendre aux machines à réaliser
des tâches sans nécessiter de programmation explicite dédiée à l'exécution de
cette tâche – c'est le domaine des techniques d'apprentissage, ou ML pour
*machine learning*. Les méthodes du ML reposent sur l'utilisation massive des
données, ce qui explique leur développement récent, i.e. corrélé au
développement des calculateurs. Les modèles prennent en entrées des données et
sont entraînés pour évaluer et/ou agir sur ces données. Parmi les applications
du ML, on retrouve la régression permettant de prédire la sortie d'un modèle
appris (e.g. fonction complexe), ou encore la classification de données.
Enfin, une catégorie particulière du ML aux capacités d'abstraction et de
généralisation toujours plus impressionnantes est l'apprentissage profond, ou
DL pour *Deep Learning*. Ce sous-groupe de techniques ML est basé sur
l'utilisation de réseaux de neurones artificiels (NN, pour *Neural Networks*),
agencés en couches. Les techniques de DL sont utilisées sur un très large
panel d'applications, allant de la reconnaissance d'objet (e.g. *Convolutional
Neural Networks* (CNN)) au traitement de données en série (e.g. traduction de
texte avec les RNN (*Recurrent Neural Networks*)).

### 1.3.2 Classification des techniques

Les techniques ML, et par conséquent les techniques de DL, peuvent être
classées en quatre catégories, selon leur méthode d'apprentissage:

- ***Apprentissage supervisé:*** Le système apprend à évaluer/classer des
  données d'entrée, sur la base d'un ensemble de données préalablement
  étiquetées. Le but est d'apprendre un modèle de classification prédéterminé.
  **e.g.** Régression linéaire, SVM, Arbre de décision.
- ***Apprentissage non-supervisé:*** Le système apprend à évaluer/classer des
  données d'entrée, sur la base d'un ensemble de données non étiquetées. Le
  but est que l'algorithme se construise seul un modèle de classification.
  **e.g.** K-means clustering, autoencoder.
- ***Apprentissage semi-supervisé:*** Le système se construit un modèle à
  l'aide d'un mélange de données étiquetées et non étiquetées. **e.g.** IA
  génératives.
- ***Apprentissage par renforcement:*** L’apprentissage par renforcement
  correspond au cas où l'algorithme apprend un comportement étant donné une
  observation. L'action de l'algorithme sur l'environnement produit une valeur
  de retour qui guide l'algorithme d'apprentissage. C'est l'apprentissage par
  la pratique. **e.g.** Q-learning.

### 1.3.3 Le potentiel du DL

Des avancées impressionnantes ont été accomplies grâce au DL et leur
utilisation des réseaux de neurones. Par exemple, *DeepMind* a pu démontrer le
potentiel de l'apprentissage par renforcement avec son modèle de *AlphaGo*
[\[159\]](references.md#ref-159), la première IA à vaincre le N° 1 mondial du
jeu de Go. Les contributions de *DeepMind* ne s'arrêtent pas seulement à
l'apprentissage profond par renforcement, mais concernent l'utilisation
globale du deep learning pour répondre à de multiples problèmes complexes
issus de domaines divers. On citera entre autres *AlphaFold*
[\[82\]](references.md#ref-82), une méthode révolutionnaire répondant avec une
précision inédite au problème de prédiction du repliement des protéines.

Pour explorer plus loin le potentiel des réseaux de neurones, la figure
[1.4](#fig-1-4) extraite du document de Miles Brundage *et al.*
[\[34\]](references.md#ref-34), montre l'évolution des IA génératives, en
l'occurrence les GAN (*Generative Adversarial Network*), pour la production de
portraits photoréalistes.

<a id="fig-1-4"></a>

![Exemple du progrès des capacités de génération des GAN, de 2014 à 2017](../../assets/figures/thesis/ch01/fig-1-4.png)

**Fig. 1.4** — Exemple du progrès des capacités de génération des GAN, de 2014
à 2017. *source:* [\[34\]](references.md#ref-34)

Ce domaine des IA génératives est particulièrement intéressant pour ses
facultés de création de données, et permet ainsi d'apporter des solutions aux
problèmes d'enrichissement d'un ensemble de données ou encore d'explorer un
espace de données. De plus, on remarque sur la figure [1.4](#fig-1-4) que ces
techniques d'IA génératives (ici, les GAN) se sont considérablement améliorées
ces dernières années.

Alors que l'usage des techniques d'apprentissage s'est largement développé, en
particulier les réseaux de neurones et les techniques de DL qui en découlent,
il semble qu'il reste encore des bénéfices à en tirer dans le domaine de
l'optimisation des systèmes de calcul, au sens large du terme.

## 1.4 Objectifs de thèse

Cette thèse a donc pour vocation d'explorer le domaine des techniques
d'apprentissage pour apporter de nouvelles solutions aux enjeux liés à
l'efficacité énergétique du calcul parallèle. En effet, dans le but
d'optimiser la consommation liée au calcul parallèle, un ensemble grandissant
de paramètres doit être considéré, limitant ainsi les performances des
méthodes classiques majoritairement heuristiques. Or, les applications
actuelles des techniques d'apprentissage profond (DL) montrent que ces
techniques sont capables d'appréhender des problèmes complexes possédant un
grand nombre de paramètres. Nous proposons donc d'étudier ces techniques pour
pallier les limites des méthodes actuelles.

Un problème que nous adresserons dans un premier temps, est l'optimisation du
calcul et sa gestion en temps réel. En effet, lorsqu'il est question du calcul
parallèle, un des premiers points impactant la consommation d'une application
parallélisée est la façon dont elle est répartie parmi les ressources de
calcul. Cette répartition doit considérer à la fois les besoins de
l'application, mais aussi les caractéristiques des ressources disponibles.
Ainsi, l'usage de techniques d'apprentissage devra permettre de considérer ces
différents paramètres afin de proposer un contrôle optimal du calcul.

Ensuite, une application parallélisée est une application exploitant largement
le support de communication. Afin d'améliorer l'efficacité énergétique du
calcul parallèle, il est donc nécessaire de concentrer des efforts sur
l'aspect communication du calcul. Dans cette thèse, nous étudierons en
particuliers les réseaux de communication sur puce et nous adresserons le
problème de l'optimisation de ces réseaux.

## 1.5 Plan de thèse

Ce manuscrit de thèse vise à présenter le travail effectué au sein de l'équipe
ADAC (*ADAptive Computing*) du LIRMM, dont l'objectif est de proposer des
solutions d'amélioration de l'efficacité énergétique des systèmes numériques
ciblés calcul parallèle, à l'aide d'outils d'apprentissage machine pertinents.
Ce document est composé de cinq chapitres, sans compter l'introduction et la
conclusion:

- *[Chapitre 2](02-research-axes.md) – Axes de recherche et problèmes
  adressés*, présente le contexte et les problématiques adressées durant cette
  thèse. En particulier, il est question de l'optimisation dynamique du calcul
  parallèle et de la conception de réseaux de communication sur puce
  optimisés, par le biais des techniques d'apprentissage.
- *[Chapitre 3](03-state-of-the-art.md) – État de l'art*, expose l'état de l'art
  de chacune des problématiques adressées.
- *[Chapitre 4](04-openmp-energy-efficiency.md) – Efficacité énergétique
  des calculs parallélisés OpenMP*, présente les travaux sur l'optimisation de
  l'aspect calculatoire des applications parallèles. Une métrique d'efficacité
  énergétique dédiée aux applications OpenMP est développée, ainsi qu'un outil
  de détection de phases d'exécution d'applications exploitant cette métrique.
  Une méthode de mapping adaptatif pour l'amélioration de l'efficacité
  énergétique de workloads OpenMP est proposée.
- *[Chapitre 5](05-gannoc.md) – Optimisation des topologies de réseaux de
  communication sur puce*, présente un outil de CAO développé pour la
  génération de topologies de NoC optimisées.
- *[Chapitre 6](06-m-rwgan.md) – Génération de réseaux sur puce hétérogènes
  optimisés*, propose une utilisation complémentaire de l'outil présenté
  *[Chapitre 5](05-gannoc.md)* en s'adressant à la problématique de la
  conception de réseaux sur puce hétérogènes optimisés. Alors que dans le
  *[Chapitre 5](05-gannoc.md)* il est question de la topologie des NoC, ici il
  sera question de leur composition (e.g. types de routeurs).
