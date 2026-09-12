# A 3-D surface beside its own heat map

Mixing a `projection="3d"` axes and an ordinary one in a single figure, with an
`extent` that puts the heat map in real units so an optimum can be marked in
data coordinates.

![A surface over core count and frequency next to a heat map of the same grid, the optimum marked with a star and labelled](../assets/figures/omp-energy-rl/surface_3d.png)

## What it demonstrates

- **`from mpl_toolkits.mplot3d import Axes3D` purely for its side effect.** The
  import registers the `"3d"` projection and the name is never used, hence the
  `# noqa: F401`; without it `projection="3d"` raises. Because the projection
  is a per-axes property, `fig.add_subplot(1, 2, 1, projection="3d")` sits
  beside a plain `fig.add_subplot(1, 2, 2)` with no special layout handling.
- **`ax3d.view_init(elev=26, azim=-128)`.** A 3-D plot has no meaningful
  default camera. Fixing elevation and azimuth makes the figure reproducible,
  and lets you pick the angle where the ridge of the surface is visible. On
  `plot_surface`, `linewidth=0` removes the wireframe that moirés on a dense
  grid.
- **`ax.imshow(grid, origin="lower", aspect="auto", extent=(...))`** for the
  companion panel. `extent` maps pixel edges onto real core-count and frequency
  units — extended by half a step per axis, since `extent` gives the *outer*
  edges of the corner pixels, not their centres. That is what lets the optimum
  be marked with `ax.scatter(best_cores, best_ghz, ...)` in data coordinates.

## The code

??? note "figures/cpj_surface.py"

    ```python
    --8<-- "assets/code/omp-energy-rl/cpj_surface.py"
    ```

The shared loader, metric helpers and rcParams style — used by every figure in
this project — are in this gallery's code folder too:

??? note "figures/_common.py"

    ```python
    --8<-- "assets/code/omp-energy-rl/_common.py"
    ```

## Run it

```bash
conda activate omp-energy-rl
cd figures
python cpj_surface.py
```

Needs `numpy`, `pandas` and `matplotlib`. The input is one characterization
sweep CSV, 28 columns, tracked in the repository. Like every input there it is
headerless and `_common.load_csv` picks the schema by column count. The figures
directory is self-contained: it imports nothing from `../src/`, reads nothing
outside `figures/`, and needs no hardware, no training and no network access.

## Where it comes from

OpenMP energy efficiency ([project page](../projects/omp-energy-rl.md)).
**Thesis Figs. 4.14 and 4.20** — mean CpJ (chunks per Joule) for every
combination of core count and frequency. Two properties of this surface carry
the argument of the whole project: the **core-count axis** is the one the Linux
governors cannot touch, since they tune frequency only, and the surface has **a
single broad optimum** rather than a spiky landscape, which is why an agent can
find a near-best configuration from 2048 samples over a 209-point space.

**Where the rebuild and the thesis disagree.** Reducing the bundled DGEMM sweep
gives **19 cores @ 2.1 GHz, mean CpJ 166.2**. The thesis reports **18 cores @
2.1 GHz, mean CpJ 166** (section 4.3.1): the frequency and the efficiency value
reproduce exactly, and the core count lands one apart.

No published original for these figures ships with the repository, so there is
no side-by-side. And the original notebooks behind them used `plotly.plotly`
and `cufflinks`, both removed from Plotly at version 4.0 — they cannot run
today at any pin. These scripts are matplotlib rewrites, not ports.

[figures/cpj_surface.py](https://github.com/mmirka/omp-energy-rl/blob/main/figures/cpj_surface.py)
