# Plotting recipes

This page is dedicated to **dataviz with python**.

I share the python code to reproduce figures from my research publications mostly.


## matplotlib

### Distributions

Fixed-bin histograms, and box plots assembled from statistics you compute.

<div class="gallery" markdown>
[![Two overlaid link-count histograms with their means marked](../assets/figures/gannoc/connection_histogram.png)<br>Two overlaid histograms with their means marked](distributions-histogram.md){ .gallery-item }
[![Box plots of three metrics across four epoch groups](../assets/figures/m-rwgan/box_whisker_panels.png)<br>Box plots from precomputed statistics](distributions-box-whisker.md){ .gallery-item }
</div>

### Scatter

Points carrying uncertainty, labels, or a reference curve.

<div class="gallery" markdown>
[![Scatter with x and y error bars over a reference curve](../assets/figures/m-rwgan/pareto_errorbar_scatter.png)<br>Scatter with two-axis error bars](scatter-errorbars.md){ .gallery-item }
[![Scatter with shaded error ellipses and hand-placed labels](../assets/figures/m-rwgan/annotated_scatter.png)<br>Annotated scatter with error ellipses](scatter-annotated.md){ .gallery-item }
[![Two coloured sweep halves above a binned frontier curve](../assets/figures/m-rwgan/pareto_front_scatter.png)<br>One array split into two series against a frontier](scatter-pareto-front.md){ .gallery-item }
</div>

### Lines and time series

Axes rebuilt from mismatched logging rates, one plot restyled five ways, curve
overlays, stacked panels, and colour-by-category.

<div class="gallery" markdown>
[![Generator and critic loss against fractional epoch](../assets/figures/m-rwgan/training_losses.png)<br>Rebuilding an x-axis from mismatched logging rates](lines-training-curves.md){ .gallery-item }
[![The same line plot rendered in a colour style](../assets/figures/m-rwgan/restyled_line_plot.png)<br>One line plot, five renders from a style table](lines-restyling.md){ .gallery-item }
[![Two stacked panels with five labelled curves each](../assets/figures/m-rwgan/multi_series_comparison.png)<br>Five-curve overlay with a legend strip above](lines-multi-series.md){ .gallery-item }
[![Three stacked panels on a shared time axis](../assets/figures/omp-energy-rl/stacked_time_series.png)<br>Stacked panels with a twin y-axis and an event marker](timeseries-stacked-panels.md){ .gallery-item }
[![A trace whose samples are coloured by a category code](../assets/figures/omp-energy-rl/categorical_overlay.png)<br>Colouring a line by a categorical variable](timeseries-categorical-overlay.md){ .gallery-item }
</div>

### Bar charts

Labels measured off the bars, and the offset formula for N grouped series.

<div class="gallery" markdown>
[![Five bars each labelled with its value and gain](../assets/figures/omp-energy-rl/annotated_bar_chart.png)<br>Bar chart with labels measured off the bars](bars-annotated.md){ .gallery-item }
[![Four bar series across fourteen categories plus a summary group](../assets/figures/m-rwgan/grouped_bar_chart.png)<br>Grouped bars with a computed summary group](bars-grouped.md){ .gallery-item }
</div>

### Heatmaps and small multiples

Panels made comparable by a shared colour scale, and what to do when they
cannot share one.

<div class="gallery" markdown>
[![Five heat maps in a row sharing one colorbar](../assets/figures/m-rwgan/heatmap_row_over_epochs.png)<br>A row of heatmaps on one shared colour scale](heatmap-row-over-time.md){ .gallery-item }
[![Seven heat maps in a 4+3 grid with one shared colorbar](../assets/figures/m-rwgan/heatmap_panel_grid.png)<br>Small-multiple heatmaps over a parameter sweep](heatmap-panel-grid.md){ .gallery-item }
[![A row of heat maps with a colorbar on each side](../assets/figures/m-rwgan/heatmap_row_dual_colorbars.png)<br>Two independent colour scales in one row](heatmap-dual-colorbars.md){ .gallery-item }
[![A 5x5 grid of black-and-white adjacency matrices](../assets/figures/gannoc/topology_grid_matrix.png)<br>A grid of binary matrices with the spare cells blanked](heatmap-binary-matrix.md){ .gallery-item }
</div>

### 3-D

A `projection="3d"` axes sharing a figure with an ordinary one.

<div class="gallery" markdown>
[![A 3-D surface next to a heat map of the same grid](../assets/figures/omp-energy-rl/surface_3d.png)<br>A 3-D surface beside its own heat map](surface-3d.md){ .gallery-item }
</div>

### Graphs

`networkx` has no figure management of its own. It renders onto a matplotlib
axes, so graph drawings tile on an ordinary subplot grid.

<div class="gallery" markdown>
[![A 5x5 grid of spring-layout graph drawings](../assets/figures/gannoc/topology_grid_graph.png)<br>Graph drawings tiled on a subplot grid](graph-network-layout.md){ .gallery-item }
</div>

## Keras

The one page here that does not go through matplotlib: a network diagram
generated from the model object itself.

<div class="gallery" markdown>
[![Keras plot_model diagram of a generator network](../assets/figures/gannoc/keras_model_generator.png)<br>Rendering a Keras model as a layer diagram](keras-model-diagram.md){ .gallery-item }
</div>
