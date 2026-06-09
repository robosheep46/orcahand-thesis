---
title: MuJoCo 驱动只有一个关节动——mj_name2id 对错误名静默返回 -1
tags: [调试, 仿真, MuJoCo, Python]
date: 2026-06-09
status: 已解决
---

> [!bug] 现象
> 写脚本驱动三指 10 个关节做抓握，结果**只有一个关节（t-pip）动**，其余纹丝不动。模型本身没问题（离屏渲染、加载校验都正常）。

## 环境

- 阶段 / 工程：仿真线 · 三指抓握 rollout（`dexterous-hand/sim_3f/`）
- 软件：mujoco 3.9.0、Python 3.14

## 定位过程

- 加逐关节"目标 vs 实际"打印：发现**所有目标都印成同一个值 +1.20**，且只有 t-pip 实际跟踪上了。
- 追到设置目标的代码：`target[aid(name)] = v`，其中 `aid(n)=mj_name2id(m, mjOBJ_ACTUATOR, n)`。
- 关键：我传的是**关节名** `right_i-mcp`，但**执行器名是** `right_i-mcp_actuator`（带 `_actuator` 后缀）。
- `mj_name2id` 找不到名字时**不报错、静默返回 -1**。于是 `target[-1] = v` 把每个值都写到了数组**最后一个元素**（t-pip 的位置），循环结束只剩最后一次写入生效。

## 根因

`mujoco.mj_name2id` 对不存在的名字返回 **-1**（不抛异常）。Python 里 `arr[-1]` 又是合法的"最后一个元素"——两个"沉默"叠加：错误的名字 → -1 → 悄悄写到末位，没有任何报错。

## 修复

执行器名 = 关节名 + `_actuator`：

```python
def aid(n): return mujoco.mj_name2id(m, mujoco.mjtObj.mjOBJ_ACTUATOR, n + "_actuator")
# 修后 10 个关节全部精准跟踪目标（误差 <0.04 rad）
```

## 复盘 & 预防

- **为什么会踩**：MuJoCo 里关节和它的执行器是两个不同实体、名字不同；orca 模型给执行器加了 `_actuator` 后缀。
- **怎么提前避免**：拿到 id 后**立即断言 `assert idx >= 0, name`**——把"静默 -1"变成"立即报错"。负索引写入是这类 bug 的温床。
- **泛化**：`mj_name2id` 所有调用（body/joint/geom/site/sensor/actuator）都该 assert ≥0；任何"按名字查 id 再拿数组下标"的代码同理。

## 相关

- 关联案例：[[调试案例库/MJCF裁三指-同名body与悬空exclude]]、[[调试案例库/MuJoCo中文路径打不开模型]]
- 关联知识：[[面试知识库/算法/index]]（MuJoCo）
- 执行计划对应阶段：[[执行计划]] 仿真线 W1
