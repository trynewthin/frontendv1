
## 注意
第一次运行需要启动
cd apiclient
npm install
cd ..
npm install
npm run dev

## 通过容器启动

不推荐

修改了nginx.conf文件：
添加了API代理配置，将/api/请求转发到 http://本机ip:8080/api/
添加了图片代理配置，将/images/请求转发到 http://本机ip:8090/

请根据ip地址自行更改。