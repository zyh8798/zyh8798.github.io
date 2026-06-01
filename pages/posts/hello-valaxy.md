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
答案：不能。  
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
答案：引用地址拷贝副本传递，JavaScript 只有值传递，不存在真正意义上的——引用传递。  
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
答案:深拷贝处理普通嵌套对象时可以通过递归实现。

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
答案:虚拟列表通过监听滚动事件，根据 scrollTop 动态计算当前应该展示的数据区间，只渲染可视区域及缓冲区的数据，从而减少 DOM 数量。早期实现可能会创建和销毁 DOM，但现代实现通常采用 DOM 复用的方式，仅更新元素内容和位置，避免频繁创建销毁带来的性能开销。

## 图片懒加载后反复上下滑动如何判断已经加载过
答案:使用 IntersectionObserver 实现懒加载时，当图片进入视口后为其设置真实地址，然后调用 unobserve() 取消该图片的监听，避免后续重复触发。如果所有图片都已经完成加载，可以进一步调用 disconnect() 销毁观察器释放资源。
## uniapp如何让一个请求百分之百优先于别的请求
答案:浏览器和 axios 本身没有请求优先级概念，一般通过封装请求队列实现。可以维护高、中、低三个优先级队列，并限制最大并发数。调度时优先执行高优先级队列中的任务。如果需要更严格的优先级控制，还可以通过 AbortController 取消低优先级请求，为高优先级请求释放并发资源。
## Vite 为什么需要预构建？
## 小程序子包的加载顺序是什么样的？
## 100 个动态组件在同一页面如何优化卡顿？
## 控制面板性能指标用什么去看,里面有什么参数?
## 手写并发请求控制函数
## 浏览器对同一域名的资源加载并发上限是多少？
## 手写自定义 Hook：参数变化自动执行。
## 手写 SKU 算法（两个颜色三个规格计算组合）。
## 站点与站点之间的参数传递方案（除了 Cookie 和路由）。
## 【致命点】v-if 的底层原理到底是什么？
## 浏览器地址栏输入 URL 后到底发生了什么？
