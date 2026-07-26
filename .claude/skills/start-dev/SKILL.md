---
name: start-dev
description: 启动记账 APP 的开发环境，执行 npm run tauri dev 命令启动 Tauri 桌面应用
---

# 启动记账 APP 开发环境

当用户调用此技能时，执行以下操作：

## 1. 启动开发服务器

```bash
npm run tauri dev
```

该命令会同时启动：
- Vite 前端开发服务器（热更新）
- Tauri 桌面应用窗口

## 2. 注意事项

- 首次启动可能需要下载 Tauri 依赖，耐心等待
- 修改前端代码后会自动热更新
- 按 `Ctrl+C` 停止开发服务器
- 如遇到端口冲突，关闭其他占用端口的进程
