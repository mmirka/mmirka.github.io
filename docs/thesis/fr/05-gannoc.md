---
title: Optimisation des topologies de réseaux de communication sur puce
chapter: 5
lang: fr
source: Chapitre4/Contribution2.tex
---

# 5. Optimisation des topologies de réseaux de communication sur puce

<div class="lang-switch" markdown>
[English](../05-gannoc.md){ .lang-pill title="This chapter in English" }
<span class="lang-pill is-current">Français</span>
</div>

Après s'être intéressé à l'optimisation temps réel d'applications
parallélisées, nous nous intéressons à l'optimisation de la conception
matérielle des supports d'applications. Pour cela, nous étudions plus
particulièrement la conception de réseaux sur puce (NoC, pour
*Network-on-Chip*), permettant d'interconnecter les éléments d'un même système
sur puce (SoC, pour *System-on-Chip*). En effet, les SoC sont entre autres
utilisés pour les systèmes embarqués, et sont donc particulièrement concernés
par l'enjeu de l'efficacité énergétique.

Nous cherchons ici (ainsi que dans le [chapitre 6](06-m-rwgan.md)) à démontrer
qu'il est possible d'exploiter les méthodes d'apprentissage profond pour
améliorer la conception des NoC, et plus globalement, la conception de réseaux
de communication. Par amélioration, il est question de designs optimisés selon
des critères définis par l'utilisateur, dont fait partie l'efficacité
énergétique.

Ce chapitre s'intéresse plus particulièrement à l'optimisation des topologies
de NoC, i.e. structure du graphe. En effet, la topologie du NoC joue à elle
seule un rôle important dans le fonctionnement du NoC, en fixant les bases des
chemins possibles à emprunter par les flux de communication. Ce chapitre est
appuyé par la publication suivante:
[\[106\]](references.md#ref-106).

> **Code.** Une reproduction en clean-room de la méthode de ce chapitre est
> disponible sur [mmirka/GANNoC](https://github.com/mmirka/GANNoC).

## 5.1 NoC et théorie des graphes

Afin de concevoir un outil de réduction d'espace de conception des NoC, il est
important de définir le type des données qui seront traitées. Pour cela, nous
faisons l'analogie entre les NoC et les graphes. En effet, la description d'un
NoC est analogue à celle d'un graphe, où les connexions et routeurs de l'un
correspondent aux arêtes et sommets de l'autre. Cela nous permet de réduire
notre problème de génération de NoC à un problème de génération de graphes.

À partir de cette analogie, nous pouvons nous référer à différents travaux sur
la génération de graphes [\[28\]](references.md#ref-28),
[\[60\]](references.md#ref-60), [\[172\]](references.md#ref-172),
[\[71\]](references.md#ref-71). Pour la plupart, la représentation choisie d'un
graphe est sa matrice d'adjacence. Cette matrice offre une représentation
formelle, non ambiguë d'un graphe. En effet, les propriétés essentielles comme
le nombre d'arêtes et le degré d'un sommet peuvent être directement extraites
de cette représentation.

<a id="fig-5-1"></a>

![Graphe: représentations](../../assets/figures/thesis/ch05/fig-5-1.svg)

**Fig. 5.1** : Graphe: représentations

Il existe différentes matrices permettant de représenter les graphes selon
différents paramètres. Il y a la matrice d'adjacence (notée $A$) qui constitue
la base de toute représentation de graphes. En effet, cette matrice contient
les informations de type structurel du graphes, et décrit la topologie du
graphe en indiquant le placement et la direction des connexions. Il existe
aussi la matrice des paramètres (notée $X$) qui contient les informations sur
différentes caractéristiques définissant le nœud d'un graphe. Dans notre cadre
des NoC, nous pourrons parler du type de routeurs ou encore de la taille des
buffers comme autant de paramètres disponibles dans la matrice $X$. Enfin, il
est possible d'enrichir la matrice d'adjacence avec une représentation en trois
dimensions, où la troisième dimension pourra contenir des informations
caractérisant les connexions. Cette dernière possibilité n'est pas exploitée
dans nos travaux, mais doit être connue dans la perspective de futurs travaux.

Sur la figure [5.1](#fig-5-1) est proposé un exemple de graphe simple afin
d'illustrer les notions de matrice d'adjacence $A$ et matrice de
caractéristiques $X$ (aussi appelée matrice de paramètres). Un NoC de $n$
routeurs pourra donc être représenté par une matrice d'adjacence de taille
$n$x$n$, où chacun des $n^2$ éléments est un booléen traduisant de la présence
ou non d'une connexion entre deux routeurs. La matrice de paramètre $X$ sera de
dimension $n$x$f$, avec $f$ le nombre de paramètres décrivant un routeur. Le
type des éléments de $X$ dépend des paramètres représentés.

## 5.2 NoC: topologie et performances

Nous nous concentrons ici sur les attributs de NoC relatifs à la topologie. Ces
attributs comprennent le nombre de routeurs, le nombre de connexions, le nombre
de connexions par routeur (i.e. le degré du routeur), etc. De plus, les
performances des NoC sont évaluées pour un routage statique (voir section
[5.4.1.2](#5412-technique-de-routage)) et différents trafics synthétiques. Un
trafic est caractérisé par la répartition de sa charge – e.g. uniforme, hotspot
– et son taux d'injection (TI) (i.e. le volume de sa charge). Plusieurs
métriques peuvent servir à évaluer les performances d'un NoC. Ici, nous
choisissons la latence du réseau, généralement corrélée au débit et à la
bande-passante du réseau, ce qui en fait une métrique pertinente de la
performance d'un NoC.

<a id="fig-5-2"></a>

| <a id="fig-5-2a"></a>(a) Impact du nombre de connexions. Trafic = uniforme, TI=10% | <a id="fig-5-2b"></a>(b) Impact de la distance moyenne. Trafic = uniforme, TI=10% |
|:--:|:--:|
| ![Impact du nombre de connexions. Trafic = uniforme, TI=10%](../../assets/figures/thesis/ch05/fig-5-2a.png) | ![Impact de la distance moyenne. Trafic = uniforme, TI=10%](../../assets/figures/thesis/ch05/fig-5-2b.png) |
| <a id="fig-5-2c"></a>(c) Impact du nombre de connexions. Trafic = hotspot, TI=10% | <a id="fig-5-2d"></a>(d) Impact de la distance moyenne. Trafic = hotspot, IR=10% |
| ![Impact du nombre de connexions. Trafic = hotspot, TI=10%](../../assets/figures/thesis/ch05/fig-5-2c.png) | ![Impact de la distance moyenne. Trafic = hotspot, IR=10%](../../assets/figures/thesis/ch05/fig-5-2d.png) |

**Fig. 5.2** : Évaluation des performances de NoC à 9 routeurs.

Sur la figure [5.2](#fig-5-2), plusieurs graphiques sont présentés pour
démontrer l'impact des attributs de topologie sur les performances d'un NoC.
Les résultats présentés correspondent à une base de données de NoC à 9
routeurs. Ils ont été évalués avec le simulateur Ratatoskr
[\[81\]](references.md#ref-81), pour les trafics uniforme (voire figures
[5.2a](#fig-5-2a) et [5.2b](#fig-5-2b)) et hotspot (figures
[5.2c](#fig-5-2c) et [5.2d](#fig-5-2d)). On considère un taux d'injection de
10%. Les figures [5.2a](#fig-5-2a) et [5.2c](#fig-5-2c) montrent la latence en
fonction du nombre de connexions des NoC simulés. Sur les figures
[5.2b](#fig-5-2b) et [5.2d](#fig-5-2d) sont affichées les valeurs de latence en
fonction de la distance moyenne entre les routeurs. La distance moyenne d'un
NoC correspond au nombre moyen de routeurs qu'un message doit traverser avant
d'atteindre sa destination. Cette valeur est donc impactée par le routage
implémenté.

On remarque un impact significatif du nombre de connexions et de la distance
moyenne sur les performances du réseau, soumis à un trafic uniforme. Bien que
l'on puisse s'attendre à des résultats similaires (i.e. plus on dispose de
connexions, meilleure est la bande-passante, et moins la distance moyenne est
grande, plus la latence est faible), la même conclusion n'est pas possible
lorsque le réseau est soumis au trafic hotspot. En effet, bien que la tendance
globale soit similaire, avec le trafic hotspot on remarque une plus grande
disparité de latence, pour des valeurs d'attributs identiques.

Alors que l'analyse des résultats pour un trafic uniforme est intuitive, on
remarque que le trafic hotspot demande une étude plus approfondie. En effet, on
ne peut pas extraire de relation de causalité évidente entre les attributs
considérés et les performances des NoC. De plus, on peut aisément admettre que
des conclusions similaires peuvent être attendues pour des trafics plus
complexes, en particulier si l'on considère la nature hétérogène des SoC. D'où
l'idée d'entraîner un modèle génératif qui peut apprendre des corrélations non
intuitives entre les paramètres et les performances de NoC.

## 5.3 Problématique et approche

Dans ce chapitre, nous nous intéressons donc à la conception de topologies de
NoC optimisées et tentons de répondre à la question suivante: *Comment
améliorer la conception des réseaux sur puce, dont l'espace de conception est
de plus en plus étendu, à l'aide d'outils d'apprentissage profond ?*

Nous proposons d'exploiter le concept de réseau antagoniste génératif (GAN)
pour créer un outil d'assistance à la conception de NoC. Cet outil doit pouvoir
fournir au concepteur un ensemble de NoC optimisés selon certains critères,
afin de réduire l'espace de conception.

### 5.3.1 Représentation des données

Pour notre approche, nous adressons le problème de conception de NoC comme un
problème de conception de graphes. Ce passage vers le domaine des graphes nous
permet d'identifier, à l'aide de techniques d'apprentissage, des propriétés non
triviales des graphes relatives aux métriques de performances des réseaux, e.g.
la latence moyenne d'envois de paquets et le seuil de saturation du réseau.

Notre intérêt se concentre sur la topologie des NoC. Ainsi, nous choisissons
d'utiliser la matrice d'adjacence $A$ comme représentation des données. En
effet, comme expliqué en amont section
[5.1](#51-noc-et-théorie-des-graphes), la matrice d'adjacence est une
représentation compacte de la topologie d'un graphe, décrivant la manière dont
les sommets sont connectés. Différentes caractéristiques clefs peuvent être
extraites de cette représentation, comme le nombre de connexions, le degrés des
sommets, la distance entre deux sommets, etc. La matrice d'adjacence est donc
une représentation à la fois simple et riche d'une topologie de graphe. De
plus, une caractéristique de cette matrice est qu'elle possède un axe de
symétrie sur sa diagonale (i.e. haut-gauche vers bas-droit). Cette propriété
découle de notre choix de ne considérer que des connexions bidirectionnelles
entre les routeurs. Cela en fait un choix particulièrement pertinent pour notre
première implémentation de modèle génératif, puisque ce sera le premier motif
que notre réseau de neurones apprendra avant de converger vers plus de détails.
De ce fait, c'est une représentation idéale pour notre problème.

Enfin, puisque nous implémentons des routeurs possédant quatre connexions
extérieures — généralement nommées Nord, Sud, Est, Ouest, plus le port Local —
nous fixons le degré maximum de nos graphes à 4.

### 5.3.2 Framework

<a id="fig-5-3"></a>

![Le framework GANNoC.](../../assets/figures/thesis/ch05/fig-5-3.svg)

**Fig. 5.3** : Le framework GANNoC.

Notre solution repose sur deux parties essentielles: (1) un réseau de neurones
qui a pour objectif d'apprendre à générer des designs de NoC, et (2) un
simulateur de NoC qui est utilisé pour évaluer les designs de NoC. Comme
illustré sur la figure [5.3](#fig-5-3), notre diagramme de conception débute
les contraintes imposées par l'utilisateur. On distingue trois types de
contraintes:

- Les contraintes de conception du NoC, décrivant l'espace de conception de
  départ, i.e. type de topologie (fixe ou variable), les types de routeurs
  disponibles, les types de connexions disponibles, etc.;
- Les paramètres de simulation, définissant l'environnement d'exécution dans
  lequel seront évalués les NoC. Dans notre cas, cela correspond exclusivement
  aux paramètres de trafic, e.g. type de trafic, taux d'injection;
- La définition de la fonction de récompense. Ou exprimé différemment, les
  métriques de NoC à optimiser, e.g. seuil de saturation, puissance consommée.

À partir de ces contraintes, une base de données est construite. Deux étapes
sont nécessaires pour produire une base de données. Premièrement, un ensemble
de NoC doit être défini en fonction des contraintes de conception. Puis cet
ensemble de NoC est évalué via le simulateur, selon les contraintes de
simulations imposées par l'utilisateur. Ainsi, un élément de la base de donnée
comprend une description d'une architecture de NoC, plus ses résultats de
simulation. De plus, on note qu'une base de données correspond à un ensemble de
contraintes utilisateurs. Si ces dernières sont modifiées, un nouveau dataset
devra être généré.

### 5.3.3 Le RWGAN pour de la génération optimisée

<a id="fig-5-4"></a>

![Schéma du Reward-Wasserstein GAN et la fonction de perte du générateur.](../../assets/figures/thesis/ch05/fig-5-4.svg)

**Fig. 5.4** : Schéma du Reward-Wasserstein GAN et la fonction de perte du
générateur $f\left(Y,W\right)$.

Le GAN utilisé ici étend le principe des WGAN évoqué en section
[2.5.3](02-research-axes.md#253-cao-et-ia-générative). Comme illustré sur
la figure [5.4](#fig-5-4), l'architecture de GAN proposée consiste en un
ensemble de trois réseaux de neurones (contre deux pour un GAN classique): un
*générateur* $G$, un *critique* $C$ et un *reward* $R$. Les deux premiers sont
les blocs basiques du WGAN. Le bloc reward a pour objectif d'évaluer les
propriétés d'un NoC donné.

Le réseau reward $R$ est entraîné indépendamment et en amont de l'entraînement
du WGAN ($G \cup C$) pour estimer une fonction de récompense. Il est ensuite
utilisé dans l'entraînement du WGAN pour guider l'apprentissage du générateur.
Cette méthode d'apprentissage du générateur est décrite sur la figure
[5.4](#fig-5-4). L'architecture finale, i.e. $G \cup C \cup R$, est appelée
Reward-WGAN (RWGAN).

**Le réseau Générateur** Le générateur prend en entrée un élément de l'ensemble
$Z$, correspondant à un espace aléatoire. Il génère en sortie une description
de NoC. Cette description doit correspondre, après apprentissage, aux critères
utilisateurs évoqués précédemment: les contraintes de conception avec les
métriques optimisées. Le premier critère est appris via l'apprentissage du GAN
basique. Le second est appris via la prise en compte de la sortie du reward
dans l'apprentissage du générateur. En effet, le générateur apprends à
maximiser la sortie du reward (i.e. $W$) qui correspond à la valeur de la
fonction de récompense estimée pour les NoC générés.

La nouvelle fonction de perte (*loss*) du générateur ainsi obtenue est formulée
dans l'équation [5.1](#eq-5-1).

<a id="eq-5-1"></a>

$$
L_G(z_i) = (1-\lambda) L_C(G(z_i)) + \lambda [\beta L_R(G(z_i))]
\tag{5.1}
$$

où $G$ désigne le générateur, $z_i$ représente un élément de l'espace aléatoire
$Z$, $\lambda$ est le ratio entre la perte venant du reward ($L_R$) et celle
venant du critique ($L_C$), et $\beta$ est un coefficient permettant
d'équilibrer les deux pertes, en complément de $\lambda$. En effet, alors que
la fonction de perte du critique n'est en théorie pas bornée, celle du reward
est limitée. D'où le besoin d'un coefficient supplémentaire devant être modifié
selon la façon dont converge les valeurs de *loss* du critique. Ainsi, la
fonction de perte du générateur est une combinaison linéaire des pertes venant
de la sortie du critique et de la sortie du reward (i.e. $f\left(Y,W\right)$
sur la figure [5.4](#fig-5-4)). Pour lisser la transition de l'entraînement
depuis un l'apprentissage des caractéristiques globales de NoC vers les
caractéristique spécifiques désirées, le coefficient de combinaison linéaire
$\lambda$ initialement à 0 est progressivement incrémenté durant
l'entraînement, jusqu'à atteindre la proportion souhaité e.g. 0.9 pour une
fonction de perte correspondant à 90% à celle du reward, et 10% à celle du
critique. Il est important de garder une proportion non négligeable de la perte
liée au critique pour préserver l'apprentissage des caractéristiques de base
d'un NoC.

**Le réseau Critique** La fonction de perte du critique est identique à celle
présentée dans [2.5.3](02-research-axes.md#253-cao-et-ia-générative) pour
le *WGAN-GP* (voir l'équation
[2.2](02-research-axes.md#eq-2-2)). L'architecture du critique dépendra de
son utilisation. Plus de détails seront apportés dans la prochaine section où
les différentes expérimentations menées sont décrites.

**Le réseau Reward** Le réseau reward possède la même architecture que le
réseau critique. Il est utilisé pour guider le générateur durant son
entraînement. En effet, alors que le critique assiste le générateur dans son
apprentissage des caractéristiques générales de représentation d'un NoC, pour
produire des données valides, le reward va préciser cet entraînement pour
induire des propriétés spécifiques aux NoC générés. Ces propriétés spécifiques
correspondent à la fonction de récompense.

## 5.4 Preuve de concept

Nous proposons ici de tester notre framework pour l'étude spécifique de
topologies irrégulières de NoC à 9 routeurs.

Nous décrivons dans un premier temps le cadre d'expérimentation. Ensuite, nous
analysons les NoC générés.

### 5.4.1 Simulateur utilisé

Ici, nous utilisons Ratatoskr [\[81\]](references.md#ref-81) pour évaluer les
performances de NoC en fonction du trafic considéré. Ratatoskr a été créé par
J.M. Joseph *et al.*. C'est un simulateur de NoC de type *cycle-accurate*, à la
fois rapide et flexible, permettant d'évaluer les performances de NoC avec un
niveau de précision similaire à l'état-de-l'art
[\[39\]](references.md#ref-39). C'est un projet open-sources qui donne la
possibilité de mener différentes simulations de NoC, adaptées aux besoins
utilisateurs via les paramètres de configurations disponibles. Entre autres, il
est très simple de modifier la topologie d'un NoC, et certaines propriétés
d'architecture (e.g. taille des buffers, nombre de VC (virtual channel), etc.).
Différents trafics sont déjà implémentés par les auteurs, tels que les trafics
*uniforme* et *hotspot*, et il est aussi possible d'injecter des traces
d'exécution pré-enregistrées. De plus, le taux d'injection est modifiable, ce
qui élargit le champ des possibles.

C'est donc cette grandes diversité de simulations possibles, alliée à la
rapidité du simulateur qui nous a poussé à l'utiliser (environ 5s pour une
simulation de 100k cycles d'un mesh $3$x$3$ soumis à un trafic uniforme, avec
un taux d'injection de 10% et un routage XY, sur un Intel E3-1225 à 3.2 GHz).

#### 5.4.1.1 Paramètres du NoC

Dans ce paragraphe, nous listons les paramètres globaux de NoC fixé pour les
simulations Ratatoskr. Nous utilisons uniquement les mesures de performances
produites par Ratatoskr, ce qui ne requiert aucune information sur la
technologie utilisée (c'est cependant nécessaire pour les estimations de
puissance et surface). Ratatoskr utilise la méthode de commutation de paquets
par *wormhole*. Ici, nous simulons des NoC avec des paquets de 32 *flits*, des
buffers de 4 *flits* de type FIFO, une seule VC et pour une horloge de 1 GHz.

#### 5.4.1.2 Technique de routage

Pour évaluer nos NoC, il nous faut définir un algorithme de routage
particulier. En effet, comme nous considérons un ensemble important de
topologies irrégulières, il nous faut définir dans Ratatoskr un routage
universel permettant de router toutes les topologies. Ainsi, nous implémentons
la méthode de routage proposée par J.C. Sancho *et al.*
[\[150\]](references.md#ref-150). Cette méthode produit un routage statique
(i.e. table de routage), efficace et sans risques d'inter-blocage. Dans nos
expériences, nous considérons le routage comme une contrainte et non comme un
paramètre. De ce fait, nous avons choisi cette méthode pour sa simplicité
d'implémentation et l'efficacité de son routage universel. Ainsi, on exploite
le fait d'utiliser un simulateur pour se reposer sur une méthode à base de
tables de routage. De futures recherches pourront s'intéresser à des méthodes
de routage plus complexes telles que la réduction de tables ou les techniques
de routage algorithmique.

### 5.4.2 Bases de données

La base de données que nous utilisons pour entraîner notre modèle de GAN est un
ensemble de matrices d'adjacence de topologies de NoC correspondant aux
critères suivants: i) les connexions du NoC forment un chemin entre chaque
paire de routeurs, i.e. un ensemble connecté de liens définis par une paire de
routeurs; ii) chaque routeur $r$ doit posséder strictement moins de cinq
connexions dans un ensemble $C$ de toutes les connexions d'un NoC, i.e.
$degree(r, C) \leq 4$; et iii) toutes les connexions sont bidirectionnelles.
L'algorithme [5.1](#algo-5-1) décrit une procédure simple pour générer la
matrice d'adjacence M d'un NoC.

<a id="algo-5-1"></a>

```
Input:  nR the number of routers, nC the desired number of connections,
        P the set of all possible NoC connections c=[r0,r1] where r0 and r1
        are routers, MaxTry the maximum number of consecutive unsuccessful
        constructions of a connected set C.
Output: The adjacency matrix M of the NoC to create.

 1  C <- { }                        %initially empty set of NoC connections%
 2  try <- 1                        %first try%
 3  while True do
 4      for nC iterations do
 5          if exists c=[r0,r1] in P, such that (degree(r0, C) < 4)
                                       and (degree(r1, C) < 4) then
 6              select c
 7              add c to C          %this increases the degrees of both r0
                                     and r1 by 1 in the set C%
 8          else goto line 13       %restart the procedure%
 9      if C is connected then
10          Create M from the set of connections C
11          return M
12      else
13          try++
14          if try < MaxTry then
15              C <- { }
16          else return
```

**Algorithme 5.1** : Création de la matrice d'adjacence M d'un NoC

Nous mettons en œuvre cet algorithme en Python. Le choix de concevoir une base
de données homogène suivant le nombre de connexions présentes dans un NoC vient
du fait que la topologie du NoC est connue comme le premier facteur jouant sur
la latence, confirmé par notre analyse du trafic uniforme. Chaque NoC de la
base de données est simulé avec Ratatoskr pour récupérer ses performances (i.e.
latence), et la base de données finale se constitue d'une liste de NoC avec
leur nombre de connexions et de leur latence moyenne. Ainsi, une base de
données correspond à un trafic particulier.

### 5.4.3 Résultats

Dans cette section, nous présentons différents résultats obtenus illustrant les
performances de notre framework à générer des topologies de NoC adaptées avec
des caractéristiques particulières.

#### 5.4.3.1 Base de données d'entraînement

Notre base de données d'entraînement du GAN consiste en un ensemble de NoC à 9
routeurs. Ces NoC possèdent entre 8 et 18 connexions, avec 10000 topologies
uniques pour chaque classe (i.e. nombre de connexions). Ainsi, la base de
données est homogène selon cette caractéristique. Les données de performance
sont obtenues pour un trafic uniforme avec un taux d'injection de 10%.

Pour cette preuve de concept, nous proposons d'entraîner le reward à évaluer le
nombre de connexions présentes dans une topologie donnée. En effet, comme
montré précédemment dans la section
[5.2](#52-noc-topologie-et-performances), sous un trafic uniforme, la latence
d'un NoC est directement corrélée au nombre de connexions. Ainsi, la fonction
de récompense estimée par le reward est une fonction qui, pour une matrice
d'adjacence donnée, sort une valeur de récompense correspondant au nombre de
connexions.

#### 5.4.3.2 Architecture des réseaux de neurones

On construit un WGAN et notre RWGAN à partir des mêmes blocs, dont les détails
de dimensionnement sont donnés dans le tableau [5.1](#tab-5-1). Le générateur
est un MLP (*Multi-Layer Perceptron*, i.e. réseau dense) à 2 couches cachées.
La couche de sortie est ensuite réorganisée pour correspondre au format 2D des
matrices à générer (ici, des matrices $9$x$9$). Il prend en entrée un vecteur
aléatoire de 100 unités. Le critique et le reward sont chacun composés de 3
couches cachées dont la fonction d'activation est LeakyReLU avec un coefficient
de pente de $0.2$ pour les valeurs négatives. Les premières et secondes couches
sont de type CNN. La troisième couche et la couche de sortie sont des couches
denses.

<a id="tab-5-1"></a>

**Tableau 5.1** : Dimensionnement du RWGAN.

> Rendered as two tables; the printed thesis shows them side by side (Table 5.1).

**Générateur**

| Couches: | Entrée | L1 | L2 | Sortie |
|:--|:--:|:--:|:--:|:--:|
| Type | Input | Dense | Dense | Dense |
| Dimensions | 100 | 162 | 162 | 81 |
| Fonction d'activation | *–* | *tanh* | *tanh* | *tanh* |

**Critique & Reward**

| Couches: | Entrée | L1 | L2 | L3 | Sortie |
|:--|:--:|:--:|:--:|:--:|:--:|
| Type | Input | CNN | CNN | Dense | Dense |
| Dimensions | 81<br>format: 9x9 | 64<br>filtre: 9x9<br>pas: 1 | 128<br>filtre: 3x3<br>pas: 2 | 512 | 1 |
| Fonction d'activation | *–* | *LeakyReLU<br>($\alpha = 0.2$)* | *LeakyReLU<br>($\alpha = 0.2$)* | *LeakyReLU<br>($\alpha = 0.2$)* | *LeakyReLU<br>($\alpha = 0.2$)* |

Les dimensions des réseaux sont déterminées expérimentalement. Une méthode
d'optimisation (e.g. exploration des hyper-paramètres) pourra faire l'objet de
futurs travaux pour un paramétrage plus fin de notre RWGAN. L'entraînement
utilise l'optimiseur RMSprop avec $5\times10^{-5}$ comme coefficient
d'apprentissage, recommandé dans [\[70\]](references.md#ref-70). Les réseaux de
neurones sont implémentés en Python, à l'aide de la bibliothèque Keras
[\[44\]](references.md#ref-44) basée sur Tensorflow
[\[2\]](references.md#ref-2).

#### 5.4.3.3 WGAN

Nous nous concentrons dans un premier temps sur l'entraînement du WGAN seul
(sans reward). L'entraînement global converge correctement. En effet, une fois
entraîné le générateur est capable de créer des topologies de NoC possédant les
caractéristiques de base (nombre de routeurs, degrés maximum, graphe connecté)
dans jusqu'à 82% des cas.

<a id="fig-5-5"></a>

| <a id="fig-5-5a"></a>(a) Comparaison selon le nombre de connexions. | <a id="fig-5-5b"></a>(b) Comparaison selon la distance moyenne entre les routeurs |
|:--:|:--:|
| ![Comparaison selon le nombre de connexions.](../../assets/figures/thesis/ch05/fig-5-5a.svg) | ![Comparaison selon la distance moyenne entre les routeurs](../../assets/figures/thesis/ch05/fig-5-5b.svg) |

**Fig. 5.5** : Comparaisons entre le dataset d'origine et des échantillons
générés par le WGAN. Les valeurs de latence sont évaluées pour un trafic
uniforme à 10% de taux d'injection.

La figure [5.5](#fig-5-5) présente une comparaison entre la base de données
d'entraînement, et un ensemble de NoC produits par le générateur entraîné.
Toutes les topologies générées sont uniques, ce qui met en exergue les
capacités de création du générateur. On voit que la distribution des latences
des NoC générés est similaire à celle de la base de données d'entraînement,
aussi bien en fonction du nombre de connexions (i.e. Figure
[5.5a](#fig-5-5a)) que de la distance moyenne entre les routeurs (i.e. Figure
[5.5b](#fig-5-5b)). Ainsi, on peut en conclure que le générateur apprend
correctement les caractéristiques de base des NoC à partir du dataset.

Néanmoins, on remarque que le générateur a des difficultés à produire des
topologies de NoC ayant un nombre extrême de connexions i.e. 8 et 18. C'est
directement causé par le processus d'apprentissage. En effet, durant
l'entraînement, le générateur va apprendre à générer des données ayant une plus
grande probabilité d'appartenir à l'espace des données d'entraînement. Cela le
fait donc converger vers la tendance moyenne du dataset. Or, comme cet espace
de données est homogène en nombre de connexions, la moyenne se trouve aux
alentours de 13 connexions. Ajouté à cela, les topologies générées avec un plus
grand nombre de connexions ont plus de chances de ne pas correspondre à la
contrainte d'être de degrés quatre maximum. D'où la faible proportion de NoC
générés avec 18 connexions. À l'inverse, une topologie générée avec 8
connexions a de forte chance de ne pas être connectée. D'où le peu de NoC à 8
connexions.

**Résumé:** le WGAN est capable d'apprendre à générer des topologies de NoC
possédant les caractéristiques générales. Il génère jusqu'à 82% de topologies
valides. Toutes les topologies générées sont uniques i.e. ne sont pas présentes
dans la base de données d'entraînement.

#### 5.4.3.4 RWGAN

<a id="fig-5-6"></a>

![Impact du reward sur l'apprentissage du RWGAN.](../../assets/figures/thesis/ch05/fig-5-6.svg)

**Fig. 5.6** : Impact du reward sur l'apprentissage du RWGAN.

Comme nous avons pu le remarquer section
[5.2](#52-noc-topologie-et-performances), sous un trafic uniforme les
meilleures performances sont directement liées au nombre de connexions i.e. NoC
densément connecté. À l'aide de notre réseau Reward, nous entraînons le
générateur à produire des topologies possédant un nombre élevé de connexions.
De ce fait, les topologies générées par le RWGAN devraient présenter en moyenne
de meilleures performances que celles générées par le WGAN, i.e. moyenne du
dataset d'entraînement.

Les expérimentations menées sur notre architecture RWGAN comportent trois
phases: (1) le réseau reward est entraîné à part pour prédire le score – ici le
nombre de connexions – d'une topologie de NoC donnée en entrée i.e. matrice
d'adjacence. (2) le RWGAN est entraîné sans le reward (i.e. $\lambda = 0$), de
la façon qu'un WGAN classique, jusqu'à ce que l'entraînement se stabilise. Cela
permet au générateur d'apprendre en premier les caractéristiques basiques des
NoC, via le feedback du critique. (3) la sortie du reward est progressivement
incluse dans la boucle d'entraînement du générateur (voire Eq.
[5.1](#eq-5-1)). Il est important d'insister sur le fait que le reward n'est
alors plus entraîné depuis la fin de l'étape (1). Sur la figure
[5.6](#fig-5-6) est illustré l'impact du reward sur l'entraînement du
générateur (étape (2) à (3)). La phase (2) correspond à la période entre les
époques 0 et 100, et la phase (3) démarre à l'époque 101 et se prolonge jusqu'à
la fin de l'entraînement (époque 250). Durant cette période (3), la répartition
entre le retour du critique et celui du reward vers le générateur est
progressivement modifiée pour passer de 0% et 100% (respectivement les
proportions du reward et du critique), à 90% et 10%. Ainsi, pour une même
entrée, le générateur apprend à augmenter le nombre de connexions au fur et à
mesure que le reward est inclus dans la boucle d'apprentissage.

<a id="fig-5-7"></a>

![WGAN vs. RWGAN. Comparaison de la distribution des topologies de NoC générées.](../../assets/figures/thesis/ch05/fig-5-7.svg)

**Fig. 5.7** : WGAN vs. RWGAN. Comparaison de la distribution des topologies de
NoC générées, selon le nombre de connexions (haut) et la latence moyenne des
paquets (bas).

Sur la figure [5.7](#fig-5-7), nous comparons les topologies de NoC générées
par le WGAN entraîné seul i.e. sans reward, et le RWGAN, après un apprentissage
de 250 époques. Dans un premier temps, nous analysons le nombre de connexions.
Comme attendu, le nombre moyen de connexions est augmenté de 36% (de 11 à 15),
ce qui représente une augmentation de 36% par rapport aux possibilités min/max
(entre 8 et 18). Ensuite, les distributions de la latence sont comparées sur le
graphique du bas de la figure [5.7](#fig-5-7). La latence moyenne de
transmission des paquets est diminuée pour passer de 45.4ns à 43.3ns.
Normalisée en fonction de l'ensemble des latences possibles (de 40ns à 54ns
environ), la latence moyenne est réduite de 0.38 à 0.24, ce qui représente une
amélioration de 37% de la latence moyenne.

Nous étudions maintenant les courbes de saturation des NoC générés, pour un
trafic uniforme, et pour la latence des paquets. Ces courbes sont obtenues via
des simulations Ratatoskr, en parcourant un ensemble de taux d'injection
jusqu'à atteindre le seuil de saturation.

<a id="fig-5-8"></a>

![Courbes de saturation des NoC générés par le RWGAN et de topologies classiques.](../../assets/figures/thesis/ch05/fig-5-8.svg)

**Fig. 5.8** : Courbes de saturation des NoC générés par le RWGAN et de
topologies classiques. Les NoC générés sont répartis en trois groupes selon
leur nombre de connexions: 11, 15 et 16 connexions.

Tout d'abord, sur la figure [5.8](#fig-5-8), nous comparons les performances de
trois classes de NoC. Ces classes se différencient par leur valeur de fonction
de récompense, ici le nombre de connexions. Ainsi, pour chaque classe nous
traçons cinq courbes de saturation correspondant à différents NoC générés. Les
trois classes sont respectivement pour des NoC de 11 connexions (noir), 15
connexions (bleu) et 16 connexions (rouge). Pour comparer avec des topologies
régulières existantes, nous traçons également les courbes de saturation d'un
*ring*, *mesh* et *torus* de 9 routeurs (respectivement 9, 12 et 18
connexions). On peut observer que les NoC avec un nombre plus élevé de
connexions ont des performances globalement meilleures, bien que de
significatives superpositions existent. En effet, on constate un NoC à 11
connexions possédant un seuil de saturation plus élevé qu'un NoC à 15
connexions. De même, un NoC à 15 connexions est plus performant qu'un NoC à 16
connexions et le *torus* à 18 connexions possède des performances similaires à
un NoC à 16 connexions. Cela met en avant le fait que le nombre de connexions
n'est pas le seul facteur de performance. Cela suggère également qu'un reward
entraîné pour approximer une fonction de récompense plus fine (e.g. latence)
peut permettre de produire des NoC aux performances optimisées. Par exemple, le
générateur pourrait produire des NoC ayant des latences plus faibles, mais pour
un nombre de connexions similaire.

<a id="fig-5-9"></a>

![Courbes de saturation des NoC générés par le RWGAN (rouge) et le WGAN (noir).](../../assets/figures/thesis/ch05/fig-5-9.svg)

**Fig. 5.9** : Courbes de saturation des NoC générés par le RWGAN (rouge) et le
WGAN (noir), après un entraînement de 250 époques training.

Enfin, sur la figure [5.9](#fig-5-9), nous proposons de comparer les résultats
de saturation de topologies de NoC générées par le WGAN (i.e. courbes noires)
et le RWGAN (i.e. courbes rouges) après un entraînement de 250 époques. Ces
courbes sont obtenues en donnant au WGAN et RWGAN les mêmes 5 entrées. Sur la
figure [5.9](#fig-5-9), un type de marqueur dénote une entrée particulière. Les
topologies ainsi générées sont ensuite simulées avec Ratatoskr, donnant les
résultats tracés.

À partir de ces résultats, on peut voir que, malgré des entrées identiques, les
générateurs produisent des topologies de NoC aux performances et nombre de
connexions différentes. En particulier, les sorties du RWGAN ont de meilleures
performances que celles du WGAN. Cela illustre bien l'efficacité du reward. De
plus, on remarque une plus grande disparité dans les NoC générés par le WGAN,
venant de l'entraînement global qui conduit le générateur à reproduire l'espace
des données d'apprentissage.

**Résultats:** L'architecture de GAN proposée montre des améliorations
significatives des NoC générés. Bien que le nombre de générations valides soit
réduit par l'utilisation du reward, ce dernier permet d'augmenter la qualité
des topologies générées en termes de performances souhaitées (i.e. fonction de
récompense, ici le nombre de connexions). En effet, comme le générateur apprend
à augmenter le nombre de connexions, cela détériore ses capacités à respecter
la contrainte principale qui est d'avoir des NoC avec un degré maximum de 4.
Ainsi, on a une probabilité de 54% d'obtenir une topologie valide (contre 82%
sans le reward i.e. WGAN seul). Cependant, nous obtenons une amélioration de
36% relative à la fonction de récompense considérée i.e. nombre de connexions.
Cette amélioration significative démontre les facultés du reward à guider
l'apprentissage du générateur vers la génération de topologies de NoC possédant
les caractéristiques souhaitées.

## 5.5 Résumé

Pour conclure ce chapitre, nous avons proposé d'utiliser les GAN pour réaliser
une réduction d'espace de conception vers un ensemble de données optimisées.
Une architecture particulière de GAN permettant de générer ces données est
présentée. Cette architecture appelée RWGAN permet ainsi de produire des
topologies de NoC optimisées. Nous avons illustré cette utilisation pour la
création de NoC possédant un nombre élevé de connexions. La suite de ce travail
consiste à implémenter une fonction de récompense moins évidente que le nombre
de connexions, telle que la latence du réseau ou encore l'efficacité
énergétique du NoC.

Dans le chapitre suivant, nous explorerons une autre façon d'améliorer la
conception de NoC, en adressant le problème de la génération de NoC
hétérogènes. Une amélioration du RWGAN est proposée, permettant à l'utilisateur
d'implémenter autant de fonctions de récompense que souhaité, via une multitude
de blocs reward. Cette nouvelle architecture est nommée M-RWGAN pour
*Multi-Reward Wasserstein GAN*.
