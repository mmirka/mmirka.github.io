# Stacked panels on a shared time axis, with a twin y-axis and an event marker

A long, noisy trace drawn raw underneath its own rolling mean, across panels
whose number is decided by the data, with one shared vertical event line.

![Three stacked panels against a shared time axis: an efficiency metric, the chosen configuration, and a phase code, with the end of exploration marked](../assets/figures/omp-energy-rl/stacked_time_series.png)

## What it demonstrates

- **Raw under smooth, not raw replaced by smooth.** The trace is 5000–15000
  samples at 500 ms; drawn raw it is a solid block. It goes down at
  `lw=0.4, alpha=0.30` with a
  `series.rolling(window, min_periods=1, center=True).mean()` overlay on top at
  `lw=1.6`: the scatter is real, and hiding it would misrepresent how noisy
  the signal is. `min_periods=1` keeps the ends of the trend line instead of
  leaving `NaN` gutters; `center=True` stops it lagging by half a window.
- **`ax.twinx()` for a second unit in one panel.** Core count and frequency
  share a panel and have nothing in common numerically, so the second gets a
  right-hand axis, colour-matched through `ax.set_ylabel(..., color=...)` plus
  `ax.tick_params(axis="y", labelcolor=...)`. `twin.grid(False)` is essential:
  two gridded axes on one panel draw two offset sets of horizontal lines.
- **The panel count comes from the data.**
  `plt.subplots(3 if has_phase else 2, 1, ..., sharex=True)`: a run recorded
  without the third signal gives a two-panel figure rather than an empty axes.
  That third panel is a scatter, not a line: a connected line would imply the
  phase codes are ordered.

## The code

??? note "figures/controller_trace.py"

    ```python
    --8<-- "assets/code/omp-energy-rl/controller_trace.py"
    ```

It imports `_common.py`, the shared loader, cleaning helpers and rcParams
style, also in this gallery's code folder. See
[the 3-D surface page](surface-3d.md).

## Run it

```bash
conda activate omp-energy-rl
cd figures
python controller_trace.py
```

Needs `numpy`, `pandas` and `matplotlib`. The inputs are three recovered
controller runs tracked in the repository as headerless CSVs: 13 or 7 columns,
with `_common.load_csv` picking the schema by column count. No hardware, no
training and no network access.

The recovered traces carry real measurement artefacts, left in rather than
cleaned out: negative rate and efficiency values from the mutex-free chunk
counter's rare torn reads, and negative energy readings, because the original
controller differenced the 32-bit RAPL counters without correcting for
wraparound.

## Where it comes from

OpenMP energy efficiency: reinforcement-learning control of core count and
frequency ([project page](../projects/omp-energy-rl.md)). The three panels are
the reward signal (CpJ, chunks per Joule), the action the controller chose, and
the execution phase the autoencoder detected.

This is one of **thesis Figs. 4.18–4.24**, the range the script rebuilds; the
sources do not pin this particular run to a single number, so none is claimed
here.

Two things the sources record about reading it. The vertical line marks the end
of the exploration period, 2048 steps = 1024 s; to its left the controller
chooses at random, to its right it follows its Q-network's argmax. But the mean
efficiency keeps climbing until roughly 2000 s. That is not a discrepancy:
experience replay holds 2048 transitions, so it takes another full buffer's
worth of *greedy* experience to flush the random actions out and refit the
Q-network on what the greedy policy actually sees. And no published original
for this run ships with the repository, the thesis's traces for this workload
come from `.eps` sources that are not among the shipped originals, so there is
no side-by-side.

The original notebooks behind this project's figures used `plotly.plotly` and
`cufflinks`, both removed from Plotly at version 4.0. These scripts are
matplotlib rewrites, not ports.

[figures/controller_trace.py](https://github.com/mmirka/omp-energy-rl/blob/main/figures/controller_trace.py)
