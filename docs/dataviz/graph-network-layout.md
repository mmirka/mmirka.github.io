# Graph drawings tiled on a matplotlib subplot grid

networkx draws through matplotlib, so a spring layout is just another artist
you can place on an ordinary `plt.subplots` grid.

![A 5x5 grid of 9-node spring-layout graph drawings, each titled with its edge count](../assets/figures/gannoc/topology_grid_graph.png)

## What it demonstrates

- **Every `nx.draw_*` function takes `ax=`.** That is the whole trick:
  networkx has no figure management of its own, it renders onto a matplotlib
  axes. So a grid of graphs is `plt.subplots(side, side)` with
  `nx.draw_networkx_edges(g, pos, ax=ax)` in the loop, and all the usual
  matplotlib layout, titling and saving on top.
- **`nx.from_numpy_array(np.triu(matrix, k=1))`.** Building the graph from the
  strict upper triangle of a symmetric adjacency matrix — the full matrix would
  give every edge twice, and `k=1` also drops the diagonal so no node gets a
  self-loop. `nx.spring_layout(graph, seed=seed)` then pins the force-directed
  layout, which is randomly initialised and would otherwise draw the same
  topology differently on every run.
- **Edges and nodes drawn separately** rather than through one `nx.draw`. Two
  calls means independent styling (grey thin edges, coloured `node_size=90`
  nodes) and a guaranteed draw order, so nodes sit on top of the edges meeting
  them. The rest is shared with
  [the binary-matrix grid](heatmap-binary-matrix.md) — same script, same data,
  two rendering functions.

## The code

??? note "figures/topology_grid.py"

    ```python
    --8<-- "assets/code/gannoc/topology_grid.py"
    ```

The link-count helper comes from a small vendored module, also in this
gallery's code folder:

??? note "figures/noc_metrics.py"

    ```python
    --8<-- "assets/code/gannoc/noc_metrics.py"
    ```

## Run it

```bash
cd figures
python topology_grid.py
```

Needs `numpy`, `matplotlib` and `networkx` — nothing else, and no import from
the project's own package. With the default `STYLE = "both"` one run writes
this figure and the adjacency-matrix view. The input is a bundled pickle of 446
valid generated topologies, so no training run and no download are needed;
`INPUT`, `STYLE`, `N_SAMPLES` and `SEED` are the settings at the top of the
script.

## Where it comes from

GANNoC ([project page](../projects/gannoc.md)). The figures README lists this
as the "topology gallery — grid of generated 9-router topologies, titled by
link count", from **RAPIDO 2021 / thesis Chapter 5**. No thesis figure number
is stated for it in the sources, so none is claimed here.

[figures/topology_grid.py](https://github.com/mmirka/GANNoC/blob/main/figures/topology_grid.py)
