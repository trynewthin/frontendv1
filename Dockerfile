# 构建阶段
FROM node:18-alpine as build-stage

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制项目文件
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM nginx:stable-alpine as production-stage

# 从构建阶段复制构建好的文件到nginx目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 暴露8020端口
EXPOSE 8020

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]