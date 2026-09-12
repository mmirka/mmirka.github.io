---
title: Abstract
lang: en
source: Abstract/abstractEN.tex
---

# Abstract

<div class="lang-switch" markdown>
<span class="lang-pill is-current">English</span>
[Français](fr/abstract.md){ .lang-pill title="Ce chapitre en français" }
</div>

The rise of machine learning techniques and algorithms and their use in a large
variety of domains show often surprising capabilities – in the interpretation of
input data and the ability to build relevant abstract representations (e.g.
supervised learning), but also in the dynamic control of complex systems (e.g.
reinforcement learning). Optimizing the energy efficiency of computing systems
has become a major issue. From hardware design to software control, different
levers exist to act on the execution of calculations. We consider in this thesis
the optimization of parallel computing, running on complex architectures, from
multicore processors to computing clusters. These systems present a large number
of design and control parameters, giving rise to a number of combinations often
too large to be considered exhaustively.

Thus, this thesis aims at using recent machine learning techniques, based on
neural networks, to build solutions for the control and design of computing
systems. These techniques can consider a significant set of parameters in order
to propose optimal solutions. The proposed techniques are intended to be
multi-level and can therefore be applied to embedded systems or various
sub-components but also at the scale of a distributed system, such as a
computing cluster.

Promising solutions are proposed along two distinct research axes. The first
axis addresses the dynamic control of parallel computing. It deals with the
real-time optimization of the energy efficiency of a system running an
application parallelized with OpenMP. Among others, a control based on
reinforcement learning is proposed. The second axis concerns the design of
optimized communication networks. Indeed, communication networks represent a
significant part of the energy consumption of computing systems. Thus, we
propose a design tool based on generative AI, for the generation of optimized
networks according to user criteria such as energy efficiency.
