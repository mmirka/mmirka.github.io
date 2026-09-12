---
title: Projects
---

# Projects

Public code, with the work behind it written up. Today that is the three
projects from my PhD.

## From the PhD

Two research axes: applying machine learning to energy efficiency first as
**dynamic control**, tuning a computation while it runs, then as **hardware
design**, generating the interconnect it runs on. The thesis behind them —
*[Machine learning for multi-level adaptive control of distributed
computing](../thesis/index.md)*, Université de Montpellier, defended
12 November 2021 — is on this site in full.

### Dynamic control

<div class="cards" markdown>

<div markdown>
![A 3-D surface of chunks per Joule over core count and frequency](../assets/figures/omp-energy-rl/surface_3d.png)

### [Online RL control of OpenMP energy efficiency](omp-energy-rl.md)

Progress measured from inside the OpenMP runtime by counting the chunks the
dynamic scheduler hands out, turned into chunks per second and chunks per
Joule. A reinforcement-learning controller then picks core count and clock
frequency from those metrics alone — no prior profiling, no source annotation —
learning during the run itself. Thesis
[chapter 4](../thesis/04-openmp-energy-efficiency.md).
</div>

</div>

### Generative design

<div class="cards" markdown>

<div markdown>
![A grid of generated 9-router network topologies drawn as graphs](../assets/figures/gannoc/topology_grid_graph.png)

### [GANNoC](gannoc.md)

Network-on-Chip topology generation as image generation: a 9-router topology is
a 9×9 adjacency matrix produced by a Wasserstein GAN. Its contribution is the
RWGAN, which adds a separately trained, frozen reward network to the usual
generator/critic pair, so generation can be biased toward a property the
designer chooses rather than merely imitating the training set. Thesis
[chapter 5](../thesis/05-gannoc.md).
</div>

<div markdown>
![A grid of 8×8 heat maps showing router-class assignments across a parameter sweep](../assets/figures/m-rwgan/heatmap_panel_grid.png)

### [M-RWGAN](m-rwgan.md)

The same mechanism, generalized from one reward to several. The topology is
fixed — an 8×8 mesh — and what is generated is the assignment of one of three
router classes to each of the 64 routers, a space of 3<sup>64</sup>
combinations. Three frozen reward networks score saturation throughput, power
and area at once, and the weights blending them give the designer a dial that
sweeps the generated population across the trade-off. Thesis
[chapter 6](../thesis/06-m-rwgan.md).
</div>

</div>

Figures from all three have their own pages under
[plotting recipes](../dataviz/index.md), and the papers are listed under
[Publications](../publications/index.md).
