import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'

// add icons what you will need
const safelist = [
  'i-ri-home-line',
]

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({
  // site config see site.config.ts
 markdown: {
    breaks: true // 自动软换行
  },
  theme: 'yun',

  themeConfig: {
    banner: {
      enable: true,
      title: '哈喽哈喽',
    },

    pages: [
      {
        name: '日记',
        url: '/links/',
        icon: 'i-ri-book-2-line',
        color: 'dodgerblue',
      },
      // {
      //   name: '备忘录',
      //   url: '/girls/',
      //   icon: 'i-ri-women-line',
      //   color: 'hotpink',
      // },
    ],

    footer: {
      since: 2016,
      beian: {
        enable: true,
        icp: '苏ICP备17038157号',
      },
    },
  },

  unocss: { safelist },
})
