---
title: MuJoCo 在 Windows 上打不开含中文（非 ASCII）路径的模型文件
tags: [调试, 仿真, MuJoCo, orca_sim, Windows]
date: 2026-06-09
status: 已解决
---

> [!bug] 现象
> 在 `C:\Users\…\毕业设计\repos\orca_sim` 下跑 orca_sim 的 `random_policy.py`，报 `ParseXML: Error opening file '...\scene_right.xml'`。文件确实存在。

## 环境

- 阶段 / 工程：仿真线 W1 · orca_sim（MuJoCo + Gymnasium）
- 软件：mujoco 3.9.0、orca_sim 0.1.0、Windows、Python 3.11 venv
- 触发：包内用**绝对路径**加载 scene/mesh，而工程路径含中文「毕业设计」

## 定位过程

- 文件 `os.path.exists()` = True，排除"真缺文件"。
- 三种加载对比：
  - 绝对路径(含中文) → `ParseXML: Error opening file`（打不开）
  - 相对路径(在中文目录内) → 过了 XML、卡在找 mesh
  - 把 scenes+models 复制到 `C:\temp_orcasim`（纯英文）再绝对路径加载 → **OK，nu=17**
- 复制到纯英文路径即好 → 根因锁定为**路径里的非 ASCII 字符**。

## 根因

MuJoCo 的底层是 C/C++，在 Windows 上用窄字符 API 打开文件，**不支持非 ASCII（中文）路径**。orca_sim 的 `envs.py` 用安装位置拼**绝对路径**加载 scene/mesh，工程在 `…\毕业设计\…` 下，路径含中文 → C 层 `fopen` 失败。

之前裁三指能加载，是因为当时用的是**相对路径**（`from_xml_path('scene_3f_right.xml')`，cwd 在中文目录内由 shell 处理），绕过了 C 层对绝对路径的编码问题。

## 修复

根上解决：把整个毕设源文件夹**改成纯英文名**`毕业设计` → `dexterous-hand`，整棵树变 ASCII（orca_sim、三指 MJCF、CAD 都受益）。改名后重建 venv、重装 editable：

```bash
# 同盘移动子项再删空壳（顶层目录被 GUI 锁时可用）
uv venv --python 3.11 sim_env\.venv
uv pip install --python sim_env\.venv\Scripts\python.exe -e repos\orca_sim
cd repos\orca_sim && python random_policy.py --env right --render-mode rgb_array --steps 3
# OK: obs(34,) act(17,) 渲染出帧
```

> 顺带坑：Windows 上有 GUI（VS Code/资源管理器）打开着该目录时，**顶层目录改名会 Access denied**，但子项能移动——建新文件夹把子项逐个移过去再删空壳即可。

## 复盘 & 预防

- **为什么会踩**：项目放在中文文件夹「毕业设计」下，多数 Python 包无感，但 MuJoCo 这种走 C 文件 I/O 的会炸。
- **怎么提前避免**：**凡是要喂给 MuJoCo / 原生 C 库的工程，一律放纯英文路径**（如 `C:\Users\12415\orca_sim`）。CAD 渲染当时是用相对路径 + `meshdir="."` 才侥幸过。
- **泛化**：OpenCASCADE、部分 CUDA/驱动工具、个别 C 扩展，在 Windows 上同样可能因中文路径失败。本地开发目录尽量全英文。

## 相关

- 关联案例：[[调试案例库/MJCF裁三指-同名body与悬空exclude]]
- 关联知识：[[环境配置]]、[[面试知识库/算法/index]]（MuJoCo）
- 执行计划对应阶段：[[执行计划]] 仿真线 W1 环境
