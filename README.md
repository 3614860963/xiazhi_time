# 夏稚时钟

## 项目信息

夏稚时钟是一个基于 React + TypeScript 开发的现代化时钟应用，使用 Vite 作为构建工具，shadcn-ui 和 Tailwind CSS 进行界面设计。

## 如何编辑代码

有多种方式可以编辑您的应用：

**使用 Vesa**

在 Vesa 中开始提示以进行更改。

通过 Vesa 进行的更改将自动提交到这个仓库。

**使用您喜欢的 IDE**

如果您想在本地使用自己的 IDE 工作，可以克隆此仓库并推送更改。推送的更改也会在 Vesa 中反映出来。

唯一的要求是安装 Node.js 和 npm - [使用 nvm 安装](https://github.com/nvm-sh/nvm#installing-and-updating)

按照以下步骤操作：

```sh
# 步骤 1：使用项目的 Git URL 克隆仓库。
git clone <YOUR_GIT_URL>

# 步骤 2：导航到项目目录。
cd <YOUR_PROJECT_NAME>

# 步骤 3：安装必要的依赖。
npm i

# 步骤 4：启动开发服务器，自动重载并即时预览。
npm run dev
```

**直接在 GitHub 中编辑文件**

- 导航到所需的文件。
- 点击文件视图右上角的"编辑"按钮（铅笔图标）。
- 进行更改并提交更改。

**使用 GitHub Codespaces**

- 导航到仓库的主页。
- 点击右上角附近的"Code"按钮（绿色按钮）。
- 选择"Codespaces"选项卡。
- 点击"New codespace"启动一个新的 Codespace 环境。
- 在 Codespace 中直接编辑文件，完成后提交并推送更改。

## 项目使用了哪些技术？

本项目使用以下技术构建：

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## 如何部署此项目？

### 一、从 GitHub 下载到本地部署

1. **克隆项目到本地**
   ```bash
   # 克隆项目
   git clone <your-github-repo-url>
   
   # 进入项目目录
   cd <project-directory>
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **本地开发运行**
   ```bash
   npm run dev
   ```
   然后在浏览器中访问终端输出的本地开发地址。

4. **构建生产版本**
   ```bash
   npm run build
   ```
   构建完成后，项目会生成 `dist` 目录，包含所有静态文件。

5. **本地预览生产版本**
   ```bash
   npm run preview
   ```
   然后在浏览器中访问终端输出的预览地址。

### 二、阿里云边缘安全加速 ESA Pages 部署

1. **准备工作**
   - 开通阿里云 ESA 边缘安全加速产品，并开通 "函数和 Pages" 服务
   - 确保您的项目已上传到 GitHub 仓库

2. **登录阿里云 ESA 控制台**
   - 访问 [阿里云 ESA 控制台](https://esa.console.aliyun.com/edge/pages/list)
   - 登录您的阿里云账号

3. **创建 Pages 项目**
   - 在左侧导航栏选择 **边缘计算 > 函数和 Pages**
   - 点击 **创建** 按钮
   - 选择 **导入 GitHub 仓库** 页签
   - 点击 **添加 GitHub 账户**，授权阿里云访问您的 GitHub 仓库

4. **选择并配置您的仓库**
   - 在仓库列表中选择您的夏稚时钟项目仓库
   - 配置构建参数：
     - **构建命令**：`npm run build`
     - **输出目录**：`dist`
   - 点击 **保存并部署**

5. **等待部署完成**
   - 阿里云 Pages 会自动执行构建和部署流程
   - 部署完成后，您可以在控制台查看部署状态和访问地址

6. **访问部署后的站点**
   - 部署完成后，阿里云 Pages 会生成一个访问地址
   - 您可以通过该地址访问您的夏稚时钟应用

### 三、其他部署方式

您也可以使用 Vesa 进行部署：

1. 打开 Vesa
2. 点击 Share -> Publish

## 我可以将自定义域名连接到我的项目吗？

是的，您可以！

要连接域名，请导航到 Project > Settings > Domains 并点击 Connect Domain。

## 项目完善文档

### 项目结构

```
├── public/            # 静态资源
├── src/              # 源代码
│   ├── components/   # 组件
│   ├── hooks/        # 自定义 hooks
│   ├── utils/        # 工具函数
│   ├── main.tsx      # 应用入口
│   └── App.tsx       # 根组件
├── .gitignore        # Git 忽略文件
├── index.html        # HTML 模板
├── package.json      # 项目配置和依赖
├── tsconfig.json     # TypeScript 配置
├── vite.config.ts    # Vite 配置
└── README.md         # 项目文档
```

### 开发流程

1. **安装依赖**：`npm install`
2. **启动开发服务器**：`npm run dev`
3. **代码编写**：在 `src` 目录中编写代码
4. **构建生产版本**：`npm run build`
5. **部署**：选择上述部署方式之一

### 技术栈说明

- **Vite**：现代前端构建工具，提供快速的开发体验
- **TypeScript**：类型安全的 JavaScript 超集
- **React**：用于构建用户界面的 JavaScript 库
- **shadcn-ui**：现代化的 UI 组件库
- **Tailwind CSS**：实用优先的 CSS 框架

### 常见问题

1. **构建失败**：检查依赖是否正确安装，查看构建日志中的错误信息
2. **部署失败**：确保 GitHub 仓库权限正确，阿里云能够访问您的仓库
3. **本地运行问题**：检查 Node.js 版本是否符合要求，尝试重新安装依赖