---
name: rebuild
description: 构建打包记账 APP，生成 exe 并放到桌面。桌面已有旧版本时自动替换。
---

# 构建打包记账 APP

当用户调用此技能时，执行以下操作：

## 1. 构建生产版本

```bash
npm run tauri build
```

该命令会执行：
- 编译前端（Vite build）
- 编译 Rust 后端（release 模式）
- 打包为 MSI 安装包

构建产物位于 `src-tauri/target/release/bundle/msi/`。

## 2. 复制 exe 到桌面

构建完成后，将 exe 文件复制到桌面：

```bash
cp -f "src-tauri/target/release/jizhang.exe" "$USERPROFILE/Desktop/记账.exe"
```

- 桌面文件名为 `记账.exe`
- `-f` 参数确保旧版本被强制替换
- 如果桌面已有 `记账.exe`，会被新构建的版本覆盖

## 3. 结果确认

告知用户：
- 构建是否成功
- exe 文件已放置到桌面路径
- 文件大小
