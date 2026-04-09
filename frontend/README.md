# Vite Starter

A fresh and elegant admin template, based on Vue3、Vite7、TypeScript、NaiveUI and UnoCSS.

一个基于 Vue3、Vite7、TypeScript、NaiveUI 和 UnoCSS 的清新优雅的中后台模版。

## ⚠️ 重要提示

### 环境变量配置优先级

项目采用**多层环境变量配置策略**，优先级从高到低：

1. **运行时环境变量** (`window.__ENV__`) - Docker 部署时的最高优先级
2. **Vite 环境变量** (`import.meta.env`) - 构建时配置

**Docker 部署时**，环境变量通过 `entrypoint.sh` 脚本自动注入到 `env-config.js` 文件中，可以覆盖 `.env` 文件中的配置。

**开发环境**，推荐使用 `.env` 文件进行本地配置

## 🚀 特性

- ⚡ **Vue 3** + **Vite 7** - 最新的前端技术栈
- 🎨 **Naive UI** - 现代化 UI 组件库
- 🎯 **UnoCSS** - 原子化 CSS 引擎
- 🔧 **TypeScript** - 类型安全的开发体验
- 📱 **响应式设计** - 支持移动端和桌面端
- 🌐 **国际化** - 支持中英文切换
- 🎨 **主题系统** - 完整的深色/浅色模式支持
- 📊 **数据可视化** - 集成 ECharts
- 🔄 **状态管理** - 基于 Pinia
- 🛣️ **路由系统** - 基于 Vue Router 4
- 🏗️ **模块化架构** - 清晰的项目结构

## 🛠️ 技术栈

- **框架**: Vue 3.5
- **构建工具**: Vite 7.3
- **UI 组件**: Naive UI 2.43
- **样式**: UnoCSS 66.5
- **状态管理**: Pinia 3.0
- **路由**: Vue Router 4.6
- **类型检查**: TypeScript 5.9
- **包管理**: pnpm

## 📦 安装

### 环境要求

- Node.js >= 20.19.0
- pnpm >= 10.5.0

### 快速开始

#### 1. 克隆项目

```bash
git clone https://github.com/your-username/vite-starter.git
cd vite-starter
```

#### 2. 安装依赖

```bash
pnpm install
```

#### 3. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑配置文件（根据你的后端 API 地址）
vim .env
```

#### 4. 启动开发服务器

```bash
pnpm dev
```

访问 `http://localhost:9527` 查看应用。

#### 5. 构建生产版本

```bash
pnpm build
pnpm preview
```

## 📜 可用脚本

```bash
# 开发
pnpm dev                 # 开发服务器（测试环境）
pnpm dev:prod           # 开发服务器（生产环境）

# 构建
pnpm build              # 生产构建
pnpm build:test         # 测试环境构建

# 代码质量
pnpm typecheck          # TypeScript 类型检查
pnpm lint               # ESLint 代码检查和修复

# 工具
pnpm cleanup            # 清理缓存
pnpm gen-route          # 生成路由
pnpm update-pkg         # 更新包版本

# Git
pnpm commit             # 交互式提交（中文）
pnpm commit:zh          # 交互式提交（中文）
pnpm release            # 发布新版本
```

## 🌐 部署

### Docker 部署（推荐）

项目提供了完整的 Docker 部署方案：

#### 1. 构建 Docker 镜像

```bash
# 构建镜像
docker build -t vite-starter .

# 或使用多阶段构建（推荐）
docker build --target builder -t vite-starter-builder .
docker build -t vite-starter .
```

#### 2. 运行容器

```bash
# 基础运行
docker run -d -p 80:80 vite-starter

# 带环境变量运行
docker run -d -p 80:80 \
  -e VITE_APP_TITLE="My Production App" \
  -e VITE_SERVICE_BASE_URL="https://api.production.com" \
  -e VITE_OTHER_SERVICE_BASE_URL='{"demo": "https://demo-api.production.com"}' \
  --name vite-starter-app \
  vite-starter
```

#### 3. Docker Compose 部署

创建 `docker-compose.yml` 文件：

```yaml
version: '3.8'
services:
  vite-starter:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_APP_TITLE=Vite Starter Production
      - VITE_SERVICE_BASE_URL=https://api.production.com
      - VITE_OTHER_SERVICE_BASE_URL={"demo": "https://demo-api.production.com"}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-fs", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
```

运行：
```bash
docker-compose up -d
```

### GitHub Pages 部署

#### 自动部署（推荐）

1. **推送代码到 GitHub**

   将代码推送到 GitHub 的 `main` 分支，GitHub Actions 会自动触发部署：

   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin main
   ```

2. **启用 GitHub Pages**

   进入 GitHub 仓库设置：
   - 进入 **Settings** → **Pages**
   - **Source** 选择 **GitHub Actions**
   - 保存设置

3. **配置环境变量**

   在 GitHub 仓库设置中添加环境变量：
   - 进入 **Settings** → **Secrets and variables** → **Actions**
   - 添加以下变量：
     - `VITE_BASE_URL`: `/[仓库名]/`
     - `VITE_APP_TITLE`: 你的应用标题

4. **访问站点**

   部署完成后，访问 `https://[你的用户名].github.io/[仓库名]/`


## 🏗️ 项目结构

```
vite-starter/
├── build/                 # 构建配置
├── packages/              # 工作空间包
│   ├── axios/            # HTTP 请求库
│   ├── color/            # 颜色工具
│   ├── hooks/            # Vue Hooks
│   ├── materials/        # UI 组件库
│   ├── scripts/          # 脚本工具
│   ├── uno-preset/       # UnoCSS 预设
│   └── utils/            # 工具函数
├── public/               # 静态资源
├── src/                  # 源代码
│   ├── components/       # 组件
│   ├── constants/        # 常量
│   ├── hooks/           # Vue Hooks
│   ├── layouts/         # 布局组件
│   ├── locales/         # 国际化
│   ├── router/          # 路由配置
│   ├── service/         # API 服务
│   ├── store/           # 状态管理
│   ├── styles/          # 样式文件
│   ├── theme/           # 主题配置
│   ├── typings/         # 类型定义
│   ├── utils/           # 工具函数
│   └── views/           # 页面组件
├── .github/             # GitHub 配置
│   └── workflows/       # GitHub Actions
├── index.html           # HTML 模板
├── package.json         # 包配置
├── pnpm-workspace.yaml # 工作空间配置
├── tsconfig.json        # TypeScript 配置
├── uno.config.ts        # UnoCSS 配置
└── vite.config.ts       # Vite 配置
```

## 🔧 配置说明

### 环境变量

项目支持多种环境变量配置方式，按优先级从高到低排列：

#### 1. 运行时环境变量（最高优先级）

通过 `public/env-config.js` 文件配置，这些变量在应用运行时注入到 `window.__ENV__` 对象中：

```javascript
// public/env-config.js
window.__ENV__ = {
  VITE_SERVICE_BASE_URL: 'https://api.production.com',
  VITE_OTHER_SERVICE_BASE_URL: `{
    "demo": "https://demo-api.production.com"
  }`
};
```

**适用场景**：
- Docker 容器部署（通过环境变量注入）
- 生产环境动态配置
- 多环境部署时的配置隔离

#### 2. Vite 环境变量（构建时配置）

创建 `.env` 文件来配置 Vite 环境变量：

```env
# 基础路径（用于 GitHub Pages 部署）
VITE_BASE_URL=/

# 应用标题
VITE_APP_TITLE=Vite Starter

# API 基础地址
VITE_SERVICE_BASE_URL=https://api.example.com

# 其他服务地址（JSON 格式）
VITE_OTHER_SERVICE_BASE_URL={"demo": "https://demo-api.example.com"}

# 路由模式
VITE_ROUTER_HISTORY_MODE=history

# 认证路由模式
VITE_AUTH_ROUTE_MODE=static

# 开发环境配置
VITE_HTTP_PROXY=Y
VITE_PROXY_LOG=Y

# 图标配置
VITE_ICONIFY_URL=https://api.iconify.design
```

#### 环境变量优先级说明

```typescript
// src/utils/env.ts 中的优先级逻辑
export const getEnv = (key: string): string => {
  // 1. 优先从 window.__ENV__ 获取（运行时注入）
  if (window.__ENV__ && window.__ENV__[key]) {
    return window.__ENV__[key]!;
  }

  // 2. 从 import.meta.env 获取（Vite 环境变量）
  return import.meta.env[key] || '';
};
```

**优先级顺序**：
1. `window.__ENV__[key]` - 运行时环境变量（Docker 环境变量通过脚本注入）
2. `import.meta.env[key]` - Vite 构建时环境变量

#### Docker 环境变量配置

在 Docker 部署时，可以通过环境变量动态覆盖配置：

```bash
# 运行容器时设置环境变量
docker run -e VITE_SERVICE_BASE_URL=https://api.production.com \
           -e VITE_APP_TITLE="My Production App" \
           your-app:latest
```

Docker 的 `entrypoint.sh` 脚本会自动将以 `VITE_` 开头的环境变量注入到 `env-config.js` 文件中。

#### 环境变量文件命名约定

Vite 支持多种环境变量文件：

- `.env` - 所有环境共用
- `.env.local` - 本地环境（不会被 Git 跟踪）
- `.env.development` - 开发环境
- `.env.production` - 生产环境

#### 支持的环境变量列表

| 变量名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `VITE_BASE_URL` | string | `/` | 应用基础路径 |
| `VITE_APP_TITLE` | string | `Vite Starter` | 应用标题 |
| `VITE_SERVICE_BASE_URL` | string | - | 主 API 服务地址 |
| `VITE_SERVICE_SUCCESS_CODE` | string | - | API 成功状态码 |
| `VITE_OTHER_SERVICE_BASE_URL` | JSON | - | 其他服务地址配置 |
| `VITE_ROUTER_HISTORY_MODE` | `hash\|history\|memory` | `history` | 路由模式 |
| `VITE_AUTH_ROUTE_MODE` | `static\|dynamic` | `static` | 认证路由模式 |
| `VITE_HTTP_PROXY` | `Y\|N` | `N` | 是否启用 HTTP 代理 |
| `VITE_PROXY_LOG` | `Y\|N` | `N` | 是否显示代理日志 |
| `VITE_ICONIFY_URL` | string | - | Iconify API 地址 |
| `VITE_STORAGE_PREFIX` | string | - | 存储前缀（多域名区分） |

#### 在代码中使用环境变量

项目提供了便捷的环境变量获取工具函数：

```typescript
// src/utils/env.ts
import { getEnv, getEnvJson } from '@/utils/env';

// 获取字符串类型的环境变量
const apiBaseUrl = getEnv('VITE_SERVICE_BASE_URL');

// 获取 JSON 类型的环境变量
const otherServices = getEnvJson<Record<string, string>>('VITE_OTHER_SERVICE_BASE_URL');

// 在组件中使用
import { API_BASE_URL, OTHER_SERVICE_BASE_URL } from '@/utils/env';

// API 请求示例
const response = await fetch(`${API_BASE_URL}/api/users`);
```

#### 环境变量类型定义

所有环境变量都有完整的 TypeScript 类型定义：

```typescript
// src/typings/vite-env.d.ts
declare namespace Env {
  interface ImportMeta {
    readonly VITE_BASE_URL: string;
    readonly VITE_APP_TITLE: string;
    readonly VITE_SERVICE_BASE_URL: string;
    // ... 其他变量
  }
}
```

### 主题配置

项目支持完整的主题自定义：

- **颜色主题**: 支持浅色/深色/自动模式
- **布局模式**: 支持多种布局方式
- **组件样式**: 可自定义圆角、阴影等
- **字体**: 默认使用 Inter 字体

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发规范

1. 使用 **ESLint** + **Prettier** 进行代码格式化
2. 使用 **TypeScript** 进行类型检查
3. 遵循 **Vue 3 Composition API** 最佳实践
4. 使用 **UnoCSS** 原子化样式
