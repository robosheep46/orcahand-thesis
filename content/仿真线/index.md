---
title: 仿真线
tags: [仿真]
---

# 🖥 仿真线

> 环境搭建 → 复现五指 RL 基线 → 三指 MJCF 重训 → 动作空间对照实验。仿真半场零硬件依赖，最大风险前置。

## 环境

- WSL2 + Ubuntu 22.04 + uv，`.wslconfig` 限内存 8G
- MuJoCo viewer 打开 `repos/orcahand_description/v2/models/mjcf/`
- 云 GPU：AutoDL 租 4090（本机不买卡），训练全在云端

## RL 基线

- 官方基线 = IsaacGymEnvs + A2C + 域随机化，1 小时训出五指转球零样本上实物
- 路线：先 MuJoCo 后 Isaac

## 待填充

- [ ] WSL2 + MuJoCo 安装踩坑
- [ ] 五指转球基线复现（reward 曲线 + rollout 视频）
- [ ] 三指 MJCF 裁剪（删 ring/pinky）+ 重训
- [ ] 力矩 vs 位置动作空间对照实验设计与结果
- [ ] 域随机化参数表
