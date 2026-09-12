# mmirka.github.io

Source for my portfolio site: profile, PhD research, teaching, publications, and
a gallery of the figures behind the work.

Built with [MkDocs](https://www.mkdocs.org/) +
[Material](https://squidfunk.github.io/mkdocs-material/), deployed to GitHub
Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Layout

```
docs/
├── index.md            Home
├── projects/           the three-project PhD arc + its index
├── dataviz/            one page per figure, plus a thumbnail gallery
├── thesis/             both editions of the thesis
├── publications/       links only — publisher DOI + HAL open access
├── teaching/           courses taught, by domain
├── resume/
└── assets/
    ├── figures/        committed PNGs, namespaced by project
    ├── code/           figure scripts, embedded into pages via snippets
    ├── stylesheets/
    └── javascripts/
```

## The repositories behind it

| Repo | What it is |
|---|---|
| [omp-energy-rl](https://github.com/mmirka/omp-energy-rl) | Online reinforcement-learning control of OpenMP energy efficiency — thesis Ch. 4 |
| [GANNoC](https://github.com/mmirka/GANNoC) | Reward-guided GAN generation of network-on-chip topologies — thesis Ch. 5 |
| [m-rwgan](https://github.com/mmirka/m-rwgan) | Multi-reward WGAN for heterogeneous NoC design-space exploration — thesis Ch. 6 |

The thesis is on the site in full, both editions, under `docs/thesis/`. The
manuscript as submitted is the
[PDF on HAL](https://hal-lirmm.ccsd.cnrs.fr/tel-03480748v2).

## Build locally

```bash
python -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/mkdocs serve          # http://127.0.0.1:8000
.venv/bin/mkdocs build --strict # what CI runs
```

`--strict` is the gate: a broken internal link, a missing anchor or an absent
image fails the build.

## License

The site code — `mkdocs.yml`, the stylesheets and JavaScript under
`docs/assets/`, and the CI workflow — is MIT licensed; see [`LICENSE`](LICENSE).

The written content and the figures — everything under `docs/` that is prose,
the thesis chapters, and the images under `docs/assets/figures/` — are licensed
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/): reuse them freely
with attribution to Maxime Mirka.

Figures reproduced from published papers (`from_papers/` in
[omp-energy-rl](https://github.com/mmirka/omp-energy-rl)) remain under their
publishers' terms and are shown here for comparison only.
