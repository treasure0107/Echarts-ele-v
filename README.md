<!--
 * @Descripttion: 项目说明文档
 * @version: 可安装vscode插件Markdown All in One 预览md文件
 * @Author: JTune
 * @Date: 2020-10-20 09:07:02
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-11-02 11:47:19
-->
# 平台项目说明文档
## 目录结构
```
├── README.md // 项目说明文件
├── .vscode         //vscode 工作区配置（用于配置代码保存自动格式化）
│   ├── settings.json  //自动格式化代码配置
├── babel.config.js // babel配置文件
├── package-lock.json 
├── package.json // npm包配置文件，定义了项目的npm脚本、依赖包等信息
├── public  //静态资源
│   ├── favicon.ico
│   └── index.html //入口html文件
├── src
│   ├── App.vue // 根组件
│   ├── assets  //静态资源
│   │   ├── image //照片
│   │   ├── logo.png
│   │   └── style //样式
│   ├── components //公共组件
│   │   ├── Breadcrumb
│   │   ├── Screenfull
│   │   ├── chart
│   │   ├── chinaMap.vue
│   │   ├── dialog
│   │   ├── home
│   │   └── webSocketTest.vue
│   ├── config
│   │   └── env.js
│   ├── layout
│   │   ├── components
│   │   └── index.vue
│   ├── main.js  //入口文件
│   ├── router   //路由
│   │   ├── group-layout.js  //集团数据路由
│   │   ├── index.js
│   │   └── place-layout.js  //数据概览路由
│   ├── store //状态管理
│   │   ├── index.js
│   │   └── login
│   ├── utils //工具栏
│   │   ├── api.js
│   │   ├── axios.js
│   │   ├── bus.js
│   │   ├── common.js
│   │   ├── mapOption.js
│   │   ├── utils.js
│   │   └── webSocket.js
│   └── views  //页面文件夹
│       ├── connectionDiagram   //接线图
│       ├── dataOverview  //数据概览页面
│       │       └──overviewPage   //数据概览相关详情页
│       ├── error404.vue
│       ├── groupOverview //集团数据页面
│       ├── home  //首页可视化页面
│       ├── index.vue
│       ├── login
│       ├── message
│       └── systemsOverview
├── vue.config.js  //vue配置项
├── yarn-error.log
└── yarn.lock
```

# 技术栈

- vue cli 3.x
- echarts4.9.0
- axios
- webpack
- ES6
- scss
- css3

## 安装依赖

```
yarn install
```

### 开发环境运行项目　

```
yarn serve
```

### 生产环境打包项目

```
yarn build
```

### Lints 修复指令

```
yarn lint
```
### 附录：Vue开发规范
### 规范内容

### 一、HTML规范
1. 文档类型
   统一为html5声明类型:`<!DOCTYPE html>`; 书写时利用IDE实现层次分明的缩进。
### 二、CSS规范


1. 组成元素:
   1.  命名必须由单词、中划线或数字组成;
   2.  使用小写字母，并遵循横线连接命名法（kebab-case）。
   3.  不允许使用拼音（约定俗成的除外，如：youku, baidu），尤其是缩写的拼音、拼音与英文的混合。 
2. 样式属性顺序
   单个样式规则下的属性在书写时，应按功能进行分组，组之间需要有一个空行。
同时要以Positioning Model > Box Model > Typographic > Visual 的顺序书写，提高代码的可读性。



   1. Positioning Model 布局方式、位置，相关属性包括：position, top, z-index, display, float等。
   2. Box Model 盒模型，相关属性包括：width, height, padding, margin，border,overflow。
   3. Typographic 文本排版，相关属性包括：font, line-height, text-align
Visual 视觉外观，相关属性包括：color, background, list-style, transform, animation
3. 命名规则
   参考 [BEM 规范](https://www.cnblogs.com/coder-zyz/p/6749295.html)
   
### 三、JavaScript规范

1. 命名
     1. 变量, 使用骆峰式命名法（Camel-Case）。
    ```bash
    let loadingModules = {};  
    ```
    2. 常量, 使用全部字母大写。
    ```bash
      const MAXCOUNT = 10; 
    ```
    3. 私有属性、变量和方法以下划线 _ 开头。
   ```bash
    let _privateMethod = {};
    ```
    4. boolean 类型的变量使用 is 或 has 开头。
     ```bash
    let isReady = false;
    let hasMoreCommands = false;
    ```
  1. 注释
  在声明变量或函数需要写注释，写注释时请一定要注意：写明代码的作用，重要的地方一定记得写注释。 没必要每份代码都描述的很充分，它会增重HTML和CSS的代码。这取决于该项目的复杂程度。
     1. 单行注释说明
      ```bash
        // 调用了一个函数
        setTitle();
        var maxCount = 10; // 设置最大量
      ```
      2. 多行注释
       ```bash
        /*
        * 代码执行到这里后会调用setTitle()函数
        * setTitle()：设置title的值
        */
      ```
      3. 函数注释
      ```bash
        /**
        * 以星号开头，紧跟一个空格，第一行为函数说明 
        * @param {类型} 参数 单独类型的参数
        * @param {[类型|类型|类型]} 参数 多种类型的参数
        * @param {类型} [可选参数] 参数 可选参数用[]包起来
        * @return {类型} 说明
        * @author 作者 创建时间 修改时间（短日期）改别人代码要留名
        * @example 举例（如果需要）
        */
      ```
      4. 文件头部注释
      推荐：VScode 文件头部自动生成注释插件：koroFileHeader
### 四、Vue代码规范
  1. 文件目录目录结构
     1. 基于Vue-cli 3.x脚手架基础划分。
     ```

        ├── babel.config.js // babel配置文件
        ├── public
        │   ├── favicon.ico  //ico图标
        │   └── index.html  //入口html文件
        ├── .vscode         //vscode 工作区配置（用于配置代码保存自动格式化）
        │   ├── settings.json  //自动格式化代码配置
        ├── src
        │   ├── App.vue // 根组件
        │   ├── assets  //静态资源
        │   │   ├── img  //照片
        │   │   ├── logo.png //logo
        │   │   └── styles  //样式
        │   ├── api //存放api请求接口
        │   ├── components //公共组件
        │   ├── main.js   //入口文件
        │   ├── router   //路由
        │   │   └── index.js
        │   ├── store  //状态管理
        │   │   └── index.js
        │   ├── utils    //工具栏
        │   │   ├── index.js
        │   │   └── request.js // 封装axios
        │   └── views     //页面文件夹
        │       └── home
        ├── package.json  // npm包配置文件，定义了项目的npm脚本、依赖包等信息
        ├── README.md  // 项目说明文件
        ├── vue.config.js  //vue配置项
        ├── .eslintrc  //eslint配置项
        ├── .prettierrc  //prettierrc配置
        └── yarn.lock

     ```
2. Vue文件代码顺序(推荐)
   1. name
   2. components
   3. data
   4. computed
   5. watch
   6. created
   7. mounted
   8. methods

   模板（可使用VSCode配置vue模板 具体参考[VSCode配置vue模板一键生成](https://www.cnblogs.com/coder-zyz/p/6749295.html)）
   ```bash
         <template>
            <div class="wrap-container">
            
            </div>
         </template>

         <script>
            export default {
               name: '',
               components: {},
               data() {
               return {}
               },
               computed: {},
               watch: {},
               created() { },
               mounted() { },
               methods: {}
            }
         </script>

         <style scoped lang="scss">
         </style>
   ```

3. 命名规则
   1. Vue项目中js命名规则
  
   | 类型                   | 规范                                         | 事例                   |
   | :--------------------- | :------------------------------------------- | :--------------------- |
   | 常量                   | 全字符大写，单词用下划线_分隔                | FETCH_USERS、GET_USERS |
   | 变量、函数             | 小写开头驼峰式                               | camelCase              |
   | 类、特殊意义的命名空间 | 大写开头驼峰式                               | CamelCase              |
   | 方法、函数             | a、动词或动词+名称组合 b、get 必须要有返回值 | handleLogin            |
   | 布尔值变量             | is 或 has 前缀                               | isLogin                |
   | 私有属性或方法         | 用 '' 或 '_' 前缀                            | _private               |
   | 事件处理函数           | handle前缀 或 Handler 后缀                   | handleLogin            |

   2.  Vue项目中js文件命名规则
         1. 属于类的.js文件，除index.js外，使用PascalBase风格
         2.  其他类型的.js文件，使用kebab-case风格
         3.  属于Api的，统一加上Api后缀

   3. Vue项目中文件夹命名规则
   **属于components文件夹下的子文件夹，使用大写字母开头的PascalBase风格，其他文件夹统一使用kebab-case的风格**
      1. 全局通用的组件放在 /src/components下
      2. 其他业务页面中的组件，放在各自页面下的 ./components文件夹下
      3. 每个components文件夹下最多只有一层文件夹，且文件夹名称为组件的名称，文件夹下必须有index.vue或index.js，其他.vue文件统一大写开头（Pascal case），components下的子文件夹名称统一大写开头（PascalCase）
        <br/>

      **例:全局公共组件：/src/components示例**
      ```bash
         - [components]
            - [Breadcrumb]
               - index.vue
            - [Hamburger]
               - index.vue
            - [SvgIcon]
               - index.vue 
      ```

       **业务页面内部封装的组件：以 /src/views/layout/components示例**
      ```bash
         -[src]
            - [views]
               - [layout]
                  - [components]
                     - [Sidebar]
                        - index.vue
                        - Item.vue
                        - SidebarItem.vue
                        - AppMain.vue
                     - index.js
                     - Navbar.vue
      ```
      ### SVN提交规范（建议）
      提交日志模板

      ```bash
         【提交类型】： Bug修复/阶段性提交/追加递交/新功能/需求修改/解决编译不过/代码整理/初次提交
         【问题描述】： 
                     1、添加了xxx功能；
                     2、解决了xxx导致的xxx问题；
                     ......
         【修改内容】： 
                     1、xxx.h文件中添加/修改了xxx；
                     2、xxx.hc文件中添加/修改了xxx；
                     ......
         【相关单号】： Bug号/库版本号/......
         【需要测试】： 是/否
      ```