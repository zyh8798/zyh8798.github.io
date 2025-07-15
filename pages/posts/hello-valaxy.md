---
title: 面试题
date: 2025-03-10
updated: 2025-03-10
categories: 面试题
tags:
  - 面试题
top: 1
---

## vue的响应式原理
vue2的响应式原理就是使用object.defineProprty()来劫持对象属性的getter和setter，当数据变化时，触发setter，通过dep.notify()来通知watcher，watcher通过回调函数来更新视图。  
vue3的响应式原理则是使用proxy来劫持对象，当数据变化时，触发handler的set和get方法，通过effect函数来更新视图。
## vue2和vue3的区别
首先在响应式的diff算法上就有区别
vue2的diff算法是双端比较，vue3的diff算法是单端比较，vue3的diff算法性能更好。    
其次在组件的更新上也有区别，vue2的组件更新是异步的，vue3的组件更新是同步的。    
最后在生命周期上也有区别，vue2的生命周期是同步的，vue3的生命周期是异步的。  
vue2的写法和vue3的写法也有所不同  
vue2的选项式APIvue3是组合式API，vue2的写法是options api，vue3的写法是composition api，vue2的写法是面向对象的，vue3的写法是面向函数的。
VUE3支持TS和tree-shaking vue2不支持
## 闭包
闭包是指有权访问外部函数的变量和参数的函数,闭包的作用是延长变量的生命周期，闭包的缺点是会造成内存泄漏，闭包的解决方法是使用weakMap和weakSet来存储闭包，避免内存泄漏。
可以用来防抖节流什么的
## VUEX项目的优化手段
代码层面:合理使用v-if v-show 防抖节流 合并请求  
路由懒加载 图片格式化,懒加载 suspence组件懒加载(vue3)  
keep-alive 合理使用key,computed
v-model.lazy  冻结对象(vue2)
打包方面:tree-shaking 代码分割 gzip压缩 cdn引入
## promise
它的出现统一了了异步编码规则
## async await
async await是promise的语法糖，async函数返回一个promise对象，await等待promise对象的状态改变，如果状态是resolved，则返回promise对象的值，如果状态是rejected，则抛出异常。
## 事件循环
事件循环是指浏览器或Node.js在执行代码时，会先执行同步代码，然后执行异步代码，异步代码会放入任务队列中，当同步代码执行完毕后，会从任务队列中取出异步代码执行，这个过程会一直重复，直到任务队列中的异步代码全部执行完毕。宏任务和微任务的区别是，宏任务会在下一个事件循环中执行，微任务会在当前事件循环中执行。
## BFC
称之为块级格式化上下文,可以用来布局解决垂直外边距合并问题触发方式为overflow:不为hidden或者auto,浮动元素,绝对定位元素,行内块元素,flex元素,grid元素
## 如何实现三栏布局
1. flex布局  
2. 双飞翼布局  
3. 圣杯布局  
4. 绝对定位布局  
5. table布局  
6. grid布局
## 事件委托
事件委托是指将事件绑定到父元素上，通过事件冒泡机制来触发子元素的事件，事件委托的优点是可以减少事件绑定的次数，提高性能，缺点是事件委托只能处理冒泡阶段的事件，无法处理捕获阶段的事件。
## 跨域
跨域是指浏览器出于安全考虑，限制从一个域加载的脚本如何与另一个域的内容进行交互，跨域的解决方法有jsonp、cors、postMessage、nginx代理、webpack代理、websocket等。
## ES6
1. let const  
2. 箭头函数  
3. 模板字符串  
4. 解构赋值  
5. Promise  
6. async await  
7. class  
8. 模块化  
9. Proxy  
10. Reflect  
11. Set Map  
12. Symbol  
13. for of  
14. Array.from  
15. Array.of
## 数组方法
1. push  
2. pop  
3. shift  
4. unshift  
5. slice  
6. splice  
7. concat  
8. join  
9. reverse  
10. sort  
11. forEach  
12. map  
13. filter  
14. reduce  
15. reduceRight  
16. every  
17. some  
18. find  
19. findIndex  
20. fill  
21. copyWithin  
22. includes  
23. flat  
24. flatMap  
25. entries  
26. keys  
27. values  
28. from  
29. of  
30. isArray

## 今日面试题目
1.微信小程序自定义tabbar图标闪烁问题
2.函数传参是值传递还是引用传递
3.深拷贝遇到嵌套对象怎么解决
4.虚拟列表的实现原理
5.图片懒加载后反复上下滑动如何判断已经加载过
6.uniapp如何让一个请求百分之百优先于别的请求
