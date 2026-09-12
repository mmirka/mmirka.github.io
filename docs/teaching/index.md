---
title: Teaching
---

# Teaching

What I teach at bachelor's and master's level in engineering schools:
machine learning from foundations through applied project work, deep and
symbolic AI, and distributed systems and networking.

Formats range from lectures and tutorials to hands-on labs and supervised group
projects, and most of this material has been taught in more than one of them.
Course material itself is not hosted here.

## Machine learning: foundations

Theory paired one-for-one with Python labs in Spyder or Jupyter: pandas,
matplotlib, seaborn, scikit-learn. Prerequisites: matrix algebra and
diagonalization, maximum-likelihood estimation and quadratic risk, Python.

- **Framing.** ML applications; the pipeline; supervised versus unsupervised;
  risk and generalization.
- **Representation and dimensionality.** Data and correlation matrices; PCA and
  choosing its dimension from an elbow; t-SNE.
- **Clustering.** Dissimilarity measures; agglomerative hierarchical clustering
  with single and complete linkage, and its dendrogram; K-means via Lloyd's.
- **Probabilistic classification.** Bayesian decision theory; naive Bayes;
  linear discriminant analysis.
- **Discriminative models.** Logistic regression from the logit and logistic
  loss through optimization to prediction; linear SVM: margin maximization,
  the dual, support vectors, soft margin and its hyperparameter, multi-class
  extension; kernel SVM with an RBF kernel.
- **Regression.** Linear and polynomial, on real datasets.
- **Data preparation.** Encodings and one-hot; outlier removal; missing-value
  imputation; normalisation; embeddings.
- **Model selection.** Metrics; under- and overfitting; K-fold
  cross-validation for hyperparameter selection.
- **Ensembles.** Weak and strong learners; bagging and boosting.

Lab arc: setup, a first k-NN, PCA and t-SNE, a hand-coded K-means, logistic
regression, linear then kernel SVM with model selection, exploratory analysis
and cleaning, customer-personality clustering with imputation, and a closing
hyperparameter search in which students submit their own models.

## Applied AI and data-science projects

Practice-first, for students who need to *run* an AI project rather than derive
it. Some theory, no maths.

- **Landscape.** What AI is and where data sits in it; supervised,
  unsupervised and reinforcement learning with their sub-categories, use cases
  and canonical examples.
- **Inputs.** Tabular (discrete and continuous), text, time series, images,
  graphs, and **choosing an algorithm** given data volume, format, compute
  budget and objective.
- **Method.** Dos and don'ts: define clear objectives, start small, insist on
  data quality, test and refine, address ethics; against starting big, relying
  on AI alone, treating it as a silver bullet, neglecting feedback loops. A
  five-step process (define the problem, prepare the data, find the
  algorithm, improve, present), contrasted with exploratory analysis for when
  the dataset is given and the problem is not.
- **Algorithm focus sessions.** Random forests; DBSCAN; ARIMA and Prophet;
  dense networks; autoencoders; GANs.
- **Generative AI in practice.** LLMs, running one locally, and the tooling
  around it.
- **The data-scientist role**.

Worked end-to-end on Kaggle datasets: Titanic and Spaceship Titanic from import
through missing values and feature conversion to submission files;
human-activity recognition, descriptively then with a tuned neural network;
multi-algorithm screening with PyCaret; and an open project on an industry
dataset.

## Deep learning

- **Neural-network fundamentals** and a tour of architectures: DNN, CNN, RNN,
  GNN, autoencoder, VAE, GAN, LSTM.
- **Practicals in TensorFlow**: data handling, handwritten-digit recognition on
  MNIST, text classification on IMDB reviews.
- **Open project work** on a text, image or audio topic with an open dataset.

## Symbolic AI and natural-language processing

- **Logic and reasoning.** Propositional, first-order and modal logic.
- **Knowledge representation** and intelligent agents.
- **Natural-language processing**, treated at length: parsing, part-of-speech
  tagging, machine translation, named-entity recognition, sentiment analysis;
  pre-trained word embeddings such as GloVe.

## Distributed applications and networking

A bottom-up pass through the stack, in C on Unix, from process synchronisation
to remote procedure call: lectures, tutorials, labs and a supervised group
project.

- **Concurrency and IPC.** Concurrent programming; synchronisation with
  semaphores and critical sections; pipes, signals and threads; a practical
  refresher on C strings and memory allocation.
- **Layered architectures.** Why they exist; OSI and TCP/IP; physical and
  data-link layers.
- **The network layer.** IP interconnection, relaying and routing; addressing
  and naming; the datagram; fragmentation; ICMP.
- **Transport and application layers.** UDP and TCP; the client-server model;
  socket programming in C; HTTP; websockets over HTTP with a JavaScript /
  Node.js API; RPC and Java RMI.
- **Network administration**, on Raspberry Pi hardware: hostnames, system
  configuration files, addressing.

Labs follow the same arc: synchronisation, pipes and signals; sockets; an HTTP
client and server; a websockets lab building a Node.js server and JavaScript
client with chat and shared-editor exercises; and an RPC lab generating stubs
with `rpcgen`.

### Socket programming: TCP versus UDP

A comparative pair of labs taught as a unit. Students write sender/receiver and
client/server programs, run them across two machines, and observe directly that
UDP preserves message boundaries but can truncate, reorder or lose datagrams,
while TCP delivers an ordered byte stream in which those boundaries are
invisible, including the consequences for `send`/`recv` return values and for
detecting a peer that has disconnected.

---

[Get in touch](../index.md#useful-links) about teaching or guest lectures.
