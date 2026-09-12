---
title: M-RWGAN
---

# Multi-objective generation of heterogeneous Networks-on-Chip

A Wasserstein GAN steered by several independently pretrained, frozen reward
networks at once, used to prune a 10<sup>30</sup>-point Network-on-Chip design
space toward saturation throughput, power and area together.

![Diagram of the multi-objective RWGAN: a generator fed from random space, its output judged by a critic and by several reward networks in parallel, all combined into the generator feedback](../assets/figures/thesis/ch06/fig-6-2.svg)

**Thesis Fig. 6.2** — The multi-objective RWGAN. From
[chapter 6](../thesis/06-m-rwgan.md).

## The problem

Chapter 5 generated the *shape* of a network. This chapter fixes it — an 8×8
mesh, adjacency matrix constant — and generates what each of its 64 routers
should be. Routers come in three classes differing only in buffer size: Big at
12 flits, Medium at 4, Small at 2.

![Normalized traffic received per router, shown as two 8×8 heat maps for two synthetic traffic patterns](../assets/figures/thesis/ch06/fig-6-3.svg)

**Thesis Fig. 6.3** — Why heterogeneity pays: traffic is not spread evenly.

Real traffic is not uniform, so a mesh of identical routers is over-provisioned
where traffic is light and a bottleneck where it is heavy.

The combinatorics are the wall. Three classes over 64 routers is
3<sup>64</sup> ≈ 10<sup>30</sup> assignments, with topology and connection types
already held fixed. Worse, scoring one assignment means a discrete-event
simulation — OMNeT++ with the HNOCS framework, extended with synthetic traffic
patterns and with Orion3.0 for static and dynamic power, at 45 nm, 1.0 V,
650 MHz, matrix crossbar. Exhaustive evaluation is inconceivable, and the three
objectives — saturation threshold, power at saturation, area — pull against
each other, so there is no single number to maximize.

## The method

The generator is an MLP: a 100-unit noise vector through Dense 768 and Dense
1536 to a 192-unit output, reshaped to 64×3, decoded by a **GumbelSoftmax**
activation that forces each router's 3-vector to be one-hot — exactly one class
per router, with no ordering implied between classes, which is why one-hot
rather than a numeric encoding.

The critic is a **graph** network, not an image network: three GCN layers
(16 → 32 → 64) and a dense output, taking *both* the adjacency matrix A and the
class matrix X, so it judges an assignment in the context of its mesh. Three
reward networks score the same output, each trained beforehand, supervised, on
the simulated dataset, and each frozen at inference. Two are GCNs — four layers
into a sigmoid, so the score lands in [0, 1] — for saturation threshold and
power. The third is a CNN reading X as an 8×8×3 image and ignoring A entirely,
for area: area depends on which routers you instantiate, not how they are
wired. Reward training uses Adam, converges in about 20 epochs, and reaches
below 1 % error on test data.

The multi-objective part is the generator's loss. The single-reward RWGAN blends
critic and reward as *(1 − λ) L_C + λ [β L_R]*; M-RWGAN replaces the single
reward term with a weighted sum, *(1 − λ) L_C + λ Σ βᵢ L_Rᵢ*, the βᵢ summing to
β. Turning those weights sweeps the generated population across the trade-off —
the published experiments sweep Saturation-versus-Power and
Saturation-versus-Area in seven ratio steps from 0-100 to 100-0, for uniform and
hotspot30 traffic, with GCN and CNN reward pairings.

## What reproduces

![Scatter of two coloured sweep halves against a binned frontier curve, each point labelled with its reward ratio](../assets/figures/m-rwgan/pareto_front_scatter.png)

**Fig.** — A reward-ratio sweep against the dataset frontier. See
[the recipe page](../dataviz/scatter-pareto-front.md).

The figure folder rebuilds all 34 PNGs from a plain clone, with nothing
downloaded and no import from the `mrwgan` package — numpy, matplotlib and a
small vendored loader. Four of the original inputs total about 1.2 GB and are
git-ignored; each is consumed by a summarising step, so `figures/bake/` reduces
them once to about 3.3 MB of committed artifacts under `figures/data/derived/`
holding exactly the arrays the figures read. `bake/verify.sh` builds every
figure twice — from the raw archives, then in a copy of `figures/` holding only
git-tracked files — and compares the PNGs byte for byte: 34 of 34 match. Each
artifact records the filename, byte size and SHA-256 of its source archive, so
re-baking from a different one is visible rather than silent.

That covers thesis Chapter 6: router-class evolution (6.9, 6.11, 6.12,
6.14–6.17), loss curves (6.10), Pareto comparisons (6.13, 6.18, 6.19) and the
IGD bar chart (6.20), plus five scripts for the DATE 2022 paper's own figures.
Reference renders of the Chapter 6 PNGs ship under `results/figures/`, and
pretrained reward checkpoints for hotspot30 and uniform traffic are git-tracked,
so retraining a reward is only needed for new data. Three standalone notebooks
build the method up on MNIST — plain WGAN-GP, then one frozen reward
(`P(digit == 5)`), then two combined by a soft-OR — the cheapest way to watch
the mechanism work without a NoC in sight. The repository's figure-number table
was checked against the thesis PDF, which corrected several an earlier version
had wrong.

## What does not reproduce

**Training.** Not from a plain clone. The 10k-sample datasets live under
`data/raw/`, about 924 MB and git-ignored because two files exceed GitHub's
100 MB limit; they are available on request, and hold 9,592 samples for
hotspot30 and 10,458 for uniform. Regenerating them means building and running
the HNOCS + Orion3.0 pipeline, whose glue code and instructions are kept as
documentation of provenance — that simulation is not run here. 

## Links

- Repository: <https://github.com/mmirka/m-rwgan>
- Paper: *A Generative AI for Heterogeneous Network-on-Chip Design Space
  Pruning* (DATE 2022) — see [Publications](../publications/index.md).
- Thesis: [Chapter 6 — Generating optimized heterogeneous
  networks-on-chip](../thesis/06-m-rwgan.md)
- Predecessor: [GANNoC](gannoc.md), the single-objective RWGAN
- Figures: [the figure pages](../dataviz/index.md)
