# 2048 游戏打包指南

本文档提供了如何将 2048 游戏打包成可在 Windows x64 系统上运行的桌面应用程序的详细说明。

## 准备工作

在开始打包之前，请确保您的系统已安装以下工具：

1. **Node.js**：版本 14.0.0 或更高
2. **npm**：通常随 Node.js 一起安装
3. **Git**：用于版本控制（可选）

## 安装依赖

首先，请确保您已安装所有必要的依赖项：

```bash
npm install
```

这将安装 `package.json` 文件中列出的所有依赖项，包括 Electron 和 electron-builder。

## 打包命令

我们已经在 `package.json` 中配置好了打包脚本，可以使用以下命令进行打包：

### 仅构建 Windows 版本
```bash
npm run build
```

### 构建所有平台版本
```bash
npm run dist
```

## 打包配置说明

在 `package.json` 文件中，我们已经添加了 `electron-builder` 的配置，主要包含以下内容：

```json
"build": {
  "appId": "com.haoze.2048",
  "productName": "2048 Game",
  "directories": {
    "output": "build"
  },
  "win": {
    "icon": "icon.ico",
    "target": [
      {
        "target": "nsis",
        "arch": [
          "x64"
        ]
      }
    ]
  },
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true,
    "runAfterFinish": true,
    "perMachine": true,
    "allowElevation": true,
    "installerIcon": "icon.ico",
    "uninstallerIcon": "icon.ico"
  }
}
```

配置说明：

- **appId**: 应用的唯一标识符
- **productName**: 产品名称，将显示在安装程序和应用中
- **directories.output**: 输出目录，打包后的文件将保存在此目录
- **win.icon**: 应用图标
- **win.target**: 目标打包格式，此处为 NSIS 安装程序
- **nsis 配置**:
  - **oneClick**: 设为 `false` 以使用自定义安装向导
  - **allowToChangeInstallationDirectory**: 允许用户更改安装目录
  - **createDesktopShortcut**: 创建桌面快捷方式
  - **createStartMenuShortcut**: 创建开始菜单快捷方式
  - **runAfterFinish**: 安装完成后运行应用
  - **perMachine**: 为所有用户安装（需要管理员权限）
  - **allowElevation**: 允许提升权限（管理员模式）

## 输出结果

成功打包后，您将在 `build` 目录中找到以下文件：

- **2048 Game Setup.exe**: Windows 安装程序，可以分发给用户
- **win-unpacked/**: 包含未打包的应用程序文件
- **latest.yml**: 自动更新配置文件（如果启用了自动更新）

## 安装说明

最终用户可以通过双击 `2048 Game Setup.exe` 来安装应用。安装向导将引导用户完成安装过程，允许选择安装位置，并可以选择以管理员模式安装。

## 故障排除

如果在打包过程中遇到问题，请尝试以下解决方法：

1. 确保已安装所有依赖：`npm install`
2. 清除缓存：`npm cache clean --force`
3. 删除 `node_modules` 文件夹并重新安装依赖
4. 检查 `electron-builder` 的官方文档和 GitHub Issues 寻找解决方案

## 更多资源

- [Electron 官方文档](https://www.electronjs.org/docs)
- [electron-builder 官方文档](https://www.electron.build/) 