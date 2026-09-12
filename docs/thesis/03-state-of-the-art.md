---
title: State of the art
chapter: 3
lang: en
source: Chapitre2/SoA.tex
---

# 3. State of the art

<div class="lang-switch" markdown>
<span class="lang-pill is-current">English</span>
[Français](fr/03-state-of-the-art.md){ .lang-pill title="Ce chapitre en français" }
</div>

## 3.1 Energy efficiency of parallel computing

Existing work aiming to improve the energy efficiency of the execution of
parallel computing is abundant. Indeed, various approaches are possible, ranging
from the upstream optimization of the code defining the computation, to the
dynamic adaptation of the computing resources during the execution of the
computation. As described in the previous chapter, section
[2.4](02-research-axes.md#24-towards-controlling-the-energy-efficiency-of-openmp-applications),
our work moves towards this latter, dynamic approach through reinforcement
learning. We study in particular applications parallelized with OpenMP, which
further specifies our positioning.

The existing approaches aiming to optimize the energy efficiency of computing
systems rely on various design techniques already studied in the literature
[\[111\]](references.md#ref-111), [\[74\]](references.md#ref-74),
[\[125\]](references.md#ref-125), [\[20\]](references.md#ref-20).

### 3.1.1 Optimization levers and their control

Industrial solutions essentially focus on the improvement of processors and of
their drivers. Contemporary processors (i.e. multicore) support a set of
features geared towards the improvement of energy efficiency. Among these
features, one finds at Intel the per-core management of *P-states*
(PCP)[\[74\]](references.md#ref-74), the frequency modulation of the components
outside the cores (UFS)[\[74\]](references.md#ref-74), the energy-efficient
"turbo" frequencies (EET) [\[21\]](references.md#ref-21), the *C-state* of the
cores [\[152\]](references.md#ref-152), power capping
[\[146\]](references.md#ref-146), or else the thermal limitations (i.e. *thermal
design power*(TDP)) which make it possible to limit the energy consumption while
ensuring the integrity of the system. These optimization levers are all found,
or found in part, in every computing system. More generally, two main features
are distinguished [\[20\]](references.md#ref-20): 1) the dynamic scaling of the
voltage and of the frequency – i.e. DVFS –, and 2) the dynamic management of the
power supply – i.e. DPM.

These features are two hardware techniques widely used to reduce the energy
consumption of the CPU. Both are controlled by the operating system (OS).
Indeed, the management of the C-states and P-states for Intel, and more globally
of DVFS and DPM, is carried out through drivers (e.g. intel_pstate and
acpi-cpufreq on Linux) handled by the operating system, and accessible to the
user through dedicated interfaces. We shall speak of a governor to refer to the
different management modes available on these drivers (e.g. *ondemand*
[\[127\]](references.md#ref-127)). Recent architectures tend to bring this
control back to the processor level. However, control at the processor level
shows significant limitations, in particular for the management of parallel
computing, since only the information relating to the cores considered is
available to the controller. Thus, manufacturers are counting on a hybrid
control where the processors act according to data provided by the OS. For
example, as mentioned by R. Schöne *et al.* [\[151\]](references.md#ref-151), if
one studies the evolution of Intel's *Hardware Power Management* (HWPM), one
notices that between the Broadwell and Skylab-SP architectures, the HWPM lost
autonomy in exchange for more flexibility and collaboration with the OS. Thus,
although a control at the processor level has many advantages such as reduced
decision-making delays and the limited interruption of workloads, an
intervention at the OS level is necessary to improve the quality of the control.

Finally, a last optimization lever is the allocation of resources to a task.
This feature is particularly useful for the management of parallel computing
since it makes it possible to optimize the way the computation is parallelized.
However, the controls implemented on the processor by manufacturers do not yet
act on this lever (i.e. per-core control, hence no notion of a parallelized
application), and governors do not exploit this potential. Indeed, resource
allocation remains the responsibility of the OS, and depends essentially on the
source code of the applications specifying, among other things, the number of
threads to be created for the parallelization of the computation. However, the
optimal number of threads will depend on the computing system. Moreover,
depending on the computing system, the type of resources used has a major impact
on energy efficiency (e.g. heterogeneous architecture).

Thus, the design of governors making it possible to optimize the energy
efficiency of the execution of a workload is a solution adopted by many in the
literature (see section [3.1.2](#312-governor-type-solutions) to optimize
computing systems.

### 3.1.2 Governor-type solutions

<a id="fig-3-1"></a>

![Simplified execution model of an application.](../assets/figures/thesis/ch03/fig-3-1.svg)

**Fig. 3.1** — Simplified execution model of an application.

We call "governor" any control system intervening on the computing system at the
runtime level. Figure [3.1](#fig-3-1) describes a three-layer model illustrating
the different execution levels of an application. One distinguishes there the
application layer comprising the high-level description of the tasks and of the
computing load, the runtime layer where the real-time controls of the operating
system and of the governors take place, and the hardware layer where the
computation is distributed to be processed by the available resources. It is
therefore the solutions operating at the level of the runtime layer that are of
interest to us. The actions of the governors can thus be distinguished according
to four categories: 1) DVFS, or frequency control, 2) DPM, or power control, 3)
Mapping, or resource allocation, and 4) Scheduling, or task scheduling. The
literature contains numerous control solutions akin to governors. We shall
therefore distinguish the governors according to the following criteria:

- **Action type,** or how the proposed control acts on the system. e.g. DVFS,
  mapping.
- ***Online* method,** or which control method is employed during the execution
  of a workload. e.g. RL.
- ***Offline* activity,** or what workload is required upstream of the control.
  e.g. training of a model.
- **Requirements,** or what are the conditions indispensable to the
  implementation of the solutions.
- **Portability,** or which systems are targeted by this method.

A comparative table [3.1](#tab-3-1) of the solutions existing in the literature
is proposed. This table sets out to highlight the different gaps existing in the
state of the art. The list of contributions is not exhaustive; the selected
contributions were however chosen in a qualitative way, in order to correctly
reproduce the trends of the state of the art. Indeed, this subject is a *hot
topic*, which results in a large number of contributions.

After a description of these different methods, we shall develop our analysis
around three essential characteriztics that are of interest to us: the
portability of the solutions, the actions carried out and the use of
reinforcement learning.

<a id="tab-3-1"></a>

> Wide table; scroll horizontally.

| ***Reference*** | ***Date*** | ***Actions*** | ***Online method*** | ***Offline activity*** | ***Requirements*** | ***Application platform*** |
|---|---|---|---|---|---|---|
| [\[170\]](references.md#ref-170) | 2012 | DPM | Deep Q-learning (RL) | - | Simulator | Multicore simulator (e.g. Intel Atom 4 and 8 cores) |
| PoGo [\[100\]](references.md#ref-100) | 2015 | DVFS | Q-Learning (RL) | Modification of the application code | Hardware performance counters | Embedded system (e.g. beagleboard with Arm Cortex A8) |
| Sparta [\[54\]](references.md#ref-54) | 2016 | Mapping | Binning-based (*predictor*)<br>Heuristic (*SPARTA Allocator*) | Training of the predictor (linear regression) | Heterogeneous system | Heterogeneous architecture (e.g. Arm big.LITTLE and HMP simulation) |
| [\[113\]](references.md#ref-113) | 2016 | DVFS | Q-learning (RL) | Empirical tuning of the reward function<br>Initialization of the Q values | Buffer utilization rate | MpSoC (e.g. Arm with 16 cores) |
| DyPO [\[73\]](references.md#ref-73) | 2017 | DVFS<br>DPM | Workload classification<br>Configuration selection (*Pareto-optimal*) | Instrumentation of the Applications<br>Characterization of benchmarks<br>Training of the classifier (*logistic regression*) | Hardware performance counters<br>LLVM<br>PAPI | Heterogeneous MpSoC (e.g. Arm big.LITTLE) |
| [\[40\]](references.md#ref-40) | 2017 | Mapping | RL | - | Hardware performance counters | Multicore system (e.g. Intel Xeon E5, 20 cores) |
| [\[142\]](references.md#ref-142) | 2018 | DVFS | EWMA (workload prediction)<br>Binning-based (DVFS) | Learning of the *Bins* | Hardware performance counters | Multicore processor (e.g. Intel Xeon E5/Phi) |
| AdaMD [\[18\]](references.md#ref-18) | 2019 | DVFS<br>Mapping | Performance prediction (additive regression)<br>Binning-based (DVFS), EWMA (workload prediction) | Training of the performance predictor<br>Learning of the classifier (DVFS) | Hardware performance counters | Heterogeneous MpSoC (e.g. Arm big.LITTLE) |
| [\[72\]](references.md#ref-72) | 2019 | DVFS<br>DPM | DQL (RL) | Training of the oracle<br>Instrumentation of the Applications<br>Offline pre-training of the DQL | Hardware performance counters | MpSoC (e.g. Arm big.LITTLE) |
| [\[101\]](references.md#ref-101) | 2019 | DVFS<br>DPM | Linear regression (*imitation learning*) | Design of an oracle (Q-Learning)<br>Approximation of the oracle (regression)<br>Instrumentation of the applications | Hardware performance counters | Heterogeneous MpSoC (e.g. Arm big.LITTLE) |
| RLBMCS [\[145\]](references.md#ref-145) | 2020 | Scheduling | RL | - | Free-RTOS | Multicore simulation |
| [\[158\]](references.md#ref-158) | 2021 | Scheduling | Deep RL | - | VM performance | IoT simulation |
| **My Work** | 2020 | DVFS<br>Mapping | Deep RL | Training of the AE training (if needed) | OpenMP support | Multicore system (e.g. Arm big.LITTLE, Intel Xeon E5) |

**Table 3.1** — Comparison of recent methods for the dynamic control of parallel
computing.

#### 3.1.2.1 Overview of existing methods

As early as 2012, R. Ye *et al.* [\[170\]](references.md#ref-170) looked into
the potential of reinforcement learning for carrying out an online control
requiring no offline analysis. Their control consists of a DPM in order to
manage in an optimal way the idle periods of the cores. Addressing this problem
for multicore systems, their learning technique is based on a neural network
(Deep Q-Learning) in order to support the large space of states and of actions.
Their work shows promising results, however they focus only on DPM. Yet, we
believe that a hybrid control addressing different levers such as DVFS and
mapping is necessary for an optimal control. Moreover, their control focuses on
the hardware aspect (state of the cores), without exploiting correlations with
the application being processed.

PoGo [\[100\]](references.md#ref-100) is proposed by L.A. Maeda-Nunez *et al.*
to carry out an *application-specific* DVFS control. This work places the
execution monitoring of parallel computing at the centre of the controller,
enabling the improvement of the energy efficiency of a particular application. A
reinforcement learning is used to decide on the modifications of the DVFS.
However, their application does not concern a multicore system, which makes
their field of actions limited to 4 possibilities. Yet, we target multicore
systems with a broader number of actions [\[170\]](references.md#ref-170).
Moreover, their control system retrieves the information on performance from
*flags* available after modification of the code of the application. Yet, in
order to facilitate the implementation of our control, we propose a less
invasive solution thanks to the chunks.

Sparta [\[54\]](references.md#ref-54) presented by B. Donyanavard *et al.* is a
system for controlling the mapping of tasks on heterogeneous multicore systems
in order to improve the energy efficiency of the computation. While their method
shows gains superior to the existing solutions for the big.LITTLE platform
tested, their method relies on offline learning and is therefore not adaptive in
real time. This method thus requires a meticulous design of the control policy
before execution, and does not guarantee an adaptation to every application
executed.

In [\[113\]](references.md#ref-113), A. Molnos *et al.* propose a solution based
on RL for a DVFS control of the system during the execution of an application
involving external interfaces (I/O), in order to guarantee the constraints of
execution quality (e.g. number of frames per second processed for a continuous
video processing). Their work focuses on the optimal tuning of the learning in
order to guarantee a fast convergence of the DVFS controller. However, the
mapping of the tasks is not taken into account, which could make it possible to
broaden the field of actions in order to guarantee the quality constraints at a
lower energy cost.

DyPO [\[73\]](references.md#ref-73) proposed by U. Gupta *et al.* is a hybrid
DVFS and DPM control system intended to adapt the configuration of the computing
system in real time according to the execution phases of the application being
processed. This model is based on the training of a workload classification
model from data collected for a set of applications. An online classification of
the executed workload then makes it possible to adapt the configuration of the
system. Contrary to our solution, their system requires an instrumentation of
the application to be optimized in order to extract the information on the
progress of its execution needed for the classification. The authors take up
their instrumentation system again in [\[72\]](references.md#ref-72), and
propose to reuse their classification model as an oracle making it possible to
pre-train a reinforcement learning. Thus, the final model benefits from the
knowledge of the oracle, while learning in real time to adapt to new
applications. Finally, a last improvement is brought by the authors in
[\[101\]](references.md#ref-101) where a transfer-learning technique is
implemented to improve the learning of the controller for the control of unknown
applications. However, each new application requires an offline instrumentation,
contrary to our method.

In [\[40\]](references.md#ref-40), G. Chasparis *et al.* propose a reinforcement
learning for the intelligent mapping of each thread of an application executed
on a multicore system. This system relies on the data of performance counters,
and does not consider the frequency control of the cores of the system.

K. R. Basireddy *et al.* [\[142\]](references.md#ref-142) propose a method based
on the offline learning of the assignment of voltage/frequency parameters
according to the current computing load. This computing load is determined from
the performance counters. Their method is applied on a multicore system and
shows significant gains in comparison with existing methods. However, their
method relies on an offline learning of the control law from a limited
benchmark. This does not guarantee an optimal control for every type of
workload. Moreover, their method for measuring the workload is based on the
performance counters, and is therefore not specific to the controlled
application as what we propose. This work is extended in AdaMD
[\[18\]](references.md#ref-18), where the management of the mapping of
concurrent applications complements their control system.

Finally, D.R. Rinku *et al.* [\[145\]](references.md#ref-145) and S. Sheng *et
al.* [\[158\]](references.md#ref-158) are two recent contributions exploiting
reinforcement learning respectively for multicore systems executing applications
parallelized with Free-RTOS, and for IoT applications executed on virtual
machines. These two contributions deal only with the planning of the tasks
(scheduling) and do not consider the DVFS and DPM controls, which are closer to
the hardware.

**Summary:** This set of contributions shows the variety of solutions explored
in the literature for the dynamic optimization of parallel computing. Our
contribution stands out mainly through the exploitation of the chunks, which are
a high-level and *application-specific* metric available in OpenMP. This makes
it possible in particular to benefit from a great diversity of platforms and
applications using OpenMP, and, with a minimum of instrumentation, to measure in
real time the quantity of computation executed. We propose to exploit this
metric for a dynamic control of the mapping and of the DVFS through an online
reinforcement learning.

#### 3.1.2.2 Portability

We first observed that the proposed solutions are generally designed for a
single system (e.g. Odroid XU3 and big.LITTLE architecture
[\[73\]](references.md#ref-73), [\[54\]](references.md#ref-54),
[\[18\]](references.md#ref-18), [\[101\]](references.md#ref-101)), and therefore
require significant efforts to be adapted to a new system. The significant
number of contributions dedicated to embedded systems and more generally to
MPSoCs should be noted, e.g. [\[160\]](references.md#ref-160),
[\[173\]](references.md#ref-173), [\[100\]](references.md#ref-100),
[\[73\]](references.md#ref-73), [\[18\]](references.md#ref-18),
[\[72\]](references.md#ref-72), [\[54\]](references.md#ref-54),
[\[101\]](references.md#ref-101). However, the problem of energy efficiency
concerns every type of computing system.

It is therefore this first point that we decided to address. To this end, we
propose a control method based on the OpenMP runtime, which is supported by the
majority of OSs and architectures. Thus, our solution can be applied on any
system supporting OpenMP, ranging from the embedded system to the HPC server,
from multicore to manycore.

In the following work of the ADAC team [\[122\]](references.md#ref-122),
[\[47\]](references.md#ref-47), the aim is to optimize the allocation of the
resources on heterogeneous architectures from information provided directly from
the compilation of applications. This has the advantage of benefiting from the
information on the characteriztics of the applications, as well as of
automatically instrumenting the program. Acting at the moment of compilation
favours the portability of the solution. Note the use of RL in
[\[122\]](references.md#ref-122) to optimize the dynamic allocation of tasks.
However, the proposed solutions only address the mapping of tasks, without
considering dynamic actions such as the variations of the operating frequency or
else dynamic phenomena such as application concurrency.

An approach that it is also appropriate to mention in this state of the art is
the work of Alessi *et al.* [\[7\]](references.md#ref-7). The authors proposed
an approach specific to OpenMP which consists in extending the existing OpenMP
API with an API specialized in energy saving. It makes it possible to take
decisions directly at the moment of execution in order to minimize the energy.
However, a modification of the code of the applications is necessary in order to
use this method, and this tool does not seem to be kept up to date.

#### 3.1.2.3 Actions and activities carried out

A majority of the control techniques aiming to improve energy efficiency
proposed in the literature address DVFS and DPM
[\[101\]](references.md#ref-101), [\[72\]](references.md#ref-72),
[\[18\]](references.md#ref-18), [\[142\]](references.md#ref-142),
[\[73\]](references.md#ref-73), [\[113\]](references.md#ref-113),
[\[100\]](references.md#ref-100), [\[170\]](references.md#ref-170),
[\[23\]](references.md#ref-23), [\[141\]](references.md#ref-141),
[\[16\]](references.md#ref-16). Others consider the allocation of the computing
resources to the tasks and the optimization of their scheduling
[\[145\]](references.md#ref-145), [\[158\]](references.md#ref-158),
[\[18\]](references.md#ref-18), [\[40\]](references.md#ref-40),
[\[65\]](references.md#ref-65), [\[54\]](references.md#ref-54),
[\[63\]](references.md#ref-63), [\[61\]](references.md#ref-61). Finally, it goes
without saying that the control of the configuration of the system (i.e. DVFS,
DPM) and of the management of the resources (i.e. mapping, scheduling) are
complementary. Thus, one finds in the literature contributions addressing
several of these approaches with a single controller, in particular AdaMD
[\[18\]](references.md#ref-18) recently proposed by K. R. Basireddy *et al.*. In
this work, different machine learning techniques are exploited in order to
propose a control of the DVFS as well as a control of the thread-core
allocation. The results presented show significant gains in energy efficiency,
since an improvement of 28% is obtained on the energy consumption, while
respecting the performance constraints of the applications studied. Finally, in
[\[62\]](references.md#ref-62), A. Gamatié *et al.* jointly address the design
of heterogeneous systems and the allocation of the workloads for the improvement
of the energy efficiency of *edge computing* type systems, which is in line with
the current trend of *domain specific computing* mentioned in the introduction.

We therefore propose to address the complementary control of the DVFS and of the
allocation of the resources, similar to AdaMD [\[18\]](references.md#ref-18).
Indeed, although effective, the solution proposed by K. R. Basireddy *et al.*
requires substantial work upstream of the dynamic control in order to create the
modules for the prediction and the classification of the workloads. Indeed, the
collection of the data and the training of the modules are as many tasks
requiring CPU time. Moreover, the set of data collected in order to characterize
the workloads is not guaranteed to be representative of every type of workload
(non-exhaustive database). Finally, their method depends on an access to the
hardware performance counters of the system considered. This therefore requires
additional work in order to integrate this solution on different systems. Thus,
we shall endeavour to differentiate ourselves from this method by proposing a
better portability of our solution (see section [3.1.2.2](#3122-portability)),
but also weaker constraints on the offline activity necessary to the setting up
of the control.

#### 3.1.2.4 The case for RL

In recent years a growing interest is observed for the use of machine learning
[\[102\]](references.md#ref-102), [\[142\]](references.md#ref-142),
[\[43\]](references.md#ref-43), and more particularly of reinforcement learning
[\[100\]](references.md#ref-100), [\[155\]](references.md#ref-155),
[\[170\]](references.md#ref-170), [\[156\]](references.md#ref-156).

The use of reinforcement learning (RL) proves effective in the framework of
decision-making problems. L.A. Maeda-Nunez *et al.* propose PoGo
[\[100\]](references.md#ref-100), an adaptive approach of energy minimization
used as a Linux governor and tested on an embedded system. A Q-Learning
algorithm is implemented as the decision unit, and the overall technique
demonstrates significant energy savings, as compared to the existing Ondemand
Linux governor [\[127\]](references.md#ref-127).

This work has been extended in [\[155\]](references.md#ref-155) where the
proposed method considers at once the intra-application workload changes and the
inter-application changes involving transfer-learning techniques. Their method
keeps showing great perspectives even on multicore systems with the assumption
of executing one task per core. In [\[170\]](references.md#ref-170), an approach
based on Q-Learning is proposed for the management of the idle periods of
multicore processors, showing the versatility of RL applications. Finally,
Basireddy *et al.* proposed in [\[142\]](references.md#ref-142) a runtime
management method taking the workload into account in order to save the energy
of HPC systems. They implemented a learning algorithm based on "binning"
[\[98\]](references.md#ref-98) to design the decision unit, and used hardware
performance counters for the characterization of the workload.

Recently, A. K. Singh *et al.* [\[160\]](references.md#ref-160) proposed a
complete survey of the state of the art of the techniques of dynamic energy
management of multicore embedded systems. This survey, more recent than our work
at the moment of its publication, highlights, among other things, the difficulty
of taking into consideration a growing number of parameters. In particular, the
methods based on RL and which rely on Q-learning, and are therefore particularly
sensitive to this problem. Yet, we observe a particular interest for these
methods in our study of the literature (c.f. table [3.1](#tab-3-1)). Indeed, one
of the major advantages of these methods is that they allow the construction of
an accurate controller, requiring very little offline effort since the learning
is done online, which makes these methods flexible. This can be observed on
table [3.1](#tab-3-1), where the contributions using RL require little offline
work. Indeed, apart from [\[72\]](references.md#ref-72) which pre-trains its
model before implementing it in real time, it is only a matter of initialization
[\[113\]](references.md#ref-113) or of instrumentation
[\[100\]](references.md#ref-100) specific to the proposed methods, or even of no
offline work at all [\[170\]](references.md#ref-170),
[\[40\]](references.md#ref-40), [\[145\]](references.md#ref-145),
[\[158\]](references.md#ref-158). However, the classical RL methods based on a
consultation table (i.e. *look-up table*) such as Q-Learning
[\[100\]](references.md#ref-100) find themselves limited by the number of
parameters that can be taken into account. This limitation is also mentioned by
S. K. Mandal *et al.* [\[101\]](references.md#ref-101), explaining that the size
of the Q-table grows exponentially with the increase of the input parameters,
which in fine makes the solution infeasible. In order to benefit from the
capabilities of RL for the construction of complex decision-making models while
overcoming the problem of the size of the consultation tables, we propose to
exploit a deep Q-learning (DQL) method [\[170\]](references.md#ref-170), which
consists in replacing the Q-table by a neural network capable of approximating a
complex Q-table.

A shortcoming of this online learning is that it is going to be adapted to the
control of the training workload, and will therefore be little flexible in
adapting to a new workload. However, encouraging work shows that it is possible
to overcome this shortcoming at a lesser effort, through techniques such as
transfer learning [\[155\]](references.md#ref-155). Thus, RL remains a
particularly interesting solution for implementing a complex control.

### 3.1.3 Conclusion

The work mentioned above shows how energy can be saved at execution by carrying
out an adaptation according to the workload. A definite interest is also
observed for the use of machine learning techniques, and more specifically for
the use of reinforcement learning. This method makes it possible to build a
decision-making system in an automatic way, for the control of the execution of
workloads. However, what emerges from it is an absence of solutions addressing,
through a single control system, the different levers that are DVFS, DPM and the
mapping of the allocation of the resources. Moreover, the solutions based on RL
do not specifically address OpenMP workloads, but position themselves at a lower
level, thereby depending on the hardware performance counters available on the
computing system.

Part of our work will consist in exploring this opportunity by showing a set of
promising results on the improvement of energy efficiency through an allocation
of the resources appropriate to the execution based on reinforcement learning.

We therefore propose to build a controller from reinforcement learning. Our
system relies on data extracted from the OpenMP runtime in order to have a
multi-level and portable solution. The actions of the controller comprise DVFS
and the allocation of resources.

## 3.2 Designing optimized NoCs at hardware level

We are interested here in the challenges of the hardware design of optimized
NoCs, which we distinguish from the control and management challenges
[\[66\]](references.md#ref-66) concerning the software level of NoCs.

The performance and the efficiency of the NoC strongly depend on the hardware
design of the interconnect. The routers are the active components that have a
significant impact on the latency and the throughput of the communication over
the Network-on-Chip. Likewise, the links carrying the traffic and transmitting
the data between the routers are partly responsible for the performance
characteriztics (e.g. bandwidth) of NoCs. Thus, an efficient allocation of the
routing resources and an optimization of the interconnect can improve the
performance of SoC applications. Consequently, the optimization of the topology
of the network, as well as the customization of the components of the NoCs (i.e.
routers and connections) through heterogeneous Networks-on-Chip designs are two
levers that must be considered when designing optimized NoCs.

In the remainder of this section, we first cite the so-called "classical"
approaches (i.e. without AI) aiming to improve the topology and the composition
of NoCs. Then, as mentioned in section
[2.5.2.1](02-research-axes.md#2521-notions-about-nocs), NoCs can be described as
graphs. We are therefore interested in the approaches for designing optimized
graphs by exploiting this analogy. Finally, before concluding on this state of
the art, we present the existing approaches for designing NoCs that exploit
machine learning techniques.

### 3.2.1 Classical design methodologies

#### 3.2.1.1 Topology optimization

**Regular topologies:** The regular NoC topologies have already been studied in
different contributions [\[27\]](references.md#ref-27),
[\[49\]](references.md#ref-49), [\[128\]](references.md#ref-128). In particular,
I. A. Alimi *et al.* describe in [\[9\]](references.md#ref-9) the advantages and
drawbacks of about ten different regular topologies. These topologies comprise,
among others, 2D topologies such as the mesh, the torus, the ring, the star and
the binary tree, but also 3D topologies such as the cube and the hypercube. This
variety of different topologies shows the complexity of NoC design. Indeed,
there is no single topology outperforming in every respect the other existing
topologies. As a result, depending on the use and on the architecture of the
underlying SoC, the choice of the topology will have a significant impact.

Thus, the design of a NoC demands particular attention on the topology of the
network. As a result, the customization of the topology can be extended as far
as the consideration of irregular, more flexible topologies.

**Irregular topologies:** Irregular topologies are based on the integration of
various shapes, generally regular structures, according to different modalities.
Thus, a hybrid, hierarchical or asymmetric approach can be adopted. Irregular
topologies aim to increase the available bandwidth with respect to regular
topologies, by adapting to the traffics considered. Indeed, as described in
[\[163\]](references.md#ref-163), the use of irregular topologies makes it
possible to produce NoCs adapted to the constraints of the SoC (i.e.
applications and architecture) by optimizing, among other things, the distance
between the routers (e.g. [\[124\]](references.md#ref-124)). However, the
routing of irregular topologies is a challenge for the designer of the NoC,
since deterministic algorithms such as XY routing prove unusable
[\[124\]](references.md#ref-124), then demanding a complex dynamic routing in
order to guarantee the correct operation of the NoC (e.g. without deadlock) .

**Summary:** The topology of the network determines the manner in which the
nodes are connected within the network. Although several NoC topologies exist in
the literature, only a few have been implemented in industrial chips
[\[171\]](references.md#ref-171). For example, the processors of the Intel Xeon
Phi series [\[137\]](references.md#ref-137) use the ring topology. The topology
of the NoC affects performance [\[42\]](references.md#ref-42), which is why
particular attention must be granted to the selection of an appropriate topology
according to the application. Additional research is necessary in order to
determine the appropriate NoC topology for heterogeneous systems capable of
executing different applications, as studied in
[\[126\]](references.md#ref-126). Thus, an appropriate CAD tool would make it
possible to facilitate this NoC design step.

#### 3.2.1.2 Optimizing NoC composition: heterogeneous NoCs

The optimization of NoCs goes through an optimized implementation of the
components of the NoC. These components are the routers and the connections.
There exist different router architectures (e.g. *bufferless* routers
[\[115\]](references.md#ref-115) , R-NoC [\[55\]](references.md#ref-55),
[\[57\]](references.md#ref-57), [\[58\]](references.md#ref-58)) as well as
different types of connections [\[86\]](references.md#ref-86) (i.e. different
bandwidths, number of virtual channels, etc.), having different performance and
energy consumption characteriztics.

In order to optimize as well as possible the architecture of a NoC according to
the constraints to which it is subjected (e.g. type of traffic), the concept of
heterogeneous NoCs turns out to be the best solution. Indeed, the heterogeneous
NoC is a flexible concept where each of the components of the NoC is determined
individually, in order to obtain a global NoC with optimal performance. Thus,
while the load of the traffic is often unbalanced
[\[69\]](references.md#ref-69), a heterogeneous NoC will be able to be optimized
to use a minimum of resources while guaranteeing a level of performance of the
network.

<a id="fig-3-2"></a>

![Heterogeneous NoC proposal by HeteroNoC](../assets/figures/thesis/ch03/fig-3-2.png)

**Fig. 3.2** — Heterogeneous NoC proposal by *HeteroNoC*
[\[110\]](references.md#ref-110). source: [\[110\]](references.md#ref-110)

In the article [\[110\]](references.md#ref-110), Mishra *et al.* propose a
*HeteroNoC* design that incorporates two types of routers: big routers with more
virtual channels (VC, for *virtual channels*) and high-bandwidth links, and
small routers with fewer VCs and low-bandwidth links. The overall design
performs markedly better than an equivalent homogeneous network, while consuming
less energy. The proposed heterogeneous NoCs can be seen in figure
[3.2](#fig-3-2). However, the proportion of routers of each type as well as
their position on the mesh grid are determined by a non-exhaustive exploration
of the design space, and nothing guarantees that the proposed NoC configurations
are optimal. Moreover, the topology of the NoC is not explored and is fixed to a
mesh. Zhao *et al.* [\[174\]](references.md#ref-174) considered the
implementation of routers with and without buffer memory and compared different
placements of routers. Just as for *HeteroNoC*, the authors reduced the design
space of the search by limiting the available router types to only two different
routers. The use of the *Clos* network instead of the usual crossbar network
inside the routers, as well as the mixing of routers with and without buffers,
are also proposed by Naik *et al.* in [\[118\]](references.md#ref-118) in order
to build a more efficient circuit-switched NoC. Finally, in the document
[\[30\]](references.md#ref-30), Bokhari *et al.* proposed the implementation of
several router architectures with various properties within a single NoC node.
The characteriztics of the node can then be selected at runtime according to the
profile of the workload. This method allows an adaptive design of the NoC and
therefore an improvement of the energy efficiency, but at the cost of an
additional control complexity and of additional hardware.

This work underlines the benefits expected in terms of energy efficiency from
the use of heterogeneous NoCs. However, it also raises the question of the
methodology to be applied in order to design optimal heterogeneous NoCs.

### 3.2.2 Generating optimized graphs

As mentioned previously, the creation of NoCs is similar to the creation of
graphs. We therefore make a first state of the art concerning the graph design
tools relying on advanced machine learning techniques.

Graph generation through deep learning techniques has been the object of
previous research, generally for the learning of graph patterns. The authors of
[\[28\]](references.md#ref-28) focused on the identification of patterns in very
large graph structures such as social networks. For this, a GAN is proposed,
based on *Long Short-Term Memory* (LSTM) neural networks.

In [\[172\]](references.md#ref-172), the authors carry out graph generation from
the adjacency matrix representation. They define a neural network that learns to
produce the connections of a vertex to its neighbour vertices, belonging to a
same graph. In [\[60\]](references.md#ref-60), the authors use a WGAN to produce
labeled graphs. They obtained promising results, in view of the complexity of
the generated data. Indeed, their GAN is capable of generating both the
adjacency matrix and the matrix of the labels. Their work is inspired by the
MolGAN project [\[38\]](references.md#ref-38) where labeled graphs are
produced. In MolGAN, the graphs represent molecules, and the labels indicate the
type of the atoms and of the connections present in the molecules.

<a id="fig-3-3"></a>

![MolGAN architecture for molecule generation](../assets/figures/thesis/ch03/fig-3-3.png)

**Fig. 3.3** — MolGAN architecture for molecule generation. source:
[\[38\]](references.md#ref-38)

The approach presented in MolGAN proposes a GAN architecture possessing a third
neural network called the Reward network. The diagram of the final GAN can be
seen in figure [3.3](#fig-3-3). This third block is implemented in order to
guide the learning of the generator to converge towards the generation of data
belonging to a sub-space of solutions matching the user constraints. The
learning of the generator according to the Reward is similar to a reinforcement
learning (RL), and the training of the Reward relies on the invocation of an
external software during the general training process. Regarding the design of
"guided" GANs, one can also cite the work of Lee and Seoh in
[\[96\]](references.md#ref-96), [\[97\]](references.md#ref-97). They first
proposed a controllable GAN [\[96\]](references.md#ref-96) inspired by
conditional GANs [\[109\]](references.md#ref-109), using a third neural network
as a classifier. They then extended their work by adding a fourth network
[\[97\]](references.md#ref-97) which allows the generator of the GAN to produce
more diversified and better-quality data, on the basis of the *inception score*
[\[149\]](references.md#ref-149).

### 3.2.3 NoC design methodologies through machine learning

As for the design specific to NoCs, through machine learning techniques, one
finds the MLNoC approach proposed by Rao *et al.* in
[\[140\]](references.md#ref-140). The authors show that machine learning
techniques can prove very efficient in the prediction of general NoC
descriptions, such as the type of topology (i.e. mesh, torus, etc.) or the
routing method, according to the properties and the features of the SoC.
However, MLNoC only explores supervised learning techniques, and no existing
work proposes to study the generation of NoC topologies based on generative AI.

In [\[143\]](references.md#ref-143), Reza *et al.* address the problem of
designing energy-efficient heterogeneous NoCs by exploring dynamic control
solutions through online learning in order to adapt the configuration of the NoC
in real time.

One finds in the literature various works exploiting machine learning techniques
to help with the design of NoCs. Alhubail *et al.* propose a methodology that
tackles the problem of the multi-objective optimization of Network-on-Chip
design, for heterogeneous systems (CPU and GPU alike)
[\[8\]](references.md#ref-8). Their solution relies on the use of a genetic
algorithm [\[79\]](references.md#ref-79) (GA) and an evolutionary algorithm
searching for Pareto-optima (i.e. SPEA2 [\[176\]](references.md#ref-176)), each
exploited at a different stage of the design process, to finally output an
optimized NoC architecture. Although this contribution is probably the most
complete to date, the proposed method produces only a single solution without
guaranteeing that it is the best one i.e. use of heuristic approaches. Moreover,
the authors implement a GA to carry out single-objective optimization i.e. to
minimize the latency of the network, and the optimization in terms of power
consumption (i.e. use of SPEA2) comes second. Thus the different optimization
objectives are addressed in a sequential manner, and therefore do not have the
same priority over the design of the final NoC.

The use of deep learning is recurrent in the state of the art. The modelling
capabilities of neural networks are exploited to predict certain NoC metrics
(e.g. average latency) and therefore help the designers in their search for
optimization. Indeed, these models allow fast and accurate predictions, making
possible the exploration of large design spaces, impossible to carry out through
the classical simulations that are much slower. To cite a few of them, K. Rusek
*et al.* propose *RouteNet* [\[148\]](references.md#ref-148), a deep learning
model trained to predict the performance of a network, in the global domain of
communication networks. This model is used for the modelling and the
optimization of networks. A similar contribution is proposed by R. Kirby *et
al.* [\[90\]](references.md#ref-90), where the concept of *graph neural network*
(GNN) is exploited to infer the congestion of physical chip design at a very low
level (logic gates).

### 3.2.4 Conclusion

The study of the state of the art of this second research axis reveals first of
all encouraging perspectives regarding the use of GANs for the generation of
NoCs, in view of the solutions existing for other types of graphs. Then, it
turns out that no contribution has yet considered this particular avenue. Thus,
there is here the opportunity to explore a new path for NoC CAD. Finally, the
various works existing in the literature testify to the difficulty of creating
optimized NoCs, arising essentially from the magnitude of the design space to be
considered. Thus, we shall attempt to bring a solution to this problem by
proposing a design space pruning tool, towards an optimized subset. Our solution
draws greatly on MolGAN, but contrary to the solution proposed in
[\[38\]](references.md#ref-38), our Reward is trained upstream of the learning
of the GAN, which allows a faster global learning since it is no longer
necessary to invoke an external software (e.g. a NoC simulator) during the
training. Obviously, the graphs studied refer to NoC topologies. To our
knowledge, this is the first time that GANs are used for the pruning of the NoC
design space. We then propose to extend this concept of guided GAN towards an
architecture with an unlimited number of Rewards.
