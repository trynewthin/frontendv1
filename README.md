# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).

docker-compose down && docker-compose up -d --build

修改了nginx.conf文件：
添加了API代理配置，将/api/请求转发到 http://192.168.64.52:8080/api/
添加了图片代理配置，将/images/请求转发到 http://192.168.64.52:8090/

请根据ip地址自行更改。