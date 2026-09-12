---
title: Conclusion et perspectives
chapter: 7
lang: fr
source: Chapitre6/Conclusion.tex
---

# 7. Conclusion et perspectives

<div class="lang-switch" markdown>
[English](../07-conclusion.md){ .lang-pill title="This chapter in English" }
<span class="lang-pill is-current">Français</span>
</div>

## 7.1 Conclusion générale

L'efficacité énergétique est le nouveau moteur guidant l'amélioration des
systèmes de calcul. En effet, après une longue période d'amélioration des
performances, la prise en compte des dépenses énergétiques s'est ajoutée aux
critères d'amélioration des calculateurs. Avec le développement de systèmes de
calcul de plus en plus complexes – i.e. multi-coeurs, many-coeurs, hétérogènes,
etc. – on parle désormais de calcul distribué et/ou parallèle, en référence aux
multiples ressources de calcul disponibles. Ainsi, pour optimiser le calcul
parallèle, il est nécessaire d'optimiser d'une part le support matériel
exécutant les tâches, mais aussi la façon dont le calcul sera réparti parmi les
ressources. L'essor des techniques d'apprentissage automatique a permis
d'apporter des solutions toujours plus performantes dans un grand nombre de
domaines. Alors que le contrôle et la conception de systèmes de calcul efficaces
énergétiquement sont des tâches de plus en plus complexes au regard du nombre
croissant de paramètres à prendre en compte, l'usage de l'IA s'avère prometteur.
Cette thèse avait donc pour but d'explorer les techniques d'apprentissage pour
apporter des solutions aux problématiques du calcul parallèle.

Dans un premier temps, nous avons tenté d'adresser le problème du contrôle
adaptatif multi-niveaux du calcul parallèle, pour l'optimisation de l'efficacité
énergétique du système exécutant le calcul. Une analyse de la littérature nous a
tout d'abord permis de recenser les métriques et les outils existants pour
connaître l'efficacité énergétique de l'exécution d'une tâche sur un système de
calcul. Nous avons remarqué un manque de solutions proches du niveau d'exécution
des applications, ne dépendant pas des compteurs matériels propres à chaque
système. De plus, peu de travaux adressaient en particulier les applications
parallélisées avec OpenMP qui pourtant est le modèle de programmation parallèle
le plus utilisé. Ensuite, nous nous sommes intéressés aux méthodes de contrôle
existantes. L'étude de l'état de l'art a permis d'identifier les techniques
d'apprentissage par renforcement comme les plus efficaces pour l'apprentissage
et le contrôle dynamique. Bien que les solutions proposées adressent différents
paramètres clés dans l'efficacité énergétique, tels que le DVFS et DPM ou encore
le mapping, peu de solutions adressent l'optimisation de plusieurs de ces
leviers à la fois.

Ainsi, notre travail s'est porté sur la formalisation d'une métrique collectée
au niveau du runtime OpenMP. Cette solution a pour avantage de ne pas dépendre
des compteurs matériels propres à chaque système de calcul et de bénéficier de
la portabilité d'OpenMP. De ce fait, notre métrique, appelée CpJ, permet un
suivi en temps réel de l'efficacité énergétique d'une application OpenMP, et
peut être utilisée sur tout système supportant OpenMP. Cette métrique nous a
ensuite permis de créer un système de contrôle basé directement sur
l'efficacité énergétique. Ce contrôle repose sur un apprentissage par
renforcement ne nécessitant aucun entraînement avant utilisation. Ce système a
été évalué pour des applications statiques, sur un benchmark synthétique
montrant un potentiel d'amélioration de l'efficacité énergétique allant jusqu'à
469% selon le type de workload exécuté et jusqu'à 17% pour l'application DGEMM,
comparé aux gouverneurs Linux. Ensuite, afin de prendre en compte les phases
d'exécution d'une application, un outil basé sur le principe des auto-encodeurs
a été développé. Grâce à cette notion supplémentaire de phase d'exécution, le
contrôle dynamique implémenté permet d'adapter les paramètres du système de
calcul aux phases de fonctionnement de l'application considérée. Les premiers
tests sur une application synthétique à deux phases montrent un gain de 50%
comparé au gouverneur *ondemand* de Linux. Ces résultats très positifs montrent
le potentiel de l'IA pour résoudre des problèmes complexes améliorant
l'efficacité énergétique de nos systèmes de calcul. Cependant, les résultats
proposés dans cette thèse sont insuffisants pour valider une utilisation sur des
applications réelles. En effet, une grande partie des résultats reposent sur une
suite de benchmarks synthétiques. De plus, les résultats sur applications
réelles sont mitigés, avec un contrôle efficace montrant des gains positifs sur
l'application statique DGEMM, et des résultats moyens sur l'application SRAD.
Cette analyse est donc à mener dans de prochains travaux. Ensuite, la définition
des actions de l'apprentissage par renforcement semble sous-optimale. En effet,
bien que l'utilisation de l'auto-encodeur permette d'obtenir une notion de phase
en entrée du contrôleur, une formulation plus minutieuse de notre problème en
problème d'apprentissage par renforcement devrait permettre de ne pas nécessiter
une détection de phase complémentaire.

Après s'être intéressé à l'optimisation en-ligne du calcul parallèle via la
proposition d'un contrôle dynamique, nous nous sommes intéressés à
l'optimisation de la conception du matériel exécutant le calcul. Notre étude
s'est rapidement dirigée vers les SoC, particulièrement sensibles aux dépenses
énergétiques, en témoigne leur utilisation en tant que systèmes embarqués. De
plus, les SoC sont généralement utilisés pour des applications spécifiques, et
non pour un usage généraliste. Ainsi, les perspectives d'optimisation sont
vastes puisque dépendantes de l'usage.

Un premier constat sur les dépenses énergétiques des SoC nous a permis de cibler
l'optimisation des réseaux sur puce, appelés NoC. Depuis leur apparition, les
NoC se sont imposés comme le module de communication par défaut des SoC, de par
leur flexibilité et leur facilité d'implémentation. Cependant, ces derniers
représentent une part significative de la consommation énergétique des SoC, en
partie liée à un surdimensionnement comparé aux trafics qui les parcourent.
Ainsi, une optimisation du design des NoC en fonction de leur usage permettrait
de réduire leur consommation énergétique tout en maintenant leurs performances,
ce qui équivaut à améliorer leur efficacité énergétique.

Nous avons adressé ce problème de conception de NoC optimisés via le prisme de
l'espace de conception. Une difficulté majeure qui fait face aux concepteurs de
NoC est le nombre important de paramètres à ajuster. En effet, la topologie du
réseau et les caractéristiques des routeurs sont autant de paramètres à régler,
tout en considérant le type de trafic auquel sera sujet le NoC, et la méthode de
routage. Après une étude de la littérature, nous nous sommes aperçus que les
solutions existantes consistent à générer une seule configuration optimisée. De
plus, ces méthodes se concentrent sur un nombre limité de critères
d'optimisation, et elles ne garantissent pas que le design généré soit le
meilleur possible. Pour remédier à cela, nous avons donc proposé un outil
permettant de réduire l'espace de conception afin de proposer au concepteur de
NoC un sous-espace optimisé des designs de NoC. Ainsi, plutôt que de proposer
directement une configuration de NoC possiblement sous-optimisée, nous générons
un ensemble de solutions afin de faciliter l'analyse d'un expert.

Notre solution repose sur une architecture particulière de GAN. Nous avons
démontré l'utilité de cette méthode sur différentes preuves de concept. En
particulier, nous avons proposé l'architecture de M-RWGAN permettant de générer
une donnée optimisée selon une multitude de critères définis par l'utilisateur.
Alors que cette solution est appliquée à la génération de NoC, il s'avère que le
concept de M-RWGAN est bien plus large et ne se restreint pas aux réseaux sur
puce. Dans notre cas de la génération de NoC, une première application a
consisté à générer avec succès des topologies de NoC optimisées. Bien que
probants, de futurs travaux pourront développer ces résultats. Par la suite,
nous nous sommes intéressés à la génération de NoC hétérogènes et nous avons
obtenu des résultats encourageants, démontrant l'efficacité de notre M-RWGAN.
Cette dernière contribution ouvre en particulier des perspectives pour le
développement de nouveaux outils de CAO. Enfin, l'objectif initial de générer
des NoC complets optimisés n'est pas encore rempli. En effet, un NoC est décrit
par sa topologie et par les éléments qui le composent. Nous avons proposé une
solution pour chacun de ces problèmes (i.e. génération de topologies puis
génération de matrices de caractéristiques), mais il manque une solution hybride
permettant de générer l'ensemble des éléments d'un NoC optimisé. Cela fera
l'objet de futurs travaux.

## 7.2 Perspectives

### 7.2.1 Amélioration du contrôle d'application basée sur l'apprentissage par renforcement

- **Contribution sur l'auto-encodeur:** l'auto-encodeur utilisé pour détecter
  automatiquement les phases d'une application est un outil développé dans le
  premier axe. N'étant qu'un simple outil, il n'a été validé que sur les
  applications à optimiser. Des travaux intéressants pourront être conduits pour
  développer cet outil et pousser sa validation sur un large panel
  d'applications afin d'en déterminer précisément ses points forts et ses
  limites.
- **Extension des résultats de validation:** notre système de contrôle a été
  testé sur deux applications réelles, une monotone (i.e. DGEMM) et une à deux
  phases (i.e. SRAD). Afin d'apporter une validation plus robuste, les résultats
  devront être étendus sur un plus grand nombre d'applications réelles. En
  particulier, il s'est avéré difficile de trouver des benchmarks réels
  multi-phases avec plus de deux phases visibles sur les traces de chunks. À
  cette fin, une suite de benchmarks pseudo-synthétiques pourrait être produite
  à partir d'un ensemble d'applications réelles monotones exécutées
  successivement, donnant un workload final avec plusieurs phases d'exécutions.
- **Extension pour la gestion d'applications concurrentes:** la contribution
  présentée pour le contrôle dynamique d'applications OpenMP n'agit que sur un
  seul workload. Or, les systèmes de calcul exécutent généralement plusieurs
  tâches en même temps. Une amélioration de notre système de contrôle serait de
  considérer plusieurs applications à la fois, et de déterminer le meilleur
  compromis quant à la répartition des ressources.
- **Amélioration de la loi de contrôle:** les capacités de l'apprentissage par
  renforcement sur d'autres cas d'usage suggèrent qu'il serait possible de se
  passer d'un outil de détection de phase en entrée du RL. De futurs travaux
  devront consister à revoir la définition de la loi de contrôle et des actions
  possibles afin de se dispenser de l'utilisation du module de détection de
  phase. Une première piste pourrait se diriger vers une reformulation des
  actions possibles. Avec un nouvel ensemble d'actions, la formule complète de
  la fonction de perte du DQN pourrait être pertinente. Cela permettrait de
  tirer profit de la notion temporelle de ce loss, qui prend en considération
  les actions passées et non uniquement la dernière action.

### 7.2.2 Développement de l'outil M-RWGAN pour la réduction d'espace de conception

- **Génération de graphes complets:** dans ces travaux, le RWGAN et son
  extension en M-RWGAN ont permis de respectivement implémenter des preuves de
  concept pour la production de matrices d'adjacences optimisées, et de matrices
  de caractéristiques optimisées. La suite logique sera de produire, par le
  biais d'une même IA, les deux matrices de description de graphes (i.e. $A$ et
  $X$). Pour cela, la piste des GNN (*Graph Neural Networks*) devra être
  approfondie.
- **Généralisation de l'outil:** Le problème de la réduction de l'espace de
  conception n'est pas un problème spécifique à la conception de NoC. Le concept
  de M-RWGAN pourrait tout d'abord être étendu au domaine des graphes grâce à
  l'utilisation des GNN. Ensuite, on peut généraliser le principe de réduction
  de l'espace de conception à la réduction d'un espace de données. Ainsi,
  l'usage pourrait se diversifier à tout problème nécessitant une réduction d'un
  espace de données.

## 7.3 Publications

### 7.3.1 Publications dans des conférences internationales

- **M. Mirka**, G. Devic, F. Bruguier, G. Sassatelli et A. Gamatié, "Automatic
  Energy-Efficiency Monitoring of OpenMP Workloads," *14th International
  Symposium on Reconfigurable Communication-centric Systems-on-Chip (ReCoSoC)*,
  2019, pp. 43-50, DOI: 10.1109/ReCoSoC48741.2019.9034988, HAL: lirmm-02183901.
  [\[104\]](references.md#ref-104)
- **M. Mirka**, G. Sassatelli et A. Gamatié, "Online Learning for Dynamic
  Control of OpenMP Workloads," *9th International Conference on Modern Circuits
  and Systems Technologies (MOCAST)*, 2020, pp. 1-6, DOI:
  10.1109/MOCAST49295.2020.9200292, HAL: hal-02565961.
  [\[108\]](references.md#ref-108)
- **M. Mirka**, M. France Pillois, G. Sassatelli, et A. Gamatié, "GANNoC: A
  Framework for Automatic Generation of NoC Topologies using Generative
  Adversarial Networks", *In Proceedings of the 2021 Drone Systems Engineering
  and Rapid Simulation and Performance Evaluation: Methods and Tools Proceedings
  (DroneSE and RAPIDO '21)*, 2021, pp. 51–58, DOI:10.1145/3444950.3447283, HAL:
  lirmm-03107918v2. [\[106\]](references.md#ref-106)
- **M. Mirka**, M. France Pillois, G. Sassatelli, et A. Gamatié, "A Generative
  AI for Heterogeneous Network-on-Chip Design Space Pruning," *Design,
  Automation and Test in Europe Conference (DATE)*, 2022, HAL: lirmm-0347591.
  [\[105\]](references.md#ref-105)

### 7.3.2 Poster

- **M. Mirka**, G. Sassatelli et A. Gamatié, "Energy-Efficiency Metric for
  Real-Time Monitoring of OpenMP Programs Executing on Multicore Systems,"
  *13ème Colloque National du GDR SOC²*, 2019, HAL: lirmm-03326276v2.
  [\[107\]](references.md#ref-107)
