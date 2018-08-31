##基于webpack4x生成的Reactjs脚手架

###step 1 安装webpack4x命令行工具

```
npm install --save-dev webpack
```


###step 2

```
/(node层) cnpm install pubilc/ cnpm install mobile/ cnpm install 
```

ps:推荐用cnpm

基础配置是生成多页面，html模板文件在templates文件里面配置，build/page文件下是打包pc端的js,build/mobile文件下是打包移动端的js,industry文件里面是生成的html，components是公共组件,src/page是多文件入口源代码,utils是包含ajax和apimap.js等配置文件,redux使用的是saga中间件如无具体需求可以不用改动


基本的两个命令：

开发运行：

```
npm run dev 
```

打包：

```
npm run build
```