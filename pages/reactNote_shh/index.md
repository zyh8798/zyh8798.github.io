---
title: React 笔记 · 海浩
icon: i-ri-quill-pen-line
color: '#8b5cf6'
nav: false
---

<ReactNotesNav current="shh" />

## JSX 与 TSX 语法

1.插值语句jsx tsx {} 可以展示字符串，数字，数组(普通类型) 元素 三元表达式 API调用

```tsx
  const str = '小明'
  const num = 12
  const arr = [1,2,3,'二二']
  const blo = true
  return (
    <>
      <div>{str}</div>
      <div>{num}</div>
      <div>{arr}</div>
      <div>{blo ? '小' : '大'}</div>
      <div>{num.toFixed()}</div>
    </>
  )
```

2.插值语句支持对象怎么做？

```tsx
// 使用JSON.stringify将对象转为字符串
const obj = {name: '小明'}
  return (
    <>
    <div>{JSON.stringify(obj)}</div>
    </>
  )
```

3.事件如何绑定?

```tsx
// 使用onClick驼峰命名
const fn = () =>{
  console.log('点击')
}
return (
  <>
  <div onClick={fn}></div>
  </>
)
```

4.如何传递参数？

```tsx
const fn = (params,e) =>{
  console.log(params,e)
}
return (
  <>
  <div onClick={(e)=>fn(123,e)}></div>
  </>
)
```

5.如何定义泛型？

```tsx
// 在T后面加一个,号，直接使用<T>会被理解为这是一个标签，需要使用,号进行纠正
  const fn = <T,>(e:T) =>{
    console.log(e)
  }
  return (
    <>
    <div onClick={(e)=>fn(e)}></div>
    </>
  )
```

6.如何绑定属性id，class，style，以及多个class？

```tsx
let id = 'id'
let cla = 'test'
let style = {color: 'red'}
return (
  <>
  <div id={id} className={`${cla},na`} style={style}></div>
  </>
)
```

7.如何添加html代码片段？类似于v-html
使用dangerouslySetInnerHTML

```tsx
let html = '<h1>我是h1</h1>'
return (
  <>
  <div dangerouslySetInnerHTML={{__html:html}}></div>
  </>
)
```

8.如何进行遍历？类似于v-for

```tsx
let arr = [1,2,3,4,5,6,7,8,9]
return (
  <>
  <div>
    {arr.map((v=>{
      return <div key={v}>{v}</div>
    }))}
  </div>
  </>
)
```

## 原理篇

### babel

babel 是 JavaScript 的转译器，帮助你将源码转译成所需要的源码。
它的工作就是解析代码（Parse），进行转换（Transform），最后生成（Generate）。

主要用途：

1. 在 JavaScript 中将新语法降级为旧语法
2. Babel 的预设可以快捷方便地进行语法降级以及框架的语法转换
3. Babel 有插件功能可以自定义需要的语法进行转换

```js
// test.js测试用例
//语法
const a = (params = 2) => 1 + params;
const b = [1, 2, 3]
const c = [...b, 4, 5]
class Babel {

}
new Babel()
//API
const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((x) => x % 2 === 0)
const y = Object.assign({}, { name: 1 })
```

```js
// babel转换代码
import babel from '@babel/core'
import presetEnv from '@babel/preset-env'
// 读取文件需要引入fs
import fs from 'node:fs'
// 通过fs.readFileSync拿到需要的文件中的代码
// 通过babel.transform加上presetEnv进行ES6转换为ES5，其中presetEnv是转换的核心
// core-js如何实现新特性，core-js@3 内部拆好了按功能分好的小零件，当babel扫描到新特性时会在代码里插入对应小模块的导入
const code = fs.readFileSync('./app.jsx', 'utf-8')
const result = babel.transform(code, {
    // 将代码中的ES6转为ES5
    // useBuiltIns 有两个属性 usage entry
    // usage是按需引入，你的代码中有用到那些新特性它会自己帮你引入
    // entry是需要在文件入口顶部写上import "core-js/stable"，这样babel就会按照你配置的浏览器进行特性替换
    // corejs则是版本号
    // 注意presets里面如果有带参数的配置需要使用presets: [[preset, options]]这种形式，不然会被错误识别成独立的解析规则导致报错
    presets: [
        [presetEnv, { useBuiltIns: "usage", corejs: 3 }],
    ],
})

console.log(result.code)

console.log(result.code)
```

```js
// 输出代码示例（未显式配置 targets 时，部分内置 API 可能不会被改写）
var a = function a() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;
  return 1 + params;
};
var b = [1, 2, 3];
var c = [].concat(b, [4, 5]);
var Babel = /*#__PURE__*/_createClass(function Babel() {
  _classCallCheck(this, Babel);
});
new Babel();
var x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(function (x) {
  return x % 2 === 0;
});
var y = Object.assign({}, {
  name: 1
});
```

如果需要转译react代码需要额外安装@babel/preset-react这个插件
由于现在babel最新的版本为8，市面上的大部分教程以及使用都是7版本所以安装babel依旧插件时最好添加上@7
core-js有两个版本一个2一个是3，由于2版本已经废弃不在维护和更新以及不支持新es新特性所以都是安装的3版本

```powershell
#安装babel 以及es6转译es5插件
npm install --save-dev @babel/core@7 @babel/cli@7 @babel/preset-env@7
#es5支持新方法
npm install --save core-js@3
#支持转移jsx,tsx
npm install --save-dev @babel/preset-react@7
```

转译react代码

```jsx
// jsx测试代码
import react from 'react'
import {createRoot} from 'react-dom/client'

const App =() =>{
    return <div>我是谁？？？</div>
}

createRoot(document.getElementById('root')).render(<App/>)
```jsx
// app.jsx 测试代码
import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => {
  return <div>我是谁？？？</div>;
};

createRoot(document.getElementById('root')).render(<App/>);
```

```js
// babel编译代码
import babel from '@babel/core'
import presetEnv from '@babel/preset-env'
// 引入支持jsx的babel插件
import react from '@babel/preset-react'
import fs from 'node:fs'
const code = fs.readFileSync('./app.jsx', 'utf-8')
const result = babel.transform(code, {
    presets: [
        [presetEnv, { useBuiltIns: "usage", corejs: 3 }],
        // 引入编译react的插件
        [react]
    ],

})

console.log(result.code)
```

编写自定义插件完成箭头函数转译成普通函数

```js
import babel from '@babel/core'
// 读取文件需要引入fs
import fs from 'node:fs'
const code = fs.readFileSync('./test.js', 'utf-8')
// 转译插件,将箭头函数变为普通函数
// types 包括了各种AST的方法
const transformFunction = ({types: t})=>{
    return {
        name: 'transformFunction',
        visitor: {
            // 需要匹配的类型
            ArrowFunctionExpression(path) {
                const node = path.node
                // 通过AST语法树拿到函数的重要参数 async params body
                // async 函数是否为异步函数
                // params 函数的参数
                // body 函数的内容
                const arrowFunction = t.functionExpression(
                    null, // 匿名函数
                    node.params,
                    // 函数的内容需要进行额外处理
                    t.blockStatement([t.returnStatement(node.body)]),
                    node.async
                )
                path.replaceWith(arrowFunction)
            }
        }
    }
}
const result = babel.transform(code, {
    plugins:[transformFunction]
})

console.log(result.code)
```

### SWC

SWC对比babel更开箱即用，同样的代码方面的转译，转译速度更快，编写的代码更少，配置也更简单，还能够打包
为什么SWC会这么快？因为使用的是rust编写的，原生支持多线程，而babel是js编写的受限于v8引擎所以会更慢
虽然swc有打包功能，但是由于功能并不完善所以还是以转译为主
SWC的代码转译

```js
// ES6转ES5
import swc from '@swc/core'

const result = swc.transformFileSync('./test.js',{
    jsc: {
        parser: {
            syntax: 'ecmascript'
        },
        target: 'es5'
    }
})

console.log(result.code)
```

转译react代码

```js
import swc from '@swc/core'

const result = swc.transformFileSync('./app.jsx',{
    jsc: {
        parser: {
            syntax: 'ecmascript',
            jsx: true
        },
        target: 'es5'
    }
})

console.log(result.code)
```

swc配置

```json
{
  "jsc": {
    "parser": {
      "syntax": "typescript", // 解析 TypeScript 语法（对应普通 JS 的 "ecmascript"）
      "tsx": true, // 是否启用 TSX（.tsx 文件必须为 true，纯 .ts 文件设为 false）
      "decorators": true, // 是否支持装饰器语法（如 NestJS、MobX 常见）
      "dynamicImport": true // 支持动态导入
    },
    "transform": {
      "react": {
        "runtime": "automatic" // 现代 React 推荐 automatic 模式
      },
      "legacyDecorator": true, // 配合传统装饰器（experimentalDecorators）使用
      "decoratorMetadata": true // 生成装饰器元数据（依赖反射机制时开启）
    },
    "target": "es2020", // 编译后的 JS 目标版本
    "externalHelpers": false, // 是否把辅助函数抽离到 @swc/helpers（设为 true 配合安装 @swc/helpers 可减小体积）
    "baseUrl": ".", // 路径解析基准目录，常配合 paths 做路径别名
    "paths": {
      "@/*": ["src/*"] // 路径映射示例，让 @/ 指向 src/
    }
  },
  "module": {
    "type": "es6", // 现代前端或 ESM 项目常用 "es6"，Node 脚本常用 "commonjs"
    "strict": true // 生成严格模式代码
  },
  "minify": false,
  "sourceMaps": true
}
```

SWC打包
**!!!注意SWC打包了解即可，SWC后续会完全废弃掉这个功能，打包使用其他工具比如vite，webpack**

安装swc/cli

```powershell
npm install -D @swc/core @swc/cli
```

移除package.json中的```"type": "module"```,因为 spack.config.js 配置文件不支持 ESM 写法（必须使用 CommonJS 的 require / module.exports）
新建spack.config.js编写以下代码
最后运行```bash npx spack```命令即可打包成功

```js
const { config } = require('@swc/core/spack')
const path = require('path')

// 打包了解即可，swc后续也不打算支持打包了
module.exports = config({
    // 文件入口
    entry: {
        web: path.join(__dirname, './test.js') //入口
    },
    // 文件出口
    output: {
        path: path.join(__dirname, './dist'), //出口
        name: 'test.js'
    }
})
```

## React Router
