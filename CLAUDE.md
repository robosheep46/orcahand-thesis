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

| 文件 | 内容 |
|---|---|
| `index.md` | 项目总览首页（一句话定位、贡献点、里程碑、ORCA 仓链接、状态） |
| `执行计划.md` | 完整执行计划（源自 `C:\Users\12415\Desktop\毕业设计\计划.md`） |
| `硬件线/index.md` | 🔧 选型/单指/三指装机/CadQuery（含「待填充」清单） |
| `仿真线/index.md` | 🖥 WSL2+MuJoCo/MJCF 裁剪/RL 基线/对照实验（含「待填充」） |
| `学习笔记/index.md` | 📚 Just-in-time 学习路线 + 笔记区（含「待填充」） |

## 工作流：写笔记 → 自动上线

```bash
# 在 content/ 里加/改 .md（支持 Obsidian [[双链]]）
git add -A && git commit -m "..." && git push   # 几十秒后网站自动更新
```

本地预览：`npx quartz build --serve`（之前用 8081 避开公司库的 8080）。

## 相关位置

- **毕设源文件夹**：`C:\Users\12415\Desktop\毕业设计`（`repos/` 是 ORCA 五个克隆代码仓、`CAD/` 是官方 STL 的 zip、`计划.md` 是计划原件）
- ORCA 开源全家桶：https://github.com/orcahand （MIT）

## 下一步

1. 逐步填充三板块的「待填充」清单（单指验证记录、MuJoCo 复现、ACT/DP 精读等）。
2. 执行计划若更新：改 `content/执行计划.md`（或同步毕设文件夹的 `计划.md`）。
3. 可选：关掉建仓时带来的 Dependabot（`.github/dependabot.yml`，如有，会自动开依赖更新 PR）。
