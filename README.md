## 项目简述

    该分支是OpenAPI-SDK自提/外卖场景的Demo演示
    包含选择自提或外卖、填写用餐人数、填写收货人信息、获取门店列表、获取菜品列表、估清、加购物车、下单、确认收货、退款等.

## 启动前需要配置的内容
1. 打开package.json
2. 修改package.json中的"proxy"字段为后端的服务地址
3. 打开根目录.env.development文件
5. 修改REACT_APP_GROUP_ID #所属集团ID
8. 配置完成后重启服务

## 项目结构
- src
  - assets 资源相关
  - components 通用组件以及布局组件
  - containers 容器组件和UI组件
  - controllers 根据功能划分的类,里边存放对应功能的部分处理方法,逻辑处理或数据处理
  - routes 路由
  - services 接口
  - store redux
  - types ts声明文件
  - views 页面文件
  - Config.ts 环境变量配置
  - CONSTANT.ts 一些全局常量
  - Filter.ts 过滤方法
  - index.tsx 入口文件
  - Utils.ts 工具函数集

## 运行

```
#安装依赖
npm install 
# or 
yarn

#本地运行
npm run start 
# or 
yarn start 

#打包
npm run build 
# or 
yarn build 
```
