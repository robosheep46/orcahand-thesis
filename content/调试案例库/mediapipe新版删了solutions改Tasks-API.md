---
title: MediaPipe 新版没有 mp.solutions（改 Tasks API + .task 模型）
tags: [调试, 仿真, MediaPipe, 遥操作]
date: 2026-06-09
status: 已解决
---

> [!bug] 现象
> 照网上一片教程写 `mp.solutions.hands.Hands(...)` 做手部追踪，运行报
> `AttributeError: module 'mediapipe' has no attribute 'solutions'`。

## 环境

- 阶段 / 工程：遥操作起步 · `teleop/` · `tele_env/.venv`（Python 3.11.15）
- 版本：**mediapipe 0.10.35**、opencv-python 4.13、numpy 2.4（uv 装的当前版）
- 触发条件：用旧版 `mp.solutions.hands` / `mp.solutions.drawing_utils` API 时

## 定位过程

- `dir(mp)` 顶层只有 `['Image', 'ImageFormat', 'tasks']`——`solutions` 整个没了。
- `from mediapipe.tasks.python.vision import HandLandmarker` 能导入，说明新版把方案搬到了 **Tasks API**。

## 根因

新版 mediapipe（0.10.x 后期）**移除了 legacy `mp.solutions.*` 方案 API**，统一到 **Tasks API**：
`mediapipe.tasks.python.vision.HandLandmarker`。两点连带变化：

1. **要外挂模型文件**：不再内置权重，需下载 `hand_landmarker.task` 模型包并用 `BaseOptions(model_asset_path=...)` 指过去。
2. **没有 drawing_utils**：21 关键点骨架得自己画；连线表在 `HandLandmarksConnections.HAND_CONNECTIONS`（每个元素 `.start/.end` 是点索引）。
3. 视频流用 `RunningMode.VIDEO` + `detect_for_video(mp_image, timestamp_ms)`，输入要包成 `mp.Image(image_format=SRGB, data=rgb)`，结果在 `result.hand_landmarks`（归一化 x/y/z）。

## 修复

```python
import mediapipe as mp
from mediapipe.tasks.python import BaseOptions
from mediapipe.tasks.python.vision import (
    HandLandmarker, HandLandmarkerOptions, RunningMode, HandLandmarksConnections)

# 1) 下模型（一次）
#   curl -L -o hand_landmarker.task \
#   https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task

opts = HandLandmarkerOptions(
    base_options=BaseOptions(model_asset_path="hand_landmarker.task"),
    running_mode=RunningMode.VIDEO, num_hands=1,
    min_hand_detection_confidence=0.6, min_tracking_confidence=0.5)

CONN = [(c.start, c.end) for c in HandLandmarksConnections.HAND_CONNECTIONS]
with HandLandmarker.create_from_options(opts) as lm:
    img = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)   # rgb = cv2.cvtColor(frame, BGR2RGB)
    res = lm.detect_for_video(img, timestamp_ms)
    for hand in res.hand_landmarks:                              # 自己画骨架
        pts = [(int(p.x*w), int(p.y*h)) for p in hand]
        for a, b in CONN: cv2.line(frame, pts[a], pts[b], (0,200,0), 2)
```

## 复盘 & 预防

- **为什么会踩**：网上 95% 的 MediaPipe Hands 教程是 `mp.solutions` 老 API，新版直接删了，照抄必崩。
- **怎么提前避免**：装完先 `dir(mp)` 看顶层有没有 `solutions`；只有 `tasks` 就走 Tasks API + `.task` 模型。
- **泛化**：Face/Pose/Holistic 全部同此迁移（`FaceLandmarker`/`PoseLandmarker`...），都要各自的 `.task` 模型；遥操作后续换 retargeter 时关键点取自 `result.hand_landmarks` 的归一化坐标。

## 相关

- 关联知识：[[面试知识库/算法/index]]（遥操作管线 MediaPipe → retargeter → 控制）
- 执行计划对应阶段：[[执行计划]] P2 遥操作
