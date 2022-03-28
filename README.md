## 项目简述

    该分支是OpenAPI-SDK堂食场景的Demo演示,包含桌台查询、获取菜品列表、估清、加购物车、下单、先付、后付、加菜、退菜、退款等.

## 启动前需要配置的内容
1. 打开package.json
2. 修改package.json中的"proxy"字段为后端的服务地址
3. 打开根目录.env.development文件
5. REACT_APP_GROUP_ID #所属集团ID
6. REACT_APP_SHOP_ID #所属门店ID
7. REACT_APP_TABLE_NAME #门店中某一个桌台的名称
8. 配置完成后重启服务

## 项目结构

    - assets 资源相关
    - components 通用组件以及布局组件
    - containers 容器组件和UI组件
    - controllers 根据功能划分的类,里边存放对应功能的部分处理方法,逻辑处理或数据处理
    - routes 路由
    - services 接口
    - store redux
    - views 页面文件
    - Config.js 环境变量配置
    - Filter.js 过滤方法
    - index.jsx 入口文件
    - Utils.js 工具函数集


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
