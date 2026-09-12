# Colouring a line by a categorical variable

A continuous trace drawn once in grey, then over-plotted one masked scatter per
category — the general recipe for "colour this series by a label" without a
colormap.

![A rate trace over a 400-sample window, samples coloured by category, with the category code stepped below](../assets/figures/omp-energy-rl/categorical_overlay.png)

## What it demonstrates

- **Line first, then one scatter per category.**
  `ax.plot(time, values, lw=0.6, color="#666666", zorder=1)` draws the
  continuity, then
  `for phase in sorted(np.unique(ids)): mask = ids == phase; ax.scatter(time[mask], values[mask], s=5, zorder=2, ...)`.
  A colormap would map the codes onto a continuous ramp and imply an ordering
  they do not have.
- **`legend(markerscale=3)`.** At `s=5` the legend swatches would be
  invisible; `markerscale` enlarges the legend's copy without touching the
  plot. The sample count goes into the label
  (`f"phase {phase} (n={mask.sum()})"`), and `ncol=len(np.unique(ids))` lays
  it out as one row whatever the number of categories.
- **`ax.step(time, ids, where="post")` for the second panel.** The right mark
  for a value that is constant between samples and jumps at one; `where="post"`
  holds each value until the next rather than interpolating backwards. Pair it
  with `ax.set_yticks(sorted(np.unique(ids)))`, or matplotlib invents
  fractional labels between codes no sample can take.

## The code

??? note "figures/phase_overlay.py"

    ```python
    --8<-- "assets/code/omp-energy-rl/phase_overlay.py"
    ```

It imports `_common.py`, the shared loader, palette and rcParams style, also in
this gallery's code folder — see [the 3-D surface page](surface-3d.md).

## Run it

```bash
conda activate omp-energy-rl
cd figures
python phase_overlay.py
```

Needs `numpy`, `pandas` and `matplotlib`. The input is one bundled controller
run tracked in the repository — a headerless 13-column CSV, the schema written
by the controller running *with* the phase autoencoder. No model file and no
TensorFlow are involved: the category codes were emitted live during the run
and nothing is recomputed. `--run` selects a different run, and `--window` /
`--offset` move the view.

## Where it comes from

OpenMP energy efficiency ([project page](../projects/omp-energy-rl.md)). This
is the validation figure for phase detection: **thesis Fig. 4.11** — CpS
(chunks per second) over time, each sample coloured by the phase the
autoencoder assigned it. If the model works, the colours line up with the
visible structure in the trace, which it recovered having never been told how
many phases there were.

Two caveats from the sources. Phase code values are arbitrary and change
between training runs — an enumerated type, not an ordering. And the published
original is not shown beside this rebuild: the thesis figure manifest names one
image filename as Fig. 4.11's source, the repository ships two differently
named ones, and no source states that they are the same image, so they are left
unpaired.

The original notebooks behind this project's figures used `plotly.plotly` and
`cufflinks`, both removed from Plotly at version 4.0. These scripts are
matplotlib rewrites, not ports.

[figures/phase_overlay.py](https://github.com/mmirka/omp-energy-rl/blob/main/figures/phase_overlay.py)
