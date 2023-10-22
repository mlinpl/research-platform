---
title: Dynamic computations in NLP models
leader: Tomasz Trzcinski
contact: filip.szatkowski@pw.edu.pl
positions:
    - name: Master's Candidate
lab_name: CVLab
created: 2023-10-22
---

Transformers are the foundation for many well performing neural language processing models. Unfortunately, they require a lot of computational resources which results in slow inference. In this project we aim to leverage conditional computation methods to speed up inference along three axes: depth-wise sparsity (early exits), width-wise sparsity (mixture of experts) and input-wise sparsity (dynamic sequence pruning). Additionally, we would like examine the hypothesis that some data points are easier to process for neural networks. For that purpose, among others, we would like to implement dynamic variant of mixture of experts (MoE) that enables MoE layers to use less resources for easy data points and compare it with difficulty rating extracted from early exit models.

#### Major 
- Artificial Intelligence
