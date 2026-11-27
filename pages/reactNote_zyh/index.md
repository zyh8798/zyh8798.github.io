---
title: React 笔记 · 英豪
icon: i-ri-book-open-line
color: '#3b82f6'
nav: false
---

<ReactNotesNav current="zyh" />

## 基础篇

#### asset目录与public目录的区别
 asset中的静态资源会随着项目进行编译变化,public不会,并且都要放根目录

#### JSX
**jsx是什么,是js语法的扩展,javascript & xml,tsx则又是在jsx从中加入了typescript**  
```jsx
import './App.css'
import type {CSSProperties} from 'react' // Ts 会推断出textAlign是string类型,但是React内部的style属性要求是'center','left'这种确定的值,所以继承一下React的接口
function App() {
 const p = 3.1415926
 const fn = <T,> (params:T)=>{
  alert(params)
 }
 const fn2= ()=>{
  console.log('fn2')
 }
 const id = '100'
 const stringClassName = 'stringClassName'
 const styleObj:CSSProperties = {
  color:'red',
  width:'200px',
  height:'200px',
  backgroundColor:'lightgray',
  marginTop:'20px',
  lineHeight:'200px',
  textAlign:'center'
 }
 const html = '<h2><span>这是一个html代码片段</span></h2>'
 const arr = [1,2,3,4,5]
  return (
    /* 
    jsx插值语法规则

    1.插值语句jsx tsx 用 {} 表示,可以传入的参数有 数字、只有基础数据类型数据的数组 、HTML元素、三元表达式、函数调用

    2.如果非要传入复杂数据类型的数组的话,使用JSON.stringify()方法将其转换为字符串

    3.绑定事件用驼峰写法就行 onClick={() => functionName(params)} 传递参数使用高阶函数传一个匿名函数进行传递,不传参数不用写括号
    3.1如果想变成泛型函数,在函数名后面加上<T,>就行了

    5.绑定属性比如说 id class等也是直接用一个{} 但是class要写成className,多个的话用插值语法`${className1} ${className2}` 进行拼接,之间居然不用写逗号

    6.绑定style直接写{} 然后里面传入一个对象,颇像VUE的胡子语法 style={{width: '100px', height: '100px'}} 但是注意这里的属性名是驼峰写法,而不是连字符写法

    7.添加html代码片段 vue里面用v-html react用这个什么危险的插入innHtml的钩子 dangerouslySetInnerHTML={{__html:html}} 
    7.1顾名思义这个不是安全有XSS注入风险,还有写上这个属性的元素的不能有内容

    8.如何遍历数组生成jsx元素使用数组的map方法,然后返回一个新的数组,但是注意要加上key属性,不然会有警告
    */
    <>
      <h2>{'Hello, World!'}</h2>
      <h2>{114514}</h2>
      <h2>{[1, 2, 3]}</h2>
      <h2>{<span>这是一个HTML元素</span>}</h2>
      <h2>{true ? '条件成立' : '条件不成立'}</h2>
      <h2>{p.toFixed(2)}</h2>
      <h2>{JSON.stringify([{name:'zyh'}])}</h2>
      <button onClick={ ()=>fn(666)}>Click me</button>
      <button onClick={fn2}>Click me</button>
      <div id={id} className={`${stringClassName} aa bb cc`}>
        用来绑定class的DIV
      </div>
      <div style={styleObj}>
        用来绑定style的DIV
      </div>
      <div dangerouslySetInnerHTML={{__html:html}}></div>
      <ul>
        {arr.map((item,index)=>{
          return <li key={index}>{item}</li>
        })}
      </ul>
    </>
  )
}

export default App

```
## 工具篇
### BABEL
**什么是babel? Babel是一个JavaScript编译器,提供了JavaScript的编译过程,能够将原代码转化为目标代码**
核心功能
1.语法转换：将新版本的 JavaScript 语法转换为旧版本的语法  
2.Polyfill：通过引入额外的代码，使新功能在旧浏览器中可用  
3.JSX: 将JSX语法转换成普通的JavaScript语法  
4.插件: 为Babel提供自定义功能  

```js
// 基础测试用例 test.js 输入
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

/*
转换代码 index.js
普通测试用例,babel版换为8,object.assgin为运行时API兼容ie需要使用垫片实现 */
/* 
targets 决定输出要兼容谁
targets: { ie: '11' } 的意思是「输出代码要考虑 IE 11 的语法支持」。
比如 IE 11 看不懂箭头函数，`preset-env` 就会启用对应的插件，把它变成普通 function。如果把目标换成 { node: '24' }，Node 24 本身支持箭头函数，这项转换就可以跳过。

presets 是预设列表
「预设库」`@babel/preset-env` 是其中一个预设包。它掌握各个环境支持哪些语法，再按你的 targets 选用转换插件。
比如箭头函数、`class`、展开语法，各有对应的转换插件。你可以把它理解成一套工具加一张兼容性表

transformAsync 转换函数接收源码字符串和配置，异步返回编译结果
*/
import { transformAsync } from '@babel/core' 
import fs from 'node:fs/promises'

const file = await fs.readFile('./test.js', 'utf-8')

const { code } = await transformAsync(file, {
    targets: { ie: '11' },
    presets: [['@babel/preset-env', { debug: true }]]
})

console.log(code);

// 输出
//语法
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
//API
var x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(function (x) {
  return x % 2 === 0;
});
var y = Object.assign({}, {
  name: 1
});


```
```js
// jsx代码转换成js代码测试用例
// test.js 输入
import react from 'react'
import { createRoot } from 'react-dom/client'

const App = () => {
    return <div>我是JSX的函数式组件,这是一个div</div>
}

createRoot(document.getElementById('root')).render(<App />)

/*
转换代码 index2.js
只需要换一个预设库换成@babel/preset-react就好了
由于版本变化导入方式 变成了 import { transformAsync } from '@babel/core' 导出需要的函数
预设库也不需要导出了改成直接填入对应的预设库名称
 */
import { transformAsync } from '@babel/core'
import fs from 'node:fs/promises'
const file = await fs.readFile('./test.jsx', 'utf-8')
const js = await transformAsync(file, {
    presets: ['@babel/preset-react']
})
console.log(js.code);

// 输出
"import react from 'react';\n" +
    "import { createRoot } from 'react-dom/client';\n" +
    'import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";\n' +
    'const App = () => {\n' +
    '  return /*#__PURE__*/_jsxDEV("div", {\n' +
    '    children: "我是JSX的函数式组件,这是一个div"\n' +
    '  }, void 0, false);\n' +
    '};\n' +
    "createRoot(document.getElementById('root')).render(/*#__PURE__*/_jsxDEV(App, {}, void 0, false));"

```

```js
// babel自定义箭头函数转换普通函数的插件--偷懒版本
import Babel from '@babel/core'
import fs from 'node:fs'

// 读取我们要转换的目标文件
const file = fs.readFileSync('./test.js', 'utf8')

// 因为下面不需要手动“捏”新节点，所以连参数里的 ({ types: t }) 都可以省掉不写
const transformFunction = () => {
    return {
        name: 'babel-transform-function', // 给你的插件起个名字
        // visitor（访问者/巡逻员）：负责去 AST 大树里蹲点抓目标
        visitor: {
            // 只要遇到 type 叫 ArrowFunctionExpression（箭头函数）的节点，就触发这个函数
            // path 是 Babel 给节点配的“全能管家”，里面包着节点数据，也自带各种操作方法
            ArrowFunctionExpression(path) {
                console.log('抓到了一个：', path.node.type)

                // 调用管家自带的“一键变身”快捷方法：
                // 它会自动帮你处理没有大括号的 return、大括号{}、async、甚至复杂的 this 指向问题
                path.arrowFunctionToExpression()
            }
        }
    }
}

// 让 Babel 开始干活，把 plugins 里的插件塞进去运行
const result = Babel.transform(file, {
    plugins: [transformFunction]
})

// 打印转换后的新代码
console.log(result.code)
```

```js
// babel自定义箭头函数转换普通函数的插件--手撸版
import Babel from '@babel/core'
import fs from 'node:fs'

const file = fs.readFileSync('./test.js', 'utf8')

// 这里的 ({ types: t }) 是 Babel 自动送给你的工具箱（@babel/types）
// 里面装着两类法宝：1. 造积木的模具（如 t.functionExpression） 2. 安检仪（如 t.isBlockStatement）
const transformFunction = ({ types: t }) => {
    return {
        name: 'babel-transform-function',
        visitor: {
            // 1. 【visitor 负责抓】：蹲点抓取所有箭头函数
            ArrowFunctionExpression(path) {
                // 从“管家 path”手里，拿出纯数据格式的“原始节点 node”
                const node = path.node

                // 2. 【t 负责查 & 造】：先准备新函数的函数体（必须是带 {} 的 BlockStatement）
                // 用安检仪 t.isBlockStatement 检查一下原箭头函数有没有自带大括号 {}：
                const body = t.isBlockStatement(node.body)
                    ? node.body // 情况 A：如果本来就有 {}（如 () => { console.log(1) }），直接拿来用
                    : t.blockStatement([t.returnStatement(node.body)]) // 情况 B：如果没写 {}（如 x => x + 1），就给它套一层 { return ... }

                // 用模具 t.functionExpression 手工捏一个“普通函数表达式”节点
                // 它的完整参数顺序是：(id, params, body, generator, async)
                const normalFunction = t.functionExpression(
                    null,        // 第1个参数 id：函数名。箭头函数没名字，传 null（代表匿名函数 function()）
                    node.params, // 第2个参数 params：参数列表（比如 (a, b)），直接把原来的搬过来
                    body,        // 第3个参数 body：上面准备好的带大括号 {} 的函数体
                    false,       // 第4个参数 generator：是不是生成器函数(function*)？箭头函数不可能是，填 false
                    node.async   // 第5个参数 async：是不是异步函数？原来是 async 就跟着是 true，否则 false
                )

                // 3. 【path 负责换】：让管家把旧的箭头函数，替换成我们刚捏好的普通函数
                path.replaceWith(normalFunction)
            }
        }
    }
}

const result = Babel.transform(file, {
    plugins: [transformFunction]
})

console.log(result.code)
```

```js
// 练习插件,删除所有console.log
// 输入 test3.js
let a = 1;
console.log(a);
let b = 2;
console.log(b);
let c = 3
console.log(c);

console.dir('111')
let fn = () => {
    let d = a + b + c
    console.log(a, b, c);
    console.warn('666');
}

// 插件代码 index5.js
import { transformAsync } from '@babel/core'
import fs from 'node:fs'

const file = fs.readFileSync('./test3.js', 'utf-8')

const clearConsoleFunction = ({ types: t }) => {
    return {
        name: 'babel-clearConsole-functon',
        visitor: {
            CallExpression(path) {
                // console.log('函数调用了');
                // console.log(path.node);
                // console.log(Object.keys(path.node));
                // console.log(path.node.callee.object?.name);
                // console.log(Object.keys(path.node.callee.object.name));

                if (path.node.callee.object?.name === 'console' && path.node.callee.property?.name === 'log') {
                    console.log('发现普通的console.log了');
                    path.remove()
                }
            }
        }
    }
}
const res = await transformAsync(file, {
    plugins: [clearConsoleFunction]
})

console.log(res.code);

// 输出
'发现普通的console.log了'
'发现普通的console.log了'
'发现普通的console.log了'
'发现普通的console.log了'
let a = 1;
let b = 2;
let c = 3;
console.dir('111');
let fn = () => {
  let d = a + b + c;
  console.warn('666');
};
```
> **一句话总口诀：`visitor` 负责抓 ➔ `t` 负责造 ➔ `path` 负责换**

### 1. `t`（`@babel/types`）：造积木的模具，不是转换魔法

很多人一开始会误以为 `t` 里面装的是“把 A 变成 B 的转换方法”，其实不是。`t` 是 Babel 送给你的 **AST 节点工具箱**，里面主要装了两类法宝：

1. **造新节点（乐高模具）**
   比如你想自己手捏一个数字 `1` 的节点，就调用 `t.numericLiteral(1)`；想手捏一个普通函数节点，就调用 `t.functionExpression(...)`。
2. **判断节点类型（安检仪）**
   都是 `t.is...` 开头，比如 `t.isIdentifier(node)` 或 `t.isBlockStatement(node)`，用来检查某个节点是不是某种特定类型。

> 💡 **注意**：如果你直接使用了 `path.arrowFunctionToExpression()` 这种偷懒快捷方法，没有自己手捏新节点，那全程其实根本用不到 `t`。

---

### 2. `visitor` 与 `ArrowFunctionExpression`：巡逻规则与蹲点目标

`ArrowFunctionExpression` **不是**从 `t` 里取出来的方法，它是用来**“蹲点”**的！

还记得我们在 AST Explorer 里看到的每个节点都有一个 `type` 吗（比如 `VariableDeclaration`、`Literal`）？如果你把一个箭头函数 `const fn = () => {}` 丢进 AST Explorer，你会看到它的 `type` 就叫做 `ArrowFunctionExpression`（箭头函数表达式）。

Babel 转换代码分为三步，这里的 `visitor`（访问者）就是第二步的**“巡逻规则”**：

1. Babel 先把你的代码文件变成一棵大树（AST）。
2. Babel 派出一个“巡逻员”，从树顶走到树底，把每个节点都逛一遍。
3. 你在 `visitor` 里写了一个 `ArrowFunctionExpression(path)`，就等于给巡逻员下了一条命令：
   > **“喂，你在逛这棵树的时候，只要遇到 `type` 叫 `ArrowFunctionExpression` 的节点，就停下来，执行我这个函数！”**

### 🔍 举一反三
* 如果以后你想专门抓 `let a = 1` 这种语句，就在 `visitor` 里写个 `VariableDeclaration(path) {}`。
* 如果想抓数字或字符串，就写 `Literal(path) {}`。
* **规律：这里的函数名和 AST 树里的 `type` 是一一对应的，树里叫啥名，这里就写啥名！**

---

### 3. `path` 与 `node`：带 GPS 的全能管家 vs 纯数据

`ArrowFunctionExpression(path)` 括号里接收到的 `path` 是学 Babel 时**最重要**的概念：

* **`node`（节点）**：就是在 AST Explorer 里看到的那一坨纯 JSON 数据（比如 `{ type: "ArrowFunctionExpression", params: [...], body: ... }`）。它很“傻”，只管存自己的数据，**不知道自己的老爸是谁、邻居是谁，也不知道怎么修改自己**。
* **`path`（路径）**：是 Babel 给 `node` 套上的一个**“全能管家 / 带 GPS 的包装盒”**。

只要巡逻员抓到了目标，交给你的不是裸奔的 `node`，而是这个管家 `path`。通过 `path`，你可以做很多事：

| 常用属性 / 方法 | 作用解释 |
| :--- | :--- |
| `path.node` | 取出里面包着的原始 AST 节点（纯数据） |
| `path.parent` | 查一查这个节点的“老爸（父节点）”是谁 |
| `path.replaceWith(新节点)` | 把当前这个旧节点，直接替换成新节点 |
| `path.remove()` | 直接把当前这句代码从树里删掉 |
| `path.arrowFunctionToExpression()` | 管家自带的“一键快捷按钮”：自动把箭头函数转换成普通函数（自动补全 `return`、处理 `this` 指向等复杂细节） |

---

写 Babel 插件，90% 以上的核心工作其实就是在写这个 visitor。  
你甚至无意间直接领悟了一个很高级的编程设计模式，就叫**“访问者模式（Visitor Pattern）”**——核心思想就是：遍历树的工作交给框架（巡逻员）去跑，我们只管在 visitor 里守株待兔，在对应的节点下写好处理函数就行。  
不管你想用 Babel 干什么神奇的事，套路全都是一模一样的：  
想上线前自动删掉所有 console.log ➔ 让巡逻员蹲点 CallExpression（函数调用），遇到是 console.log 就 path.remove()。  
想把 let / const 降级成兼容老浏览器的 var ➔ 让巡逻员蹲点 VariableDeclaration（变量声明），把它的 kind 改成 "var"。  
想把 React 的 `<div>`（JSX 语法）转成浏览器能懂的 JS ➔ 让巡逻员蹲点 JSXElement，把它替换成 React.createElement(...)。  
所以你以后写插件的工作流超级简单：  
先把要改的代码丢进 AST Explorer，看一眼你想改的那块代码 type 叫啥名。  
回到代码里，把这个名字写进 visitor，让巡逻员去抓。  
在函数里拿到 path，想删就删、想改就改、想替换就用 t 捏个新的换上去。  
就是这么简单！你已经入门啦！🎉  


## SWC

### 1. SWC 是什么？
* **全称**：**Speedy Web Compiler**（极速 Web 编译器）
* **底层语言**：**Rust**（单线程比 Babel 快约 20 倍，多核快约 70 倍）
* **核心作用**：把现代 JS / TS / JSX 语法降级转换成兼容代码 + 模块转换 + **自带代码压缩**（同时干了 Babel + Terser 的活）。
* ⚠️ **注意**：SWC 只管“翻译”不管“类型检查”（就像它直接把 TS 的 `: string` 擦掉，不会帮你报类型错误）。

---

### 2. 拆解基础代码里的配置项

```javascript
swc.transform(file, {
    filename: 'input.js', // 1. 给这段代码字符串起个“假名字”
    sourceMaps: true,     // 2. 是否生成“代码地图”
    isModule: false,      // 3. 当成普通脚本还是模块来解析
    jsc: {                // 4. JavaScript Compiler（核心编译配置大管家）
        parser: {         // 5. 解析器：决定“怎么看懂”你的源码
            syntax: 'ecmascript'
        },
        transform: {}     // 6. 转换器：决定“怎么改造”源码（如 JSX、装饰器）
    }
}).then(output => {
    console.log(output.code); // 编译后的新代码
    console.log(output.map);  // 生成的 Source Map 地图（用于浏览器调试定位报错）
})
```

### 逐个白话解释：
1. **`filename`**：只是给已经读进来的代码字符串贴个文件名标签（**不是**让 SWC 去硬盘找这个文件）。作用是：报错时方便提示哪行出错，以及生成 Source Map 时记录原文件名。
2. **`sourceMaps`**：是否开启调试地图。设为 `true`，`output.map` 才会有内容，方便浏览器把编译后的代码报错位置映射回你原来的源码行号。
3. **`isModule`**：告诉 SWC 这段代码是不是 ES 模块（有没有 `import` / `export`）。
   * `false`：普通脚本模式（遇到 `import` 会报错）。
   * `true`：ES 模块模式。
   * `'unknown'`：让 SWC 自己扫一眼代码自动判断（实战推荐）。
4. **`jsc`**：**JS Compiler** 的缩写，SWC 最核心的配置全塞在它里面。
5. **`jsc.parser`**：对应编译第一步（源码 ➔ AST 树），告诉 SWC 你的源码是用啥语法写的。
6. **`jsc.transform`**：对应编译第二步（改造 AST 树），配置 React JSX、装饰器等特殊语法怎么转。

---

### 3. 实战高频常用配置清单（查表用）

平时写项目（或者配 `.swcrc` 文件）最常往配置里加的就是下面这几块：

#### ① 支持 TypeScript / JSX / 装饰器（在 `jsc.parser` 里配）
```javascript
jsc: {
    parser: {
        syntax: 'typescript', // 'ecmascript'（默认，普通JS） | 'typescript'（TS文件）
        jsx: true,            // 如果 syntax 是 ecmascript 且写了 JSX，开这个
        tsx: true,            // 如果 syntax 是 typescript 且写了 JSX，开这个
        decorators: true      // 是否允许 @装饰器 语法（比如写 NestJS 时需要）
    }
}
```

#### ② 指定降级到哪个 JS 版本（`jsc.target`）
```javascript
jsc: {
    // 默认其实是 'es5'（会把箭头函数、const/let 全转成老式 function 和 var）
    // 常用值：'es5' | 'es2015' (即ES6) | 'es2020' | 'es2022'
    target: 'es2015'
}
```
> 💡 **高阶替代方案 `env`**：如果你不想写死 `es5`，想跟 Babel 的 `@babel/preset-env` 一样**“按浏览器版本自动降级 + 自动打补丁（Polyfill）”**，可以在最外层配 `env`（注意：`env` 和 `jsc.target` 不能同时写）：
> ```javascript
> env: {
>     targets: 'Chrome >= 79' // 或者写 { chrome: '79' }
> }
> ```

#### ③ React JSX 转换（在 `jsc.transform` 里配）
```javascript
jsc: {
    transform: {
        react: {
            // 'automatic'：React 17+ 新写法，自动引入 jsx 运行时，不用每个文件手写 import React
            // 'classic'：老写法，会转成 React.createElement(...)
            runtime: 'automatic'
        }
    }
}
```

#### ④ 指定输出什么模块化语法（最外层 `module`）
比如你源码写了 `import`，想编译给老版 Node.js 用（转成 `require`）：
```javascript
module: {
    // 'es6'（保留 import/export） | 'commonjs'（转成 require/module.exports） | 'umd'
    type: 'commonjs'
}
```

#### ⑤ 一键开启代码压缩混淆（最外层 `minify`）
SWC 的拿手好戏！Babel 做不到压缩，SWC 一行配置搞定：
```javascript
minify: true, // 开启压缩（去空格、换行，缩短变量名，干掉死代码）
```

---

### 4. 终极合体模板（React + TypeScript + 压缩）
把上面的常用配置拼起来，一个现代前端项目的基础 SWC 配置就长这样：

```javascript
swc.transform(file, {
    filename: 'App.tsx',
    sourceMaps: true,
    isModule: true,
    minify: true, // 顺手把代码压缩了
    module: {
        type: 'es6'
    },
    jsc: {
        target: 'es2020', // 降级到 ES2020
        parser: {
            syntax: 'typescript', // 解析 TS
            tsx: true             // 支持 TSX
        },
        transform: {
            react: {
                runtime: 'automatic' 
            }
        }
    }
})
```

### `jsc.transform`：特殊语法与框架专项改造

> **核心定位**：`parser` 只负责“**认得**”特殊语法（不报语法错）；`transform` 才负责真正把这些特殊语法或框架黑魔法“**改造**”成普通 JS 代码。

#### 1. React 自动 JSX 转换（`react.runtime`）
* **痛点**：在老模式（`classic`）下，直接写 `let title = <h1>标题</h1>` 会被编译成 `React.createElement(...)`，如果不显式在文件顶部写 `import React from 'react'` 就会报错。
* **解决**：设置 `runtime: 'automatic'`（React 17+），让 SWC **自动**在文件顶部引入 JSX 编译函数（`_jsx`），以后写组件再也不用每页手写 `import React` 了。

#### 2. React 开发热更新（`react.refresh`）
* 同样写在 `transform.react` 下，开发环境中框架通常会加上 `refresh: true`。
* **作用**：开启 React 热更新（Fast Refresh）。写页面改了个按钮颜色保存后，浏览器不用整个刷新，局部就能瞬间变过来。

```javascript
jsc: {
    transform: {
        react: {
            runtime: 'automatic', // React 17+ 自动 JSX 转换
            refresh: true         // 开启开发环境热更新
        }
    }
}
```

#### 3. 装饰器语法改造（`legacyDecorator` / `decoratorMetadata`）
* **场景**：写 **NestJS**（很火的 TS 后端框架）时，代码里到处都是 `@Controller()`、`@Inject()` 这种 `@` 开头的“装饰器”语法。
* **两步配合**：
  1. **第一步（`parser`）**：开启 `decorators: true`，让 SWC 认识 `@` 不报错。
  2. **第二步（`transform`）**：开启 `legacyDecorator: true` 和 `decoratorMetadata: true`，SWC 才会真正把这些 `@` 语法改造成 Node.js 能跑通的普通函数和反射代码。

```javascript
jsc: {
    parser: {
        syntax: 'typescript',
        decorators: true          // 1. 先让 SWC 认得 @
    },
    transform: {
        legacyDecorator: true,    // 2. 改造装饰器语法
        decoratorMetadata: true   // 3. 保留类型反射元数据（NestJS 必备）
    }
}
```

#### 4. 编译期全局变量替换（`optimizer.globals`）
* **场景**：在代码里写了全局调试开关，例如：`if (__DEBUG__) { console.log('调试中') }`。
* **作用**：在 `transform.optimizer.globals.vars` 里配好把 `__DEBUG__` 替换成 `'false'`，SWC 打包时就会强行把代码里的 `__DEBUG__` 变成 `false`（配合 `minify` 压缩还能把整个 `if` 死代码直接删干净）——干的就是 Webpack 里 **`DefinePlugin`** 插件的活！

```javascript
jsc: {
    transform: {
        optimizer: {
            globals: {
                vars: {
                    __DEBUG__: 'false' // 编译期把 __DEBUG__ 替换成 false
                }
            }
        }
    }
}
```
## 原理篇

## HOOKS

## 组件篇
