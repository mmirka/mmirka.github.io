# A row of heatmaps on one shared colour scale

Spatial snapshots at several points in time, made comparable by pinning
`vmin`/`vmax` and served by a single colorbar stolen from every panel at once.

![Five 8x8 heat maps of a mean generated mesh at five training epochs, with one shared colorbar](../assets/figures/m-rwgan/heatmap_row_over_epochs.png)

## What it demonstrates

- **`ax.imshow(grid, vmin=0, vmax=1, cmap="viridis")` on every panel.** The
  whole point of the figure. `imshow` autoscales to each array's own min and
  max, so without explicit limits the five panels would each use the full
  colour range and the apparent change over training would be an artefact of
  five different scales. Fixing the bounds is what makes them a sequence rather
  than five unrelated pictures.
- **One colorbar for the whole row.**
  `fig.colorbar(im, ax=axes, label="router's size", shrink=0.85)` — passing the
  *list* of axes steals space proportionally from all of them and produces one
  bar. A single axes would shrink only that panel; one call per panel would
  repeat the same scale five times. The mappable being whichever image was
  drawn last is legitimate only because every panel shares `vmin`/`vmax`.
- **A one-panel guard.** `plt.subplots(1, 1)` returns a bare axes, not an
  array, so `if len(epochs) == 1: axes = [axes]` keeps the loop uniform. (The
  alternative is `squeeze=False`, as on the
  [binary-matrix grid](heatmap-binary-matrix.md).)

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
python router_evolution.py --config uniform --type training-progress --reward-ratio Sat100
```

Needs `numpy` and `matplotlib`. The raw training-history pickle is ~493 MB and
stays git-ignored; the figure reads a committed archive instead — an
`(n_epochs, batch, 64)` int8 array of per-router class indices, the `argmax`
every reader takes first, baked down from 492 MB to 210 KB. A plain clone
rebuilds this figure with nothing downloaded. `--history-path` still points the
script at a raw archive if you have one, and takes precedence.

## Where it comes from

M-RWGAN ([project page](../projects/m-rwgan.md)). **Thesis Fig. 6.9** (DATE2022
/ thesis Chapter 6). Each panel is the "Mean Generated NoC": an 8×8 map of the
weighted router-class score — the router's size — averaged over the generator's
fixed-noise sample batch at that epoch.

The script's docstring records a correction worth carrying: the thesis text
(page 136) confirms Fig. 6.9 is this five-epoch spatial-snapshot grid, **not**
the router-class-proportion-over-epoch line plot, which is a distinct figure
(6.10c) that this script does not reproduce. An earlier version of the
docstring conflated the two.

[figures/router_evolution.py](https://github.com/mmirka/m-rwgan/blob/main/figures/router_evolution.py)
