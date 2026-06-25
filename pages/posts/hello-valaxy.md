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
// 至少两个的话,就是简单到爆炸的两个循环,我居然说自己不会,一听到SKU就懦了
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

// 三个才需要算笛卡尔积,reduce 版本
function cartesian(arr) {
  return arr.reduce((prev, current) => {
    const result = []

    for (const p of prev) {
      for (const c of current) {
        result.push([...p, c])
        console.log(result)
      }
    }

    return result
  }, [[]])
}

const data = [
  ['红色', '蓝色'],
  ['S', 'M', 'L'],
  ['套餐1', '套餐2']
]

console.log(cartesian(data))
```

```js
// 三个循环版本,原理就是定义 当前已有组合 循环当前规格  拼接新的组合
// 先有一个空组合,然后先把颜色乘进去得到颜色组合,然后把尺码乘进去得到颜色+尺码组合然后把套餐乘进去得到颜色+尺码+套餐组合
// 使用三层循环：
// 第一层循环当前规格，
// 第二层循环已有组合，
// 第三层循环当前规格中的每一个值，

// 不断把旧组合和当前值进行拼接，生成新的组合，最终得到所有 SKU。
function cartesian(arr) {
    let result = [[]]

    for (const specs of arr) {
        const temp = []
        console.log('本轮specs:', specs)
        for (const item of result) {
            console.log('本轮item:', item)
            for (const value of specs) {
                console.log('本轮value:', value)
                temp.push([...item, value])
            }
        }

        result = temp
        console.log('本轮result:', result)

    }

    return result
}

const data = [
    ['红色', '蓝色'],
    ['S', 'M', 'L'],
    ['套餐1', '套餐2']
]

console.log('结果:', cartesian(data))
```

## 站点与站点之间的参数传递方案（除了 Cookie 和路由）。
站点之间传递参数常见方案有：

1.URL参数，例如 query 或 hash。

2.window.postMessage，通过 iframe 或新窗口进行跨域通信。

postMessage 并不是根据域名通信，而是根据 Window 对象通信。

常见获取 Window 对象的方式有：

1. iframe.contentWindow
2. window.parent
3. window.opener
4. window.open()

第二个参数 origin 只是安全校验，并不是用于寻找目标窗口。

3.服务端中转，A站将数据存储到服务端，B站再获取数据，这是企业系统最常见方案。

4.OAuth 授权流程，例如微信登录、GitHub 登录，本质上通过授权码和服务端交换用户信息。
如果A、B有共同的数据源（Redis、数据库、共享API），可以通过服务端中转传递数据。

如果A、B没有共同的数据源，则只能通过对方开放的API获取数据。

当API涉及用户身份和权限时，通常会使用OAuth获取访问凭证（access_token）后再调用API。

OAuth是一种授权协议，用于让第三方应用在不获取用户密码的情况下访问用户资源。

典型场景是微信登录、GitHub登录、QQ登录。

流程通常是：
用户授权 → 获取code → 服务端换token → 调用开放API获取用户信息。
Cookie、LocalStorage、SessionStorage 通常受同源策略限制，不能直接用于跨站点数据共享。
## v-if 的底层原理到底是什么？
v-if 底层并不是修改 CSS，而是条件渲染。Vue 会根据条件决定是否创建或销毁对应的 VNode 和真实 DOM。当条件从 false 变为 true 时，会重新创建组件并执行 mounted；从 true 变为 false 时，会卸载组件，执行 beforeDestroy/destroyed（Vue2）或 beforeUnmount/unmounted（Vue3），最后删除对应 DOM。因此切换成本较高。

v-show 才是通过修改元素的 display:none/display:block 来控制显示和隐藏，DOM 一直存在，因此 mounted 只会执行一次，切换性能更好。
## 浏览器地址栏输入 URL 后到底发生了什么？
1. 浏览器解析URL。

2. 进行DNS域名解析，将域名解析成IP地址，并优先查询浏览器和操作系统缓存。

3. 建立TCP连接；如果是HTTPS，还会进行TLS握手完成证书验证和密钥协商。

4. 浏览器发送HTTP请求，服务端处理后返回响应。

5. 浏览器解析HTML生成DOM树，解析CSS生成CSSOM树，合成Render Tree，然后进行Layout、Paint、Composite完成页面渲染。

6. 遇到CSS、JS、图片等资源继续发起请求，JS执行后页面最终完成交互。


## computed 和 watch 的区别(往下的都是扩展题目)
cmputed主要用来派生值,watch主要用来执行副作用

为什么一个有缓存一个没缓存? 因为computed有返回值,watch没有返回值

computed能不能做异步处理? 理论上可以但是不推荐,设计的初衷就是用来同步的返回数据的,要做放到watch里面做副作用请求比较好


## Vue 的 nextTick 原理
Vue 的 DOM 更新是异步的。当响应式数据发生变化时，Vue 不会立即更新 DOM，而是先将更新任务放入调度队列（Scheduler），并利用 Promise.then 创建微任务，在当前同步代码执行结束后统一刷新 DOM，实现批量更新，避免频繁回流和重绘。

nextTick 的作用就是等待这一轮 DOM 更新完成后，再执行回调，因此常用于获取更新后的 DOM 或操作第三方库

Vue 确实优先使用：

Promise.resolve().then(...)

nextTick 的实现不是只有 Promise。

Vue 内部会根据环境降级。

例如：

Promise.then
    ↓
MutationObserver（旧浏览器）
    ↓
setImmediate（IE）
    ↓
setTimeout

Vue2 就有这样一套降级策略。

Vue3 因为浏览器环境要求更高，基本就是：

Promise.resolve().then(flushJobs)

为什么首选微任务?因为微任务执行起来比宏任务更快,宏任务会被推迟到下一轮才执行,还得手动做去重

## Vue 为什么是异步更新？
为什么：
count.value++

console.log(dom)

DOM 还是旧的？

Vue 的响应式数据更新是同步的，但 DOM 更新是异步的。当响应式数据发生变化时，Vue 不会立即操作 DOM，而是先将更新任务加入调度队列，在当前同步代码执行结束后，通过微任务统一刷新 DOM。这样可以把同一轮事件循环中的多次数据修改合并为一次 DOM 更新，减少频繁的回流和重绘，提高页面性能。

为什么要批量更新（Batch Update）？

Vue 采用批量更新的目的是减少 DOM 操作次数。因为 DOM 更新会触发浏览器的样式计算（Style）、布局（Layout）、绘制（Paint）等渲染流程，成本远高于普通 JavaScript 运算。Vue 会将同一轮事件循环中的多个数据变化先加入调度队列（Scheduler），并进行去重，最后统一更新 DOM。这样既减少了浏览器渲染次数，也避免了同一组件重复更新，从而提高页面性能。



## Vue3 为什么 Proxy 比 Object.defineProperty 好？
Vue2 使用 Object.defineProperty 对每个属性分别进行劫持，因此初始化时需要递归遍历整个对象，为每个属性设置 getter 和 setter。Vue3 改用 Proxy 代理整个对象，不需要遍历所有属性，响应式实现更加高效。除此之外，Proxy 还解决了 Vue2 无法监听新增属性、删除属性以及数组索引变化等问题，可拦截的操作也更加丰富，因此 Vue3 最终选择了 Proxy。

proxy这么好为什么vue2不用? 

Vue2 发布于：2016 年 而 Proxy：ES2015（ES6）
虽然规范早就有了，但是：

浏览器支持非常差。

尤其是：

IE11 ❌
老版 Android 浏览器 ❌
老版 Safari ❌

Vue2 并不是不知道 Proxy 更优秀，而是在当时必须兼容 IE11 等旧浏览器。Proxy 属于 ES6 新特性，IE 完全不支持，而且无法通过 polyfill 模拟，因此 Vue2 只能选择兼容性更好的 Object.defineProperty。等到 Vue3 发布时，前端生态已经基本放弃 IE，浏览器对 Proxy 的支持成熟，Vue 才全面重构响应式系统。

那为什么vue2为什么不通过polyfill(垫片)去实现模拟一个proxy?实现兼容更多浏览器?
Polyfill 就是：浏览器不会，我用 JavaScript 给它补一个；但像 Proxy 这种需要 JavaScript 引擎底层支持的能力，就补不了。


##  父子组件生命周期执行顺序
例如：

<App>
    <Child />
</App>

mounted 谁先？

destroy 谁先？
父的beforeCreated 然后父的 created 然后父的 beforeMounted 然后 然后子的beforeCreated 然后子的 created 然后子的beforeMounted 然后子的mounted
然后父的 mounted 如果销毁的话就是 父的 beforeDesotry 然后子的 beforeDestory 子的 destory  然后 然后父的 destory



## keep-alive 的原理
KeepAlive 是 Vue 提供的一个抽象组件，本身不会渲染 DOM。它的作用是缓存组件实例，而不是销毁组件。当组件第一次渲染时，会创建实例并缓存；再次切换回来时，直接复用缓存的实例，因此不会重新执行 created 和 mounted，而是触发 activated；切换出去时也不会执行 destroyed，而是执行 deactivated。内部通过维护缓存（cache）和缓存顺序（keys）管理组件，当设置 max 时，会采用 LRU（最近最少使用）算法淘汰最久未使用的组件。

KeepAlive 为什么叫抽象组件（Abstract Component）？它为什么不会渲染 DOM？

除了 KeepAlive，还有哪些抽象组件？

Vue2 有几个比较典型：

KeepAlive

Transition

TransitionGroup（某种程度上）

Teleport（Vue3）

vue2通过abstract:true就能实现抽象组件的封装,vue3因为重构了渲染器所以没有这个属性了

Vue3 为什么没有 abstract: true？

Vue3 重构了渲染器，不再依赖 abstract: true 跳过组件，而是通过 KeepAlive 自身的特殊标识（__isKeepAlive）和渲染器对 VNode 的特殊处理来实现缓存和生命周期管理，因此抽象组件不再是一个公开的配置项，而是框架内部的一种实现机制。


## 浏览器缓存

什么是强缓存（Strong Cache）？

强缓存是指浏览器根据响应头判断资源是否过期，如果没有过期，则直接使用本地缓存，不会向服务器发送请求。强缓存主要由 Expires 和 Cache-Control 控制，其中 Expires 使用绝对时间，容易受到客户端时间影响；Cache-Control 使用相对时间（如 max-age），优先级更高，也是目前主流的缓存控制方式。  
缓存策略是由服务器通过 HTTP 响应头（如 Cache-Control、Expires）制定的，而真正是否使用缓存、是否发送请求，则由浏览器根据这些规则自行判断和执行。因此可以理解为：服务器负责制定缓存策略，浏览器负责执行缓存策略。

什么是协商缓存?
强缓存性能最好，因为不会发送任何请求。但它依赖资源 URL 不变，如果资源名称固定，就无法及时更新。因此对于带 Hash 的静态资源，通常使用长期强缓存；而对于 HTML、接口数据或文件名固定的资源，则更适合使用协商缓存，由服务器判断资源是否发生变化，既保证资源能够及时更新，又避免重复传输。

前端主要通过工程化打包生成带 Hash 的静态资源，使其能够安全地使用长期强缓存；而协商缓存主要依赖服务器返回的 ETag、Last-Modified 等响应头，由浏览器自动携带 If-None-Match、If-Modified-Since 等请求头与服务器协商。前端一般不需要手动处理协商缓存的具体逻辑。

协商缓存需要浏览器和服务器共同参与。服务器首次响应资源时，会返回 Last-Modified 或 ETag；浏览器再次请求时，会自动携带 If-Modified-Since 或 If-None-Match 请求头，告诉服务器自己缓存的是哪个版本。服务器比较后，如果资源没有变化，则返回 304 Not Modified，浏览器继续使用本地缓存；如果资源发生变化，则返回 200 和新的资源，同时更新缓存。其中 Last-Modified 基于资源修改时间判断，而 ETag 基于资源唯一标识判断，更准确，因此现代项目更常使用 ETag。

顺带一提如果同时存在 lastmodified 和 etag 会以etag为准

## localStorage、sessionStorage、Cookie 区别
localStorage、sessionStorage 和 Cookie 都可以在浏览器存储数据。localStorage 生命周期最长，除非主动删除，否则数据会一直存在；sessionStorage 仅在当前标签页有效，关闭标签页后数据会被清除；Cookie 除了可以存储数据外，还会随着同源 HTTP 请求自动发送给服务器，因此常用于登录状态维护。相比之下，localStorage 和 sessionStorage 只在前端使用，不会自动参与网络请求。此外，Cookie 容量较小，约 4KB，而 localStorage 和 sessionStorage 一般可存储约 5MB 数据。

面试官可能会问：

既然 localStorage 容量更大，为什么很多网站登录还是用 Cookie？

这题很多人会回答：

因为 Cookie 自动发送。

这只是其中一个原因，不是最重要的。

真正高频答案其实是：

Cookie 可以设置 HttpOnly，JavaScript 无法读取，安全性更高；而 localStorage 完全暴露给 JavaScript，一旦发生 XSS（Cross-Site Scripting，跨站脚本攻击），Token 很容易被窃取。


##  HTTP 和 HTTPS 区别
HTTP（HyperText Transfer Protocol，超文本传输协议）就是浏览器和服务器约定好的一套"聊天规则"。

HTTP 是一种应用层协议（Application Layer Protocol），它定义了浏览器与服务器之间请求和响应的格式，也就是双方通信的规则。随着互联网的发展，为了解决性能问题，HTTP 从 1.1 演进到 2，再到 3，每个版本都在优化传输效率；而 HTTPS 并不是 HTTP 的新版本，而是在 HTTP 的基础上增加了 TLS 加密，用于保证通信的安全性。

由于HTTP 是明文传输协议，数据在传输过程中可能被窃听、篡改，也无法验证服务器身份；HTTPS 则是在 HTTP 的基础上加入 TLS 加密协议，通过数据加密、完整性校验以及数字证书认证三种机制，保证通信过程的安全性。HTTP 默认端口为 80，HTTPS 默认端口为 443。由于 HTTPS 需要进行 TLS 握手，因此首次建立连接会比 HTTP 多一次握手开销，但现代 TLS 已经将性能影响降到很低。

HTTPS是怎么加密的?

HTTPS 采用混合加密。TLS 握手阶段利用非对称加密安全地交换对称密钥，后续所有业务数据都使用对称加密传输，因为对称加密速度远快于非对称加密，更适合大量数据传输。


HTTP
│
├── HTTP/1.1 长连接 HTTP 层队头阻塞
│      ↑
│      │
│      └── 浏览器和服务器聊天规则（旧）
│
├── HTTP/2 多路复用 Header 压缩 解决 HTTP 层队头阻塞 (但是TCP还是有TCP层的堵塞)
│      ↑
│      │
│      └── 聊天规则升级（支持多路复用）
│
└── HTTP/3 QUIC 内置 TLS 解决 TCP 层队头阻塞
       ↑
       │
       └── 聊天规则再次升级（基于 QUIC）

      
 HTTP
│
│ 定义怎么聊天
│
TLS
│
│ 保证聊天安全
│
TCP
│
│ 保证可靠送达
│
IP
│
│ 负责找到目标地址

IP（Internet Protocol，互联网协议）
UDP（User Datagram Protocol，用户数据报协议）
TCP（Transmission Control Protocol，传输控制协议）
QUIC (Quick UDP Internet Connections 快速 UDP 互联网连接)

既然 QUIC 这么厉害，为什么不直接替代 TCP？

标准答案：

因为 QUIC 主要是为 HTTP 场景设计的，而 TCP 已经广泛应用于数据库、SSH、Redis、邮件等各种协议，这些协议没有必要为了 QUIC 重写整个生态。另外，QUIC 在用户态（User Space）实现，而 TCP 是操作系统内核（Kernel）实现，各有适用场景，因此未来很可能长期共存，而不是完全替代。


## 为什么 JWT 可以无状态？
什么叫状态（State）？
状态其实就是：

服务器需不需要记住你以前来过。

所谓无状态，是指服务器不需要保存客户端的登录状态。传统 Session 登录需要服务器维护 Session 数据，每次请求都要根据 Session ID 查找对应用户；而 JWT 将用户身份、权限、过期时间等信息保存在 Token 中，并通过签名保证数据未被篡改。客户端每次请求携带 JWT，服务器验证签名后即可直接获取用户信息，因此无需维护 Session，这就是 JWT 能实现无状态的原因。

JWT 为什么还能防止别人伪造？

其中 Signature（签名） 是服务器用自己的**密钥（Secret）**计算出来的。

## 闭包是什么？

闭包是指一个函数能够访问并保持其定义时所在词法作用域中的变量，即使外层函数已经执行结束，这些变量仍然不会被释放。本质上是因为内部函数一直引用着外层作用域，垃圾回收器根据可达性分析认为这些变量仍然可访问，因此不会回收。闭包常用于防抖、节流、数据封装、柯里化等场景。需要注意的是，闭包本身不会导致内存泄漏，但如果长期持有不再使用的大对象，就可能导致内存无法及时释放。

## this 指向
this 指向由调用方式决定（箭头函数除外）。

1. 普通函数
- 独立调用：非严格模式下指向 window，严格模式下为 undefined。
- 对象调用：this 指向调用它的对象。

2. 箭头函数
- 没有自己的 this。
- this 继承定义时外层作用域的 this。

3. call
- 修改 this。
- 第一个参数是 this，后续参数逐个传递。
- 会立即执行。

4. apply
- 修改 this。
- 第一个参数是 this，第二个参数为数组。
- 会立即执行。

5. bind
- 返回绑定好 this 的新函数，不立即执行。
- 第一个参数是 this，后续参数会作为预置参数。

6. new
- 创建新对象。
- 将对象原型指向构造函数 prototype。
- this 指向新对象并执行构造函数。
- 默认返回新对象（若构造函数返回对象，则返回该对象）。

补充:this 的指向是在函数执行时确定的，只有箭头函数是在定义时确定的。

技巧:普通函数看调用者,普通函数是JS里面的一等公民,它一个人就是一个单位,大部分时候看一看最后是不是单独赋值了,单独赋值了就不管前面的东西了,它自己就有一个this
## 防抖(Debounce)和节流(Throttle)
```js
// 注意使用addEventListener需要的是一个函数,如果单纯的把debounce穿过去不return一个函数此时debouce的返回值是undefined所以要返回一个函数
      function debounce(fn, delay) {
        return function (...args) {
          if (timer) {
            console.log("to fast");
            clearTimeout(timer);
          }
          timer = setTimeout(function () {
            fn.apply(this, args);
          }, delay);
        };
      }
```

```js
// 注意 每次都需要取到最新的当前时间,所以now要放在每次的位置
      function throttle(fn, delay) {
        let last = 0;
        return function (...args) {
          let now = Date.now();
          if (now - last >= delay) {
            fn.apply(this, args);
            last = now;
          } else {
            console.log("已节流");
          }
        };
      }
```
### webpack的打包流程
Webpack 打包时首先会读取 webpack.config.js 配置文件，根据 entry 找到入口文件。

然后解析入口文件生成 AST，分析其中的 import 和 require，并递归解析所有依赖模块，最终构建出完整的依赖图（Dependency Graph）。

在解析过程中，如果遇到 Webpack 无法直接处理的资源，例如 Vue、TypeScript、CSS 等文件，会根据配置调用对应 Loader，将其转换为 Webpack 可识别的 JavaScript 模块，并继续递归分析依赖。

所有模块处理完成后，Webpack 会根据依赖关系生成一个或多个 Chunk。

在整个构建过程中，Plugin 可以通过监听 Webpack 生命周期的 Hook 参与各个阶段，例如生成 HTML、压缩代码、清理目录等。

最后将 Chunk 打包生成 Bundle 文件输出到 dist 目录。

其中 Loader 作用于单个模块，负责模块转换；Plugin 作用于整个构建流程，负责扩展 Webpack 能力。

Loader 执行顺序是从右向左，因为后一个 Loader 的输出会作为前一个 Loader 的输入。

## 浏览器的渲染管线

浏览器收到 HTML 后，会先解析 HTML 生成 DOM Tree，同时解析 CSS 生成 CSSOM Tree。随后将 DOM Tree 和 CSSOM Tree 合并生成 Render Tree，Render Tree 只包含需要渲染的节点。然后进入 Layout 阶段，计算每个元素的位置和尺寸。接着进入 Paint 阶段，将元素绘制成像素信息。最后通过 Composite 阶段将多个图层合成为最终画面并显示到屏幕上。

### 什么是重排什么是重绘?

重排:

当元素的 几何信息（Geometry） 发生变化时，需要重新计算布局。

例如：

width

height

padding

margin

border

left/top

display

添加 / 删除 DOM

窗口大小变化

### 重绘（Repaint）

当元素的 外观（Appearance） 变化，但几何信息不变时。

例如：

color

background

visibility

outline

重排一定会发生重绘, 重绘不一定发生重排,相比之下还有一个开销更小的合成,不一定会发生前两步

Composite（合成）是浏览器渲染流程中的最后一步。在 Paint 阶段浏览器会把页面内容绘制到不同图层（Layer）上，而 Composite 阶段会将这些图层交给 GPU 进行合成，生成最终画面并显示到屏幕上。对于 transform、opacity 等只涉及图层变化的操作，浏览器通常只需要执行 Composite，而不需要重新进行 Layout 和 Paint，因此性能更好。

transform 就是使用这个原理达到节省性能的目的,更多的使用GPU去加速渲染(使用原来的图层,不触发重排也不触发重绘),而不是触发重排,还有will-change告诉GPU这里要渲染,提前创建图层

transform 通常会让元素提升为独立图层，后续动画只需要在 Composite 阶段由 GPU 对图层进行平移、旋转、缩放等操作，而不会触发 Layout 和 Paint，因此性能更好。



## 浏览器渲染进程

Chrome 采用多进程架构。

早期浏览器通常多个页面共享一个进程，一个页面崩溃可能导致整个浏览器崩溃。

Chrome 将不同页面隔离到不同渲染进程中：

```text
Chrome

├── Renderer Process（百度）
├── Renderer Process（B站）
├── Renderer Process（Github）
└── Renderer Process（知乎）
```

这样某个页面崩溃不会影响其它页面。

---

### Chrome 主要进程

```text
Chrome

├── Browser Process
├── Network Process
├── GPU Process
├── Utility Process
└── Renderer Process
```

---

### Browser Process（浏览器主进程）

浏览器的管理者。

负责：

* 标签页管理
* 地址栏
* 窗口管理
* 历史记录
* 书签
* 权限控制
* 进程调度

---

### Renderer Process（渲染进程）

负责页面渲染。

主要处理：

* HTML
* CSS
* JavaScript
* DOM
* 页面渲染

通常一个标签页对应一个 Renderer Process。

---

### Network Process（网络进程）

负责所有网络请求。

主要包括：

* DNS
* TCP
* TLS
* HTTP
* HTTP2
* HTTP3
* Cookie
* 浏览器缓存

例如：

```js
fetch('/api/user')
```

实际上：

```text
Renderer Process

↓

通知 Network Process

↓

Network Process 发请求

↓

返回结果

↓

通知 Renderer Process
```

---

### GPU Process（GPU进程）

负责：

* GPU资源管理
* 图层合成
* GPU加速渲染

例如：

```css
transform
opacity
```

通常会利用 GPU 加速。

---

### Utility Process（工具进程）

负责：

* PDF解析
* 视频解码
* 音频解码
* 浏览器扩展能力

---

### Renderer Process 内部结构

```text
Renderer Process

├── Main Thread
├── Compositor Thread
└── Raster Thread
```

---

### Main Thread（主线程）

负责：

* JS执行
* DOM构建
* CSSOM构建
* Render Tree构建
* Layout（重排）
* Paint（重绘）

浏览器渲染管线中的大部分工作都在这里完成。

```text
DOM

↓

CSSOM

↓

Render Tree

↓

Layout

↓

Paint
```

---

### Compositor Thread（合成线程）

负责：

```text
Composite（图层合成）
```

例如：

```css
transform
opacity
```

很多情况下只需要 Composite，不需要重新 Layout 和 Paint。

---

### Raster Thread（栅格线程）

负责：

```text
Paint结果

↓

Bitmap（位图）
```

将绘制结果转换为最终像素数据。

---

### JavaScript 为什么会导致页面卡死

因为：

```text
JS执行

Layout

Paint
```

都运行在：

```text
Main Thread
```

上。

例如：

```js
while(true){}
```

会一直占用 Main Thread。

导致：

* 页面无法响应点击
* Layout无法执行
* Paint无法执行

因此页面卡死。

---

### 浏览器渲染管线与渲染进程关系

渲染进程：

```text
Renderer Process
```

是浏览器中的一个进程。

渲染管线：

```text
DOM

↓

CSSOM

↓

Render Tree

↓

Layout

↓

Paint

↓

Composite
```

是渲染进程内部执行的一套工作流程。

关系：

```text
Renderer Process

↓

执行 Rendering Pipeline
```

---

### 浏览器渲染进程总结

Chrome采用多进程架构，每个页面通常对应一个 Renderer Process。Renderer Process 内部包含 Main Thread、Compositor Thread、Raster Thread 等线程。Main Thread 负责 JS 执行和渲染管线中的 DOM、CSSOM、Layout、Paint；Compositor Thread 负责 Composite；Raster Thread 负责栅格化。Network Process 负责网络请求，GPU Process 负责图层合成和 GPU 加速。

##  Tree Shaking 原理

为什么：

ESM支持

CommonJS不支持

## 为什么 ESM 能 Tree Shaking？

为什么：

import

可以。

require

不行。

## Rollup 和 Webpack 有什么区别？
## diff 算法
## key 为什么不能用 index
## requestAnimationFrame
## WebSocket 和 SSE
## Rollup Plugin
## Babel 做了什么
## sourceMap 原理
