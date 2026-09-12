---
title: Energy efficiency of OpenMP parallel computation
chapter: 4
lang: en
source: Chapitre3/Contribution1.tex
---

# 4. Energy efficiency of OpenMP parallel computation

<div class="lang-switch" markdown>
<span class="lang-pill is-current">English</span>
[Français](fr/04-openmp-energy-efficiency.md){ .lang-pill title="Ce chapitre en français" }
</div>

This chapter presents the work carried out on the first research axis, which
attempts to answer the questions raised in section
[2.6.1](02-research-axes.md#261-real-time-optimization-of-openmp-applications-through-rl).
This work is accompanied by the following publications:
[\[107\]](references.md#ref-107), [\[104\]](references.md#ref-104),
[\[108\]](references.md#ref-108).

The aim is therefore to optimize a computing system executing a parallel
OpenMP application. This optimization is meant to be dynamic, so as to adapt as
closely as possible to the needs of the application being executed, and it
proceeds by modifying the configuration of the system. By configuration, we
mean a set of computing resources allocated to the task, together with their
operating frequency.

First, we propose a "toolbox" for retrieving in real time various pieces of
information about the energy efficiency of a system executing an OpenMP
application, without resorting to the hardware performance counters that depend
on the system used. Second, we develop a control method resting on a
reinforcement learning technique. Finally, we close this chapter with a few
results demonstrating the effectiveness of our method, and discuss the
perspectives.

## 4.1 Monitoring the energy efficiency of OpenMP applications

In order to adapt the system according to its energy efficiency, it is
necessary to have real-time access to the value of that energy efficiency. To
this end, we propose a new approach, at software level, exploiting the OpenMP
runtime library (i.e. the *runtime*). With a view to studying different
computing architectures, we considered two systems of different natures: a
heterogeneous Odroid platform of the big.LITTLE type, and a multicore Intel
Xeon server.

### 4.1.1 Chunks and their associated metrics

Here we propose to define, on the basis of chunks, two new metrics that make it
possible to characterize the performance and the energy efficiency of an
application executed on a multicore system.

<a id="def-1"></a>

> **Definition 1 — Chunks per Second - CpS**
>
> The number of chunks executed in one second, where a chunk is a block of
> instructions assigned to a thread for execution. Defines a speed of work,
> i.e., it is a performance metric.

<a id="def-2"></a>

> **Definition 2 — Chunks per Joule - CpJ**
>
> The number of chunks executed for one Joule, where the Joules denote the
> quantity of energy used by the computing system. It can also be defined as
> CpS per Watt, or CpS/W, the number of chunks per second executed per Watt.
> Defines a quantity of work per quantity of energy, i.e., it is an
> energy-efficiency metric.

<a id="ex-1"></a>

**Example 1**

Consider the simple OpenMP code shown in Figure
[4.1](#fig-4-1). It consists in changing the value of the $i^{\text{th}}$
element of a vector B by adding to it the $i^{\text{th}}$ element of a vector
A. It is a simple piece of code, walking through a memory space and performing
an elementary computation on each of these memory cells.

<a id="fig-4-1"></a>

```c
00    #include <omp.h>
01  // Initialisation
02    n = 1e9; nthreads = 10;
03    double *A, *B;
04    posix_memalign((void**)&A, 64,
                            n*sizeof(double));
05    posix_memalign((void**)&B, 64,
                            n*sizeof(double));
06    for (i = 0; i < n; ++i) {
07        A[i] = 0.1;
08        B[i] = 0.0;
09    }
10  // Parallélisation
11    omp_set_num_threads(nthreads);
12    #pragma omp parallel for
            schedule(dynamic, 1) // directive OpenMP
13    for (i=0; i<n; i++){                 
14       B[i] = A[i] + B[i];
15    }
16    return 0;
```

**Fig. 4.1** — Example of a simple OpenMP C code.

The computations are therefore performed inside a *for* loop, which
corresponds to the workload that is to be parallelized. To grasp how the
parallelization is carried out, we refer to Figure
[2.1](02-research-axes.md#fig-2-1). The OpenMP directive on line 12
initializes a parallel region, where the chunks are distributed dynamically,
and one by one (option "schedule(dynamic, 1)"), among the worker threads. The
team of worker threads is set up on line 11, with 10 threads created here.

For this example, we use here an Intel Xeon processor with 10 compute
cores. When we run this code on different architecture configurations, in
terms of core count or operating frequency, we obtain different performance
and energy-efficiency values, reflected by our CpS and CpJ metrics, as shown
in Figure [4.2](#fig-4-2).

<a id="fig-4-2"></a>

| <a id="fig-4-2a"></a>(a) Configurations with different core counts. Frequency = 1.2GHz. | <a id="fig-4-2b"></a>(b) Configurations with different core frequencies. #core = 1. |
|:--:|:--:|
| ![Configurations with different core counts. Frequency = 1.2GHz.](../assets/figures/thesis/ch04/fig-4-2a.png) | ![Configurations with different core frequencies. #core = 1.](../assets/figures/thesis/ch04/fig-4-2b.png) |

**Fig. 4.2** — CpS and CpJ for different system configurations.

In Figure [4.2a](#fig-4-2a), performance (i.e. CpS) rises before reaching a
plateau from 3 cores onwards. This is explained by a saturation of memory
access, directly linked to the memory-demanding nature of the application.
Beyond 3 compute cores, a degradation of energy efficiency is observed.
Indeed, past that threshold, most of the cores end up waiting for data to
process while still drawing power. When it is the operating frequency that
varies, for a fixed number of computing resources, a linear improvement in
performance is observed, figure [4.2b](#fig-4-2b). Energy efficiency, for its
part, drops beyond a certain frequency. This corresponds to moving to
frequencies above the base frequency of the Intel Xeon processor (i.e.
2.2GHz), which gives rise to an increase in power consumption.

**Discussion and usage assumptions:** The chunk metric is defined as a relative
metric. According to the terminology used in OpenMP, a chunk corresponds to one
iteration of a parallel loop. We will therefore consider only applications made
up essentially of *for* loops parallelized with OpenMP. Moreover, this
characteriztic (i.e. a chunk is one iteration of a *for* loop) means that the
size of a chunk varies according to the quantity of work contained in an
iteration. We will come back to this later, in particular in section
[4.2.2](#422-building-a-synthetic-benchmark) where different types of
computation are discussed.

It should also be noted that our method for computing the CpJ is based on the
energy consumption of the whole system. This will restrict our experiments to
controlling the execution of a single application at a time, so that the chunks
account for most of the useful computation of the system. Thus, in our
experiments, we will be able to assume that the energy consumption of the
system is mainly affected by the chunks of the application under consideration.

#### 4.1.1.1 Chunk extraction method

<a id="fig-4-3"></a>

![Chunk collection sequence diagram (left) and chunk counter update method (right, pseudo-code).](../assets/figures/thesis/ch04/fig-4-3.png)

**Fig. 4.3** — Chunk collection sequence diagram (left) and chunk counter
update method (right, pseudo-code).

The GNU implementation of the OpenMP API is embedded in the *libgomp* library
of GCC. In particular, the scheduling mechanism responsible for dispatching
chunks among threads is described there. That library is linked against the
runtime after compilation. Chunk tracking is done at this very level. The
*libgomp* library is modified so as to include the mechanism for automatic
chunk collection described in figure [4.3](#fig-4-3). Thus, on every allocation
of chunks to a thread, a counter is updated. This counter is recorded in a
shared memory region, created through the IPC (Inter-Process Communication) API
available on the operating system in use. Application binaries linked with this
modified version of GCC/*libgomp* can therefore carry out this automatic
instrumentation. It is then possible to follow in real time the evolution of
the CpS and CpJ metrics during application execution, by reading from the
shared memory region from another process.

We have therefore implemented a library that makes it possible to create
scripts with access to the CpS and CpJ values, and able to carry out arbitrary
processing on those data. By periodically collecting the number of chunks, the
CpS is directly measurable, and the CpJ is derived from it by accessing the
power consumption. This power-consumption datum is accessible in various ways
depending on the computing systems used. Thus, for the Odroid platform, the
consumption data are obtained by reading the outputs of the current sensors
directly, whereas for the Intel server dedicated counters are available (i.e.
RAPL counters). The latter can be accessed either through the Intel PCM tool or
by reading the relevant registers directly. These collection scripts can then
be used to dynamically control various parameters of the system, such as the
operating frequency or the assignment of threads to the computing resources of
the system (i.e. "thread-to-core" scheduling).

The overall concept is illustrated in figure [4.3](#fig-4-3). More precisely,
it describes the periodic reading of the shared memory by the collection
script, while the OpenMP scheduling tool (i.e. scheduler) manages,
asynchronously, both the allocation of chunks to threads and the updating of
the counter in the shared memory. For robustness reasons, only the scheduler is
allowed to write in the shared memory. As a result, there is no concurrency
between the threads to be managed, since they merely read from memory. Finally,
no memory protection mechanism, such as "mutexes", is implemented, because the
probability of a simultaneous access to the shared memory by the script and the
scheduler is very low. Indeed, we have observed that such an event is
negligible, as it is automatically cancelled during the analysis of the data
(i.e. an outlier) and their processing, e.g. neural network training.

These metrics are therefore easy to implement and, since they are extracted
directly at the level of the OpenMP runtime, they can be exploited on any
system and architecture that has the *libgomp* librairy, i.e. most systems.
Moreover, they can be used during the execution of an application, which opens
up perspectives for real-time analysis of the efficiency of a computing system.

#### 4.1.1.2 The chunk metric: formalization

We have just presented the chunk metric that allows us to follow in real time,
from the runtime, the progress of the execution of a workload. Here we propose
to formalize this metric.

This formalization concentrates on parallel workloads; sequential regions are
therefore set aside, since they are not subject to parallel execution. A
parallel workload can be described as a finite set of chunks, which may be
executed in series as well as in parallel. We write $\mathcal{I}$ for the set
of instructions supported by the execution system under consideration.

**Parallel workloads:** A parallel workload $Par = \{C\}$ is a set of chunks
$C = \{i_k\}$. Each $i_k$ represents an instance of an instruction belonging to
$\mathcal{I}$.

**Architecture:** We define an execution architecture $Arc = (Proc, Mem)$ of a
computing system as a combination of processing elements $Proc$ and associated
memory resources $Mem$. We write $\alpha=\{Arc_k\}$ for the set of all possible
architectures.

An architecture can be monitored using hardware performance counters and
energy-consumption sensors. We consider
$V = \langle v_1, v_2, ..., v_n \rangle$ as a vector in which each value
$v_k$ corresponds to a measurement of the hardware performance counters and of
the energy consumption. For example, these values may be the number of *cache
misses*, *hits*, of memory accesses such as *read* and *write*, etc. The set of
all these vectors is written $\mathcal{V}$.

**Definition of the execution:** We define the execution function
$Ex: \mathcal{I} \times \alpha \rightarrow \mathcal{V}$, which outputs a vector
of metrics as a function of the execution of an instruction on a given
architecture.

From this definition, the execution of a chunk $C = \{i_k\}$ on an
architecture $a \in \alpha$ produces a vector
$V = \langle v_1, v_2, ..., v_n \rangle$ in the following way:
$\forall i_k \in C, Ex(i_k,a) = \langle v^k_1, v^k_2, ..., v^k_n \rangle$ such
that

$$
v_1 = \sum\limits_{\forall i_k} v^k_1, v_2 = \sum\limits_{\forall i_k} v^k_2, ..., v_n = \sum\limits_{\forall i_k} v^k_n
$$

As a result, a chunk is a representation of the compute load at a coarser level
of granularity than that of instructions. Indeed, the outcome of the execution
of a chunk corresponds to the sum of the executions of all the instructions
contained in the chunk. Measuring chunks therefore makes it possible to follow
the execution of a compute load as a whole, whereas global tracking that rests
on hardware performance counters calls for data processing of the "data fusion"
kind, since those counters give only information specific to independent
events.

**Parallel execution of a workload:** In the course of its execution, a
parallelized compute load (previously written $Par$) will be spread over a
certain number of execution threads, depending on the architecture as well as
on the user's choices (e.g. choice of configuration). We define
$\mathcal{T} = \{th_1, th_2, ... th_n\}$ as the set of threads
$th_{k, (k \in 1..n)}$ used to execute $Par$. We write
$q_{k, (k \in 1..n)} \in \mathcal{P}(Par)$ for the set of chunks assigned for
execution to a thread $th_k$, such that: $q_1 \cup q_2 \cup ... \cup q_n = Par$

**Performance and energy efficiency:** For a parallel workload $Par$, the
execution time $\delta_{Par}$ is given by the maximum value of
$\delta_{th_{k, (k \in 1..n)}}$, where
$\delta_{th_k}= \sum\limits_{C_i \in q_k} \delta_{C_i}$ represents the
execution duration of all the chunks contained in $q_k$ assigned to the thread
$th_k$.

In the same way, the energy consumption $\epsilon_{Par}$ of a parallel
workload is defined by the sum of the
$\epsilon_{th_{k, (k \in 1..n)}}$, where
$\epsilon_{th_k}= \sum\limits_{C_i \in q_k} \epsilon_{C_i}$ represents the
energy required to execute all the chunks of $q_k$ assigned to the thread
$th_k$.

The quantity of chunks executed per second can easily be computed: these are
our *Chunks per Second* (CpS). Likewise, the quantity of chunks executed per
Joule consumed can be derived: these are our *Chunks per Joule* (CpJ). These
metrics allow us to describe, respectively, the performance and the energy
efficiency of parallel OpenMP workloads. We thus define the two following
metrics:

<a id="eq-4-1"></a>

$$
Perf(Par) = \frac{1}{\delta_{Par}} * \sum\limits_{q_k \in \mathcal{P}(Par)} |q_k|
\tag{4.1}
$$

and

<a id="eq-4-2"></a>

$$
EnergyEff(Par) = \frac{1}{\epsilon_{Par}} * \sum\limits_{q_k \in \mathcal{P}(Par)} |q_k|
\tag{4.2}
$$

Formula ([4.1](#eq-4-1)) defines our chunk-based performance metric (i.e. CpS),
for the execution of a parallel workload, while formula ([4.2](#eq-4-2))
describes it energy efficiency (i.e. CpJ).

**Discussion:** We therefore formulate chunks as a relevant metric for
following in real time the execution of parallel workloads. Moreover, for the
particular monitoring of performance and of energy efficiency, we define the
chunk-based CpS and CpJ metrics. It is important to recall that the
characteriztics of chunks vary according to the parallelized *for* loop. Thus,
the hybrid metrics - i.e. CpS and CpJ - are metrics specific to the
parallelized loop, and therefore cannot be used as a means of comparison
between different workloads.

In this work, we are interested only in parallel workloads. However, a
sequential workload can be interpreted as a parallel workload running on a
single thread only, i.e. $\mathcal{T} = \text{singleton}$. As a result,
following this formulation, it is easy to apply formulas ([4.1](#eq-4-1)) and
([4.2](#eq-4-2)) by simply replacing the terms $|q_k|$ by 1. Indeed, a
sequential region is analogous to a parallel region made up of a single chunk.

### 4.1.2 Towards energy-efficiency analysis

The ability to follow the execution of an application and its efficiency can be
exploited to determine the most advantageous system configuration from the
energy-efficiency point of view. Application codes often exhibit different
execution phases that differ in their behaviour with regard to their use of
hardware resources, e.g. a computation-heavy task (*compute-intensive*) versus
a task heavy in memory accesses (*memory-intensive*). Let us take the
fashionable example of an application running on the cloud to illustrate our
point. As very aptly described by A.Bhattacharyya *et al.*
[\[22\]](references.md#ref-22), a cloud application usually goes through a
multitude of types of task, i.e. workload, ranging from memory storage with
load periods to processing periods that are greedy in compute power. It may
also have to carry out communication tasks, with the latency problems that
follow from them. Broadly, there are as many types of phase as there are
features present in the application. Staying with this idea, another classic
example is smartphone applications. This family of applications plays the role
of interface between the user and the operating system. As a result, they have
different operating phases, such as handling calls or accessing the image
gallery, or simply remaining idle (*sleep mode*).

Thus, a phase change translates into a change in the type of workload. More
particularly, in our case of parallelized applications, this change means a
modification of the characteriztics of the chunks. Indeed, the chunk metric is
relative to the amount of work contained in one loop iteration. These changes
cause variations in the energy consumption, hence the need to adapt the
configuration of the system according to the current phase of the application,
in order to optimize that energy consumption.

#### 4.1.2.1 Example of a multi-phase application

We show the need to adapt the configuration of the system to the current
execution phase by illustrating the difference between *memory-intensive* and
*compute-intensive* applications. Following the definition of chunks, the CpS
and CpJ values are interpreted in the following way: the higher the values, the
better the performance and the energy efficiency.

<a id="ex-2"></a>

**Example 2**

Consider the OpenMP code detailed in figure [4.4](#fig-4-4). This program is
designed to have two execution phases, with different characteriztics.

<a id="fig-4-4"></a>

```c
00    #include <omp.h>
01  // Initialization
02    nthreads = 10;
03    double *A, *B, *C, *D;
04    posix_memalign((void**)&A, 64, 
                            n*sizeof(double));
05    posix_memalign((void**)&B, 64,
                            n*sizeof(double));
06    posix_memalign((void**)&C, 64, 
                            n*sizeof(double));
07    posix_memalign((void**)&D, 64,
                            n*sizeof(double));
08    for (i = 0; i < n1; ++i) {
09        A[i] = 0.1;
10        B[i] = 0.0;
11    }
12    for (i = 0; i < n2; ++i) {
13        C[i] = 0.1;
14        D[i] = 0.0;
15    }
16    omp_set_num_threads(nthreads);
17    for (j = 0; j < n; ++j) {
18      // Parallel region
19      #pragma omp parallel for 
            schedule(dynamic, 1) // directive OpenMP
20      for (i=0; i<n1; i++){                 
21          B[i] = A[i] + B[i];
22      }
23      // Parallel region
24      #pragma omp parallel for
            schedule(dynamic, 1) // directive OpenMP
25      for (i=0; i<n2; i++){                 
26          D[i] = fct(C[i], D[i]);
27      }
28    return 0;
```

**Fig. 4.4** — A simple OpenMP program in C with alternating phases of the
compute-intensive and memory-bound kinds.

This program consists of a single main *for* loop, executing two other *for*
loops consecutively. These two nested loops constitute the two different
phases (i.e. two different chunk types) of the main program. The first loop
performs simple additions, and therefore carries out mostly memory accesses.
It is a region of the *memory-intensive* kind. The second loop, for its part,
is a *compute-intensive* region, where fct() is a function that requires a
great deal of computation.

Figure [4.5](#fig-4-5) plots the time evolution of the CpJ and CpS,
collected during the execution of this program on a fixed configuration. The
energy consumption accompanies these plots on a third graph. Two phases can
be observed on both the CpS and CpJ plots, with similar behaviours. Moreover,
despite its noisy character, the energy consumption can be regarded as
constant, since no particular pattern stands out. From these plots, we can
therefore state that the two phases visible on the curves correspond to the
two loops described above. These results show that our CpS and CpJ metrics
make it possible to perform phase analysis. *Note:* This counter-intuitive
result (i.e. one might expect to see a variation of the energy consumption
according to the type of workload) is explained in part by the fact that the
measurements are made for the whole system, and that they were taken for a
system configuration inducing a high energy consumption - i.e. 19 cores at
2.1GHz - thereby masking the variations linked to the application.

<a id="fig-4-5"></a>

![Profile of the synthetic application executed on an Intel server. From top to bottom: CpS, power consumption (Watt), CpJ.](../assets/figures/thesis/ch04/fig-4-5.png)

**Fig. 4.5** — Profile of the synthetic application executed on an Intel
server. From top to bottom: CpS, power consumption (Watt), CpJ.

When this code is executed on different architecture configurations, the
energy-efficiency results shown in figure [4.6](#fig-4-6) are obtained.

<a id="fig-4-6"></a>

| <a id="fig-4-6a"></a>(a) Global and per-phase CpS mean | <a id="fig-4-6b"></a>(b) Global and per-phase CpJ mean | <a id="fig-4-6c"></a>(c) Breakdown of the phases' execution time |
|:--:|:--:|:--:|
| ![Global and per-phase CpS mean](../assets/figures/thesis/ch04/fig-4-6a.png) | ![Global and per-phase CpJ mean](../assets/figures/thesis/ch04/fig-4-6b.png) | ![Breakdown of the phases' execution time](../assets/figures/thesis/ch04/fig-4-6c.png) |

**Fig. 4.6** — Comparison of the metrics for 3 configurations on an Intel
server. 1: 2 cores at f= 1.5GHz; 2: 9 cores at f= 1.5GHz; 3: 17 cores
at f= 2.1GHz.(a): Describes the mean CpS values, for the overall execution
and for each execution phase, (b): Same as (a) for the CpJ, (c): Breakdown of
the phase durations

Figure [4.6](#fig-4-6) shows in (a) the performance (CpS) and in (b) the
energy efficiency (CpJ) of the application as a whole, but also for each of
the two execution phases, for three particular configurations. The breakdown
(in %) of the execution time between the two phases is described in (c). We
first define the optimal configuration as the one giving the best energy
efficiency. It can be seen that each phase has a distinct optimal
configuration. Indeed, following the notation used in figure
[4.6](#fig-4-6), configurations 1 and 3 are optimal for phase 1 and phase 2
respectively. Moreover, the best energy efficiency obtained when considering
the application as a whole is for configuration 2, different from the optima
of the respective phases. Note that the possibility of alternating between
configurations 1 and 3 would obviously lead to better global results,
compared with those of configuration 2, the latter being manifestly a
compromise.

In this particular example, alternating between configurations 1 and 3
according to the execution phase changes, rather than running the whole
application on configuration 2, would make it possible to obtain an increase
in CpJ of nearly 15% (considering a perfect system, with no cost attached to
configuration changes).

From the above example, we see that CpS and CpJ are metrics that make it easy
to capture the energy efficiency of a system during the execution of a task,
and according to its phases. Indeed, different CpS and CpJ behaviours are
observed for the different execution phases. This reflects the fact that these
phases (i.e. chunk types) have their own CpS and CpJ characteriztics, allowing
us to conclude that these metrics capture the application phases.

In the previous example, these execution phases were observed a posteriori,
after the program had run. A real-time system is therefore needed to automate
this processing, i.e. to determine the number of phases existing in the
application, to enumerate them and finally to be able to identify which phase
is currently executing. This will subsequently make it possible to identify the
optimal configuration of a phase, and to select it in real time.

### 4.1.3 An autoencoder for execution-phase detection

We have thus shown that our CpS and CpJ metrics make it possible to see the
execution phases of an application in real time. We have also observed that,
from the energy-efficiency point of view, these phases may require different
configurations. Detecting the phases and identifying their optimal
configuration are therefore the keys to an optimal dynamic control.

Here we propose a solution for automatically detecting application execution
phases in real time. Our solution exploits the architecture of autoencoders
[\[77\]](references.md#ref-77), a particular form of neural network that
allows, among other things, feature extraction. Thus, with the help of a
trained autoencoder, we perform phase detection with excellent results.

<a id="fig-4-7"></a>

![Illustration of the autoencoder concept](../assets/figures/thesis/ch04/fig-4-7.png)

**Fig. 4.7** — Illustration of the autoencoder concept

Autoencoders are therefore particular topologies of deep neural networks that
are becoming more and more popular. They are used in various application
domains, such as image processing with noise removal
[\[167\]](references.md#ref-167). The objective of an autoencoder is to reduce
the dimensionality of its input data, e.g. the size of the images in the case
of the image processing mentioned above. This dimensional compression is
achieved by the "bottleneck" shape of the neural network architecture, as
illustrated in figure [4.7](#fig-4-7). Indeed, autoencoders have a symmetric
shape, with the internal layer of neurons as the axis of symmetry, of lower
dimension than the input layer. Two distinct parts can thus be identified: the
encoder and the decoder. The former defines the part going from the input layer
to the internal layer, while the latter designates the part going from the
internal layer to the output layer of the neural network. Several intermediate
layers can be implemented inside these two parts, in order to increase the
depth of the network.

An autoencoder is trained to reproduce at its output what was given to it at
its input. In this way, a compact representation of its input is available at
the boundary between the encoder and the decoder. This is the internal layer
mentioned earlier, and described in figure [4.7](#fig-4-7).

In our case, our autoencoder is trained to reproduce the CpS values and the
system configuration data (i.e. *Confiuration data* in figure
[4.8](#fig-4-8): number of allocated cores and operating frequency), passing
through the internal layer where the information about the phase will be
recovered. The architecture implemented to address this phase-detection task is
illustrated in figure [4.8](#fig-4-8), and described in section
[4.1.3.1](#4131-the-proposed-autoencoder).

#### 4.1.3.1 The proposed autoencoder

<a id="fig-4-8"></a>

![Designed autoencoder. 1: internal layer, 2: configuration data (#cores, frequency), 3: concatenation of 1 and 2](../assets/figures/thesis/ch04/fig-4-8.png)

**Fig. 4.8** — Designed autoencoder. 1: internal layer, 2: configuration
data (#cores, frequency), 3: concatenation of 1 and 2

In order to extract information about the phase, a discrete layer (blue
rectangle, numbered 1), i.e. binary neuron outputs, is used as the internal
layer. The information about the system configuration (frequency and number of
allocated compute cores), represented by the yellow rectangle numbered 2, is
given directly at the decoder input (green rectangle numbered 3) by
concatenating it with the information contained in the internal layer. As a
result, the autoencoder is constrained to build for itself a discrete
representation of the CpS, on the basis of the configuration information.
Ultimately, this representation will correspond to the information about the
phase. This therefore amounts to the unsupervised training of a classifier.
Indeed, the number of classes corresponding to the number of different phases
is not given a priori to the autoencoder. Each class determined by the training
of the autoencoder corresponds to an execution phase identified by the network.
The training does, however, require a first data-collection step, in order to
sweep the different system configurations and collect the corresponding CpS and
CpJ values.

After training, the model only needs the CpS data and the system configuration
to determine the current execution phase of the running program. This therefore
makes real-time phase detection possible.

#### 4.1.3.2 Proof of concept on SRAD (Rodinia benchmark)

We therefore have a framework for real-time monitoring of the energy efficiency
of OpenMP applications, together with a phase-detection method for applications
that have different execution phases with different optimal configurations. We
propose to illustrate the use of this framework with the SRAD benchmark, taken
from the Rodinia benchmark suite [\[41\]](references.md#ref-41). The tests are
carried out on two computing systems: an Intel-Xeon server with two multicore
processors (*sockets*) (20 cores, 10 per socket), and an Odroid XU3 platform
based on the Armv7 big.LITTLE architecture.

<a id="fig-4-9"></a>

![Sample of the execution of the SRAD application. CpS and CpJ profiles.](../assets/figures/thesis/ch04/fig-4-9.png)

**Fig. 4.9** — Sample of the execution of the SRAD application. CpS and CpJ
profiles.

In what follows, the term system configuration designates a set of two
features: the number of compute cores assigned to the execution of the program,
and the operating frequency of those cores. As illustrated in figure
[4.9](#fig-4-9), the SRAD benchmark is a relevant choice for testing the
framework as a whole. Indeed, this figure plots the CpS and CpJ curves for the
execution of SRAD on a fixed configuration, and two distinct execution phases
are observed.

<a id="fig-4-10"></a>

| <a id="fig-4-10a"></a>(a) CpJ for the Intel server, 95 configurations | <a id="fig-4-10b"></a>(b) CpJ for the Intel server, zoom on the optimal configurations (underlined in the colours of the corresponding phases) |
|:--:|:--:|
| ![CpJ for the Intel server, 95 configurations](../assets/figures/thesis/ch04/fig-4-10a.png) | ![CpJ for the Intel server, zoom on the optimal configurations](../assets/figures/thesis/ch04/fig-4-10b.png) |

| <a id="fig-4-10c"></a>(c) CpJ for the Odroid board, 52 configurations | <a id="fig-4-10d"></a>(d) CpJ for the Odroid board, zoom on the optimal configurations (underlined in the colours of the corresponding phases) |
|:--:|:--:|
| ![CpJ for the Odroid board, 52 configurations](../assets/figures/thesis/ch04/fig-4-10c.png) | ![CpJ for the Odroid board, zoom on the optimal configurations](../assets/figures/thesis/ch04/fig-4-10d.png) |

**Fig. 4.10** — Characterization of the SRAD application, on two
architectures: an Intel server possessing 20 cores and an Arm platform with 4
heterogeneous cores.

A characterization of this application is run on the two computing systems,
exploring all the possible configurations, i.e. all the possible frequencies
and sets of cores. Figures [4.10a](#fig-4-10a) and [4.10b](#fig-4-10b) show the
results of the characterization on the Intel server. The range of
configurations starts at a single core and grows progressively up to 19,
because the core dedicated to data collection was excluded. For each core
count, a set of frequencies is explored, going from 40 to 80% of the maximum
frequency, in steps of 10%. Higher frequencies are not used for our analysis,
as they are subject to a regulation (*CPU throttling*) caused by the "thermal
envelope" (TDP) of the processor. This gives us a total of 95 different
configurations.

The same experiment is conducted on the Odroid board, and described in figures
[4.10c](#fig-4-10c) and [4.10d](#fig-4-10d), with similar results. Note
that for each of the systems the configurations leading to the best
performance are different, and are identified in figures
[4.10b](#fig-4-10b) and [4.10d](#fig-4-10d). This simple example demonstrates
once again the relevance of the proposed metrics (CpS and CpJ) for obtaining
information about applications executing on embedded systems such as the Odroid
board just as much as on high-performance computing (HPC) systems such as the
Intel server.

<a id="fig-4-11"></a>

![Example of phase detection for the SRAD application, on the CpS profile.](../assets/figures/thesis/ch04/fig-4-11.png)

**Fig. 4.11** — Example of phase detection for the SRAD application, on the
CpS profile.

Figure [4.11](#fig-4-11) plots the evolution of the CpS together with the two
different phases detected in real time by the autoencoder. This illustrates the
overall very good results of the autoencoder, after a relatively short training
time. Indeed, the training of the autoencoder takes between 1min and 5min for
each dataset (Intel server and Odroid board), and converges towards its final
error (*loss*) after a few tens of seconds. All these training runs were
conducted on the Intel Xeon server, equipped with Xeon E3-1225v3 CPUs. As
expected, once trained, our encoder produces a code corresponding to each
phase. The value of the code is arbitrary and may vary from one training run to
another, and must therefore be interpreted as an enumerated type.

## 4.2 Optimizing CpJ: methodology and solution

We therefore have at our disposal a "toolbox" made up of metrics for following
in real time the performance and the energy efficiency (respectively CpS and
CpJ) of a parallelized OpenMP application, together with a tool for automatic
phase detection through the exploitation of autoencoders. In order to guarantee
the CpJ usage assumptions defined in section
[4.1.1](#411-chunks-and-their-associated-metrics), the applications considered
will be made up essentially of parallelized *for* loops, so that the chunks
account for most of the useful computation of the computing system. Thus, for
the CpJ measurement, we will be able to reasonably assume that the energy
consumption of the system is mainly affected by the chunks. Furthermore, since
chunks are specific to the parallelized workload, we will consider the control
of a single application at a time.

In this part, we propose a solution for optimizing energy efficiency, through
the optimization of the CpJ. This solution is based on reinforcement learning,
which has the advantage of not requiring data collected ahead of its training.

**Note:** For the remainder of this part, only the Intel Xeon server will be
used for the experiments. Indeed, given the recent state of the art, which
mostly targets heterogeneous systems (e.g. the bib.LITTLE Odroid board), it
seemed more interesting to focus on an SMP (*Symmetric Multiprocessing*) server
type system, with a homogeneous architecture.

### 4.2.1 Methodology

First of all, this section presents the method followed to create, test and
validate our dynamic control solution for the optimization of the CpJ.

**Step 1: Building a synthetic benchmark** We have shown above that chunks are
a metric relative to the type of work carried out, and that the optimal
configuration (i.e. the one leading to the best energy efficiency) varies with
the type of chunks. We therefore propose, first of all, to illustrate in more
detail this impact of the chunk type on the optimal configuration, relying on
the "compute-intensive vs. memory-intensive" duality mentioned in
[4.1.1](#411-chunks-and-their-associated-metrics). To this end we propose a
synthetic benchmark, developed in section
[4.2.2](#422-building-a-synthetic-benchmark), made up of static OpenMP
applications (i.e. a single type of chunks and a single execution phase). This
benchmark will subsequently serve to demonstrate the effectiveness of our
dynamic control system, detailed in
[4.2.3](#423-reinforcement-learning-for-dynamic-reconfiguration).

**Step 2: Implementing a suitable deep reinforcement learning** To ensure
real-time decision making (i.e. the heart of the control system), we propose to
implement an AI based on deep reinforcement learning. As mentioned in section
[2.4.2](02-research-axes.md#242-automatic-decision-making-and-rl),
reinforcement learning is favoured for decision-making solutions, because it
theoretically guarantees convergence towards the best possible solutions.
Moreover, using a deep learning method here (i.e. a neural network) makes it
possible to have a solution that takes into account a very large field of
possibilities. We develop this point in section
[4.2.3](#423-reinforcement-learning-for-dynamic-reconfiguration).

**Step 3: Evaluating the control system** Finally, we will evaluate our system
on various applications. First, we will compare the performance of our system
for the DGEMM benchmark [\[99\]](references.md#ref-99) with the different Linux
governors. Then, we will turn to multi-phase applications with a synthetic
application composed of two static applications, and the SRAD benchmark. The
results are the subject of a new part, in [4.3](#43-results-and-analysis).

Note: future work will have to validate our system on a broader set of
multi-phase applications, in particular by relying on well-known benchmark
suites such as Rodinia and PARSEC.

### 4.2.2 Building a synthetic benchmark

#### 4.2.2.1 Synthetic benchmark: model

To extract the potential energy-efficiency gains of the chosen computing system
(i.e. the Intel server), we designed a parametrizable synthetic benchmark model
from which benchmarks with different profiles can be derived. The model is
built around two consecutive and parametrized code blocks, making it possible
to cover *memory-intensive* and *compute-intensive* operations. As a result,
the applications thus created have different behaviours, according to their
intensity in terms of memory accesses and computation needs. The model is
described in figure [4.12](#fig-4-12).

<a id="fig-4-12"></a>

```c
00  #include <omp.h>
01  // Initialization
02  Some environment definitions
03  // Parallelization
04  omp_set_num_threads(nthreads);
05  // OpenMP directive 
06  #pragma omp parallel for schedule(dynamic, 1)
07  for (i=0; i<n; i++){  
08      for (j=0; j<100; j++){
09          if (j < coef){
10              MEM-intensive code fragment
11          }
12          else{
13              CPU-intensive code fragment
14          }
15  }
16  return 0;
```

**Fig. 4.12** — Benchmark model.

The *memory-intensive* code segment executes a set of operations on large
vectors, such as additions, copies and permutations. The intensity of the
memory demand therefore depends on the size of the vectors, on their
dimensions, and on the random behaviour of the various accesses to the vectors
(i.e. it increases the probability of *cache-misses*). The *compute-intensive*
segment, for its part, executes a set of mathematical computations drawn from
linear algebra and from combinations of arithmetic and trigonometric functions,
calling upon computation-heavy methods such as Fourier series analysis and
various floating-point operations. The amount of stress applied to the CPU(s)
then depends on the number of calls to these functions, and on their
characteriztics. As a result, these two blocks are basic pieces of code
representative of the two characteriztics we wish to bring out. Finally, to
derive a benchmark, the ratio between CPU intensity and Memory intensity is set
by the "coef" variable.

#### 4.2.2.2 Characterization of the synthetic applications

From the model described above, 6 benchmarks are produced: *C100M0*,
*C98M2*, *C96M4*, *C90M10*, *C80M20*, *C0M100*. The *CxMy* notation expresses
the proportions between the two constraint modes we wish to target: *x* is the
percentage of CPU intensity and *y* that of Memory intensity. Thus, the
*C0M100* and *C100M0* benchmarks are respectively exclusively
*memory-intensive* and *compute-intensive*. We assign up to 19 compute cores to
the execution threads, among the 20 available on our Intel server (c.f. section
[4.1.3.2](#4132-proof-of-concept-on-srad-rodinia-benchmark)).

<a id="tab-4-1"></a>

| **CPU intensity oriented** | **Memory intensity oriented** |
|---|---|
| IPC = instructions per CPU cycle | RW = MEM Read and Write |
| EXEC = instructions per nominal <br> CPU cycle | L3MB = L3 cache external memory <br> bandwidth |
| L3HIT = L3 (read) cache hit ratio | L2MPI = number of L2 (read) <br> cache misses per instruction |
| INST = Instructions retired | L3MPI = number of L3 (read) <br> cache misses per instruction |

**Table 4.1** — Description of the Intel PCM counters.

All the values described in the remainder of this part are collected from the
Intel hardware performance counters, through the Intel PCM tool
[\[1\]](references.md#ref-1), and depicted through the radar charts presented
in figure [4.13](#fig-4-13). Table [4.1](#tab-4-1) lists all the metrics
considered (i.e. performance counters), sorted according to their nature,
depending on whether they relate to compute behaviours or to memory usage.
Figure [4.13](#fig-4-13) shows that each application has its own profile, and
stresses the CPU and the memory differently, with different impacts on the
counters. Indeed, the "CPU-intensive" benchmark *C100M0* has all the counters
concerned at their maximum value. Conversely, the "memory-intensive" benchmark
*C0M100* has all the memory-oriented counters at their maximum.

<a id="fig-4-13"></a>

| <a id="fig-4-13a"></a>(a) C100M0 | <a id="fig-4-13b"></a>(b) C98M2 | <a id="fig-4-13c"></a>(c) C96M4 | <a id="fig-4-13d"></a>(d) C90M10 |
|:--:|:--:|:--:|:--:|
| ![C100M0](../assets/figures/thesis/ch04/fig-4-13a.png) | ![C98M2](../assets/figures/thesis/ch04/fig-4-13b.png) | ![C96M4](../assets/figures/thesis/ch04/fig-4-13c.png) | ![C90M10](../assets/figures/thesis/ch04/fig-4-13d.png) |

| <a id="fig-4-13e"></a>(e) C80M20 | <a id="fig-4-13f"></a>(f) C0M100 |
|:--:|:--:|
| ![C80M20](../assets/figures/thesis/ch04/fig-4-13e.png) | ![C0M100](../assets/figures/thesis/ch04/fig-4-13f.png) |

**Fig. 4.13** — Profile of the applications according to the PCM counters.

<a id="fig-4-14"></a>

| <a id="fig-4-14a"></a>(a) C100M0 | <a id="fig-4-14b"></a>(b) C98M2 | <a id="fig-4-14c"></a>(c) C96M4 | <a id="fig-4-14d"></a>(d) C90M10 |
|:--:|:--:|:--:|:--:|
| ![C100M0](../assets/figures/thesis/ch04/fig-4-14a.png) | ![C98M2](../assets/figures/thesis/ch04/fig-4-14b.png) | ![C96M4](../assets/figures/thesis/ch04/fig-4-14c.png) | ![C90M10](../assets/figures/thesis/ch04/fig-4-14d.png) |

| <a id="fig-4-14e"></a>(e) C80M20 | <a id="fig-4-14f"></a>(f) C0M100 |
|:--:|:--:|
| ![C80M20](../assets/figures/thesis/ch04/fig-4-14e.png) | ![C0M100](../assets/figures/thesis/ch04/fig-4-14f.png) |

**Fig. 4.14** — Characterization of the energy efficiency of the applications
(i.e. CpJ) and optimal configuations.

#### 4.2.2.3 Energy efficiency

<a id="tab-4-2"></a>

| **Benchmark** |  | C100M0 | C98M2 | C96M4 | C90M10 | C80M20 | C0M100 |
|---|---|---|---|---|---|---|---|
| **Best Conf.** | CpJ | 3866 | 2505 | 1581 | 818 | 517 | 336 |
| i.e. Reference | CpS | 303k | 170k | 90k | 40k | 25k | 12k |
| **vs.** | CpJ | 10% | 25% | 29% | 95% | 60% | 442% |
| **Performance** | CpS | -12% | -11% | -19% | 21% | 1% | 151% |
| **vs.** | CpJ | 16% | 24% | 33% | 44% | 75% | 469% |
| **Powersave** | CpS | 75% | 59% | 49% | 56% | 92% | 355% |
| **vs.** | CpJ | 10% | 20% | 32% | 18% | 75% | 433% |
| **Ondemand** | CpS | -12% | -14% | -17% | -1% | 50% | 193% |
| **vs.** | CpJ | 10% | 20% | 29% | 32% | 56% | 469% |
| **Conservative** | CpS | -12% | -14% | -19% | -16% | 1% | 160% |

**Table 4.2** — Gains in energy efficiency (CpJ) and performance (CpS) of the
benchmarks' optimal configurations, compared with the Linux governors:
Powersave, Performance, Ondemand and Conservative.

For each of the 6 proposed benchmarks, we carry out an exhaustive
characterization, i.e. we run the application for every possible configuration
(frequency and number of cores) and report the mean CpJ over the whole
execution duration. *Note:* The energy-consumption measurement used to compute
the CpJ is extracted directly from Intel's RAPL model-specific registers (MSR)
[\[74\]](references.md#ref-74).

The results are presented in figure [4.14](#fig-4-14), where the best
configuration is labeled. One notes the diversity of the optimal
configurations among the applications, which underlines the duality between the
intensity of the CPU constraints and the intensity of the Memory constraints
within the applications. Indeed, the two extreme applications (*C100M0* and
*C0M100*) have two opposed optimal configurations (in terms of CpJ), with
regard to the number of computing resources allocated, i.e. 1 core for the
*memory-intensive* application versus 19 cores for the *CPU-intensive*
application (maximum core count allocated, with 1 core per thread).

To observe the impact that assigning the best configuration of an application
can have, while it runs on the computing system concerned, we compare the mean
CpJ and CpS values with executions subject to the following Linux governors:
Powersave, Performance, Ondemand and Conservative. The results are reported in
table [4.2](#tab-4-2).

We obtain potential energy-efficiency gains ranging from 10% to 469%, in
comparison with the Linux governors. Performance losses are observed on most of
the *CPU-intensive* applications, but they always remain below 20%, which stays
reasonable compared with the considerable improvements in energy efficiency.
The main problem with the Linux governors is the absence of resource
management, in terms of *thread-to-core* control. This brings out the benefits
of being able to control the allocation of computing resources to parallelized
applications. Hence the use of "online" learning described later to adapt the
configuration of the system dynamically.

### 4.2.3 Reinforcement learning for dynamic reconfiguration

As already mentioned, the solution proposed to carry out the dynamic control of
the system configuration so as to maximize its energy efficiency is based on
reinforcement learning. More precisely, we draw inspiration from Deep
Q-learning (DQL) [\[112\]](references.md#ref-112), a deep learning technique
developed by DeepMind in 2015.

The control system we propose therefore performs both the training of its
neural network and the control of the configurations in real time, during the
execution of the controlled application.

This system is described in figure [4.15](#fig-4-15).

<a id="fig-4-15"></a>

![Control system.](../assets/figures/thesis/ch04/fig-4-15.svg)

**Fig. 4.15** — Control system.

It is based on the reward principle used in reinforcement learning (RL for
*Reinforcement Learning*). Here, the network is only trained to perform
combinatorial inference, which means that its decisions about the actions to
take depend solely on the current state of the system, i.e. they are not a
function of the previous states as originally in DQL. Our model was
nevertheless developed in a generic fashion so as to support the original DQL,
but this is not the subject of this contribution. The environment represents
the multicore computing system executing the OpenMP applications. For each
possible state, the quality of each action (i.e. system configuration) is
evaluated through the reward function (i.e. reward) which is a direct function
of the CpJ. Our approach for obtaining an efficient control therefore rests on
a compact definition of the state of the environment, which makes it possible
to ensure a certain speed of exploration and convergence. As a result, the
state is defined from the configuration of the computing system (i.e. current
frequency and number of active cores) and from the CpS value.

#### 4.2.3.1 The decision-making process

"Online" decision making rests on learning by experience, i.e.
*learning-by-doing*. Following RL terminology, the decisions are called
*actions* and the environment is defined by its *state*. The system starts
taking decisions at the end of its learning, which is called the *exploration
phase*. During this exploration phase, random actions are taken in order to
determine the best action for each state. The actions are rewarded according to
the benefits they bring (here, according to the CpJ value). The advantage of
using a neural network (NN for *Neural Network*) here rests on its
interpolation capabilities, i.e. the ability to predict an action for a new,
unknown state, on the basis of the knowledge accumulated during the exploration
phase.

In our context, the state is given by the system configuration coupled with the
CpS value, i.e. the set of states is not a discrete set. An action is a new
configuration to apply to the system, and the reward is the CpJ value resulting
from that change. The Tensorflow API [\[2\]](references.md#ref-2) is used to
build the neural network, through the Keras interface
[\[44\]](references.md#ref-44).

Overall, this system is effective for controlling static applications (i.e.
with a single execution phase). We illustrate its performance in section
[4.3.1](#431-static-omp-applications) on the DGEMM benchmark
[\[99\]](references.md#ref-99). However, this system has more difficulty
controlling the execution of applications that have different training phases.
Indeed, even when using all the resources of DQL (with past states taken into
account), the system does not learn correctly to identify the operating phases.
We therefore propose to include in our control loop the phase-detection tool
presented above.

#### 4.2.3.2 Including the autoencoder for multi-phase applications

<a id="fig-4-16"></a>

![Proposed autoencoder.](../assets/figures/thesis/ch04/fig-4-16.png)

**Fig. 4.16** — Proposed autoencoder.

We therefore propose to include in the control system the autoencoder presented
in section [4.1.3.1](#4131-the-proposed-autoencoder) in figure
[4.8](#fig-4-8) and summarized here in figure [4.16](#fig-4-16). It is trained
offline to reproduce the state of the environment (i.e. CpS value and system
configuration). We can thus extract from its internal layer information
relating to the phase of the application currently executing, designated by the
term *code* in figure [4.16](#fig-4-16).

The final control system is thus described in figure [4.17](#fig-4-17). The
autoencoder makes it possible to recover the phase information directly. As a
result, the CpS value becomes obsolete for the learning, and is directly
replaced by the information about the phase. We illustrate the correct
operation of the system in section [4.3.2](#432-variable-omp-applications),
where a two-phase synthetic application serves as our proof of concept.

<a id="fig-4-17"></a>

![Control system with the autoencoder.](../assets/figures/thesis/ch04/fig-4-17.svg)

**Fig. 4.17** — Control system with the autoencoder.

#### 4.2.3.3 Neural-network implementation details

All our neural networks are implemented in Python. More precisely, we use the
Tensorflow API [\[2\]](references.md#ref-2), with Keras
[\[44\]](references.md#ref-44) as frontend. The training runs use Keras's
*Adam* optimizer, with its default settings. The sizing of the networks was not
the subject of any particular optimization. It is based on the trends observed
in the state of the art, and on our experimental results.

**Agent ("NN" in figure [4.15](#fig-4-15)):** Our agent is described in table
[4.3](#tab-4-3). It is made up of 3 hidden layers (i.e. L1, L2 and L3) of the
*Dense* type. The dimension corresponds to the number of neurons. The input
layer is of dimension 3, i.e. the dimension of the state of the environment,
and the dimension of the output layer is 209, i.e. the number of possible
actions.

<a id="tab-4-3"></a>

| **Layers:** | Input | L1 | L2 | L3 | Output |
|---|:--:|:--:|:--:|:--:|:--:|
| Type | Input | Dense | Dense | Dense | Dense |
| Dimensions | 3 | 8 | 64 | 256 | 209 |
| Activation function | *–* | *Linear* | *Linear* | *Linear* | *Linear* |

**Table 4.3** — Sizing of the Agent's neural network.

The exploration period takes 2048 iterations. This number of iterations was
determined experimentally so as to guarantee correct learning by our agent
while minimizing the amount of data collected (i.e. a reduced exploration
time). The learning takes less than 100ms per iteration. In order to allow
real-time learning, we choose a controller sampling period of 500ms per
iteration. Finally, an inference is carried out in less than 2ms.

**Autoencoder:** The autoencoder is described in table
[4.4](#tab-4-4). It is composed of 7 successive hidden layers, distributed as
follows: 3 for the encoding part (i.e. L1, L2, L3), 3 for the decoding part
(i.e. L4, L5, L6), and one for the internal code. The internal code is a binary
dense layer of dimension 2, so that the phase code can take 4 values. The
binarization is ensured by the use of the *binary tanh* activation function.
The learning is done in 50 epochs, and takes less than 5s per epoch.
Consequently, it is carried out offline. Finally, less than 5ms are needed to
predict the phase ID, which makes it possible to perform the inference during
execution.

<a id="tab-4-4"></a>

| **Modules:** | Encoder | Encoder | Encoder | Encoder |  |  | Decoder | Decoder | Decoder | Decoder |
|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| **Layers:** | Input | L1 | L2 | L3 | Internal | Internal | L4 | L5 | L6 | Output |
| Type | Input | Dense | Dense | Dense | Dense | Dense | Dense | Dense | Dense | Dense |
| Dimensions | 3 | 100 | 100 | 100 | 2 | 2 | 100 | 100 | 100 | 3 |
| Activation function | *–* | *Linear* | *Linear* | *Linear* | *binary tanh* | *binary tanh* | *Linear* | *Linear* | *Linear* | *Linear* |

**Table 4.4** — Sizing of the autoencoder.

## 4.3 Results and analysis

This last part sets out the various experiments and their results. They are
conducted on the Intel Xeon server presented above. Here, the driver used is
CPUFreq, the default one on the Linux kernel, in place of Intel's driver, the
*Intel P-State*. It gives access, among other things, to the Linux governors
such as *ondemand* [\[127\]](references.md#ref-127).

The possible configurations therefore range from 1 to 19 cores, distributed
evenly over the two sockets, for an operating frequency ranging from 1.2GHz to
2.2GHz, in steps of 100MHz. We do not explore frequencies above 2.2GHz, because
the latter are subject to "thermal throttling" (TDP) and it is therefore not
possible to guarantee that they remain constant.

### 4.3.1 Static OMP applications

In this first part of the results, we look at the control of static
applications, that is to say applications having only a single execution phase,
equivalent to a single type of chunks. We therefore use the version of the
system described in figure [4.15](#fig-4-15), which does not have the
autoencoder, the phase detector.

This design is evaluated with the DGEMM benchmark
[\[99\]](references.md#ref-99). An ad-hoc exhaustive search made it possible to
determine that the optimal configuration of this application is 18 cores at
2.1GHz, for a mean CpJ of 166. The sampling period is set at 500ms, for the
data collection as well as the decision making.

<a id="fig-4-18"></a>

| <a id="fig-4-18a"></a>(a) Evolution of the energy efficiency. |
|:--:|
| ![Evolution of the energy efficiency.](../assets/figures/thesis/ch04/fig-4-18a.png) |

| <a id="fig-4-18b"></a>(b) Actions of the controller i.e. configuration. |
|:--:|
| ![Actions of the controller i.e. configuration.](../assets/figures/thesis/ch04/fig-4-18b.png) |

**Fig. 4.18** — Evolution of the system variables during the online learning,
for the control of the DGEMM benchmark.

For our experiment, the exploration phase is arbitrarily set at 2048 iterations
(i.e. 1024s), which is relatively short compared with the amounts of data
usually used in general to train a neural network. Moreover, no dataset
augmentation technique was used to improve the quality of the dataset. We
nevertheless observe in figure [4.18](#fig-4-18) that this is enough for our
system to reach near-optimal performance. Figure [4.18a](#fig-4-18a) shows the
plot of the CpJ during execution. We note the globally stable value of the CpJ,
staying within 3% of the value known for the optimal configuration. A few
fluctuations are noticeable, including sporadic transient modifications of the
configuration in figure [4.18b](#fig-4-18b). However, the mean configuration
imposed by our control system after training is 18.05 cores at 2.09GHz, which
can reasonably be considered equal to the pre-determined optimal configuration.

**Gains:** Compared with the Linux governors available on our Intel Xeon
server, our method produces the following gains: 10%, 17%, 11% and 10%,
compared respectively with the *Performance, Powersave, Ondemand,
Conservative* governors. These results are similar to those obtained for the
*C100M0* benchmark, which is consistent with the *compute-intensive* character
of DGEMM.

**Additional validations:** In addition, we propose to validate this controller
on the whole set of applications of the synthetic benchmark.

<a id="fig-4-19"></a>

| <a id="fig-4-19a"></a>(a) C100M0 | <a id="fig-4-19b"></a>(b) C98M2 | <a id="fig-4-19c"></a>(c) C96M4 | <a id="fig-4-19d"></a>(d) C90M10 |
|:--:|:--:|:--:|:--:|
| ![C100M0](../assets/figures/thesis/ch04/fig-4-19a.svg) | ![C98M2](../assets/figures/thesis/ch04/fig-4-19b.svg) | ![C96M4](../assets/figures/thesis/ch04/fig-4-19c.svg) | ![C90M10](../assets/figures/thesis/ch04/fig-4-19d.svg) |

| <a id="fig-4-19e"></a>(e) C80M20 | <a id="fig-4-19f"></a>(f) C0M100 |
|:--:|:--:|
| ![C80M20](../assets/figures/thesis/ch04/fig-4-19e.svg) | ![C0M100](../assets/figures/thesis/ch04/fig-4-19f.svg) |

**Fig. 4.19** — Energy efficiency for each of the applications of the
synthetic benchmark, while the controller is in use.

Figure [4.19](#fig-4-19) shows the evolution of the energy efficiency for each
of the six experiments (one per application). The overall remark we can make is
that, for each experiment, the energy efficiency at the end of training (after
the 1024s of pure exploration) is maximized, i.e. greater than or equal to the
maximum seen during the exploration.

Table [4.5](#tab-4-5) summarizes these results, comparing the configurations
determined by the controller with the optimal configurations measured ahead of
the simulations. The final mean configurations of the system correspond broadly
to the optimal configurations of the respective applications. Gains are even
obtained when we compare the CpJ values at the end of training with those
obtained for the optimal configurations.

<a id="tab-4-5"></a>

| **Benchmark** |  | C100M0 | C98M2 | C96M4 | C90M10 | C80M20 | C0M100 |
|---|---|---|---|---|---|---|---|
| **Best Conf.** | CpJ | 3866 | 2505 | 1581 | 818 | 517 | 336 |
|  | #cores, freq(GHz) | 19, 2.1 | 13, 2.1 | 7, 2.1 | 3, 2.1 | 2, 2.1 | 1, 1.9 |
| **vs. Results** | CpJ | 4051 | 2580 | 1603 | 839 | 575 | 405 |
|  | Gains (CpJ) | 4.8% | 3.0% | 1.4% | 2.6% | 11.2% | 20.5% |
|  | #cores, freq(GHz) | 19, 2.1 | 13, 1.9 | 8, 1.9 | 4, 2.1 | 3, 2.1 | 1, 1.9 |

**Table 4.5** — Results of the controller for each of the applications of the
synthetic benchmark.

One must, however, remain cautious about these gains. Indeed, we obtain these
very positive results, going up to 20%, in comparison with the optimal
configurations. Yet, by definition, the optimal configurations are the ones
delivering the best energy-efficiency values. This counter-intuitive result
calls for further investigation to explain its origin. It is likely that
experimental variations between the characterization of the applications and
the tests of our controller came to alter the performance of the server.
Nevertheless, the positive impact of the controller leaves no doubt in figure
[4.19](#fig-4-19) and makes it possible to definitively confirm its correct
operation for static applications.

### 4.3.2 Variable OMP applications

We now turn to the control of variable applications, that is to say
applications having several execution phases. We therefore use the version of
the system described in figure [4.15](#fig-4-15), which has the phase
detection. The rest of the experimental set-up is the same as for section
[4.3.1](#431-static-omp-applications).

#### 4.3.2.1 Evaluation on SRAD

<a id="fig-4-20"></a>

| <a id="fig-4-20a"></a>(a) CpJ for the server's 209 configurations | <a id="fig-4-20b"></a>(b) Zoom on the optimal configurations: 208 and 203 respectively for phase 1 and phase 2. |
|:--:|:--:|
| ![CpJ for the server's 209 configurations](../assets/figures/thesis/ch04/fig-4-20a.png) | ![Zoom on the optimal configurations: 208 and 203 respectively for phase 1 and phase 2.](../assets/figures/thesis/ch04/fig-4-20b.png) |

**Fig. 4.20** — Characterization of the SRAD application, on the Intel server,
distributing the resources evenly among the sockets.

We evaluate our control system on a well-known multi-phase application: SRAD,
taken from the Rodinia benchmark suite [\[41\]](references.md#ref-41). This
application possess two phases, and we propose a new characterization of this
application (i.e. different from the one proposed in figure
[4.10](#fig-4-10)), taking into account the homogeneous distribution of the
allocated resources among the two sockets of the Intel server. The results of
the characterization are described in figure [4.20](#fig-4-20). The optimal
configurations are {19 cores, f=1.6GHz} and {19 cores, f=2.1GHz}, respectively
for the high phase and the low phase.

<a id="fig-4-21"></a>

| <a id="fig-4-21a"></a>(a) Evolution of the energy efficiency. |
|:--:|
| ![Evolution of the energy efficiency.](../assets/figures/thesis/ch04/fig-4-21a.svg) |

| <a id="fig-4-21b"></a>(b) Actions of the controller i.e. configuration. |
|:--:|
| ![Actions of the controller i.e. configuration.](../assets/figures/thesis/ch04/fig-4-21b.svg) |

**Fig. 4.21** — Operating traces of the controller, for SRAD.

The results obtained with our control system are set out in figures
[4.21](#fig-4-21) and [4.22](#fig-4-22). First, an overview of the training is
given in figure [4.21](#fig-4-21), where the exploration and exploitation
periods of the learning are clearly visible, respectively from 0 to 1024s for
the pure exploration, and from 1024s to about 2000s for the exploitation. One
can also observe the transition between these two periods, between 1024s and
roughly 1700s, during which the rate of random actions decreases progressively
from 100% to 5% in favour of the actions decided by the agent. The remaining 5%
of random actions make it possible to maintain a certain level of learning, so
as to adjust the behaviours learned during the short exploration period. In the
long run, this percentage can be set to 0.

<a id="fig-4-22"></a>

| <a id="fig-4-22a"></a>(a) Evolution of the energy efficiency. |
|:--:|
| ![Evolution of the energy efficiency.](../assets/figures/thesis/ch04/fig-4-22a.svg) |

| <a id="fig-4-22b"></a>(b) Evolution of the performance, and output of the autoencoder i.e. phase ID. |
|:--:|
| ![Evolution of the performance, and output of the autoencoder i.e. phase ID.](../assets/figures/thesis/ch04/fig-4-22b.svg) |

| <a id="fig-4-22c"></a>(c) Actions of the controller i.e. configuration. |
|:--:|
| ![Actions of the controller i.e. configuration.](../assets/figures/thesis/ch04/fig-4-22c.svg) |

**Fig. 4.22** — Post-training zoom _ Operating traces of the controller,
for SRAD.

The first remark we can make is that the system converges towards one
particular configuration: {19 cores, f=1.6GHz}, the optimal configuration of
the high phase. Although this result shows a certain quality of learning, we
note the absence of any configuration change according to the execution phase
of the application. Yet it can be noted in figure
[4.22b](#fig-4-22b) that the information about the phase is correctly extracted
by the autoencoder. Several reasons may explain this operating flaw, and call
for future investigations:

- The learning is not long enough to differentiate the two phases and converge
  towards the two optimal configurations.
- Since the CpJ value of the high phase is far greater than that of the low
  phase, the learning is biased by this gap. Indeed, as the reward function is
  directly proportional to the CpJ, the learning will be greater for the high
  phase. A new reward policy could improve this.

**Gains:** Compared with the Linux governors available on our Intel Xeon
server, our method produces the following results: -12.3%, 7%, -12.9% and
-12.8%, compared respectively with the *Performance, Powersave, Ondemand,
Conservative* governors. These results are below our expectations, and are
explained by the fact that the AI did not learn correctly to assign the optimal
configuration of the low phase. When we compare the results for each of these
phases in table [4.6](#tab-4-6), we observe this shortfall. Indeed, apart from
the comparison with the *Conservative* governors, where we are slightly below
(-3.6%), we obtain energy-efficiency gains for the high phase (i.e. phase 2),
for which the configuration selected by our controller is its optimal
configuration. Then, except for the *Powersave* governor, for which our gains
go up to 16.6%, we obtain negative results on the low phase (i.e. phase 1). Yet
this low phase has a longer execution duration than the high phase (visible in
figure [4.22b](#fig-4-22b)), which logically reduces our mean gains.

<a id="tab-4-6"></a>

| **Phases** |  | Phase 1 | Phase 2 | Global |
|---|---|---|---|---|
| **Results** | CpJ | 121.3 | 386.0 | 169.6 |
| **vs. Performance** | $\delta$ | -11.5% | 6.0% | -12.3% |
| **vs. Powersave** | $\delta$ | 3.7% | 16.6% | 7% |
| **vs. Ondemand** | $\delta$ | -11.8% | 1.5% | -12.9% |
| **vs. Conservative** | $\delta$ | -10.6% | -3.7% | -12.8% |

**Table 4.6** — Differences ($\delta$) in energy efficiency (CpJ) of our
controller, compared with the Linux governors: Powersave, Performance,
Ondemand and Conservative.

In order to shed some light on the problem of learning the optimal
configurations of the phases, we propose to test our model on a synthetic
application with characteriztics different from those of SRAD. This synthetic
application also has two phases, a high phase and a low phase, with similar
execution durations, but with distant optimal configurations.

#### 4.3.2.2 Evaluation on a synthetic application

We now evaluate our design with a two-phase synthetic application. It is
derived from two synthetic static applications. One of the phases is of the
*compute-intensive* kind, similar to *C100M0*, and its optimal configuration is
{19 cores, f=2.2GHz}. The second phase is of the *memory-intensive* kind, and
has the following optimal configuration: {4 cores, f=1.3GHz}. The 2 phases thus
have very different characteriztics, unlike the phases of SRAD in the previous
section.

<a id="fig-4-23"></a>

| <a id="fig-4-23a"></a>(a) Evolution of the energy efficiency. |
|:--:|
| ![Evolution of the energy efficiency.](../assets/figures/thesis/ch04/fig-4-23a.png) |

| <a id="fig-4-23b"></a>(b) Actions of the controller i.e. configuration. |
|:--:|
| ![Actions of the controller i.e. configuration.](../assets/figures/thesis/ch04/fig-4-23b.png) |

**Fig. 4.23** — Operating traces of the controller, for the 2-phase
benchmark.

As can be seen in figure [4.23a](#fig-4-23a), the two phases are clearly
identifiable through the CpJ plot, reflecting the different types of workload
executed. Although not shown on these graphs, the autoencoder generates the
information relating to the phases right from the start of the execution. The
neural network of the online controller is therefore trained directly with this
datum. As previously, this training is carried out during the first 1024
seconds.

From the very beginning of the exploitation phase (i.e. from 1024s onwards), we
observe that the controller identifies only 2 phases, and adapts the
configuration accordingly, validating the operation of the autoencoder. The
online control selects 19 and 5 cores respectively for the two phases, which
corresponds to the known optimal configurations. As for the frequency, the
latter oscillates between 1.2GHz and 1.4GHz, which is not close enough to the
known configurations, suggesting that a longer training time would make it
possible to improve the energy efficiency.

**Gains:** Compared with the available Linux governors, our method produces the
following gains: 51%, 7%, 51% and 50%, compared respectively with the
*Performance, Powersave, Ondemand, Conservative* governors. The potential gains
of each phase were measured individually through an offline characterization,
and an improvement of the training could eventually produce gains ranging from
34% to 136%, again in comparison with the Linux governors.

<a id="fig-4-24"></a>

| <a id="fig-4-24a"></a>(a) Evolution of the energy efficiency. |
|:--:|
| ![Evolution of the energy efficiency.](../assets/figures/thesis/ch04/fig-4-24a.svg) |

| <a id="fig-4-24b"></a>(b) Actions of the controller i.e. configuration. |
|:--:|
| ![Actions of the controller i.e. configuration.](../assets/figures/thesis/ch04/fig-4-24b.svg) |

**Fig. 4.24** — Operating traces of the controller, for the 2-phase
benchmark.

**Verification:** Finally, we propose here to validate the value of the
autoencoder by repeating the last experiment but implementing the controller
model without the autoencoder. As can be seen in figure
[4.24](#fig-4-24), unlike figure [4.23](#fig-4-23), nothing brings out a
correlation between the actions taken and the phase changes. Moreover, we
obtain a mean CpJ value after training that is 34% lower than in the previous
experiment (i.e. with the autoencoder). The autoencoder, and more generally the
information about the execution phase, therefore makes it possible, as
expected, to improve the learning of the controller.

#### 4.3.2.3 Discussion

Overall, we can therefore confirm that our control system, enriched with a
phase-detection module, is capable of learning to recognize the operating
phases of an application, and of adjusting the configuration of the system
according to that information in order to optimize the energy efficiency of the
computation.

The proposed autoencoder proves particularly effective at performing this phase
detection in real time. However, in the current solution, the autoencoder is
trained for a single application and before being included in the control
system. This therefore runs counter to the primary advantage of the real-time
learning brought by RL. Several solutions to this limitation may be the subject
of future work, such as the design of a general-purpose autoencoder, or the
inclusion of phase detection within the RL.

Next, limitations appear as regards the degrees of precision that our model can
tolerate. Indeed, we note that for the SRAD application, whose phases have
similar optimal configurations, our model does not distinguish between these
two configurations, leading to losses in energy efficiency. Conversely, when
the optimal configurations are far apart, as for our synthetic application, the
learning converges correctly and makes it possible to gain in energy
efficiency. Future work will consist in precisely defining these limitations,
and in modifying the parameters and the learning policy of the controller
accordingly.

Finally, to the initial usage assumptions is added the constraint of the
sampling period, which must allow both the various processing steps of the
controller to be carried out (i.e. RL training, neural network inferences,
etc.) and the evolution of an application to be followed (i.e. a period longer
than the execution duration of a chunk). These various constraints raise
difficulties in selecting real applications eligible for our control, which
explains the limited number of results. Future work will consist in pushing
back these limitations, so as to be able to apply our method to a larger set of
applications.

## 4.4 Summary

Having shown the potential of chunks as a reliable metric for monitoring
performance and energy efficiency, we turned to the exploitation of
neural-network-type solutions in order to propose a methodology for controlling
OpenMP applications.

A tool based on autoencoders is thus presented to detect and identify the
execution phases of an application, if any exist. This tool proves particularly
effective on two-phase applications, but future studies will have to be
conducted to validate this operation on applications with a larger number of
phases.

Next, a system-configuration control method is proposed to optimize both the
number of resources allocated to the workload and their operating frequency.
This control is built around a reinforcement learning inspired by DQN, and
allows an automatic optimization of the configuration during the execution of
the application to be optimized, without prior training (except for the
autoencoder if it is used). This method is validated on a set of synthetic
applications designed to represent the *memory-intensive vs. compute-intensive*
duality. Significant energy-efficiency gains were obtained when comparing our
method with the classic Linux governors. Future work will have to confirm these
results on benchmarks of real applications. Indeed, although convincing, our
validation rests mainly on synthetic applications. It will therefore be
necessary to show the robustness of our solution on recognized benchmarks.
Finally, in view of the recent literature (e.g. AdaMD
[\[18\]](references.md#ref-18)), a development of our solution towards
multi-task management will be interesting to explore. Indeed, our solution is
by its very nature *application-specific* because of the use of chunks, whereas
the trend is towards something more general, with a dynamic control that is
effective for any new application executed on the system. Techniques such as
transfer learning [\[155\]](references.md#ref-155) could make it possible to
remedy this shortcoming.

Finally, the multi-phase control was tested on a real application as well as a
synthetic application. The results confirm that RL can enable an adaptive
control of parallel computation. In particular, adding a phase-identification
module allows the system to learn the different actions to take in order to
optimize the energy efficiency of the computing system. Moreover, this learning
requires only 2048 data points, which is little compared with well-known
databases (e.g. 70000 data points for MNIST). However, these results are not
optimal and call for future work in order to make the system more precise and
more robust. Indeed, we noted a learning flaw of the controller for the SRAD
application, which has two similar optimal configurations. More thorough
research will therefore make it possible to adjust the learning policy of the
controller, as well as the overall control system. An important point of
improvement is the operating frequency of the controller. Indeed, the latter
operates at 2Hz, i.e. one action every 0.5s. This sampling period limits the
number of detectable execution phases to phases with a minimum duration of 1s.
Moreover, although the number of data points needed for correct learning is
only 2048, that amounts to 1024s of execution and therefore represents an
additional limit on the use of our method, i.e. the control of an application
running for several hours so as to make this period of pure learning
negligible.

This chapter dealt with the work carried out within the framework of our first
research axis. The next chapter addresses our second axis, centred on the
optimization of hardware design. More precisely, the aim is to optimize NoC
designs in order to improve their energy efficiency, or any other metric
considered. Indeed, although motivated by the optimization of systems'
consumption, the proposed solution is intended to be general and not limited to
a single lever of improvement.
