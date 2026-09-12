# One line plot, five renders from a style table

Driving figure size, palette, line width, font size and legend placement from a
dict, so the same plot can be emitted for a slide, for a two-column paper and
for greyscale print.

![Three router-class fractions per training epoch, colour version](../assets/figures/m-rwgan/restyled_line_plot.png)

## What it demonstrates

- **A `STYLES` dict maps a name to a full render.** Each entry carries
  `figsize`, a colour triple, `lw`, a font size and a `legend_kw`; one
  `plot_style(proportions, name, style, output_dir)` consumes it. The data
  loads once and draws five times, and a sixth look is a dict entry rather than
  a copied cell.
- **Conditional keyword assembly.** `kw = {"label": ..., "color": ...}`, then
  `if style["lw"] is not None: kw["linewidth"] = style["lw"]`. A style can
  decline to set a property and inherit matplotlib's default, which passing
  `linewidth=None` explicitly would not do.
- **An out-of-axes legend needs `bbox_inches="tight"`.**
  `legend(loc="upper left", bbox_to_anchor=(1, 0.78, 0.3, 0.3))` puts it beside
  a 7.5×2 inch figure where there is no room inside; it lies outside the
  nominal figure rectangle and would be cropped at save time without the tight
  bbox. Font size is a style property too, and must be applied to both
  `ax.set_xlabel(..., fontsize=fs)` and `ax.tick_params(labelsize=fs)`,
  forgetting the second is why a resized figure looks half-scaled.

## The code

??? note "figures/taux_routeurs_date2022.py"

    ```python
    --8<-- "assets/code/m-rwgan/taux_routeurs_date2022.py"
    ```

It imports the shared `noc_data.py` data layer, also in this gallery's code
folder. See [the errorbar scatter page](scatter-errorbars.md).

## Run it

```bash
cd figures
python taux_routeurs_date2022.py --style all
```

Needs `numpy` and `matplotlib`. One invocation writes all five styles:

| Output | Style |
|---|---|
| `BDtime3` | colour (r/g/b), figsize 8.75×3, the render above |
| `BDtimeBW` | greyscale, thick lines, figsize 7.5×2 |
| `BDtimeBWr` | red-scale |
| `BDtimeBW2` | yellow/teal/blue |
| `BDtimeBW3` | yellow/teal/blue (alternate shades) |

The raw training-history pickle stays git-ignored; the script reads a committed
archive holding the per-router class indices this figure reduces the batches
to, so no download is needed. `--history-path` reads a raw archive instead.

## Where it comes from

M-RWGAN ([project page](../projects/m-rwgan.md)). The mean fraction of the 64
routers in each of three size classes, per training epoch, averaged over a
fixed-noise generator sample batch.

This is the DATE2022 router-rate-over-training curve, from the
`picture_DATE2022_tauxRouteurs` notebook. No thesis or paper figure number is
stated for it in the sources, so none is claimed here.

[figures/taux_routeurs_date2022.py](https://github.com/mmirka/m-rwgan/blob/main/figures/taux_routeurs_date2022.py)
