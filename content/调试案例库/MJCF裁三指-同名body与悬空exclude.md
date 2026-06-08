---
title: 裁三指 MJCF：中指/无名指同名 body + 删body后悬空 contact exclude 导致加载失败
tags: [调试, 仿真, MuJoCo, MJCF, orcahand]
date: 2026-06-08
status: 已解决
---

> [!bug] 现象
> 把官方五指 `orcahand_right` 裁成三指（删无名指 r- + 小指 p-）时，两类坑：① 想"按名字删 body"会删错指——中指和无名指的 body **同名都叫 `right_M-AP`**；② 删完 body 后 `MjModel.from_xml_path` 报 `unknown body` 加载失败。

## 环境

- 阶段 / 工程：仿真线 · 三指 MJCF 裁剪（`repos/orcahand_description/v2`）
- 软件版本：mujoco 3.9.0（Windows 原生，`pip install mujoco`，Python 3.14）
- 触发条件：手工删 body 子树 + 编译 `scene_3f_right.xml`

## 复现步骤

1. 复制 `orcahand_right_body.xml` → 删掉无名指(r-)和小指(p-)两棵 body 子树。
2. `python -c "import mujoco; mujoco.MjModel.from_xml_path('scene_3f_right.xml')"`
3. 报错 `Error: unknown body 'right_M-AP_6ec59111'`（来自 `.mjcf` 的 `<contact><exclude>`）。

## 定位过程

- 五指有 17 关节：wrist + 拇指 t-(4) + 食/中/无名/小 各 abd/mcp/pip(3×4)。三指保留 拇+食+中 = 10。
- 看 body 树发现两个 body 都叫 `right_M-AP`：`_e04a96f2`（里面挂 **m-** 关节 = 中指）和 `_6ec59111`（里面挂 **r-** 关节 = 无名指）。只有 hash 后缀 + 内部关节前缀能区分。
- 加载报错不在 body 本身，而在 `.mjcf` 的 `<contact>`：里面有几十条 `<exclude body1=.. body2=..>`，其中引用了已删除的 r-/p- body。

## 根因

1. **同名 body**：ORCA 导出的 MJCF 用 `部件名_hash` 命名，中指和无名指共用同一 STL 部件 `M-AP`，名字前缀完全一样——靠名字删必然误伤。
2. **悬空引用**：MuJoCo 的 `<contact><exclude>` 引用 body 名；删了 body 却没删对应 exclude，编译期校验报 `unknown body`。

## 修复

- 删 body **认内部关节前缀**（`r-`/`p-`）或 hash 后缀，不认 `M-AP` 这个名字。
- 删 body 的同时，把 `.mjcf` 里所有 `body1`/`body2` 命中被删 body 的 `<exclude>` 行一并删掉。
- 腕锁死 = 直接删 `right_wrist` joint（R-Carpals 刚性连到 TopTower）+ 删 `wrist_actuator`。
- 产物：`orcahand_3f_right_body.xml` / `orcahand_3f_right.mjcf` / `scene_3f_right.xml`。校验通过：`nu=10`、`njnt=10`、无 r-/p-/wrist。

```python
# 无头校验：装配数对不对，一句话搞定
import mujoco
m = mujoco.MjModel.from_xml_path('scene_3f_right.xml')
assert m.nu == 10 and m.njnt == 10   # 10 执行器 / 10 关节
```

## 复盘 & 预防

- **为什么会踩**：CAD 导出的 MJCF body 名 = 部件名，左右对称/多指共用件必然重名，只能靠 hash 区分。
- **怎么提前避免**：删 body 前先 `grep "<joint name"` 把每棵子树挂的关节列出来，按关节前缀定位要删哪棵；删完跑一次 `from_xml_path` + 断言 `nu/njnt`，别等 viewer 里才发现。
- **泛化**：任何"裁剪 / 镜像 / 增删肢体"的 MJCF/URDF 改动，凡是按名字引用 body 的块（`contact/exclude`、`equality`、`tendon`、`sensor`、`actuator`）删完都要连带清理悬空引用。

## 相关

- 关联知识：[[面试知识库/算法/index]]（MuJoCo / MJCF）、[[面试知识库/项目决策/index]]（裁三指）
- 执行计划对应阶段：[[执行计划]] P1 三指 MJCF 重训
