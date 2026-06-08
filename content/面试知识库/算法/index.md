---
title: 算法
tags: [面试, 算法]
---

# 🧠 算法

> RL 主干、模仿学习、MuJoCo、PyTorch/Transformer、sim2real——算法加分项。代码先行、论文解惑，每篇沉淀"能讲清的原理"。

## 仿真与训练栈

- WSL2 + Ubuntu 22.04 + uv；MuJoCo viewer 看 `orcahand_description` 的 MJCF；云 GPU 用 AutoDL 租 4090
- RL 官方基线 = IsaacGymEnvs + A2C + 域随机化（1 小时训出五指转球零样本上实物）；路线先 MuJoCo 后 Isaac

## 待写笔记

**RL 主干**
- [ ] MDP → 策略梯度 → A2C/PPO 推导主线（蘑菇书 / Spinning Up）
- [ ] 域随机化为什么能跨 sim2real gap，随机化哪些量
- [ ] 《Learning Dexterity》要点（手内操作 RL 的经典做法）

**模仿学习（保底线）**
- [ ] ACT (Zhao 2023) 精读：action chunking + CVAE 解决了什么
- [ ] Diffusion Policy (Chi 2023) 精读：用扩散建模动作分布的动机
- [ ] LeRobot dataset 规范 / 遥操作数据采集

**基础**
- [ ] PyTorch + d2l：张量/反传/MLP、**Transformer 必学**
- [ ] MuJoCo / MJCF 要点；三指裁剪 = 删 ring/pinky 改 XML
- [ ] retargeter 代价函数、MediaPipe 关键点 → 机械手映射

> 训练不收敛、MJCF 报错等实操问题记到 [[调试案例库/index]]，这里只沉淀**原理**。
