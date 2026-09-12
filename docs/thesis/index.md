---
title: Thesis
lang: en
---

# Machine learning for multi-level adaptive control of distributed computing

<div class="lang-switch" markdown>
<span class="lang-pill is-current">English</span>
[Français](fr/index.md){ .lang-pill title="Ce chapitre en français" }
</div>

<div class="thesis-panel" markdown>
Both editions of the manuscript are here, in full. The French text is the
original; the English is translated from it. Use the switch above, on any page.

These chapters are a vendored copy, converted from the LaTeX manuscript and
maintained in a separate repository. The manuscript as submitted is the
[PDF on HAL](https://hal-lirmm.ccsd.cnrs.fr/tel-03480748v2).
</div>

**Maxime Mirka**, PhD thesis, Université de Montpellier, defended 12 November 2021.
Original title: *Techniques d'apprentissage pour le contrôle adaptatif
multi-niveaux du calcul distribué*.

The manuscript was written in French. These pages carry the full text in both
languages: the [French edition](fr/index.md) is a faithful conversion of the original
LaTeX, and the English edition is translated from it, anchored to the author's
own English wording in the four papers this work was published in.

**Start here:** [Abstract](abstract.md) · [Chapters](#chapters) · [References](references.md) · [Glossary](glossary.md)

## Chapters

| # | Chapter | Code |
|---|---|---|
| 1 | [Introduction](01-introduction.md) | |
| 2 | [Research axes and problems addressed](02-research-axes.md) | |
| 3 | [State of the art](03-state-of-the-art.md) | |
| 4 | [Energy efficiency of OpenMP parallel computation](04-openmp-energy-efficiency.md) | |
| 5 | [Optimizing network-on-chip topologies](05-gannoc.md) | [GANNoC](https://github.com/mmirka/GANNoC) |
| 6 | [Generating optimized heterogeneous networks-on-chip](06-m-rwgan.md) | [m-rwgan](https://github.com/mmirka/m-rwgan) |
| 7 | [Conclusion and perspectives](07-conclusion.md) | |

## What the thesis argues

Optimizing the energy efficiency of computing systems is a design problem with
too many parameters to search exhaustively. The thesis applies neural-network
learning to that problem at two levels, which is what the two research axes are.

The **first axis** is dynamic control. It introduces two runtime metrics
(Chunks per Second, CpS, and Chunks per Joule, CpJ) measured inside the OpenMP
runtime itself, with no prior profiling and no code annotation, and uses them to
drive reinforcement-learning control of a running parallel application.

The **second axis** is hardware design. It treats network-on-chip generation as
a graph-generation problem and trains generative adversarial networks to produce
topologies and heterogeneous router configurations optimized against criteria
the designer chooses. That gives **GANNoC** and its reward-guided RWGAN
(chapter 5), then the multi-objective **M-RWGAN** (chapter 6).

## Published papers

The work appeared in four English-language papers, all open access on HAL:

- **A Generative AI for Heterogeneous Network-on-Chip Design Space Pruning**,
  DATE 2022. <https://hal-lirmm.ccsd.cnrs.fr/lirmm-03475912v1>
- **GANNoC: A Framework for Automatic Generation of NoC Topologies using
  Generative Adversarial Networks**, RAPIDO 2021.
  <https://hal-lirmm.ccsd.cnrs.fr/lirmm-03107918v2>
- **Online Learning for Dynamic Control of OpenMP Workloads**, MOCAST 2020.
  <https://hal.science/hal-02565961v1>
- **Automatic Energy-Efficiency Monitoring of OpenMP Workloads**, ReCoSoC 2019.
  <https://hal-lirmm.ccsd.cnrs.fr/lirmm-02183901v1>

and in one poster:

- **Energy-Efficiency Metric for Real-Time Monitoring of OpenMP Programs
  Executing on Multicore Systems**, 13e Colloque National du GDR SoC²,
  Montpellier, June 2019. <https://hal-lirmm.ccsd.cnrs.fr/lirmm-03326276v2>

The thesis itself: <https://hal-lirmm.ccsd.cnrs.fr/tel-03480748v2>

## About this edition

Figure, table and equation numbers are the printed thesis's own, and the 176
references keep their printed numbering, so anything here can be cited against
the PDF. See the [glossary](glossary.md) for the French-to-English terminology
and where each term was decided.
