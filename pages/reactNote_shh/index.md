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

## 状态、表单与 Hooks

## React Router
