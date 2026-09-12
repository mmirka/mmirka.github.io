---
title: Résumé
lang: fr
source: Abstract/abstractFR.tex
---

# Résumé

<div class="lang-switch" markdown>
[English](../abstract.md){ .lang-pill title="This chapter in English" }
<span class="lang-pill is-current">Français</span>
</div>

L’essor des techniques et algorithmes d’apprentissage (i.e. Machine Learning) et
leur utilisation dans des domaines de plus en plus variés montrent des capacités
souvent surprenantes – dans l’interprétation des données d’entrée et la capacité
de construire des représentations abstraites pertinentes (e.g. apprentissage
supervisé), mais aussi dans le contrôle dynamique de systèmes complexes (e.g.
apprentissage par renforcement). L'optimisation de l'efficacité énergétique des
systèmes de calcul est devenue un enjeu majeur. De la conception matérielle au
contrôle logiciel, différents leviers existent pour agir sur l'exécution de
calculs. Nous considérons dans cette thèse l'optimisation du calcul parallèle,
s'exécutant sur des architectures complexes, du processeur multicoeur au cluster
de calcul. Ces systèmes possèdent un nombre de paramètres de conception et de
contrôle important, donnant lieu à un nombre de combinaisons souvent trop large
pour pouvoir être considérées de façon exhaustive.

Ainsi, cette thèse a pour objectif de s'appuyer sur les techniques
d'apprentissage automatique récentes, basées sur les réseaux de neurones, pour
construire des solutions de contrôle et de conception de systèmes de calcul. Ces
techniques peuvent considérer un ensemble significatif de paramètres afin de
proposer des solutions optimales. Les techniques proposées ont vocation à être
multi-niveaux et pourront à ce titre être appliquées à l’échelle d’un système
embarqué ou de ses divers sous-composants mais aussi à l’échelle d'un système
distribué, comme par exemple un cluster de calcul.

Des solutions prometteuses sont proposées selon deux axes de recherche
distincts. Le premier axe s'adresse au contrôle dynamique du calcul parallèle.
Il est question de l'optimisation en temps réel de l'efficacité énergétique d'un
système exécutant une application parallélisée avec OpenMP, à l'aide, entre
autres, d'un apprentissage par renforcement. Le deuxième axe concerne la
conception de réseaux de communication optimisés. En effet, les réseaux de
communication représentent une part non négligeable de la consommation
énergétique des systèmes de calcul. Ainsi nous proposons un outil d'aide à la
conception basé sur une IA générative, pour la génération de réseaux optimisés
selon des critères utilisateurs tels que l'efficacité énergétique.
