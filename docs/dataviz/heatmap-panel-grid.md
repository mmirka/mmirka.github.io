# Small-multiple heatmaps over a parameter sweep

A 2-D subplot grid walked as a flat sequence, with deliberately blank cells for
the layout and for data that is not there.

![Seven 8x8 heat maps in a 4+3 grid, one per point of a reward-weight sweep, with one shared colorbar](../assets/figures/m-rwgan/heatmap_panel_grid.png)

## What it demonstrates

- **`plt.subplots(2, 4)` then `axes.flatten()`.** The layout is a rectangle,
  the data a list of seven sweep points. Flattening lets one
  `for ax, ratio in zip(axes_flat, RATIO_ORDER)` fill the grid in reading
  order, `zip` stopping at the shorter of the two, and
  `axes_flat[-1].axis("off")` retires the eighth cell — which keeps every panel
  the same size and aligned on both rows, where `gridspec` or a nested layout
  would not.
- **A missing panel is blanked in place.** If a sweep point's dataset is not
  bundled the cell gets `ax.axis("off")` and a title saying so, and the rest
  stay put. Skipping it would shift every subsequent panel and silently
  misalign the grid against the sweep order.
- **Shared `vmin=0, vmax=1` across all panels**, as on
  [the row of heatmaps](heatmap-row-over-time.md), so a cell's colour means the
  same thing everywhere and the sweep reads across.
  `fig.colorbar(im, ax=list(axes_flat), shrink=0.7)` then takes space from
  every cell including the blank one, keeping the grid rectangular.

## The code

??? note "figures/router_evolution.py"

    ```python
    --8<-- "assets/code/m-rwgan/router_evolution.py"
    ```

It imports the shared `noc_data.py` data layer, also in this gallery's code
folder — see [the errorbar scatter page](scatter-errorbars.md).

## Run it

```bash
cd figures
python router_evolution.py --config uniform --type reward-ratio-compare --reward-pair SatAndPow
```

Needs `numpy` and `matplotlib`. Omitting `--reward-pair` defaults to `both`,
which writes this figure and its companion — the other reward pair for the same
traffic — in one invocation.

The inputs are the fully *simulated* dataset pickles for each sweep point (not
raw generator output: real adjacency matrices, router-class assignments and
per-sample latency/power/area curves). They are tracked in git, so this figure
needs neither a download nor a bake. This figure type has no raw-archive
override, because it needs a full seven-point sweep of already-simulated
datasets, which a single training run does not produce.

## Where it comes from

M-RWGAN ([project page](../projects/m-rwgan.md)). **Thesis Fig. 6.11**
(DATE2022 / thesis Chapter 6). Each panel is the same router-size map — the
per-router class assignment averaged over a whole already-simulated generated
dataset — for one point of the seven-point weight sweep (100-0, 90-10, 70-30,
50-50, 30-70, 10-90, 0-100) between the saturation reward and the power reward.

[figures/router_evolution.py](https://github.com/mmirka/m-rwgan/blob/main/figures/router_evolution.py)
