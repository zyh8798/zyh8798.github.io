import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'
/* 
> 也就是说这个https://icones.js.org/上面能看到各个图标库的图标,然后呢直接复制需要遵循Unocss的明明规范使用,然后还要加在safelist里面才走通是吗

● 对，总结得很准确。只补充一点：大部分情况下写在 .vue / .md 模板里的图标 UnoCSS 能自动扫到，不需要加 safelist。只有像
  valaxy.config.ts 这种配置文件里的图标才需要手动加，因为 UnoCSS 扫描不到那里。
*/
// add icons what you will need
const safelist = [
  'i-ri-home-line',
  'i-ri-file-user-line',
  'i-ri-book-open-line',
  'i-ri-quill-pen-line',
]

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({
  // site config see site.config.ts
  devtools: false,
  markdown: {},
  theme: 'yun',

  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
  },

  themeConfig: {
    banner: {
      enable: true,
      title: '相信的心就是你的力量',
    },

    pages: [
      // {
      //   name: '日记',
      //   url: '/links/',
      //   icon: 'i-ri-book-2-line',
      //   color: 'dodgerblue',
      // },
      {
        name: '简历',
        url: '/resume/',
        icon: 'i-ri-file-user-line',
        color: 'hotpink',
      },
      {
        name: 'React 笔记 · 英豪',
        url: '/reactNote_zyh/',
        icon: 'i-ri-book-open-line',
        color: '#3b82f6',
      },
      {
        name: 'React 笔记 · 海浩',
        url: '/reactNote_shh/',
        icon: 'i-ri-quill-pen-line',
        color: '#8b5cf6',
      },
    ],

    footer: {
      since: 2016,
      beian: {
        enable: true,
        icp: '苏ICP备114514号',
      },
    },
  },

  unocss: { safelist },
})
