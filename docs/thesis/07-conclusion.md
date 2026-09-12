---
title: Conclusion and perspectives
chapter: 7
lang: en
source: Chapitre6/Conclusion.tex
---

# 7. Conclusion and perspectives

<div class="lang-switch" markdown>
<span class="lang-pill is-current">English</span>
[Français](fr/07-conclusion.md){ .lang-pill title="Ce chapitre en français" }
</div>

## 7.1 General conclusion

Energy efficiency is the new driver guiding the improvement of computing
systems. Indeed, after a long period of performance improvement, the
consideration of energy expenditure has been added to the improvement criteria
of computers. With the development of increasingly complex computing systems –
i.e. multicore, many-core, heterogeneous, etc. – we now speak of distributed
and/or parallel computing, in reference to the multiple computing resources
available. Thus, to optimize parallel computing, it is necessary to optimize on
the one hand the hardware support executing the tasks, but also the way in which
the computation will be distributed among the resources. The rise of machine
learning techniques has made it possible to bring ever more efficient solutions
in a large number of domains. While the control and design of energy-efficient
computing systems are increasingly complex tasks with regard to the growing
number of parameters to be taken into account, the use of AI proves promising.
This thesis therefore aimed to explore machine learning techniques in order to
bring solutions to the problems of parallel computing.

First, we attempted to address the problem of the multi-level adaptive control
of parallel computing, for the optimization of the energy efficiency of the
system executing the computation. An analysis of the literature first allowed us
to survey the existing metrics and tools for knowing the energy efficiency of
the execution of a task on a computing system. We noticed a lack of solutions
close to the execution level of applications, not depending on the hardware
performance counters specific to each system. Moreover, few works addressed in
particular the applications parallelized with OpenMP, which is nevertheless the
most widely used parallel programming model. Then, we took an interest in the
existing control methods. The study of the state of the art made it possible to
identify reinforcement learning techniques as the most effective ones for
learning and dynamic control. Although the proposed solutions address different
key parameters in energy efficiency, such as DVFS and DPM or mapping, few
solutions address the optimization of several of these levers at the same time.

Thus, our work focused on the formalization of a metric collected at the level
of the OpenMP runtime. This solution has the advantage of not depending on the
hardware performance counters specific to each computing system and of
benefiting from the portability of OpenMP. As a result, our metric, called CpJ,
allows a real-time monitoring of the energy efficiency of an OpenMP application,
and can be used on any system supporting OpenMP. This metric then allowed us to
create a control system based directly on energy efficiency. This control relies
on a reinforcement learning requiring no training before use. This system was
evaluated for static applications, on a synthetic benchmark showing a potential
energy-efficiency improvement of up to 469% depending on the type of workload
executed and of up to 17% for the DGEMM application, compared to the Linux
governors. Then, in order to take into account the execution phases of an
application, a tool based on the principle of autoencoders was developed. Thanks
to this additional notion of execution phase, the implemented dynamic control
makes it possible to adapt the parameters of the computing system to the
operating phases of the application considered. The first tests on a synthetic
two-phase application show a gain of 50% compared to the *ondemand* governor of
Linux. These very positive results show the potential of AI for solving complex
problems improving the energy efficiency of our computing systems. However, the
results proposed in this thesis are insufficient to validate a use on real
applications. Indeed, a large part of the results rely on a suite of synthetic
benchmarks. Moreover, the results on real applications are mixed, with an
effective control showing positive gains on the static DGEMM application, and
average results on the SRAD application. This analysis is therefore to be
carried out in future work. Then, the definition of the actions of reinforcement
learning seems sub-optimal. Indeed, although the use of the autoencoder makes it
possible to obtain a notion of phase at the input of the controller, a more
meticulous formulation of our problem as a reinforcement learning problem should
make it possible not to require a complementary phase detection.

After having taken an interest in the online optimization of parallel computing
through the proposal of a dynamic control, we took an interest in the
optimization of the design of the hardware executing the computation. Our study
quickly turned towards SoCs, which are particularly sensitive to energy
expenditure, as evidenced by their use as embedded systems. Moreover, SoCs are
generally used for specific applications, and not for a general-purpose use.
Thus, the optimization prospects are vast since they depend on the use.

A first observation on the energy expenditure of SoCs allowed us to target the
optimization of Networks-on-Chip, called NoCs. Since their appearance, NoCs have
established themselves as the default communication module of SoCs, owing to
their flexibility and their ease of implementation. However, the latter
represent a significant part of the energy consumption of SoCs, partly related
to an oversizing compared to the traffic that runs through them. Thus, an
optimization of the design of NoCs according to their use would make it possible
to reduce their energy consumption while maintaining their performance, which
amounts to improving their energy efficiency.

We addressed this problem of designing optimized NoCs through the prism of the
design space. A major difficulty faced by NoC designers is the large number of
parameters to be adjusted. Indeed, the topology of the network and the
characteriztics of the routers are as many parameters to be set, while
considering the type of traffic to which the NoC will be subject, and the
routing method. After a study of the literature, we realized that the existing
solutions consist in generating a single optimized configuration. Moreover,
these methods focus on a limited number of optimization criteria, and they do
not guarantee that the generated design is the best possible one. To remedy
this, we therefore proposed a tool making it possible to reduce the design space
in order to offer the NoC designer an optimized sub-space of NoC designs. Thus,
rather than directly proposing a possibly sub-optimized NoC configuration, we
generate a set of solutions in order to facilitate the analysis of an expert.

Our solution relies on a particular GAN architecture. We demonstrated the
usefulness of this method on different proofs of concept. In particular, we
proposed the M-RWGAN architecture, making it possible to generate a data item
optimized according to a multitude of criteria defined by the user. While this
solution is applied to the generation of NoCs, it turns out that the M-RWGAN
concept is much broader and is not restricted to Networks-on-Chip. In our case
of NoC generation, a first application consisted in successfully generating
optimized NoC topologies. Although convincing, future work will be able to
develop these results. Subsequently, we took an interest in the generation of
heterogeneous NoCs and we obtained encouraging results, demonstrating the
effectiveness of our M-RWGAN. This last contribution opens in particular
perspectives for the development of new CAD tools. Finally, the initial
objective of generating complete optimized NoCs is not yet fulfilled. Indeed, a
NoC is described by its topology and by the elements that compose it. We
proposed a solution for each of these problems (i.e. generation of topologies
then generation of feature matrices), but a hybrid solution making it possible
to generate all the elements of an optimized NoC is missing. This will be the
subject of future work.

## 7.2 Perspectives

### 7.2.1 Improving reinforcement-learning-based application control

- **Contribution on the autoencoder:** the autoencoder used to automatically
  detect the phases of an application is a tool developed in the first axis.
  Being only a simple tool, it has been validated only on the applications to be
  optimized. Interesting work could be conducted to develop this tool and to
  push its validation on a wide panel of applications in order to determine
  precisely its strong points and its limits.
- **Extension of the validation results:** our control system was tested on two
  real applications, a monotonous one (i.e. DGEMM) and a two-phase one (i.e.
  SRAD). In order to provide a more robust validation, the results will have to
  be extended to a larger number of real applications. In particular, it proved
  difficult to find real multi-phase benchmarks with more than two phases
  visible on the chunk traces. To this end, a suite of pseudo-synthetic
  benchmarks could be produced from a set of monotonous real applications
  executed successively, giving a final workload with several execution phases.
- **Extension for the management of concurrent applications:** the contribution
  presented for the dynamic control of OpenMP applications acts only on a single
  workload. Yet computing systems generally execute several tasks at the same
  time. An improvement of our control system would be to consider several
  applications at a time, and to determine the best trade-off as regards the
  distribution of the resources.
- **Improvement of the control law:** the capabilities of reinforcement learning
  on other use cases suggest that it would be possible to do without a phase
  detection tool at the input of the RL. Future work will have to consist in
  revisiting the definition of the control law and of the possible actions in
  order to dispense with the use of the phase detection module. A first lead
  could head towards a reformulation of the possible actions. With a new set of
  actions, the complete formula of the loss function of the DQN could be
  relevant. This would make it possible to take advantage of the temporal notion
  of this loss, which takes into consideration the past actions and not only the
  last action.

### 7.2.2 Developing the M-RWGAN tool for design-space reduction

- **Generation of complete graphs:** in this work, the RWGAN and its extension
  into M-RWGAN made it possible to respectively implement proofs of concept for
  the production of optimized adjacency matrices, and of optimized feature
  matrices. The logical next step will be to produce, by means of a single AI,
  the two graph description matrices (i.e. $A$ and $X$). To this end, the lead
  of GNNs (*Graph Neural Networks*) will have to be explored further.
- **Generalization of the tool:** The problem of the reduction of the design
  space is not a problem specific to NoC design. The M-RWGAN concept could first
  be extended to the domain of graphs thanks to the use of GNNs. Then, the
  principle of design space reduction can be generalized to the reduction of a
  data space. Thus, the use could diversify to any problem requiring a reduction
  of a data space.

## 7.3 Publications

### 7.3.1 Publications in international conferences

- **M. Mirka**, G. Devic, F. Bruguier, G. Sassatelli and A. Gamatié, "Automatic
  Energy-Efficiency Monitoring of OpenMP Workloads," *14th International
  Symposium on Reconfigurable Communication-centric Systems-on-Chip (ReCoSoC)*,
  2019, pp. 43-50, DOI: 10.1109/ReCoSoC48741.2019.9034988, HAL: lirmm-02183901.
  [\[104\]](references.md#ref-104)
- **M. Mirka**, G. Sassatelli and A. Gamatié, "Online Learning for Dynamic
  Control of OpenMP Workloads," *9th International Conference on Modern Circuits
  and Systems Technologies (MOCAST)*, 2020, pp. 1-6, DOI:
  10.1109/MOCAST49295.2020.9200292, HAL: hal-02565961.
  [\[108\]](references.md#ref-108)
- **M. Mirka**, M. France Pillois, G. Sassatelli, and A. Gamatié, "GANNoC: A
  Framework for Automatic Generation of NoC Topologies using Generative
  Adversarial Networks", *In Proceedings of the 2021 Drone Systems Engineering
  and Rapid Simulation and Performance Evaluation: Methods and Tools Proceedings
  (DroneSE and RAPIDO '21)*, 2021, pp. 51–58, DOI:10.1145/3444950.3447283, HAL:
  lirmm-03107918v2. [\[106\]](references.md#ref-106)
- **M. Mirka**, M. France Pillois, G. Sassatelli, and A. Gamatié, "A Generative
  AI for Heterogeneous Network-on-Chip Design Space Pruning," *Design,
  Automation and Test in Europe Conference (DATE)*, 2022, HAL: lirmm-0347591.
  [\[105\]](references.md#ref-105)

### 7.3.2 Poster

- **M. Mirka**, G. Sassatelli and A. Gamatié, "Energy-Efficiency Metric for
  Real-Time Monitoring of OpenMP Programs Executing on Multicore Systems,"
  *13ème Colloque National du GDR SOC²*, 2019, HAL: lirmm-03326276v2.
  [\[107\]](references.md#ref-107)
