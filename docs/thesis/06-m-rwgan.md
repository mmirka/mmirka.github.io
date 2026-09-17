---
title: Generating optimized heterogeneous networks-on-chip
chapter: 6
lang: en
source: Chapitre5/Contribution3.tex
---

# 6. Generating optimized heterogeneous networks-on-chip

<div class="lang-switch" markdown>
<span class="lang-pill is-current">English</span>
[Français](fr/06-m-rwgan.md){ .lang-pill title="Ce chapitre en français" }
</div>

In this chapter we take an interest in the generation of heterogeneous NoCs.
Here, unlike in the previous chapter, we consider NoCs with a fixed topology –
i.e. a mesh – and we focus on the type of the routers implemented. We were able
to observe that our GANNoC solution presented previously is general enough to be
applied to different problems. We therefore propose to apply this method to the
production of heterogeneous NoCs, that is to say NoCs holding routers of
different natures, and to extend the RWGAN concept so as to consider several
reward functions at once, i.e. multi-objective learning. This chapter is
supported by the following publication: [\[105\]](references.md#ref-105).

> **Code.** A clean-room reproduction of the method of this chapter is
> available at [mmirka/m-rwgan](https://github.com/mmirka/m-rwgan).

## 6.1 Heterogeneous NoCs: motivation and challenges

### 6.1.1 Asymmetric traffic

With the aim of simplifying the NoC design process, NoCs are generally designed
on the basis of uniform or very regular synthetic traffic, e.g. *transpose*,
*bitreverse*, etc.
[\[49\]](references.md#ref-49).
However, the nature of the applications executed on a SoC is often quite
different [\[69\]](references.md#ref-69).
Unfortunately, an insufficient understanding of the expected traffic may lead to
a sizing of the NoC that is neither optimal nor cheap.
Thus, in order to illustrate this point, we carried out a study on real
applications.
We analyzed traces coming from the Netrace tool
[\[76\]](references.md#ref-76). These traces are extracted from the execution
of PARSEC applications [\[24\]](references.md#ref-24) on the M5 simulator
[\[25\]](references.md#ref-25) for a homogeneous multicore system of 64 cores
with shared memory. *Simmedium* inputs are used across the whole set of PARSEC
applications, apart from the *Bodytrack* and *Swaption* benchmarks, for which
*simlarge* inputs are used.

<a id="fig-6-1"></a>

![Number of packets received per core for 8 applications of the Parsec benchmark run on 64 cores](../assets/figures/thesis/ch06/fig-6-1.svg)

**Fig. 6.1** : Number of packets received per core for 8 applications of the
Parsec benchmark run on 64 cores

Figure [6.1](#fig-6-1) sets out the number of packets received during the
execution of eight applications of the PARSEC benchmark.
The 64 cores of the SoC are organized into an 8 by 8 *mesh*, with their IDs
translated into X-Y coordinates.
For each of the applications, one notices a wide disparity in the number of
packets received by the cores, without any particular symmetric traffic pattern.
These differences show that some routers are more heavily solicited than others,
and reveal the inefficient use of the resources of the homogeneous NoC.
It should be noted that these hotspots are observed for a SoC that is
homogeneous as well.
However, the SoCs designed nowadays are more and more heterogeneous (CPU, GPU,
accelerators, ...) for energy-efficiency reasons, which brings new sources of
asymmetry into the traffic.
As a result, one solution to improve the energy efficiency of SoCs is to design
heterogeneous NoCs adapted to the traffic constraints.

### 6.1.2 An immense design space

This work therefore addresses the problem of designing optimized heterogeneous
NoCs. In particular, we propose a solution making it possible to cover large
design spaces for which classical exhaustive search methods are not conceivable,
owing to an excessive computation time.

Indeed, design spaces grow rapidly given the set of parameters defining a
heterogeneous NoC. For example, let us take an 8x8 mesh network, and let us
consider only the router type. For $n$
possible router types, we obtain the number of combinations $C =
n^{64}$. Thus, for only 3 router types, i.e. $n=3$, we obtain $ C
= 3^{64} \approx 10^{30}$ possible design combinations. Moreover, the connection
type and the network topology are further parameters that can be considered,
leading to an immense design space.
As a result, an exhaustive evaluation of the design space by a NoC designer is
not conceivable.

## 6.2 Multi-objective learning

### 6.2.1 Generated data

Still with a view to making the link with the field of graphs, in the previous
[chapter 5](05-gannoc.md) we generate adjacency matrices, whereas in this
chapter we generate the parameter matrices (i.e. $X$, to reuse the notation of
the graph field, see section
[5.1](05-gannoc.md#51-nocs-and-graph-theory)).
As a result, we consider here the generation of heterogeneous NoCs for a fixed
topology (constant adjacency matrix $A$). The heterogeneity therefore comes from
the properties of the routers implemented.

In this work, we consider the router type as the only parameter. The matrix $X$
thus describes the class of each of the routers implemented. To describe the
router class, a *one-hot* vector description is used. In classification, a
one-hot vector is a binary representation of the class and works in the
following way: for $n$ possible data classes, the one-hot vector holds $n$
elements, called bits. Each bit represents one possible category. Thus, to
encode the class of a datum with a one-hot vector, it is enough to set to 1 the
bit corresponding to the class, and to leave the others at 0. This
classification method differs from numerical encoding methods (e.g. classA = 1,
classB = 2, classC = 3), which intrinsically contain an ordering of the classes,
and therefore a value bias. In our case, our categories hold no ordering
relation, so the neutral one-hot encoding is ideal.
This description therefore allows better learning on the part of the neural
network for a classification whose categories hold no ordering relation between
them.

### 6.2.2 The M-RWGAN architecture

<a id="fig-6-2"></a>

![Diagram of the Multi-Objectives RWGAN, with the gradient descent of the generator's training shown as red arrows](../assets/figures/thesis/ch06/fig-6-2.svg)

**Fig. 6.2** : Diagram of the Multi-Objectives RWGAN, with the gradient descent
of the generator's training shown as red arrows.

We propose here an improvement of the RWGAN presented in the previous chapter.
Whereas the RWGAN holds only a single optimization objective – i.e. one reward –
the architecture presented here makes it possible to implement several
optimization objectives for one and the same generator. We name this new
architecture Multi-Reward WGAN (M-RWGAN). As mentioned in section
[6.2.1](#621-generated-data), the data generated in this work are parameter
matrices of heterogeneous NoCs. Our M-RWGAN architecture is therefore used to
generate configurations of heterogeneous NoCs with a fixed topology (here, an
8x8 mesh), optimized according to different objectives.
For example, it is possible to implement a two-objective M-RWGAN making it
possible to consider both the throughput and the power consumption, through two
distinct rewards, so as to globally optimize the energy efficiency.

**Description of the M-RWGAN** The M-RWGAN concept therefore extends the RWGAN
architecture by giving the possibility of implementing several reward modules,
allowing a multi-objective training of the generator (see figure
[6.2](#fig-6-2)).
We stay with an MLP for the generator architecture. We took an interest in the
GCN (Graph Convolutional Network
[\[89\]](references.md#ref-89)) for the architecture of the critic and reward
modules, since this type of neural network is specific to the processing of
graph-type data. However, we shall see in the results sections that the CNN
architecture can sometimes prove more effective at learning patterns.
The training of the critic is similar to the traditional WGAN-GP.
It takes as input $x$ and $\hat{x}$, respectively the real and the generated
data, and produces a score $\hat{y}$ relating to the "realness" of its input
(i.e. whether or not it may belong to the space of the real data). It is then
trained to reduce its prediction error, i.e. to minimize the W-loss.
The generator produces $\hat{x}$ from a random input $z$. $\hat{x}$
is processed by the critic and the rewards ($R_i$, with $i \in [1,n]$).
As illustrated in figure [6.2](#fig-6-2), the parameters of the generator are
then trained from the outputs of these modules, i.e. $\hat{y}$ coming from the
critic, and $s_i$ coming from the rewards $R_i$. This learning happens through
the backpropagation of the gradient of the respective losses, with the reward
blocks and the critic considered in inference mode. During its learning, the
generator thus seeks to minimize the W-loss coming from the critic, as well as
the losses coming from the rewards. The latter are obtained through a mean
squared error measurement with respect to the corresponding objectives.
The rewards are models that have gone through supervised learning before being
included in the generator's training. They are trained on labeled datasets
built with the help of a NoC simulator, allowing us to associate performance
measurements with NoC configurations. Once included in the M-RWGAN, the rewards
are no longer trained, and are used only in inference mode.

**Multi-objective loss function** We now illustrate the working of our
multi-objective implementation with the loss function of the generator. Indeed,
it is at that level that the multi-objective aspect is really taken into
account. As for any neural network, during its training the generator seeks to
minimize its error (i.e. loss). The principle of the loss function of the
generator of an RWGAN is recalled here:

<a id="eq-6-1"></a>

$$
L_G(z) = (1-\lambda) L_C(\hat{x}) + \lambda [\beta L_R(\hat{x})]
\tag{6.1}
$$

, where $L_G$, $L_C$ and $L_R$ are respectively the loss functions of the
generator, critic and reward. $lambda$ is the coefficient of distribution
between the error of the critic and that of the reward considered in the
generator's training.
$\beta$ is a coefficient making it possible to balance the difference of
magnitude that may appear between the loss values of the critic and the reward.
Given our M-RWGAN architecture, the new loss function of the generator is
defined as follows:

<a id="eq-6-2"></a>

$$
L_G(z) = (1-\lambda) L_C(\hat{x}) + \lambda [\sum_{i=1}^{n} \beta_i L_{R_i}(\hat{x})]
\tag{6.2}
$$

, where $\sum_{i=1}^{n} \beta_{i} = \beta$, $\beta$ comes from Eq.
[5.1](05-gannoc.md#eq-5-1) and $L_{R_i}$ is the loss function of the
$i^{\text{ème}}$ reward.
*Note:* as $n$ grows, it will be important to adjust the value of $\beta$ with
care so as to avoid a deterioration of the loss values.

Thus, our architecture provides a solution for training a generative neural
network according to several objectives.
It is moreover possible to adjust as desired the impact of each of the
objectives by means of coefficients (i.e. $\beta_i$), making it possible to tune
the global multi-objective function with precision.

## 6.3 Results and analysis

We present here various promising results obtained with our tool. These results
constitute a proof of concept that comes to complete the work presented in
[chapter 5](05-gannoc.md).

### 6.3.1 Experimental conditions

**Design space** We limit our experiments to the generation of parameter
matrices X, corresponding to the types of the routers. The NoC topologies are
identical, and we consider 8x8 meshes.

The list of router classes is presented in table
[6.1](#tab-6-1). We have 3 router classes, which differ by the size of their
buffers. These are homogeneous routers, i.e. all the buffers have the same size,
and of classical structure (5 ports: North, South, East, West, Local).

<a id="tab-6-1"></a>

| **Name** | Big | Medium | Small |
|:--:|:--:|:--:|:--:|
| **Buffer size** | 12 | 4 | 2 |

**Table 6.1** : Buffer size in *flits*.

**Simulator** In order to obtain, for different traffic patterns, the
performance and energy consumption measurements of the produced NoCs, we use
*Omnet++* [\[164\]](references.md#ref-164), a high-level discrete-event
simulator for communication networks. On this simulator, we exploit the HNOCS
framework [\[19\]](references.md#ref-19), which provides the basic models to
simulate NoCs such as the virtual channels and the conventional router with a
3-stage pipeline.
We complete this framework with the addition of synthetic traffic patterns, e.g.
hotspot [\[49\]](references.md#ref-49). We add to the framework the use of the
*Orion3* library [\[83\]](references.md#ref-83) to obtain estimates of the
static and dynamic power consumption. From the hardware parameters of the
targeted technology, and from the simulated switching rate, this library makes
it possible to estimate the consumption of a system with a low error: less than
$10\%$ compared with lower-level RTL models.
Table [6.2](#tab-6-2) presents the main technology parameters used in our study.

<a id="tab-6-2"></a>

| **Manufacturing** | **Vdd** | **Frequency** | **Crossbar type** |
|:--:|:--:|:--:|:--:|
| $45nm$ | $1.0V$ | $650MHz$ | Matrix |

**Table 6.2** : Orion3.0: technology parameters

**M-RWGAN architecture and parameters** Our M-RWGAN is built with three reward
blocks: one reward for the saturation threshold, a second reward for the energy
consumption at the saturation threshold and a last one for the area of the NoC.
The purpose of these rewards is that, by playing on their importance in the
generator's training, it should be possible to modify the specificities of the
generated NoCs with either a tendency towards energy saving, at the expense of
the bandwidth (i.e. a low saturation threshold), or a preference for a high
saturation threshold but at a higher energy consumption. Finally, it will be
interesting to find a configuration that optimizes both objectives, so as to
tend towards an optimal energy efficiency – i.e. a high saturation threshold for
a minimal energy consumption.

Following the example of the RWGAN in the previous chapter, the dimensions of
the networks were determined empirically, and therefore do not follow from any
particular optimization methodology. The details of the various modules of the
M-RWGAN are given in tables [6.3](#tab-6-3) and [6.4](#tab-6-4).

<a id="tab-6-3"></a>

**Generator**

| **Layers:** | Input | L1 | L2 | Output |
|--:|:--:|:--:|:--:|:--:|
| Type | Input | Dense | Dense | Dense |
| Dimensions | 100 | 768 | 1536 | 192 |
| Activation<br>function | *–* | *LeakyReLU<br>($\alpha = 0.2$)* | *LeakyReLU<br>($\alpha = 0.2$)* | *LeakyReLU<br>($\alpha = 0.2$)* |

**Critic**

| **Layers:** | Input A<br>Input X | L1 | L2 | L3 | Output |
|--:|:--:|:--:|:--:|:--:|:--:|
| Type | Input x2 | GCN | GCN | GCN | Dense |
| Dimensions | A: 64x64<br>X: 64x3 | 16 | 32 | 64 | 1 |
| Activation<br>function | *–* | *LeakyReLU<br>($\alpha = 0.2$)* | *LeakyReLU<br>($\alpha = 0.2$)* | *LeakyReLU<br>($\alpha = 0.2$)* | *Linear* |

**Table 6.3** : Dimensioning of the Generator and Critic modules of the M-RWGAN

> Rendered as two tables; the printed thesis shows them side by side
> (Table 6.3).

The generator is an MLP network with 2 hidden layers (see table
[6.3](#tab-6-3)). It takes as input a random vector of 100 units. Its output is
resized into a 64x3 matrix so as to match the dimensions of the matrix $X$ to be
generated. Finally, to enforce the *one-hot* encoding, the *GumbelSoftmax*
activation function is applied to the generator's output
[\[38\]](references.md#ref-38).

The critic is a convolutional GCN-type neural network
[\[89\]](references.md#ref-89). Its GCN-type layers are implemented through the
*Spektral* library [\[68\]](references.md#ref-68), which is based on Keras. The
critic is thus composed of 3 GCN-type layers, and of a dense output layer. The
critic holds two inputs, corresponding to the adjacency matrix $A$ and the
matrix $X$ of the evaluated graphs.

<a id="tab-6-4"></a>

**Reward GCN**

| **Layers:** | Input A<br>Input X | L1 | L2 | L3 | L4 | Output |
|--:|:--:|:--:|:--:|:--:|:--:|:--:|
| Type | Input x2 | GCN | GCN | GCN | GCN | Dense |
| Dimensions | A: 64x64<br>X: 64x3 | 128 | 64 | 64 | 32 | 1 |
| Activation<br>function | *–* | *LeakyReLU<br>($\alpha = 0.2$)* | *LeakyReLU<br>($\alpha = 0.2$)* | *LeakyReLU<br>($\alpha = 0.2$)* | *LeakyReLU<br>($\alpha = 0.2$)* | *Sigmoid* |

**Reward CNN**

| **Layers:** | Input | L1 | L2 | L3 | Output |
|--:|:--:|:--:|:--:|:--:|:--:|
| Type | Input | CNN | CNN | Dense | Dense |
| Dimensions | X: 8x8x3 | 128<br>filter: 3x3<br>stride: 1 | 32<br>filter: 3x3<br>stride: 2 | 128 | 1 |
| Activation<br>function | – | *LeakyReLU*<br>*($\alpha = 0.2$)* | *LeakyReLU*<br>*($\alpha = 0.2$)* | *LeakyReLU*<br>*($\alpha = 0.2$)* | *Sigmoid* |

**Table 6.4** : Dimensioning of the various Rewards of the M-RWGAN

> Rendered as two tables; the printed thesis shows them side by side
> (Table 6.4).

The implemented rewards can be of two types: convolutional GCN or CNN, whose
details are given in table [6.4](#tab-6-4).
As for the critic, the GCN rewards make it possible to process the matrices $X$
in two dimensions: 64x3, for the number of routers (i.e. 64) and the number of
router classes (i.e. 3 possible classes). They also require the adjacency matrix
$A$ as an input in order to perform the convolution.
They are built with 4 GCN layers, and a dense output layer with *Sigmoid* as
activation function (i.e. to guarantee a score $\in$
[0,1]).
The CNN-type rewards, making it possible to process the matrices $X$ in three
dimensions: 8x8x3, for the dimensions of the 8x8 mesh and the class dimension
(i.e. 3, for the 3 possible categories). They do not consider the matrix
$A$. We shall use them for instance to approximate the area function, which
predicts the area of a NoC as a function of its routers, and which therefore
does not require any knowledge of the topology. The CNN rewards are implemented
with 2 convolutional layers, followed by a dense layer. The output layer is a
dense layer with *Sigmoid* as activation function.

The training of each reward is carried out upstream of the training of the
M-RWGAN, so as to use them only in inference during the training of the
M-RWGAN. Their learning uses the *Adam* optimizer and converges quickly (about
20 epochs) towards minimal errors, below 1% on test data, which ensures a good
evaluation of the generator's outputs. The overall training of the M-RWGAN is
similar to the RWGAN presented in [chapter 5](05-gannoc.md).

### 6.3.2 Datasets: preliminary analysis

We study the learning of our model for two different traffic patterns: uniform
and hotspot30, flowing on an 8x8 mesh NoC. The load of these traffic patterns is
represented in figure [6.3](#fig-6-3). Thus, the objective of the training of
the M-RWGAN will be to generate X matrices of NoCs optimized for these traffic
patterns, according to different optimization criteria. Our optimization
criteria will be the saturation threshold, the power consumed at the saturation
threshold and the area. Thus, by adapting the importance of these optimization
criteria, it is possible to vary the learning conditions and the final
characteriztics of the generated NoCs.

<a id="fig-6-3"></a>

![Normalized amount of traffic received per router for 2 synthetic traffic patterns run on an 8x8 mesh](../assets/figures/thesis/ch06/fig-6-3.svg)

**Fig. 6.3** : Normalized amount of traffic received per router for 2 synthetic
traffic patterns run on an 8x8 mesh: hotspot30 (i.e. 30% of the traffic is
destined for router 54), and uniform.

The database, or dataset, plays a major role in machine learning. Indeed, it is
from this dataset that the AI is going to train in order to build its final
model. Analyzing the dataset therefore makes it possible to check, on the one
hand, that the latter holds no particular bias (e.g. an imbalance in the
proportions of the labels for a classification), and, on the other hand, to
anticipate the patterns that the AI may learn. In our case, the dataset must
allow the AI to learn to assign a router size as a function of its position, of
the traffic and of the optimization parameters. We therefore propose here to
analyze the training datasets of the M-RWGANs in order to determine the
potential learning biases present.

Our datasets contain only $X$ matrices (i.e. router types) for 8x8 meshes. In
order to limit a first bias in the construction of the dataset, these matrices
are generated randomly, ensuring both a homogeneity over the types of each
router, and also over the distribution of the router types. Thus, we ensure that
there is no imbalance in the datasets, so as to avoid finding ourselves in a
case of imbalanced learning [\[91\]](references.md#ref-91). These datasets
contain, for each traffic pattern, 10k $X$ matrices, associated with the
simulation data of the corresponding NoC (i.e. latencies, power, area, etc.).
These simulation data are used only for the training of the Rewards. The modules
of the GAN (generator and critic) train only on the X matrices.

We therefore analyze our datasets for the uniform traffic and the hotspot30
traffic, taking a closer interest in the saturation threshold and power data,
and in their correlation with the router types (i.e. size). The area data are
not studied here. Indeed, the router types are directly linked to the router
size (i.e. buffer size). Now, having guaranteed the homogeneity of the
distribution of the classes, the same goes for the distribution of the areas.

#### 6.3.2.1 Uniform traffic

Let us first look at the biases existing in our dataset for the uniform traffic.
A bias is defined as a non-uniformity of the dataset, with respect to a
particular datum. The distribution of the dataset is presented in figure
[6.4](#fig-6-4), as a function of the saturation threshold and of the power
consumption, respectively figures [6.4a](#fig-6-4a) and
[6.4b](#fig-6-4b).

<a id="fig-6-4"></a>

| <a id="fig-6-4a"></a>(a) Distribution of the NoCs of the dataset according to their saturation threshold. | <a id="fig-6-4b"></a>(b) Distribution of the NoCs of the dataset according to their power (mW) at the saturation threshold. |
|:--:|:--:|
| ![Distribution of the NoCs of the dataset according to their saturation threshold](../assets/figures/thesis/ch06/fig-6-4a.png) | ![Distribution of the NoCs of the dataset according to their power (mW) at the saturation threshold](../assets/figures/thesis/ch06/fig-6-4b.png) |

**Fig. 6.4** : Distribution of the uniform dataset.

One observes a substantial bias around the saturation threshold of 13% and the
power of 1200mW. One may therefore expect the training of the GAN, without the
rewards, to tend towards the generation of NoCs having a medium saturation
threshold and a low power consumption. We note moreover for this dataset a mean
saturation threshold of 12.88% and a mean power at the saturation threshold of
1136mW. Furthermore, the extreme values of the saturation threshold are hardly
present, indicating that there are few configurations supporting an injection
rate above 18%. Finally, one notices that the two distributions are similar,
indicating a correlation between the saturation threshold and the power
consumption. This matches the results expected for a NoC subjected to uniform
traffic. Indeed, in order to improve the saturation threshold of a NoC subjected
to uniform traffic, one must among other things increase the bandwidth of the
routers and hence their size, which increases the overall consumption of the
NoC.
This analysis is logically confirmed when one looks in detail at the mean router
size of the NoCs, as a function of the power consumption and of the saturation
threshold, figure [6.5](#fig-6-5). Indeed, one can see that the higher the
saturation threshold of the NoCs, the larger the router size. The same goes for
the power. One notices however that this simple analysis does not make it
possible to extract the traffic pattern, which should logically be correlated
with the router size in order to optimize the energy efficiency. We shall see in
what follows how the learning of the GAN behaves.

<a id="fig-6-5"></a>

| <a id="fig-6-5a"></a>(a) Saturation threshold. |
|:--:|
| ![Saturation threshold](../assets/figures/thesis/ch06/fig-6-5a.svg) |

| <a id="fig-6-5b"></a>(b) Power (mW) at the saturation threshold. |
|:--:|
| ![Power (mW) at the saturation threshold](../assets/figures/thesis/ch06/fig-6-5b.svg) |

**Fig. 6.5** : Mean router size, as a function of the saturation threshold
[6.5a](#fig-6-5a) and of the power consumption [6.5b](#fig-6-5b) of the NoCs,
for **uniform** traffic.

#### 6.3.2.2 Hotspot30 traffic

Let us now look at the biases existing in our dataset for the hotspot30
traffic. The distribution of the dataset is presented in figure
[6.6](#fig-6-6), as a function of the saturation threshold and of the power
consumption, respectively figures [6.6a](#fig-6-6a) and
[6.6b](#fig-6-6b).

<a id="fig-6-6"></a>

| <a id="fig-6-6a"></a>(a) Distribution of the NoCs of the dataset according to their saturation threshold. | <a id="fig-6-6b"></a>(b) Distribution of the NoCs of the dataset according to their power (mW) at the saturation threshold. |
|:--:|:--:|
| ![Distribution of the NoCs of the dataset according to their saturation threshold](../assets/figures/thesis/ch06/fig-6-6a.png) | ![Distribution of the NoCs of the dataset according to their power (mW) at the saturation threshold](../assets/figures/thesis/ch06/fig-6-6b.png) |

**Fig. 6.6** : Distribution of the hotspot30 dataset.

One notices the presence of biases on certain values. In particular, we note a
higher density of NoCs having a power around 325mW and 250mW. Likewise, two
saturation threshold values stand out, with 2.75% and 3.75%. These particular
points may be explained by the fact that the hotspot traffic is going to impact
a limited number of routers. Thus, large differences of values may appear
between similar configurations whose few differences happen to lie at the level
of the hotspot. It will be interesting to see how the learning of the RWGAN will
be impacted by these biases. We note for this dataset a mean saturation
threshold of 3.22% and a mean power at the saturation threshold of 315mW.

In the same way as for the uniform traffic, we observe in figure
[6.7](#fig-6-7) the mean router size of the NoCs as a function of the saturation
threshold and of the power consumption. This time, we notice very clearly the
correlation between the traffic pattern and the router size. Although,
intuitively, the tendency remains the same as for the uniform traffic (the
saturation threshold and the consumption increase when the router size
increases), one clearly distinguishes the location of the hot spot, confirming
its impact on the performance of the NoC. Thus, one can confirm that the
performance of a NoC subjected to hotspot traffic is mainly impacted by the
architecture of the routers located in the vicinity of the hot spot (here
vertically, owing to the XY routing). More broadly, this confirms the interest
of having the router architecture correlated with the traffic load.

<a id="fig-6-7"></a>

| <a id="fig-6-7a"></a>(a) Saturation threshold. |
|:--:|
| ![Saturation threshold](../assets/figures/thesis/ch06/fig-6-7a.svg) |

| <a id="fig-6-7b"></a>(b) Power (mW) at the saturation threshold. |
|:--:|
| ![Power (mW) at the saturation threshold](../assets/figures/thesis/ch06/fig-6-7b.svg) |

**Fig. 6.7** : Mean router size, as a function of the saturation threshold
[6.7a](#fig-6-7a) and of the power consumption [6.7b](#fig-6-7b) of the NoCs,
for **hotspot30** traffic.

### 6.3.3 Experiments

Figure [6.3](#fig-6-3) represents the distribution of the load of the traffic
flowing on an 8x8 mesh, for two synthetic traffic patterns. The objective here
is to train the M-RWGAN to generate heterogeneous NoC configurations according
to different optimization criteria, and for the traffic patterns presented in
figure [6.3](#fig-6-3). We recall that the generator produces X matrices
describing the class of each of the routers, for an 8x8 mesh, and for the 3
possible classes described in table [6.1](#tab-6-1).

For each learning run, we fix the proportion of the rewards impacting the
training of the generator. Thus, in the remainder of this manuscript, we shall
use the notation \<reward\>\<proportion\> to describe the weights of the reward
blocks, with \<reward\> equal to *Sat*, *Pow*, *Area* respectively for the
reward of the saturation threshold, the reward of the power at the saturation
threshold and the reward of the area. The value \<proportion\> will lie between
0 and 100,
thus describing the proportion of the reward in the final loss function (i.e.
equivalent to $\beta_{i}$ in equation [6.2](#eq-6-2)). For example, a learning
run taking into account the saturation threshold at 90% and the power
consumption at 10% will see its reward designated by the notation "Sat90Pow10"
(with Area0 implied).

#### 6.3.3.1 Parameters and illustration of the training runs

The training runs are done over 300 epochs and $\lambda$ (see equation
[6.2](#eq-6-2)) decreases progressively from $1$ towards $0.2$ starting from
epoch 50. These values were determined empirically, so as to guarantee a "soft"
transition between the learning of the generator linked only to the critic
($\lambda = 1$), and the learning of the generator mainly guided by the global
reward ($\lambda = 0.2$).

<a id="fig-6-8"></a>

| <a id="fig-6-8a"></a>(a) $\beta = 1$ | <a id="fig-6-8b"></a>(b) $\beta = 10$ |
|:--:|:--:|
| ![beta = 1](../assets/figures/thesis/ch06/fig-6-8a.svg) | ![beta = 10](../assets/figures/thesis/ch06/fig-6-8b.svg) |

**Fig. 6.8** : Mean router size, as a function of the value of $\beta$, for a
training run of 300 epochs on the uniform traffic, with the saturation reward
only (Sat100).

The variable $\beta$ is fixed at 10 in order to limit the impact of the bias
linked to the mean of the dataset. Figure [6.8](#fig-6-8) illustrates this
interest. On this figure are compared the mean router size of the generated
NoCs, after two M-RWGAN training runs considering only the reward of the
saturation threshold, for $\beta = 1$ and $\beta = 10$. Thus, the expected
result is that the generator produce NoCs having routers of large size in order
to maximize the saturation threshold (i.e. maximize the reward). One observes
that with $\beta = 1$, the outer routers are reduced, which does not match the
analysis of the dataset and the impact of the bias. Now, with $\beta = 10$ (i.e.
the loss of the reward weighs more than the loss of the critic), one logically
observes a greater impact of the reward, making it possible to compensate for
the bias of the critic.

<a id="fig-6-9"></a>

| <a id="fig-6-9a"></a>(a) epoch 0 | <a id="fig-6-9b"></a>(b) epoch 50 | <a id="fig-6-9c"></a>(c) epoch 100 | <a id="fig-6-9d"></a>(d) epoch 200 |
|:--:|:--:|:--:|:--:|
| ![epoch 0](../assets/figures/thesis/ch06/fig-6-9a.svg) | ![epoch 50](../assets/figures/thesis/ch06/fig-6-9b.svg) | ![epoch 100](../assets/figures/thesis/ch06/fig-6-9c.svg) | ![epoch 200](../assets/figures/thesis/ch06/fig-6-9d.svg) |

| <a id="fig-6-9e"></a>(e) epoch 300 |
|:--:|
| ![epoch 300](../assets/figures/thesis/ch06/fig-6-9e.svg) |

**Fig. 6.9** : Mean router size, as a function of the training step (epoch), for
a training run of 300 epochs on the uniform traffic, with the saturation reward
only (Sat100).

<a id="fig-6-10"></a>

| <a id="fig-6-10a"></a>(a) Output of the Sat and Pow rewards. | <a id="fig-6-10b"></a>(b) Loss function of the generator and of the critic. |
|:--:|:--:|
| ![Output of the Sat and Pow rewards](../assets/figures/thesis/ch06/fig-6-10a.svg) | ![Loss function of the generator and of the critic](../assets/figures/thesis/ch06/fig-6-10b.svg) |

| <a id="fig-6-10c"></a>(c) Presence rate of the router types. |
|:--:|
| ![Presence rate of the router types](../assets/figures/thesis/ch06/fig-6-10c.svg) |

**Fig. 6.10** : Evolution of the various values associated with the training of
the M-RWGAN, for a training run of 300 epochs on the uniform traffic, with the
saturation reward only (Sat100).

The history of the training is proposed in figures [6.9](#fig-6-9) and
[6.10](#fig-6-10). Figure [6.9](#fig-6-9) details the evolution of the NoCs
generated by our GAN. One observes a progressive increase of the router size,
starting from epoch 50, that is from the moment when the reward is taken into
account in the training of the generator. This influence of the reward is
confirmed in figure [6.10a](#fig-6-10a), which describes the evolution of the
output of the saturation and energy consumption rewards. These outputs
correspond to an evaluation of the generated NoCs, according to their
performance in terms of saturation threshold and power consumption. Thus, one
observes that from epoch 50 onwards the score associated with the saturation
reward increases progressively so as to tend towards 0.9 (the maximal score
being 1). This matches the expected results well. In return, the score in terms
of power decreases so as to tend towards 0.1, indicating that the generated NoCs
consume more.

The evolution of the loss of the generator and of the critic as a function of
the progress of the training is presented in figure [6.10b](#fig-6-10b). One can
first observe that the two losses are symmetrical until epoch 50 (start of the
taking into account of the reward), which indicates that the learning is stable.
Then, one observes a good adaptation of the generator to the reward since the
loss of the generator decreases only 50 epochs after its entry. Finally, the two
losses stabilize again at the end of the training (from epoch 200 to the end),
with a factor of 3 between them, directly linked to $\beta$, which favours the
taking into account of the reward.

Finally, the impact of this learning on the presence rate of the router types is
detailed in figure [6.10c](#fig-6-10c). One logically observes there a tendency
towards the implementation of routers of large size (i.e. Big type), and an
almost zero presence of routers of smaller size. Thus, routers of the Small type
are non-existent in the networks produced at the end of the training, and the
Medium ones are in a large minority (12.4%) against the Big ones
(87.6%).

**Conclusion:** We can therefore confirm the proper working of our set-up. We
shall analyze in what follows, in more detail, the way in which the rewards
impact the learning according to their weight, and how our tool makes it
possible to produce optimized NoCs efficiently.

#### 6.3.3.2 Results for uniform traffic

We begin by analyzing the results of the M-RWGAN for the uniform traffic.
With the aim of producing NoCs optimized from the point of view of energy
efficiency, we first analyze the networks generated by the generator when the
latter is trained with the Sat and Pow rewards in different proportions. Indeed,
since the energy efficiency is a ratio between the performance and the power,
the first naive approach is to put the rewards of the saturation threshold and
of the power consumption in competition, in order to guide the learning of the
generator towards the production of NoCs optimizing these two characteriztics
(i.e. maximize the saturation threshold and minimize the power consumption).

<a id="fig-6-11"></a>

| <a id="fig-6-11a"></a>(a) Sat100 | <a id="fig-6-11b"></a>(b) Sat90Pow10 | <a id="fig-6-11c"></a>(c) Sat70Pow30 | <a id="fig-6-11d"></a>(d) Sat50Pow50 |
|:--:|:--:|:--:|:--:|
| ![Sat100](../assets/figures/thesis/ch06/fig-6-11a.svg) | ![Sat90Pow10](../assets/figures/thesis/ch06/fig-6-11b.svg) | ![Sat70Pow30](../assets/figures/thesis/ch06/fig-6-11c.svg) | ![Sat50Pow50](../assets/figures/thesis/ch06/fig-6-11d.svg) |

| <a id="fig-6-11e"></a>(e) Sat30Pow70 | <a id="fig-6-11f"></a>(f) Sat10Pow90 | <a id="fig-6-11g"></a>(g) Pow100 |
|:--:|:--:|:--:|
| ![Sat30Pow70](../assets/figures/thesis/ch06/fig-6-11e.svg) | ![Sat10Pow90](../assets/figures/thesis/ch06/fig-6-11f.svg) | ![Pow100](../assets/figures/thesis/ch06/fig-6-11g.svg) |

**Fig. 6.11** : Mean router size, as a function of the proportion between the
Sat and Pow rewards, for a training run of 300 epochs on the uniform
traffic.

<a id="tab-6-5"></a>

| **Values** |  | R-Sat | R-Pow | t-Big | t-Medium | t-Small |
|---|---|---|---|---|---|---|
| **Rewards** | Sat100 | 0.86 | 0.09 | 87.6% | 12.4% | 0% |
|  | Sat90Pow10 | 0.81 | 0.22 | 76.5% | 23.5% | 0% |
|  | Sat70Pow30 | 0.67 | 0.38 | 55.2% | 42.8% | 2% |
|  | Sat50Pow50 | 0.52 | 0.54 | 40% | 49.9% | 10.1% |
|  | Sat30Pow70 | 0.35 | 0.70 | 26.2% | 43.7% | 30.1% |
|  | Sat10Pow90 | 0.18 | 0.86 | 15.2% | 33.3% | 51.5 |
|  | Pow100 | 0.08 | 0.95 | 5.3% | 23.7% | 71% |

**Table 6.5** : Values of the various training variables. R-Sat and R-Pow
correspond respectively to the scores of the saturation threshold reward and of
the consumption reward. t-Big, t-Medium and t-Small are the presence rates
(i.e. distribution) of the respective router types in the generated NoCs.
Uniform traffic.

Figure [6.11](#fig-6-11) displays the mean sizes of the routers produced by the
generator, for different training runs corresponding to different proportions of
the Sat and Pow rewards. Thus, from figure [6.11a](#fig-6-11a) to figure
[6.11g](#fig-6-11g), the proportion of the power reward is increased, while
decreasing the proportion of the performance reward (saturation threshold). The
detailed values of the reward outputs (i.e. scores) and of the presence rates of
the router types in the generated NoCs are available in table
[6.5](#tab-6-5). We observe, as expected, an overall reduction of the router
size, as the proportion of the Pow reward is increased. Indeed, the proportion
of Big-type routers decreases from 87.6% to 5.3%, whereas the proportion of
Small-type routers increases from 0% to 71%. We then observe a greater reduction
of the size of the central routers. This result is explained by the fact that
the dynamic power of the router is dominant in its total power, when it is
subjected to heavy traffic. Now, the Pow reward is trained to assign a score
corresponding to the consumption at the saturation threshold of the evaluated
NoC. Thus, the larger the routers subjected to a high traffic, the more the
latter will consume and the lower the score of the NoC will be. This explains
the fact that, as soon as the Pow reward is considered, the first routers to be
reduced are the central routers (i.e. a higher traffic load, see figure
[6.3](#fig-6-3)).

This result is in contradiction with the result expected in order to obtain an
energy-efficient NoC. Indeed, in order to optimize the performance and the
energy consumption of the NoC, the objective is that the router size follow a
distribution similar to the traffic – i.e. the higher the traffic load on a
router, the larger that router must be in order to support the load. To get
closer to this behaviour, it is not the power at the saturation threshold that
must be considered (since it is largely dominated by the dynamic power), but the
static power, that is the power for a zero traffic.
The latter is correlated with our third characteriztic considered: the area of
the NoC.

We therefore propose, in a second step, to study the learning results of the
generator, for a reward composed of the Sat reward and of the Area reward.

These results are presented in figure [6.12](#fig-6-12), and the detail of the
values of the training variables (scores at the output of the rewards and
presence rates of the router types) is available in table
[6.6](#tab-6-6).

<a id="fig-6-12"></a>

| <a id="fig-6-12a"></a>(a) Sat100 | <a id="fig-6-12b"></a>(b) Sat90Area10 | <a id="fig-6-12c"></a>(c) Sat70Area30 | <a id="fig-6-12d"></a>(d) Sat50Area50 |
|:--:|:--:|:--:|:--:|
| ![Sat100](../assets/figures/thesis/ch06/fig-6-12a.svg) | ![Sat90Area10](../assets/figures/thesis/ch06/fig-6-12b.svg) | ![Sat70Area30](../assets/figures/thesis/ch06/fig-6-12c.svg) | ![Sat50Area50](../assets/figures/thesis/ch06/fig-6-12d.svg) |

| <a id="fig-6-12e"></a>(e) Sat30Area70 | <a id="fig-6-12f"></a>(f) Sat10Area90 | <a id="fig-6-12g"></a>(g) Area100 |
|:--:|:--:|:--:|
| ![Sat30Area70](../assets/figures/thesis/ch06/fig-6-12e.svg) | ![Sat10Area90](../assets/figures/thesis/ch06/fig-6-12f.svg) | ![Area100](../assets/figures/thesis/ch06/fig-6-12g.svg) |

**Fig. 6.12** : Mean router size, as a function of the proportion between the
Sat and Ar rewards, for a training run of 300 epochs on the uniform
traffic.

<a id="tab-6-6"></a>

| **Values** |  | R-Sat | R-Area | t-Big | t-Medium | t-Small |
|---|---|---|---|---|---|---|
| **Rewards** | Sat100 | 0.86 | 0.11 | 87.6% | 12.4% | 0% |
|  | Sat90Area10 | 0.78 | 0.29 | 63.2% | 36.8% | 0% |
|  | Sat70Area30 | 0.66 | 0.54 | 35% | 64% | 1% |
|  | Sat50Area50 | 0.58 | 0.66 | 20% | 78% | 2% |
|  | Sat30Area70 | 0.49 | 0.78 | 4.6% | 88.1% | 7.3% |
|  | Sat10Area90 | 0.33 | 0.86 | 0.8% | 66.3% | 32.9% |
|  | Area100 | 0.12 | 0.93 | 0% | 32.8% | 67.2% |

**Table 6.6** : Values of the various training variables. Sat and Area rewards,
uniform traffic.

As expected, one observes an overall reduction of the router size.
However, this time it is indeed the central routers that keep a size larger than
the average. The use of the Area reward thus makes it possible to come close to
our theoretical optimum by matching the router size with the load of the traffic
considered.

One thus notices that the choice of the rewards used is essential if our
generator is to produce NoCs contained within an optimized design space. It is
also important to note that the training of our R-WGAN allows the generator to
extract patterns from the dataset that were not visible from our preliminary
analysis. Indeed, in figure [6.4](#fig-6-4), the pattern of the uniform traffic
is not detectable. Now, depending on the rewards used, and in particular when a
performance reward (i.e. Sat) is combined with a consumption reward (i.e. Pow
and Area), one clearly recognizes this pattern in the generated NoCs.

**Overall comparison with the dataset:** To come back to our objective of
generating a set of optimized NoCs, we propose to compare the performance of the
generated NoCs with the NoCs of the dataset.
For each of the learning runs corresponding to a combination of rewards, we
evaluate 100 generated NoCs with the OMNET++ simulator, and collect the mean of
the results. Figure [6.13](#fig-6-13) positions the means for each of the
configurations and the mean of the dataset, for the values of saturation
threshold, power consumption and area. Thus, two plots are proposed: figure
[6.13a](#fig-6-13a) for the positioning as a function of the saturation
threshold and of the power consumption, and figure [6.13b](#fig-6-13b) for the
saturation threshold and the area of the NoCs. In black are represented the data
of the initial dataset, partitioned according to their saturation threshold. The
latter make it possible to draw a boundary where any point "below" this boundary
(i.e. a higher saturation threshold and/or a lower power/area) can be considered
as a NoC having a better energy efficiency.

<a id="fig-6-13"></a>

| <a id="fig-6-13a"></a>(a) Saturation threshold and power. | <a id="fig-6-13b"></a>(b) Saturation threshold and area. |
|:--:|:--:|
| ![Saturation threshold and power](../assets/figures/thesis/ch06/fig-6-13a.svg) | ![Saturation threshold and area](../assets/figures/thesis/ch06/fig-6-13b.svg) |

**Fig. 6.13** : Comparison of the generated NoCs and of the dataset according to
different metrics (saturation threshold, energy consumed, area), when subjected
to uniform traffic.

We first notice very slight variations on plot
[6.13a](#fig-6-13a) in comparison with the dataset. Some configurations
are indeed better than the dataset, but it is difficult to extract the best
configuration. On plot [6.13b](#fig-6-13b), which positions the various results
according to the mean area and the mean saturation threshold, one logically
notes that all the configurations resulting from a training run holding the Area
reward are below the boundary and therefore hold a better energy efficiency than
the dataset.

**Gains in energy efficiency:** We propose to extract the best configuration for
each type of combination (Sat-Pow and Sat-Area). To do so, we proceed with the
following computation: for each configuration, a ratio representing the energy
efficiency at the saturation threshold is computed, that is
$\frac{\text{Saturation Rate}}{Power}$. The configurations having the best score
are the following: Sat0Pow100 for the Sat-Pow reward type, and Sat30Area70 for
the Sat-Area type.

- *Sat0Pow100:*
  The NoCs produced by the generator after a training run with the Sat0Pow100
  reward have on average a saturation threshold lower by 3.88% than the mean of
  the dataset (saturation threshold of 12.88% for the mean of the dataset
  against 9% for the generated NoCs), that is a decrease of 30.1%. As regards
  the power consumed at the saturation threshold, the latter is 746mW against
  1136mW for the mean of the dataset, which represents a reduction of 34.3%.
  Finally, if one measures the energy efficiency as the performance (i.e. the
  saturation threshold) divided by the power consumed, one obtains an
  improvement of about 6.45% in the energy efficiency of the generated NoCs, in
  comparison with the mean of the initial dataset.
- *Sat30Area70:*
  The NoCs produced by the generator after a training run with the Sat30Area70
  reward have on average a saturation threshold of 14.25%, similar to the mean
  of the dataset. As regards the power at the saturation threshold, the latter
  is 1000mW against 1136mW for the mean of the dataset, which represents a
  decrease of 12%. Finally, one obtains an improvement of about 14.6% in the
  energy efficiency of the generated NoCs, in comparison with the mean of the
  initial dataset.

#### 6.3.3.3 Results for hotspot30 traffic

The same experiments are conducted on the hotspot30 dataset. The results
obtained for the combinations of the Sat and Pow rewards are presented in figure
[6.14](#fig-6-14). Conclusions similar to those of the experiments on the
uniform traffic can be drawn. Indeed, once again it is the routers subjected to
the greatest traffic load that are minimized as a priority.
The learning linked to the rewards is validated in view of the scores presented
in table [6.7](#tab-6-7). Indeed, the score at the output of the Sat reward
decreases from 0.86 to 0.12 as the proportion of the Sat reward decreases from
100% towards 0%. Conversely, the power reward increases from 0.16 to 0.92 with
the increase of the proportion of the Pow reward from 0% to 100%.

<a id="fig-6-14"></a>

| <a id="fig-6-14a"></a>(a) Sat100 | <a id="fig-6-14b"></a>(b) Sat90Pow10 | <a id="fig-6-14c"></a>(c) Sat70Pow30 | <a id="fig-6-14d"></a>(d) Sat50Pow50 |
|:--:|:--:|:--:|:--:|
| ![Sat100](../assets/figures/thesis/ch06/fig-6-14a.svg) | ![Sat90Pow10](../assets/figures/thesis/ch06/fig-6-14b.svg) | ![Sat70Pow30](../assets/figures/thesis/ch06/fig-6-14c.svg) | ![Sat50Pow50](../assets/figures/thesis/ch06/fig-6-14d.svg) |

| <a id="fig-6-14e"></a>(e) Sat30Pow70 | <a id="fig-6-14f"></a>(f) Sat10Pow90 | <a id="fig-6-14g"></a>(g) Pow100 |
|:--:|:--:|:--:|
| ![Sat30Pow70](../assets/figures/thesis/ch06/fig-6-14e.svg) | ![Sat10Pow90](../assets/figures/thesis/ch06/fig-6-14f.svg) | ![Pow100](../assets/figures/thesis/ch06/fig-6-14g.svg) |

**Fig. 6.14** : Mean router size, as a function of the proportion between the
Sat and Pow rewards, for a training run of 300 epochs on the hotspot30
traffic.

<a id="tab-6-7"></a>

| **Values** |  | R-Sat | R-Pow | t-Big | t-Medium | t-Small |
|---|---|---|---|---|---|---|
| **Rewards** | Sat100 | 0.9 | 0.16 | 52% | 34.9% | 13.1% |
|  | Sat90Pow10 | 0.83 | 0.29 | 35% | 41.5% | 23.5% |
|  | Sat70Pow30 | 0.71 | 0.50 | 16% | 54% | 30% |
|  | Sat50Pow50 | 0.64 | 0.58 | 5.8% | 51% | 43.2% |
|  | Sat30Pow70 | 0.45 | 0.75 | 11% | 47% | 42% |
|  | Sat10Pow90 | 0.28 | 0.9 | 12.5% | 40% | 47.5% |
|  | Pow100 | 0.13 | 0.92 | 8.5% | 34.1% | 57.4% |

**Table 6.7** : Values of the various training variables. Sat and Pow rewards,
hotspot30 traffic.

Finally, we train our M-RWGAN with combinations of the Sat reward and of the
Area reward. As for the uniform traffic, one sees in figure
[6.15](#fig-6-15) that the generator produces NoCs whose router size is
directly correlated with the traffic load. Indeed, even for the Sat30Area70
combination, whose score given by the Area reward is 0.85
(see table [6.8](#tab-6-8)), the routers around the hotspot are the only ones
not to be completely minimized. Thus, the reduction of the area of the NoC is
optimized so as to penalize the performance of the NoC as little as possible.

<a id="fig-6-15"></a>

| <a id="fig-6-15a"></a>(a) Sat100 | <a id="fig-6-15b"></a>(b) Sat90Area10 | <a id="fig-6-15c"></a>(c) Sat70Area30 | <a id="fig-6-15d"></a>(d) Sat50Area50 |
|:--:|:--:|:--:|:--:|
| ![Sat100](../assets/figures/thesis/ch06/fig-6-15a.svg) | ![Sat90Area10](../assets/figures/thesis/ch06/fig-6-15b.svg) | ![Sat70Area30](../assets/figures/thesis/ch06/fig-6-15c.svg) | ![Sat50Area50](../assets/figures/thesis/ch06/fig-6-15d.svg) |

| <a id="fig-6-15e"></a>(e) Sat30Area70 | <a id="fig-6-15f"></a>(f) Sat10Area90 | <a id="fig-6-15g"></a>(g) Area100 |
|:--:|:--:|:--:|
| ![Sat30Area70](../assets/figures/thesis/ch06/fig-6-15e.svg) | ![Sat10Area90](../assets/figures/thesis/ch06/fig-6-15f.svg) | ![Area100](../assets/figures/thesis/ch06/fig-6-15g.svg) |

**Fig. 6.15** : Mean router size, as a function of the proportion between the
Sat and Ar rewards, for a training run of 300 epochs on the hotspot30
traffic.

<a id="tab-6-8"></a>

| **Values** |  | R-Sat | R-Area | t-Big | t-Medium | t-Small |
|---|---|---|---|---|---|---|
| **Rewards** | Sat100 | 0.9 | 0.41 | 52% | 34.9% | 13.1% |
|  | Sat90Area10 | 0.84 | 0.63 | 28% | 45% | 27% |
|  | Sat70Area30 | 0.80 | 0.74 | 18.3% | 45% | 36.7% |
|  | Sat50Area50 | 0.76 | 0.8 | 16% | 31.1% | 52.9% |
|  | Sat30Area70 | 0.72 | 0.85 | 10% | 39% | 51% |
|  | Sat10Area90 | 0.66 | 0.9 | 4% | 40% | 56% |
|  | Area100 | 0.21 | 0.94 | 0% | 35% | 65% |

**Table 6.8** : Values of the various training variables. Sat and Area rewards,
hotspot30 traffic.

One notices however a lack of precision on the hotspot30 traffic. Indeed,
one notices in particular, on the learning with the Sat and Area rewards, a
cross pattern around the hotspot router, thus moving away from the traffic
pattern. This may be explained by the use of GCNs to build the rewards. This
type of learning relies on the neighbourhood of the nodes of the graph. Thus, if
the learning of the reward leads to the conclusion that a router must be of
large size, that same learning may propagate to the neighbouring routers. This
would therefore explain why the saturation threshold reward assigns a better
score to the NoCs generated with routers of large size neighbouring the real
hotspot. Future work will have to clarify this behaviour, by studying the
parameters of the GCN in more detail.

Before analyzing the various sets of NoCs produced by the generators as a
function of the combination of rewards assigned during the learning, we propose
to implement the rewards of the saturation threshold and of the power with a
CNN. Indeed, although the GCN proved more effective for the uniform traffic, it
would seem that this is not the case for the particular pattern of the hotspot.

**CNN supplement:** We begin by analyzing the learning runs with the CNN-based
Sat and Pow rewards. The router sizes of the NoCs generated for each training
run are presented in figure [6.16](#fig-6-16), and the values of the scores and
presence rates are detailed in table
[6.9](#tab-6-9). The major difference with the previous experiments is the
appearance of the pattern of the hotspot traffic, more precisely than during the
learning runs with the GCN rewards. Then, the conclusions on the router sizes of
the generated NoCs remain unchanged: to optimize the power consumed at the
saturation threshold of the generated NoCs, the routers subjected to the highest
traffic loads (i.e. the hotspot) are reduced.

<a id="fig-6-16"></a>

| <a id="fig-6-16a"></a>(a) Sat100 | <a id="fig-6-16b"></a>(b) Sat90Pow10 | <a id="fig-6-16c"></a>(c) Sat70Pow30 | <a id="fig-6-16d"></a>(d) Sat50Pow50 |
|:--:|:--:|:--:|:--:|
| ![Sat100](../assets/figures/thesis/ch06/fig-6-16a.svg) | ![Sat90Pow10](../assets/figures/thesis/ch06/fig-6-16b.svg) | ![Sat70Pow30](../assets/figures/thesis/ch06/fig-6-16c.svg) | ![Sat50Pow50](../assets/figures/thesis/ch06/fig-6-16d.svg) |

| <a id="fig-6-16e"></a>(e) Sat30Pow70 | <a id="fig-6-16f"></a>(f) Sat10Pow90 | <a id="fig-6-16g"></a>(g) Pow100 |
|:--:|:--:|:--:|
| ![Sat30Pow70](../assets/figures/thesis/ch06/fig-6-16e.svg) | ![Sat10Pow90](../assets/figures/thesis/ch06/fig-6-16f.svg) | ![Pow100](../assets/figures/thesis/ch06/fig-6-16g.svg) |

**Fig. 6.16** : Mean router size, as a function of the proportion between the
Sat and Pow rewards, for a training run of 300 epochs on the hotspot30
traffic. Rewards relying on a CNN.

<a id="tab-6-9"></a>

| **Values** |  | R-Sat | R-Pow | t-Big | t-Medium | t-Small |
|---|---|---|---|---|---|---|
| **Rewards** | Sat100 | 0.97 | 0.26 | 33.6% | 32% | 34.4% |
|  | Sat90Pow10 | 0.93 | 0.32 | 29.8% | 37.1% | 33.1% |
|  | Sat70Pow30 | 0.80 | 0.47 | 31.1% | 31.5% | 37.4% |
|  | Sat50Pow50 | 0.74 | 0.61 | 7.5% | 37% | 55.5% |
|  | Sat30Pow70 | 0.48 | 0.82 | 14.4% | 40% | 45.6% |
|  | Sat10Pow90 | 0.37 | 0.9 | 14.7% | 35.9% | 49.4% |
|  | Pow100 | 0.10 | 0.95 | 21% | 36.3% | 42.7% |

**Table 6.9** : Values of the various training variables. Sat and Pow rewards,
hotspot30 traffic. Rewards relying on a CNN.

Finally, the last experiments studied are for the Sat and Area rewards in CNN.
The results displayed in figure [6.17](#fig-6-17) present a pattern similar to
the pattern of the hotspot30 traffic, suggesting an almost ideal optimization of
the architecture of the generated NoCs. This conclusion is reinforced by the
values of the scores assigned by the rewards, table [6.10](#tab-6-10). Indeed,
whereas the score of the Sat reward (i.e. performance) is 0.97 for a Sat100
reward, this score remains high despite the increase of the proportion of the
Area reward, and is maintained at 0.89 for the Sat10Area90 reward. Of course,
this score falls with the Area100 reward since the influence of the Sat reward
is no longer present in the training of the generator. Thus, the Sat10Area90
reward particularly draws our attention since the latter displays high scores
for each of the rewards (0.89 for the Sat score and 0.91 for the Area score)
while minimizing the router size as much as possible with only 5% of Big routers
and up to 68.4% of Small routers.

<a id="fig-6-17"></a>

| <a id="fig-6-17a"></a>(a) Sat100 | <a id="fig-6-17b"></a>(b) Sat90Area10 | <a id="fig-6-17c"></a>(c) Sat70Area30 | <a id="fig-6-17d"></a>(d) Sat50Area50 |
|:--:|:--:|:--:|:--:|
| ![Sat100](../assets/figures/thesis/ch06/fig-6-17a.svg) | ![Sat90Area10](../assets/figures/thesis/ch06/fig-6-17b.svg) | ![Sat70Area30](../assets/figures/thesis/ch06/fig-6-17c.svg) | ![Sat50Area50](../assets/figures/thesis/ch06/fig-6-17d.svg) |

| <a id="fig-6-17e"></a>(e) Sat30Area70 | <a id="fig-6-17f"></a>(f) Sat10Area90 | <a id="fig-6-17g"></a>(g) Area100 |
|:--:|:--:|:--:|
| ![Sat30Area70](../assets/figures/thesis/ch06/fig-6-17e.svg) | ![Sat10Area90](../assets/figures/thesis/ch06/fig-6-17f.svg) | ![Area100](../assets/figures/thesis/ch06/fig-6-17g.svg) |

**Fig. 6.17** : Mean router size, as a function of the proportion between the
Sat and Area rewards, for a training run of 300 epochs on the hotspot30
traffic. Rewards relying on CNNs.

<a id="tab-6-10"></a>

| **Values** |  | R-Sat | R-Area | t-Big | t-Medium | t-Small |
|---|---|---|---|---|---|---|
| **Rewards** | Sat100 | 0.97 | 0.60 | 33.6% | 32% | 34.4% |
|  | Sat90Area10 | 0.97 | 0.8 | 14% | 36% | 50% |
|  | Sat70Area30 | 0.96 | 0.87 | 7% | 38.9% | 54.1% |
|  | Sat50Area50 | 0.96 | 0.88 | 5.5% | 34.5% | 60% |
|  | Sat30Area70 | 0.94 | 0.89 | 5.5% | 30% | 64.5% |
|  | Sat10Area90 | 0.89 | 0.91 | 5% | 27.6% | 68.4% |
|  | Area100 | 0.20 | 0.94 | 0% | 33.4% | 66.6% |

**Table 6.10** : Values of the various training variables. Sat and Area rewards,
hotspot30 traffic. Rewards relying on a CNN.

<a id="fig-6-18"></a>

| <a id="fig-6-18a"></a>(a) Saturation threshold and power. | <a id="fig-6-18b"></a>(b) Saturation threshold and area |
|:--:|:--:|
| ![Saturation threshold and power](../assets/figures/thesis/ch06/fig-6-18a.svg) | ![Saturation threshold and area](../assets/figures/thesis/ch06/fig-6-18b.svg) |

**Fig. 6.18** : Comparison of the generated NoCs and of the dataset according to
different metrics (saturation threshold, energy consumed, area), when subjected
to hotspot30 traffic, for the GCN rewards.

<a id="fig-6-19"></a>

| <a id="fig-6-19a"></a>(a) | <a id="fig-6-19b"></a>(b) |
|:--:|:--:|
| ![6.19a](../assets/figures/thesis/ch06/fig-6-19a.svg) | ![6.19b](../assets/figures/thesis/ch06/fig-6-19b.svg) |

**Fig. 6.19** : Comparison of the generated NoCs and of the dataset according to
different metrics (saturation threshold, energy consumed, area), when subjected
to hotspot30 traffic, for the CNN rewards.

**Overall comparison with the dataset:** We analyze here the NoCs generated by
the generators trained with the different combinations of rewards (GCN and CNN)
in order to extract the combinations producing the NoCs with the best energy
efficiency.

First of all, the simulation results of the generations linked to the GCN
rewards are presented in figure [6.18](#fig-6-18). One notices directly that all
the results show a better energy efficiency than the dataset. Indeed, the
simulation data of the generated sets are all positioned below the data of the
dataset.

Then the simulation results of the generations linked to the CNN rewards are
presented in figure [6.19](#fig-6-19). Except for the Pow100 reward on plot
[6.19b](#fig-6-19b), all the results show a better energy
efficiency than the dataset. Indeed, the simulation data of the generated sets
are once again all positioned below the data of the dataset.

**Gains in energy efficiency:** The best combinations of rewards are determined
as previously, giving Sat70Pow30 and Sat70Area30 as the best combinations of GCN
rewards for the Sat-Pow and Sat-Area types respectively. For the CNN rewards, we
obtain Sat50Pow50 and Sat70Area30 as the best combinations, for the Sat-Pow and
Sat-Area types respectively.

- *Sat70Pow30_GCN:*
  The NoCs produced by the generator after a training run with the Sat70Pow30
  reward in GCN have on average a saturation threshold higher by 0.58% than the
  mean of the dataset (saturation threshold of 3.8% against 3.22% for the mean
  of the dataset), that is an increase of 18%. As regards the power consumed at
  the saturation threshold, the latter is 332mW against 315mW for the mean of
  the dataset, which represents an increase of 5.4%. Finally, as for the uniform
  traffic, the energy efficiency is measured as the performance (i.e. the
  saturation threshold) divided by the power consumed. One obtains an
  improvement of about 12.2% in the energy efficiency of the generated NoCs, in
  comparison with the mean of the initial dataset.
- *Sat70Area30_GCN:*
  The NoCs produced by the generator after a training run with the Sat70Area30
  reward in GCN have on average a saturation threshold higher by 1%
  (saturation threshold of 3.22% for the mean of the dataset against 4.22% for
  the generated NoCs), that is an increase of 31%. As regards the power at the
  saturation threshold, the latter is 366mW against 315mW for the mean of the
  dataset, which represents an increase of 16.2%. Finally, one obtains an
  improvement of about 12.55% in the energy efficiency of the generated NoCs, in
  comparison with the mean of the initial dataset.
- *Sat50Pow50_CNN:*
  The NoCs produced by the generator after a training run with the Sat50Pow50
  reward in CNN have on average a saturation threshold higher by 0.54% than the
  mean of the dataset (3.76% against the 3.22% of the dataset), that is an
  increase of 16.8%. As regards the power at the saturation threshold,
  the latter is 318mW against 315mW for the mean of the dataset, which
  represents an increase of less than 1%. Finally, one obtains an
  improvement of about 15.5% in the energy efficiency of the generated NoCs, in
  comparison with the mean of the initial dataset.
- *Sat70Area30_CNN:*
  The NoCs produced by the generator after a training run with the Sat70Area30
  reward in CNN have on average a saturation threshold higher by 0.96%
  (saturation threshold of 3.2% for the mean of the dataset against 4.16% for
  the generated NoCs), that is an increase of 29.8%. As regards the power
  at the saturation threshold, the latter is 360mW against 315mW for the mean of
  the dataset, which represents an increase of 14.3%. Finally, one obtains an
  improvement of about 12.9% in the energy efficiency of the generated NoCs, in
  comparison with the mean of the initial dataset.

#### 6.3.3.4 Optimization quality: a preliminary analysis

In the previous sections, we showed that our tool makes it possible to sweep
rapidly through a data space of large dimension by varying the combinations of
rewards. We concentrated on the interest of such a tool for extracting a subset
optimized in terms of energy efficiency.
However, our tool is more generally a multi-objective optimization tool.

In this last section, we propose to evaluate the optimization qualities of our
tool, as a function of the real objectives modelled by the rewards (i.e.
saturation threshold, power and area). To do so, we choose the IGD metric
(Inverted Generational Distance
[\[45\]](references.md#ref-45)) to determine the optimization quality of our
tool. The IGD metric is defined as the mean Euclidean distance between the true
Pareto front and the Pareto front of the data generated by the tool.
Overall, the IGD makes it possible to measure the convergence of a set $A$ of
obtained solutions towards a reference set $R$, which is ideally the true Pareto
front. It is formulated by equation [6.3](#eq-6-3).

<a id="eq-6-3"></a>

$$
IGD(A,R) = \frac{1}{\lvert R \rvert} \sum_{r \in R} \bigl(\min\{\, dist(r,a) \mid a \in A \,\}\bigr)
\tag{6.3}
$$

with $\lvert R \rvert$ the number of solutions contained in R and dist(r, a) the
Euclidean distance between the solutions r and a.

In our case, we wish to evaluate the quality of the generated data as a function
of the true Pareto front. This requires knowing the entirety of the design
space, in order to extract the front from it. Thus, we place ourselves in a
reduced space and consider the generation of 4x3 mesh NoCs, composed of 12
routers that can be of 3 types. This represents a space of 531 441 possible
combinations, which we simulate in full for the hotspot30 traffic.

<a id="fig-6-20"></a>

![Euclidean distance between the best generated NoC of each learning run and the true Pareto front](../assets/figures/thesis/ch06/fig-6-20.svg)

**Fig. 6.20** : Euclidean distance between the best generated NoC of each
learning run and the true Pareto front, together with the detail for each
objective. Measurement of the IGD - i.e. mean.

The set of results (saturation, power and area of each NoC) is normalized
between 0 and 1 as a function of the minimum and maximum of each measurement.
Thus, the optimal value of the saturation threshold is 1 (i.e. we wish to
maximize it), and the optimal value of area and of power is 0 (i.e. we wish to
minimize these metrics). We then determine $R$ from the normalized data.

From this design space, we extract 10k data points to build our training
dataset. From this dataset, we train our three rewards (saturation threshold,
power, area), then we train our M-RWGAN with $x$ combinations of rewards. For
each training run, we generate a set $N$ of 100 NoCs, and we compute
$a_i = \min\{\, dist(r,n) \mid n \in N \,\}$, the best NoC generated by the
$i^{\text{ème}}$ learning run. Finally, we compute the IGD, by applying formula
[6.3](#eq-6-3) with $A = \{\, a_i \mid i \in [1..x] \,\}$.

The results are displayed in figure [6.20](#fig-6-20). For each training run
(i.e. combination of rewards), the measurements of the best solution are
displayed, namely: the Euclidean distance to the true Pareto front
(multi-objective) i.e. $a_i$ , and the detail of the Euclidean distances for
each objective. Finally, we display the IGD computed for the multi-objective
optimization together with the detail of the mean distances for each objective.
These latter results are described in what follows, and compared with the mean
of the design space:

- multi-objective (i.e. IGD): 0.06, mean of the design space: 0.373
- Saturation threshold: 0.013, mean of the design space: 0.044
- Power: 0.028, mean of the design space: 0.053
- Area: 0.043, mean of the design space: 0.367

By comparing our IGD with the mean distance of the whole set of points of the
design space, we observe that our tool holds substantial optimization
performance. Indeed, we obtain a reduction of the distance to the Pareto front
of 85% (from 0.373 for the mean of the design space, to 0.06 for the IGD of our
tool). Moreover, considering a maximal distance of $\sqrt{3} \approx 1.73$ (i.e.
3 objectives), our score of 0.06 demonstrates a great optimization quality.
Finally, we also obtain a reduction of the distances for each objective of 70%,
47% and 88% respectively for the saturation threshold, the power and the area,
in comparison with the mean of the design space.
Thus, these latter results underline the multi-objective optimization potential
of our tool.

## 6.4 Summary

In this last contribution, we proposed a complex neural network architecture,
named M-RWGAN. This architecture differs from the RWGAN of the previous chapter
by the level of complexity possible for the reward function serving to optimize
the generator. Indeed, we show that, through the use of several simple rewards,
it is possible to create a hybrid reward approximating a complex optimization
function.

This work opens interesting perspectives on the development of CAD tools. Future
work will have to explore the capabilities of the M-RWGAN and combine the
generation of the adjacency matrix $A$ of the previous chapter with the
generation of the feature matrix $X$ of this last chapter in order to propose a
complete generation of NoCs. By extension, this tool generalizes to the
production of optimized graphs, and is therefore not restricted to the field of
NoCs.

The avenues for future work are developed in more detail in the perspectives of
this thesis, [chapter 7](07-conclusion.md).
