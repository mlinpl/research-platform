---
title: How to handle data shift during fine tuning RL models?
leader: Maciej Wołczyk, Bartłomiej Cupiał
contact: maciej.wolczyk@gmail.com
positions:
    - name: Student Researcher
lab_name: GMUM
created: 2023-10-22
---

Foundation models have delivered impressive outcomes in areas like computer vision and language processing, but not as much in reinforcement learning. It has been demonstrated that fine-tuning on compositional tasks, where certain aspects of the environment may only be revealed after extensive training, is susceptible to catastrophic forgetting. In this situation, a pre-trained model may lose valuable knowledge before encountering parts of the state space that it can handle. The goal of the project is to research and develop methods which could prevent forgetting of the pretrained weights and therefore get better performace by leveraging previous knowledge. Highly recommend section 4.4 Minecraft RL

### General must-have requirements

PyTorch
