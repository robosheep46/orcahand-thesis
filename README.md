# 三指灵巧手 · 毕设知识库

毕业设计《低成本三指灵巧手平台的构建与基于学习的操作技能研究》的项目知识库。把 ETH [ORCA](https://github.com/orcahand) 开源手裁剪成三指，硬件线 + 仿真线双轨并行，跑通 遥操作 → 模仿学习 → RL sim2real。

🌐 **在线**：https://robosheep46.github.io/orcahand-thesis

基于 [Quartz v4](https://quartz.jzhao.xyz) 构建（数字花园 / 双链 / 关系图谱），亮色 Solarized Light、暗色 Tokyo Night 双主题。

## 本地预览

```bash
npm i
npx quartz build --serve
```

## 写作

笔记放在 `content/`，写 Markdown 即可（支持 Obsidian `[[双链]]`）。推送到 `main` 分支后，GitHub Actions 自动构建并部署到 Pages。
