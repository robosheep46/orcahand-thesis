# CLAUDE.md — 个人毕设知识库（Quartz）

> 本文件给在本目录开 Claude Code 的会话提供上下文。**这是「个人毕设库」站点**，与公司库（`C:\Users\12415\Desktop\knowledge-garden`）分属两个对话，互不混淆。

## 这是什么

毕业设计《低成本三指灵巧手平台的构建与基于学习的操作技能研究》的项目知识库。把 ETH ORCA 开源手（飞特 STS3215）裁剪成三指，硬件线 + 仿真线双轨，跑通 遥操作 → 模仿学习（保底）→ RL sim2real（主线）。用 **Quartz v4** 数字花园呈现。

## 现状（2026-06-08）

- ✅ **已上线**：https://robosheep46.github.io/orcahand-thesis/
- ✅ **仓库**：https://github.com/robosheep46/orcahand-thesis（Public，账号 robosheep46）
- ✅ 自动部署：push 到 `main` → `.github/workflows/deploy.yml` 构建并发布到 Pages
- ✅ 双主题：亮 Solarized Light / 暗 Tokyo Night

## 内容结构（`content/`）

> **按用途双库组织**（2026-06-08 重构）：调试时沉淀问题，备答辩时沉淀知识。原「硬件线/仿真线/学习笔记」三板块已拆并入这两块。

| 路径 | 内容 |
|---|---|
| `index.md` | 项目总览首页（定位、贡献点、里程碑、双库入口、ORCA 仓链接） |
| `执行计划.md` | 完整执行计划 master 文档（源自 `C:\Users\12415\Desktop\dexterous-hand\计划.md`） |
| `调试案例库/index.md` | 🐞 实战踩坑库：装机/接线/标定/环境/训练，按 现象→根因→修复 沉淀 |
| `调试案例库/_模板.md` | 案例模板（复制它写新案例） |
| `面试知识库/index.md` | 🎓 知识地图 + 高频问答清单 + 学习路线 |
| `面试知识库/嵌入式/index.md` | ⚙️ 舵机/FOC/通信协议/磁编/实时控制 |
| `面试知识库/算法/index.md` | 🧠 RL/IL/MuJoCo/PyTorch/ACT/DP/sim2real |
| `面试知识库/项目决策/index.md` | 🧩 选型/裁三指/动作空间——答辩弹药 |

### 调试案例库的 AI 写入约定

调 bug 时：一旦**根因清楚 + 修复已验证**，主动复制 `调试案例库/_模板.md` → `调试案例库/<短标题>.md`，打 tag（`硬件`/`仿真`/`sim2real` + 器件/工具），并在 `调试案例库/index.md` 的案例索引表加一行。编译错误、接线松动、纯手滑不写。（思路同 `stm32-problem-logger`。）

## 工作流：写笔记 → 自动上线

```bash
# 在 content/ 里加/改 .md（支持 Obsidian [[双链]]）
git add -A && git commit -m "..." && git push   # 几十秒后网站自动更新
```

本地预览：`npx quartz build --serve`（之前用 8081 避开公司库的 8080）。

## 相关位置

- **毕设源文件夹**：`C:\Users\12415\Desktop\dexterous-hand`（原「毕业设计」，改英文名避开 MuJoCo 中文路径坑）。`repos/` 是 ORCA 五个克隆代码仓（含 orca_sim、三指 MJCF）、`CAD/` 是官方 STL 的 zip、`计划.md` 是计划原件、`cad_3f/` 是 CadQuery 工程、`sim_env/` 是仿真 venv
- **务必纯英文路径**：要喂给 MuJoCo / OCP 等原生 C 库的工程不能放中文目录（见 content 里「环境配置」与调试案例）
- ORCA 开源全家桶：https://github.com/orcahand （MIT）

## 下一步

1. 调试时把案例落到 `调试案例库/`；学到的原理沉到 `面试知识库/` 对应分卷。
2. 执行计划若更新：改 `content/执行计划.md`（或同步毕设文件夹的 `计划.md`）。
3. 可选：关掉建仓时带来的 Dependabot（`.github/dependabot.yml`，如有，会自动开依赖更新 PR）。
