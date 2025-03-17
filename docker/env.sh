#!/bin/sh

# 获取环境变量并替换到JS文件中
ROOT_DIR=/usr/share/nginx/html

# 检查index.html是否存在
if [ -f "$ROOT_DIR/index.html" ]; then
  echo "正在处理环境变量..."
  
  # 查找所有JS文件
  find $ROOT_DIR -name "*.js" -type f | while read file; do
    # 替换API访问路径
    sed -i 's/http:\/\/localhost:8080\/api/\/api/g' $file
    
    # 修复resource-server引用，替换为localhost:8090
    sed -i 's/http:\/\/resource-server/http:\/\/localhost:8090/g' $file
    
    echo "已处理: $file"
  done
  
  echo "环境变量替换完成"
else
  echo "错误：找不到 index.html 文件"
  exit 1
fi
