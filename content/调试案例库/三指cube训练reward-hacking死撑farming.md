---
title: 三指 cube 训练 reward hacking——策略"死撑"farming 稠密奖励而不完成任务
tags: [调试, 仿真, RL, reward-shaping, PPO]
date: 2026-06-09
status: 已解决
---

> [!bug] 现象
> 三指转方块 PPO 过夜训练：**reward 一路涨 10 倍（14→147），success_rate 却从峰值 31% 崩到 2%**。
> 期望：reward 和 success 同向上升。

## 环境

- 阶段 / 工程：P1 三指 cube 手内操作 · `sim_rl/train_cube3f_overnight.py` · orca_sim MuJoCo + SB3 PPO
- 配置：8 并行环境，CPU，`max_episode_steps=200`，~1400 fps

## 复现 / 观察到的趋势

| 步数 | reward | success | ep_len |
|---|---|---|---|
| 209k | 16.5 | **0.31** | 68（快速解决）|
| 1.0M | 58.7 | 0.28 | 147 |
| 2.3M | 113 | 0.04 | 189 |
| 4.1M | 147 | **0.02** | 192（耗满 200 上限）|

关键观察：**reward 与 ep_len 几乎完美同步上涨，二者与 success 反相关**。早期（209k）其实在真解题（success 31%、68 步完成），之后逐渐漂移成"抓住举着死撑到时间上限"。

## 根因

奖励函数（`task_envs.py` 的 `OrcaHandRightCubeOrientation`）三处缺陷叠加：

```python
def _get_reward(self):
    alignment_reward = 0.5 * (align + 1.0)        # ① 白给基线 0.5：完全不对齐也得 0.5/步
    lift_bonus = clip(z-0.12,0,0.12)/0.12
    return alignment_reward + 0.10*lift_bonus - drop_penalty   # ② 无终局成功奖励
def _get_terminated(self):
    return goal_reached or dropped                # ③ 完成=提前终止
```

把账一算就清楚——`max_episode_steps=200`，每步白拿 ~0.5–1.5：
- **快速完成**（68 步）：episode 立即终止，只攒到 ~48 分。
- **死撑**（200 步）：攒到 ~150 分。

所以"完成目标"在数学上**是一种惩罚**：它放弃了剩下一百多步的稠密分，且没有任何终局奖励来补偿。
策略没有 bug，它在**正确地优化一个写坏的奖励**。这就是 reward hacking 的典型：
agent 找到了设计者没料到的高分捷径。

## 修复

**势能整形（potential-based reward shaping, Ng et al. 1999）** + 稀疏终局信号。
不改上游，写成子类 `sim_rl/cube3f_env.py`：

```python
def _potential(self):                       # 势能 Φ = 对齐 + 0.3·举起
    return self._red_face_up_alignment() + 0.3*lift_frac
def _get_reward(self):
    phi = self._potential(); prev = self._prev_potential; self._prev_potential = phi
    r = 2.0*(phi - prev) - 0.01             # 稠密=势能差(telescope)，与时长无关；每步时间惩罚
    if self._cube_dropped(): r -= 5.0       # 掉落重罚
    if self._goal_reached(): r += 20.0      # 终局成功大奖
    return r
```

为什么这样能修：
- **势能差 telescope**：整段稠密奖励求和 = `2·(Φ_end − Φ_start)`，**有界且与 episode 长度无关** → 死撑拿不到任何额外分（ΔΦ≈0）。
- **时间惩罚** −0.01/步：拖延持续掉血。
- **终局成功 +20**：远超死撑可多拿的分，让"快速完成"成为最优。
- 势能整形**可证明不改变最优策略**（只改 shaping、不改最优解），仅加速收敛——答辩可讲。

修复验证：随机策略 reward 从原来的"白拿正分"变成 **~−1.7（负分）**，farming 的地基被抽掉。

## 复盘 & 预防

- **为什么会踩**：稠密奖励 + 固定时间上限 + 无终局奖励 + 完成即终止，是手内操作任务最经典的奖励陷阱。
- **怎么提前避免**：①**永远同时盯 reward 和 success 两条曲线**，背离就是 reward hacking 报警；② 稠密项优先用**势能整形**（数学上安全）；③ "完成任务"必须有**终局奖励**，且要 ≥ 拖到时间上限能多拿的分；④ 警惕"白给基线"（不做事也得分）。
- **泛化**：所有"达标即终止 + 稠密整形"的任务（导航到点、抓取、装配）都有此风险；终局奖励与稠密奖励的相对量级是关键超参。

## 相关

- 关联知识：[[面试知识库/算法/index]]（RL / reward shaping / PPO）
- 关联决策：[[面试知识库/项目决策/index]]（奖励设计是 sim2real 的一部分）
- 执行计划对应阶段：[[执行计划]] P1 三指能否手内操作
