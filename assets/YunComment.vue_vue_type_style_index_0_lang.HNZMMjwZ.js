import{G as A,m as S,k as M}from"./app.Bt1tSK70.js";import{i as f,a as v}from"./index.C5okkQwF.js";import"./chunks/dayjs.CCYrSalk.js";import{f as d,N as i,M as w,O as n,P as c,S as u,u as B,aj as E,ak as L,r as g,a8 as N,y as m,X as y,V as x,a2 as O,a3 as _,a0 as P,a1 as W,F as j,$ as z,L as D,c as R,R as p,U as T}from"./framework.DBZiiW_D.js";const U=d({__name:"YunArtalk",setup(r){return f(v)||(void 0)(),(a,t)=>{const s=w("ArtalkClient");return n(),i(s)}}}),F=d({__name:"YunTwikoo",setup(r){return f(v)||(void 0)(),(a,t)=>(n(),c("div",null,t[0]||(t[0]=[u("div",{id:"tcomment",w:"full"},null,-1)])))}}),I=d({__name:"YunWaline",setup(r){if(f(v))throw new Error("Please install valaxy-addon-waline");const a=(void 0)();return(t,s)=>{const e=w("WalineClient");return n(),i(e,{w:"full",options:B(a).options||{serverURL:""}},null,8,["options"])}}}),G={"case-capital":"","op-90":""},X={class:"shadow-lg select-options absolute translate-y-1 left-0 top-full w-full bg-$va-c-bg-light overflow-hidden rounded-1"},q=["onClick"],H=d({__name:"YunSelect",props:E({options:{}},{modelValue:{},modelModifiers:{}}),emits:["update:modelValue"],setup(r){const a=L(r,"modelValue"),t=g(!1);A("click",()=>{t.value=!1});function s(e){e.preventDefault(),e.stopImmediatePropagation(),e.stopPropagation(),t.value=!t.value}return(e,o)=>(n(),c("div",{class:"relative h-8 w-30 text-$va-c-text-2 z-$yun-z-select",onMousedown:o[0]||(o[0]=N(()=>{},["stop"]))},[u("button",{class:y(["flex h-full w-full px-2 items-center justify-between rounded transition",t.value?"border-$va-c-primary":""]),border:"~ gray op-30",onClick:s},[u("span",G,x(a.value),1),o[1]||(o[1]=u("div",{"inline-flex":"","i-ri-arrow-down-s-line":""},null,-1))],2),m(O,{persisted:""},{default:_(()=>[P(u("ul",X,[(n(!0),c(j,null,z(e.options,l=>(n(),c("li",{key:l,class:y(["cursor-pointer list-none px-2 hover:bg-$va-c-primary-light hover:text-white case-capital",{"bg-$va-c-primary text-white":a.value===l}]),onClick:k=>a.value=l},x(l),11,q))),128))],512),[[W,t.value]])]),_:1})],32))}}),J=D(H,[["__scopeId","data-v-63887b80"]]),K={key:0,class:"flex justify-end w-full mb-2"},ne=d({__name:"YunComment",setup(r){const a=S(),t=["valaxy-addon-waline","valaxy-addon-twikoo","valaxy-addon-artalk"],s=R(()=>t.filter(o=>a.value.addons[o]).map(o=>o.split("-")[2])),e=g(s.value[0]);return(o,l)=>{const k=J,C=I,h=F,$=U,b=w("ClientOnly"),V=M;return n(),i(V,{w:"full",p:"4",class:"comment yun-comment sm:p-6 lg:px-12 xl:px-16"},{default:_(()=>[m(b,null,{default:_(()=>[s.value.length>1?(n(),c("div",K,[m(k,{modelValue:e.value,"onUpdate:modelValue":l[0]||(l[0]=Y=>e.value=Y),options:s.value},null,8,["modelValue","options"])])):p("v-if",!0),e.value==="waline"?(n(),i(C,{key:1})):p("v-if",!0),e.value==="twikoo"?(n(),i(h,{key:2})):p("v-if",!0),e.value==="artalk"?(n(),i($,{key:3})):p("v-if",!0),T(o.$slots,"default")]),_:3})]),_:3})}}});export{ne as _};
