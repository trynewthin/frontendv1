# Docker 部署指南

本目录包含了将智选车前端项目部署到 Docker 容器中所需的所有文件。

## 文件说明

- `Dockerfile`: 用于构建 Docker 镜像的配置文件
- `nginx.conf`: Nginx 服务器配置文件
- `docker-compose.yml`: Docker Compose 配置文件，用于简化容器的管理

## 使用方法

### 使用 Docker Compose（推荐）

1. 确保已安装 Docker 和 Docker Compose
2. 在项目根目录下运行：

```bash
docker-compose -f docker/docker-compose.yml up -d
```

这将构建镜像并启动容器。应用将在 http://localhost 上可访问。

### 手动构建和运行

1. 构建 Docker 镜像：

```bash
docker build -t zhixuanche-frontend -f docker/Dockerfile .
```

2. 运行容器：

```bash
docker run -d -p 80:80 --name zhixuanche-frontend zhixuanche-frontend
```

## 环境变量

本项目使用项目根目录中的 `.env` 文件作为环境变量配置。在构建 Docker 镜像时，这些环境变量会被编译到应用中。

如果需要修改环境变量，请在构建镜像前修改项目根目录中的 `.env` 文件。

## 开发环境

对于开发环境，您可以使用项目的开发脚本：

```bash
npm install
npm run dev
```

## 注意事项

- 生产环境部署前，请确保已正确配置 `.env` 文件中的环境变量
- 如需修改端口映射，请编辑 `docker-compose.yml` 文件中的 `ports` 部分 