# Bar chart with value labels measured off the bars

Labels placed from the bar container itself, with a computed percentage under
each value and axis headroom made for them.

![Five bars comparing an efficiency metric across four policies and a reference configuration, each labelled with its value and gain](../assets/figures/omp-energy-rl/annotated_bar_chart.png)

## What it demonstrates

- **`ax.bar` returns a container — measure the labels off it.**
  `for bar, value in zip(bars, values): ax.text(bar.get_x() + bar.get_width() / 2, value, text, ha="center", va="bottom")`.
  Reading the geometry back from each `Rectangle` keeps placement correct
  whatever the bar width, x positions or category count; hardcoding `x = i`
  breaks the moment any of those changes. `va="bottom"` anchored at the bar's
  own height sits the text on top without a manual y offset.
- **The label carries a derived quantity.** For every non-reference bar the
  text is two lines — the value, and `f"+{100 * (reference / value - 1):.0f}%"`
  against the reference. The comparison the figure exists to make is written on
  the figure rather than left to the reader.
- **`ax.set_ylim(0, max(values) * 1.22)`.** Autoscaling stops at the tallest
  bar, so a label on top of it is clipped by the axes. Proportional headroom is
  the simplest fix and survives a change of data.

## The code

??? note "figures/governor_comparison.py"

    ```python
    --8<-- "assets/code/omp-energy-rl/governor_comparison.py"
    ```

It imports `_common.py`, the shared loader, palette, cleaning helpers and
rcParams style, also in this gallery's code folder — see
[the 3-D surface page](surface-3d.md).

## Run it

```bash
conda activate omp-energy-rl
cd figures
python governor_comparison.py                  # the figure above
python governor_comparison.py --workload 2P    # the two-phase benchmark
```

Needs `numpy`, `pandas` and `matplotlib`. The inputs are four governors × two
workloads of headerless 26-column CSVs, tracked in the repository and read with
no hardware.

## Where it comes from

OpenMP energy efficiency ([project page](../projects/omp-energy-rl.md)). Each
Linux governor runs the same workload under its own frequency policy and with
*no control at all over how many cores the workload gets*; the "best
configuration" bar is the optimum found by the exhaustive characterization
sweep. The gap between them is the headline result. **Thesis Tables 4.2 and
4.5.**

**Where the rebuild and the thesis disagree.** Recomputed from the bundled
logs, the DGEMM gains come out consistently higher than the thesis's:

| vs governor | thesis §4.3.1 | recomputed here |
|---|---|---|
| Performance | 10% | 11.7% |
| Powersave | 17% | 18.4% |
| Ondemand | 11% | 12.3% |
| Conservative | 10% | 12.1% |

One bundled log — the two-phase benchmark under Performance — contains a few
samples where the RAPL energy delta came out near zero, giving CpJ spikes five
orders of magnitude above everything else. `_common.clip_outliers` caps them
rather than dropping them, which is what the thesis's own analysis did.

The original notebooks behind this project's figures used `plotly.plotly` and
`cufflinks`, both removed from Plotly at version 4.0. These scripts are
matplotlib rewrites, not ports.

[figures/governor_comparison.py](https://github.com/mmirka/omp-energy-rl/blob/main/figures/governor_comparison.py)
