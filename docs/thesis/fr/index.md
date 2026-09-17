---
title: Manuscrit
lang: fr
---

# Techniques d'apprentissage pour le contrôle adaptatif multi-niveaux du calcul distribué

<div class="lang-switch" markdown>
[English](../index.md){ .lang-pill title="This chapter in English" }
<span class="lang-pill is-current">Français</span>
</div>

<div class="thesis-panel" markdown>
Le manuscrit est disponible ici dans ses deux éditions. Le texte français est
l'original ; l'anglais en est traduit. Le sélecteur ci-dessus est présent sur
chaque page.

Ces chapitres sont une copie, convertie depuis le manuscrit LaTeX et maintenue
dans un dépôt séparé. Le manuscrit tel que déposé est le
[PDF sur HAL](https://hal-lirmm.ccsd.cnrs.fr/tel-03480748v2).
</div>

**Maxime Mirka** , thèse de doctorat, Université de Montpellier, soutenue le
12 novembre 2021.

Cette édition présente le manuscrit intégral en deux langues. La version
française ci-dessous est une conversion fidèle des sources LaTeX originales ;
la [version anglaise](../index.md) en est traduite, en s'appuyant sur les formulations
de l'auteur dans les quatre articles issus de ces travaux.

**Pour commencer :** [Résumé](abstract.md) · [Chapitres](#chapitres) · [Références](references.md) · [Glossaire](glossary.md)

## Chapitres

| # | Chapitre | Code |
|---|---|---|
| 1 | [Introduction](01-introduction.md) | |
| 2 | [Axes de recherche et problèmes adressés](02-research-axes.md) | |
| 3 | [État de l'art](03-state-of-the-art.md) | |
| 4 | [Efficacité énergétique des calculs parallélisés OpenMP](04-openmp-energy-efficiency.md) | |
| 5 | [Optimisation des topologies de réseaux de communication sur puce](05-gannoc.md) | [GANNoC](https://github.com/mmirka/GANNoC) |
| 6 | [Génération de réseaux sur puce hétérogènes optimisés](06-m-rwgan.md) | [m-rwgan](https://github.com/mmirka/m-rwgan) |
| 7 | [Conclusion et perspectives](07-conclusion.md) | |

## Les deux axes de recherche

L'optimisation de l'efficacité énergétique des systèmes de calcul fait
intervenir un nombre de paramètres trop grand pour être exploré de façon
exhaustive. La thèse applique les réseaux de neurones à ce problème sur deux
niveaux, correspondant aux deux axes de recherche.

Le **premier axe** porte sur le contrôle dynamique. Il introduit deux métriques
mesurées directement dans l'environnement d'exécution OpenMP , i.e. les Chunks par
Seconde (CpS) et les Chunks par Joule (CpJ), sans profilage préalable ni
annotation de code, puis les exploite pour piloter une application parallèle
par apprentissage par renforcement.

Le **second axe** porte sur la conception matérielle. Il formule la génération
de réseaux sur puce comme un problème de génération de graphes et entraîne des
réseaux antagonistes génératifs à produire des topologies et des configurations
de routeurs hétérogènes optimisées selon les critères du concepteur. D'où
**GANNoC** et son RWGAN guidé par reward (chapitre 5), puis le **M-RWGAN**
multi-objectif (chapitre 6).

## Publications

Ces travaux ont donné lieu à quatre articles en anglais, tous en accès libre
sur HAL :

- **A Generative AI for Heterogeneous Network-on-Chip Design Space Pruning**,
  DATE 2022. <https://hal-lirmm.ccsd.cnrs.fr/lirmm-03475912v1>
- **GANNoC: A Framework for Automatic Generation of NoC Topologies using
  Generative Adversarial Networks**, RAPIDO 2021.
  <https://hal-lirmm.ccsd.cnrs.fr/lirmm-03107918v2>
- **Online Learning for Dynamic Control of OpenMP Workloads**, MOCAST 2020.
  <https://hal.science/hal-02565961v1>
- **Automatic Energy-Efficiency Monitoring of OpenMP Workloads**, ReCoSoC 2019.
  <https://hal-lirmm.ccsd.cnrs.fr/lirmm-02183901v1>

ainsi qu'à un poster :

- **Energy-Efficiency Metric for Real-Time Monitoring of OpenMP Programs
  Executing on Multicore Systems**, 13e Colloque National du GDR SoC²,
  Montpellier, juin 2019. <https://hal-lirmm.ccsd.cnrs.fr/lirmm-03326276v2>

Le manuscrit : <https://hal-lirmm.ccsd.cnrs.fr/tel-03480748v2>

## À propos de cette édition

Les numéros de figures, de tableaux et d'équations sont ceux du manuscrit
imprimé, et les 176 références conservent leur numérotation d'origine : tout ce
qui figure ici peut donc être cité par rapport au PDF. Voir le
[glossaire](glossary.md) pour la terminologie français–anglais et la source
retenue pour chaque terme.
