# Two overlaid histograms with their means marked

A side-by-side bar histogram that compares two populations over the same
integer bins and writes each population's mean into the legend and onto the
axes.

![Overlaid link-count histograms of two generated topology sets, each annotated with its mean](../assets/figures/gannoc/connection_histogram.png)

## What it demonstrates

- **Fixed bins from `np.bincount`, not `ax.hist`.**
  `np.bincount(counts, minlength=MAX + 1)[bins]` sliced to a fixed range makes
  both series share an x-axis even when one never reaches the extremes,
  `ax.hist` picks its own edges per call and would not.
- **Side-by-side bars by shifting the centres.** Two `ax.bar` calls at
  `bins ± width / 2`, `width = 0.4`. For integer data this beats overlapping
  semi-transparent bars, and nothing is hidden behind anything.
- **The statistic lives in the legend label.** Means are formatted into
  `label=` (`f"WGAN (mean {wgan_mean:.2f})"`), so no annotation has to be
  positioned; `ax.axvline(mean, linestyle="--")` in each series' colour places
  the mean honestly between bars rather than rounding it to one.

## The code

??? note "figures/connection_histogram.py"

    ```python
    --8<-- "assets/code/gannoc/connection_histogram.py"
    ```

The connection count and validity helpers come from a small vendored module,
also in this gallery's code folder:

??? note "figures/noc_metrics.py"

    ```python
    --8<-- "assets/code/gannoc/noc_metrics.py"
    ```

## Run it

```bash
cd figures
python connection_histogram.py
```

Needs only `numpy` and `matplotlib`. Both inputs ship in the repository: two
pickles of already-generated valid 9-router topologies, 446 each, drawn from
identical noise seeds, each a `(446, 9, 9)` array of zeros and ones. No
training run and no download. The source project calls this its
"guaranteed-reproducible figure".

## Where it comes from

GANNoC: a WGAN-GP that generates network-on-chip topologies, and the reward
network that steers it toward denser ones
([project page](../projects/gannoc.md)). The two populations are the plain
WGAN-GP baseline and the reward-guided RWGAN, sampled from the same seeds; the
reward-guided mean sits at roughly 14 links against roughly 12 for the
baseline.

The figures README places this in **thesis Chapter 5** and in **RAPIDO 2021**
without giving a figure number. The closest thesis figure by caption is **Fig.
5.7** (comparing generated topologies by number of connections and by mean
packet latency), of which this reproduces the connection-count half only; the
latency half needs a cycle-accurate NoC simulator that the clean-room
repository does not carry.

[figures/connection_histogram.py](https://github.com/mmirka/GANNoC/blob/main/figures/connection_histogram.py)
