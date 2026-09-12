# Publications

Four peer-reviewed conference papers, one poster and the PhD thesis, newest
first, each with its publisher DOI and its open-access record on HAL.

Everything here is deposited open access on HAL, so the full text is readable
even where the publisher link is paywalled. No PDFs are hosted on this site.
Each **Abstract** below opens the paper's own abstract, quoted as published.

## Conference papers

### A Generative AI for Heterogeneous Network-on-Chip Design Space Pruning

Maxime Mirka, Maxime France-Pillois, Gilles Sassatelli, Abdoulaye Gamatié.

DATE 2022, 25th Design, Automation and Test in Europe Conference and
Exhibition, Antwerp, Belgium, March 2022, pp. 1135–1138.

??? quote "Abstract"

    Often suffering from under-optimization, Networks-on-Chip (NoCs) heavily impact
    the efficiency of domain-specific Systems-on-Chip. To cope with this issue,
    heterogeneous NoCs are promising alternatives. Nevertheless, the design of
    optimized NoCs satisfying multiple performance objectives, e.g. throughput,
    power and area, is extremely challenging and requires significant expertise.
    While some approaches have been proposed to deal with the design space of NoCs,
    most fail to meet some expectations such as tractable exploration time and
    handling of multi-objective optimization. In this paper, we propose an approach
    based on generative artificial intelligence to help pruning complex design
    spaces for heterogeneous NoCs, according to configurable performance
    objectives. This is made possible by the ability of Generative Adversarial
    Networks to learn and generate relevant design candidates for the target NoCs.
    The speed and flexibility of our solution enable a fast generation of optimized
    NoCs that fit users’ expectations. Through some experiments, we show how to
    obtain competitive NoC designs reducing the power consumption with no
    communication performance or area penalty compared to a given conventional NoC
    design.


- Publisher (DOI): <https://doi.org/10.23919/DATE54114.2022.9774721>
- HAL open access: <https://hal-lirmm.ccsd.cnrs.fr/lirmm-03475912v1>

Corresponds to [Chapter 6](../thesis/06-m-rwgan.md) of the thesis and to the
[m-rwgan](https://github.com/mmirka/m-rwgan) repository.

### GANNoC: A Framework for Automatic Generation of NoC Topologies using Generative Adversarial Networks

Maxime Mirka, Maxime France-Pillois, Gilles Sassatelli, Abdoulaye Gamatié.

RAPIDO 2021, 13th Workshop on Rapid Simulation and Performance Evaluation:
Methods and Tools, Budapest, Hungary, January 2021, pp. 51–58. The 2021 edition
was held as a virtual event.

??? quote "Abstract"

    We propose GANNoC, a framework for automatic generation of customized Network-
    on-Chip (NoC) topologies, which exploits generative adversarial networks (GANs)
    learning capabilities. We define the problem of NoC generation as a graph
    generation problem, and train a GAN to produce such graphs. We further present
    a Reward-WGAN (RWGAN) architecture, based on the Wasserstein GAN (WGAN). It is
    coupled to a reward network enabling to steer the resulting generative system
    towards topologies having desired properties. We illustrate this capability
    through a case study aimed at producing topologies with a specific number of
    physical connections. After training, the generative network produces unique
    topologies with a 36% improvement regarding the number of connections, when
    compared to those found in the training dataset. NoCs’ performance assessment
    is carried out using the Ratatoskr 3D-NoC simulator with state-of-the-art
    characteristics. Results suggest interesting opportunities in learning
    correlations between intrinsic NoC features and resulting performance.


- Publisher (DOI): <https://doi.org/10.1145/3444950.3447283>
- HAL open access: <https://hal-lirmm.ccsd.cnrs.fr/lirmm-03107918v2>

Corresponds to [Chapter 5](../thesis/05-gannoc.md) of the thesis and to the
[GANNoC](https://github.com/mmirka/GANNoC) repository.

### Online Learning for Dynamic Control of OpenMP Workloads

Maxime Mirka, Gilles Sassatelli, Abdoulaye Gamatié.

MOCAST 2020, 9th International Conference on Modern Circuits and Systems
Technologies, Bremen, Germany, September 2020, pp. 1–6.

??? quote "Abstract"

    Optimizing energy-efficiency of modern multicore compute systems through online
    control is often regarded as both promising and challenging. In this paper, we
    propose a dynamic control technique for OpenMP workloads that exploits online
    energy efficiency measures derived from the OpenMP runtime. The proposed
    strategy relies on an automatic program phase identification which detects
    workload execution patterns, used by a reinforcement learning back-end. We
    design a synthetic benchmark template that makes it possible to produce
    benchmarks with controllable characteristics for mimicking a wide range of
    workload profiles. Experimental results show improvements on a 20-core server
    when compared to default Linux governors.


- Publisher (DOI): <https://doi.org/10.1109/MOCAST49295.2020.9200292>
- HAL open access: <https://hal.science/hal-02565961v1>

Corresponds to [Chapter 4](../thesis/04-openmp-energy-efficiency.md) of the
thesis and to the [omp-energy-rl](https://github.com/mmirka/omp-energy-rl) repository.

### Automatic Energy-Efficiency Monitoring of OpenMP Workloads

Maxime Mirka, Guillaume Devic, Florent Bruguier, Gilles Sassatelli, Abdoulaye Gamatié.

ReCoSoC 2019, 14th International Symposium on Reconfigurable
Communication-centric Systems-on-Chip, York, United Kingdom, July 2019,
pp. 43–50.

??? quote "Abstract"

    Energy-efficiency has been a major challenge in compute systems over the last
    decade. Both embedded and high-performance computing domains are concerned.
    Many efforts have been currently spent to devise solutions that are capable of
    providing systems with the best compromises in terms of performance and power
    consumption. In this paper, we propose an approach for on-line energy-
    efficiency analysis when executing OpenMP workloads on multicore systems. The
    novelty of our approach lies in the ability to monitor energy efficiency at
    runtime without prior knowledge of the application profile or code annotation.
    The solution relies on two new metrics: the Chunks per Second (CpS) and Chunks
    per Joule (CpJ). The former captures the quantity of work achieved by threads
    per unit time (i.e. a performance indicator). The latter indicates the quantity
    of work achieved by threads per unit energy, also corresponding to the
    performance per watt (i.e. an energy efficiency indicator). As most programs
    are made of several phases performing different computations for which CpS and
    CpJ cannot be related, it is crucial to be capable of detecting phase changes
    such as to perform intra-phase energy efficiency optimizations. For that
    purpose we devise a specific neural network model derived from the popular
    auto-encoder largely explored in the machine learning community, that is
    capable of understanding application profile and track phase changes at run-
    time. We show that these new metrics allow to perform energy efficiency
    optimization, and illustrate our approach on the analysis of the SRAD
    application from the Rodinia benchmark. The energy-efficiency profile analysis
    of the application is conducted on both an Intel and ARM platforms, showing its
    flexibility.


- Publisher (DOI): <https://doi.org/10.1109/ReCoSoC48741.2019.9034988>
- HAL open access: <https://hal-lirmm.ccsd.cnrs.fr/lirmm-02183901v1>

Corresponds to [Chapter 4](../thesis/04-openmp-energy-efficiency.md) of the
thesis and to the [omp-energy-rl](https://github.com/mmirka/omp-energy-rl) repository.

## Poster

### Energy-Efficiency Metric for Real-Time Monitoring of OpenMP Programs Executing on Multicore Systems

Maxime Mirka, Gilles Sassatelli, Abdoulaye Gamatié.

13e Colloque National du GDR SoC², Montpellier, France, June 2019.

??? quote "Abstract"

    Energy-efficiency has been a major challenge in compute systems over the last
    decade. In this work, we propose an approach for on-line energy-efficiency
    measurement when executing OpenMP workloads on multicore systems. The novelty
    of our approach lies in the ability to monitor energy efficiency at run-time
    without prior knowledge of the application profile or code annotation. The
    solution relies on two new metrics: the Chunks per Second (CpS) and Chunks per
    Joule (CpJ). The former captures the quantity of work achieved by threads per
    unit time (i.e. a performance indicator). The latter indicates the quantity of
    work achieved by threads per unit energy, also corresponding to the performance
    per watt. We show that these new metrics are suitable information making it
    possible to perform energy efficiency analysis.


- Publisher (DOI): DOI not located.
- HAL open access: <https://hal-lirmm.ccsd.cnrs.fr/lirmm-03326276v2>

Corresponds to [Chapter 4](../thesis/04-openmp-energy-efficiency.md) of the
thesis and to the [omp-energy-rl](https://github.com/mmirka/omp-energy-rl) repository.

## PhD thesis

### Techniques d'apprentissage pour le contrôle adaptatif multi-niveaux du calcul distribué

Maxime Mirka. Université de Montpellier, doctoral school I2S, speciality SyAM
(Systèmes Automatiques et Micro-Électroniques), research unit LIRMM. Supervised
by Gilles Sassatelli and Abdoulaye Gamatié. Defended 12 November 2021.
NNT 2021MONTS072.

The manuscript was written in French. Rendered in English on this site as
**Machine learning for multi-level adaptive control of distributed computing**;
the HAL record carries its own English rendering, *Machine learning techniques
for multi-level and adaptive control in distributed compute systems*.

The thesis applies neural-network learning to energy efficiency at two levels.
The first axis is dynamic control of a running parallel program: the CpS and CpJ
runtime metrics, unsupervised phase detection, and reinforcement-learning
control (Chapter 4, from the ReCoSoC 2019, GDR SoC² 2019 and MOCAST 2020
contributions above). The second axis is hardware design: generative adversarial
networks that produce network-on-chip topologies (Chapter 5, RAPIDO 2021) and
then heterogeneous router configurations optimized against several criteria at
once (Chapter 6, DATE 2022).

- HAL deposit: <https://hal-lirmm.ccsd.cnrs.fr/tel-03480748v2>
- HAL DOI: <https://doi.org/10.70675/5120b1b4zeee9z464dz9a7az2b56971707a3>

The full English edition is vendored on this site: read it from the
[thesis index](../thesis/index.md).
