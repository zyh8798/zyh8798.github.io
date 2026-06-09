---
title: 面砸了的面试题
date: 2025-03-10
updated: 2025-03-10
categories: 面试题
tags:
  - 面试题
top: 1
---

## 如何解决微信小程序自定义tabbar图标闪烁问题?
不能。  
从微信小程序的多 WebView 架构来看，页面切换会导致组件重新挂载，因此普通自定义 TabBar 天然存在闪烁风险。

可以通过官方 `custom-tab-bar`、页面预加载、缓存组件等方式减轻，但只有原生 tabBar 能从架构层面基本避免闪烁。

对于极致流畅需求，可以采用单页容器+`v-show`切换方案，但会带来内存和维护成本。

`custom-tab-bar`就是tabbar属性设置为custom，再创建自定义文件夹 `custom-tab-bar/index` 然后在每一个页面使用，这样微信会缓存TabBar实例，但也不做不到完全不闪烁也只能减轻。

页面预加载就是使用`wx.preloadPage()`，提前加载对应页面，但是也只能减轻。

`v-show`就是把所有页面都放到同一个地方，然后使用`v-show`切换，代价是切换逻辑要自己控制首屏加载压力高，维护成本高，失去页面级生命周期、页面路由栈、部分分享能力、页面独立性，所以可以通过缓存使用，但是失去整个路由系统和页面传参也是得不偿失。

所以实际上还是`custom-tab-bar`配合`wx.preloadPage`会好一点;

"需要在每个页面放置"可能来自于某些跨端方案的实现方式（比如 taro 的一些旧版本），或者是原生微信小程序的玩法。但   uni-app 的做法是：

pages.json 里设 tabBar.custom: true → 框架自动读取 src/custom-tab-bar/index → 自动注入到每个 tab 页底  

小程序端是微信客户端做的注入，H5 端是 @dcloudio/uni-h5 框架做的。所以你在页面代码里确实看不到 <custom-tab-bar />

你只需要把组件写好放在 custom-tab-bar/index.vue，剩下的事框架帮你干了。


## 函数传参是值传递还是引用传递
引用地址拷贝副本传递，JavaScript 只有值传递，不存在真正意义上的——引用传递。  
基本类型传递的是值本身；  
对象传递的是对象引用（内存地址）的副本，因此修改对象属性会影响原对象，但重新赋值不会影响外部变量;   

```js
function change(obj) {
  obj.name = "张三"
}
const user = {
  name: "李四"
}
change(user)
console.log(user.name) // 张三, 由于修改的同一份地址+修改同一个属性所以是张三
```

```js
function change(obj) {
  obj = {
    name: "张三"
  }
}
const user = {
  name: "李四"
}
change(user)
console.log(user.name) // 把user赋值给obj也是一个引用地址传递的动作,obj又弄了个新的地址所以是李四
```

## 深拷贝遇到嵌套对象怎么解决
深拷贝处理普通嵌套对象时可以通过递归实现。

如果对象存在循环引用，会导致递归无限执行，因此需要使用 WeakMap 缓存已经拷贝过的对象。每次递归前先通过 has 判断是否已经处理过，如果处理过直接返回缓存对象，从而解决循环引用问题。
```js
function deepClone(obj, cache = new WeakMap()) {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (cache.has(obj)) {
    return cache.get(obj)
  }

  const result = Array.isArray(obj) ? [] : {}

  cache.set(obj, result)

  for (const key in obj) {
    result[key] = deepClone(obj[key], cache)
  }

  return result
}
```
如果面试官继续追问：

JSON.parse(JSON.stringify(obj))

算不算深拷贝？答案是：不完整。
会丢失：
undefined
Symbol
Function
Date
RegExp
Map
Set
BigInt
循环引用

现代浏览器更推荐： 

const clone = structuredClone(obj)  该方法还支持把原值中的可转移对象转移（而不是拷贝）到新对象上。可转移对象与原始对象分离并附加到新对象；它们将无法在原始对象中被访问。

## 虚拟列表的实现原理
虚拟列表通过监听滚动事件，根据 scrollTop 动态计算当前应该展示的数据区间，只渲染可视区域及缓冲区的数据，从而减少 DOM 数量。早期实现可能会创建和销毁 DOM，但现代实现通常采用 DOM 复用的方式，仅更新元素内容和位置，避免频繁创建销毁带来的性能开销。

## 图片懒加载后反复上下滑动如何判断已经加载过
使用 IntersectionObserver 实现懒加载时，当图片进入视口后为其设置真实地址，然后调用 unobserve() 取消该图片的监听，避免后续重复触发。如果所有图片都已经完成加载，可以进一步调用 disconnect() 销毁观察器释放资源。
## uniapp如何让一个请求百分之百优先于别的请求
浏览器和 axios 本身没有请求优先级概念，一般通过封装请求队列实现。可以维护高、中、低三个优先级队列，并限制最大并发数。调度时优先执行高优先级队列中的任务。如果需要更严格的优先级控制，还可以通过 AbortController 取消低优先级请求，为高优先级请求释放并发资源。

## Vite 为什么需要预构建？
Vite 预构建主要有两个目的：

将 CommonJS 等非 ESM 规范的依赖转换为浏览器可直接运行的 ESM。
对第三方依赖进行预打包，将大量内部模块合并为较少的请求，减少开发环境中的网络开销，提高启动速度和热更新性能。

Vite 使用 esbuild 完成预构建，并将结果缓存到 node_modules/.vite 目录中。

如果面试官继续追问：

为什么 Vite 比 Webpack 启动快？

你可以接：

Webpack 启动时需要打包整个项目。

Vite 启动时只预构建 node_modules，
业务代码按需编译，
浏览器通过 ESM 按需加载。

因此冷启动速度通常远快于 Webpack。

## 小程序子包的加载顺序是什么样的？
小程序启动时仅加载主包，主包包含入口页面与公共资源。子包采用按需加载机制，只有当用户首次访问子包页面时才会触发下载，并在本地缓存，后续访问无需重复下载（除非版本更新）。

为了优化体验，可以使用：

独立分包（independent subpackage）：不依赖主包即可独立运行，常用于登录页、活动页等场景。
分包预加载（preloadRule）：在用户访问指定页面时提前加载相关分包，降低跳转延迟。

在模块引用方面：

主包不能直接引用子包内容
子包之间不能相互引用
子包可以使用主包公共代码或 npm 依赖

独立分包怎么分? 

```js
// pages.json subPackages.independent配置文件开启这个属性 启动 → 直接下载独立分包 → 进入登录页不在需要先下载主包 常见于广告 登录 活动页
// 独立分包的页面必须确保没有依赖主包文件中的逻辑
{
  "root": "login",
  "independent": true  
}
```

分包预加载怎么搞?

```js
// pages.json配置文件里面加入这个属性,放上要预加载的分包,当 pages/index/index 被访问时(并不是进入之后)触发预加载
// 预加载是不是“提前执行页面逻辑”？ 不会,要先下载下来
// preloadRule 会不会影响首屏性能？ 可能会,要下载的包太多了会卡
// 预加载和首次访问同时发生用谁? 谁先下载好就用谁的
{
  "preloadRule": { 
    "pages/index/index": {
      "network": "all",
      "packages": ["packageA"]
    }
  }
}
```

## 100 个动态组件在同一页面如何优化卡顿？
当页面存在 100 个动态组件时，卡顿的核心原因通常来自三个方面：DOM 数量过多、Vue 响应式系统的依赖追踪开销，以及频繁的批量更新触发。

优化思路需要从“减少同时渲染的组件数量”和“降低响应式及更新成本”两个方向入手。

1.渲染控制（减少同时存在的组件）

如果是标准列表结构，优先使用虚拟列表（Virtual List），通过只渲染可视区域内的组件，将 DOM 数量控制在常数级别，从根本上降低渲染压力。

如果不是标准列表结构，可以使用分片渲染（Chunk Rendering），通过 requestAnimationFrame 或 setTimeout 将一次性渲染拆分为多批执行，避免主线程长任务阻塞。

同时可以结合 IntersectionObserver 实现视口级懒加载，只在组件进入可视区域时才触发渲染，并配合 defineAsyncComponent 实现组件代码的按需加载，从而降低首屏压力。

2.响应式优化（降低 Vue 代理成本）

对于不需要响应式的数据结构，可以使用 markRaw 或 shallowRef 来减少 Proxy 代理开销：

markRaw：标记对象不进入响应式系统
shallowRef：只对 .value 层级进行响应式追踪，避免深层代理

对于完全静态内容，可以使用 v-once，使其只渲染一次，不参与后续更新。

3.更新优化（减少无效重渲染）

需要避免错误的 key（如 index 作为 key），防止组件被重复销毁和重建。

同时应避免将 100 个组件绑定到同一个全局状态源，防止一个状态变化触发全量更新。

总结:

整体优化本质是控制三个维度：

同时渲染的组件数量（DOM 维度）
响应式追踪范围（Proxy 维度）
更新触发范围（diff 维度）

## 控制面板性能指标用什么去看,里面有什么参数?
当时主要从三个维度验证：

冷启动时间（Cold Start），Webpack 启动需要数秒，而 Vite 基本在 1 秒内完成。
HMR 热更新速度，修改组件后 Vite 几乎实时更新，而 Webpack 需要重新编译部分模块。
通过 Chrome DevTools 的 Network 和 Lighthouse 观察资源加载情况和性能指标。

因为 Vite 基于原生 ESM 和 esbuild 预构建依赖，不需要像 Webpack 那样在启动阶段打包整个项目，所以开发体验明显更快。

## 项目从 Webpack 迁移到 Vite 后有什么提升？怎么证明？
1. 冷启动速度

最明显的是开发环境启动速度。

Webpack 启动时需要先分析依赖并打包整个项目：

npm run serve
↓
等待数秒
↓
项目启动

Vite 启动时只会预构建依赖（node_modules），业务代码通过浏览器 ESM 按需加载：

npm run dev
↓
几百毫秒
↓
项目启动

从终端输出时间就能明显看到差异。


2. Network 面板

F12 → Network

Webpack：

main.js
vendors.js

通常会看到体积较大的 Bundle 文件。

Vite：

vue.js
router.js
main.js
...

浏览器通过 ESM 按需请求模块。

可以明显看到资源组织方式不同。

## Webpack 迁移到 Vite 遇到了哪些问题？
1. CommonJS 迁移 ESM

普通情况：
```js
const axios = require('axios')

// 改为：

import axios from 'axios'

// 部分动态导入：

const page = require(`./pages/${name}`)

// Vite 不支持动态 require。

// 需要改成：

const modules = import.meta.glob('./pages/*.js')

// 或者：

await import(...)
```
2. Alias 配置迁移

原来的@
直接迁移即可：
```js
alias: {
  '@': fileURLToPath(
    new URL('./src', import.meta.url)
  )
}
```

项目里还存在：
@import "~element-ui/lib/theme-chalk/index.css"

这里的~是 Webpack Sass Loader 的特殊语法。表示：node_modules


Vite 默认不支持。

因此需要通过：vite.config.js 自定义 importer 进行兼容处理。

3. .vue 自动补全问题
```js

// Webpack 默认支持：

import Home from '@/views/home' // 自动补：home.vue

// Vite 默认不包含.vue因此需要：

resolve: {
  extensions: [
    '.vue',
    '.js',
    '.json'
  ]
}

```
4. Vue2 构建版本问题

Vue2 有两个常见版本：

vue.runtime.esm.js 只负责 模板渲染 不包含模板编译器。

vue/dist/vue.esm.js包含：模板编译+模板渲染项目部分组件依赖运行时模板编译能力。

```js
// 因此增加配置：
alias: {
  vue: 'vue/dist/vue.esm.js' // 强制使用完整版 Vue。
}
```
5. 环境变量迁移
 
Vite 不再通过 process.env 注入环境变量，而是通过 import.meta.env 暴露，因此需要修改变量前缀和访问方式。

## 手写并发请求控制函数

```js
  const fn = () => {
            return fetch("https://jsonplaceholder.typicode.com/posts/1")
                .then(res => res.json());
        }

        let requestList = new Array(20).fill(fn);

        await asyncPool(requestList);

        function asyncPool(list, max = 3) {
            return new Promise(resolve => {
                let result = []
                let finished = 0;
                let index = 0;

                const run = () => {
                    if (finished === list.length) {
                        resolve(result)
                        return;

                    }

                    if (index === list.length) {
                        return;
                    }

                    let currentIndex = index;
                    index++
                    let task = list[currentIndex];

                    task().then(res => {
                        result[currentIndex] = res
                    }).catch(err => {
                        result[currentIndex] = err
                    }).finally(() => {
                        finished++
                        console.log(`finished: ${finished}, index: ${index}`)
                        run()
                    })
                }

                for (let i = 0; i < max; i++) {
                    run()
                }
            })

        }
```
## 浏览器对同一域名的资源加载并发上限是多少？
浏览器对同一域名的资源加载并发上限在 HTTP/1.1 环境下通常是 6 个左右，超过的请求会进入等待队列。这样做是为了避免单个站点占用过多网络资源。HTTP/2 引入了多路复用机制，多个请求可以复用同一个 TCP 连接，因此不再受传统 6 个连接限制的影响。
## 手写自定义 Hook：参数变化自动执行。
```js
import { ref, watch, type Ref } from 'vue'
export function useList<T, P>(api: (params: P) => Promise<T[]>, params: Ref<P>) {
    const list = ref<T[]>([])

    const loading = ref(false)

    const getList = async () => {
        loading.value = true
        try {
            const res = await api(params.value)
            list.value = res
        } finally {
            loading.value = false
        }
    }
    watch(params, getList,
        {
            immediate: true,
            deep: true

        }
    )


    return {
        list,
        loading,
        getList
    }
}
// 参数变化太频繁了浪费怎么办? 和分页组件的修改重复了怎么办?
// 分开做,要么hook的请求就只是占位,给分页组件的change去做请求,要么分页组件的change不用,全部交给hook
// 太频繁的问题可以不用监听,让用户手动修改完(假设有很多参数)手动点确认再调用
```
## 手写两个颜色三个规格计算组合的SKU。
```js
// 简单到爆炸的两个循环,我居然说自己不会,一听到SKU就懦了
const sizes= ['M','L','S']
const colors = ['蓝色','红色','黄色']
function sku(colors,sizes){
const result = []
for(color of colors){
  for(size of sizes){
    result.push([color,size])
  }
}
return result
}
sku(color,sizes)
```

## 站点与站点之间的参数传递方案（除了 Cookie 和路由）。
## 【致命点】v-if 的底层原理到底是什么？
## 浏览器地址栏输入 URL 后到底发生了什么？
