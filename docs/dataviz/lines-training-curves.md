# Rebuilding an x-axis when two series are logged at different rates

Per-batch loss curves placed on a fractional-epoch axis, so they can be read
next to quantities that are only logged once per epoch.

![Generator and critic loss against fractional epoch](../assets/figures/m-rwgan/training_losses.png)

## What it demonstrates

- **The x-axis is synthesised, not stored.** Losses are logged every batch, the
  reward every epoch. To put the batch-rate series on an epoch axis the script
  builds `np.arange(0, n_epochs, n_epochs / len(g_loss))[:len(g_loss)]`. The
  trailing slice matters: floating-point step accumulation makes `np.arange`
  occasionally return one element too many, and `plot` would raise on
  mismatched lengths.
- **`n_epochs` is recovered from a different array.** The batch log does not
  know how many epochs it spans, so the count comes from
  `len(next(iter(rewards.values()))) - 1`: the two logging rates are
  reconciled by reading one from the other rather than by hardcoding.
- **Optional series handled by dict, not by branching.** The reward plot walks
  `sorted(run["rewards"].items())` with a colour lookup keyed by channel index,
  so a two-reward run draws two lines and a three-reward run three, in a stable
  order, from the same six lines of code.

## The code

??? note "figures/loss_curves.py"

    ```python
    --8<-- "assets/code/m-rwgan/loss_curves.py"
    ```

It imports the shared `noc_data.py` data layer, also in this gallery's code
folder. See [the errorbar scatter page](scatter-errorbars.md).

## Run it

```bash
cd figures
python loss_curves.py --run-prefix \
    "data/reward_weight_sweep_8x8_3reward/uniform_3c/multiRWGAN_R-SatGCN_300e_L0.2-d0.05_beta10_SatAndArea_100-0_date08072021_"
```

Needs `numpy` and `matplotlib`. One invocation writes both the loss figure
above and the reward-score figure. The two raw loss logs are 6–8 MB each and
live in a git-ignored tree; the two plotted columns and the per-epoch reward
arrays in full are baked into a committed archive (12 MB → 1.4 MB) that the
script prefers, so this figure needs no download.

One caveat on other runs: a run produced by the repository's own
`scripts/train_mrwgan.py` will not be read as-is. It writes `generator_loss.pkl`
and `reward_sat_loss.pkl`, where this script expects the bundled extensionless
`*_generator_loss` and `*_reward{1,2,3}_loss`. Rename or symlink first.

## Where it comes from

M-RWGAN ([project page](../projects/m-rwgan.md)). **Thesis Fig. 6.10**
(DATE2022 / thesis Chapter 6): generator and critic loss plus reward scores,
for the uniform-traffic saturation/area run.

[figures/loss_curves.py](https://github.com/mmirka/m-rwgan/blob/main/figures/loss_curves.py)
