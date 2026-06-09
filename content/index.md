---
title: 低成本三指灵巧手平台
description: 把 ETH ORCA 开源手裁剪成三指，硬件线 + 仿真线双轨并行，跑通遥操作 → 模仿学习 → RL sim2real 的毕业设计知识库。
---

> [!abstract] 这是什么
> 毕业设计《**低成本三指灵巧手平台的构建与基于学习的操作技能研究**》的项目知识库。
>
> 一句话：把 ETH ORCA 开源手（飞特 STS3215 执行器）**裁剪成三指**，硬件线与仿真线**双轨并行**，跑通 **遥操作 → 模仿学习（保底）→ RL sim2real（主线）** 的算法阶梯；触觉与 FOC 执行器为可选冲高项。
>
> 周期 12 个月（2026-07 ~ 2027-06）｜ 定位：嵌入式岗 + 算法加分 ｜ 成本 ≈ ¥2400

## 论文贡献点

1. **三指裁剪构型的可行性验证**（仿真先行：批量采购前用 RL 验证三指能否完成手内操作）
2. **力矩 vs 位置动作空间的 sim2real 对照实验**（仿真内完成，ORCA 论文未做）
3. 低成本三指平台上 **IL + RL sim2real 全链路复现**与 gap 分析
4. （可选）拇指 2 轴 **FOC 化**的执行器对比研究

## 双轨里程碑

```
硬件线  W1 采购 → W2-4 单指验证 → M2 三指装机 → M2-3 遥操作管线
仿真线  W1 环境 → W2-4 复现五指RL基线 → M2 三指MJCF重训 → M3 对照实验
                              两线 M3 末会师：真机零样本首测
```

| 阶段 | 月份 | 目标 |
|---|---|---|
| **P0** | M1 | 单指验证（3 舵机跑通官方脚本）；仿真复现五指转球基线 |
| **P1** | M2 | 三指装机 + 三指 MJCF 重训（回答"三指能否手内操作"） |
| **P2** | M2.5–3.5 | 遥操作：MediaPipe → retargeter → 实时控制 + 录制 |
| **P3** | M3.5–5.5 | **模仿学习（保底线）**：ACT/DP 学 2 个任务 ← 毕设成立 |
| **P4** | M5–8 | RL sim2real：域随机化 + 真机零样本/微调 + gap 分析 |
| **P5** | M8–12 | 冲高+收尾：触觉 / 拇指 FOC（二选一或砍）；论文、答辩 |

→ 完整阶段验收、采购清单、风险登记见 [[执行计划]]。

## 知识库导航

> 按**用途**双库组织：动手时沉淀问题，备答辩时沉淀知识。

| 板块 | 内容 |
|---|---|
| [[调试案例库/index\|🐞 调试案例库]] | 装机/接线/标定/环境/训练的**实战踩坑**，按 现象→根因→修复 沉淀（调试时 AI 协助落盘） |
| [[面试知识库/index\|🎓 面试知识库]] | 嵌入式 / 算法 / 项目决策的**体系化深度知识**，答辩与面试的弹药库 |
| [[执行计划]] | 课题定案、里程碑、采购、论文骨架、风险（master 文档） |
| [[环境配置]] | 谁跑在哪：Windows 原生 vs 云 Linux；MuJoCo/CadQuery/orca_core/AutoDL 安装步骤 |

## ORCA 开源资产（[github.com/orcahand](https://github.com/orcahand)，MIT）

| 仓库 | 作用 | 本地 |
|---|---|---|
| [orca_core](https://github.com/orcahand/orca_core) | Python 控制栈（Dynamixel + Feetech 双后端、YAML 配置、标定脚本） | `repos/orca_core` |
| [orcahand_description](https://github.com/orcahand/orcahand_description) | MJCF/URDF 模型（三指裁剪 = 改 XML） | `repos/orcahand_description` |
| [orca_sim](https://github.com/orcahand/orca_sim) | 仿真环境（RL 基线 = IsaacGymEnvs + A2C + 域随机化） | `repos/orca_sim` |
| [orca_retargeter](https://github.com/orcahand/orca_retargeter) | 人手 → 机械手重定向 | `repos/orca_retargeter` |
| [orca_teleop](https://github.com/orcahand/orca_teleop) | 遥操作输入（换 MediaPipe，不买手套） | `repos/orca_teleop` |

> [!note] 状态（2026-06-09）
> **食指验证电气套件已购**（STS3215×4 + FE-URT-2 + 7.4V 电源 + 轴承/腱绳/PTFE 管）。**三指 MJCF 已裁定并动力学验证通过**。**仿真环境就绪**（orca_sim：MuJoCo+Gymnasium 本地原生，非 Isaac）。**RL 管线已验证**（SB3 PPO），**三指 cube 操作任务已建成**（obs37/act10，三指能抓握方块）。**CadQuery 基座+绞盘第一版出件**。源文件夹改英文名 `dexterous-hand`。
> 下一步：舵机到货跑 orca_core 单指验证；仿真上 AutoDL 云正式训三指基线（答「三指能否手内操作」）。
