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
      {
        name: '日记',
        url: '/links/',
        icon: 'i-ri-book-2-line',
        color: 'dodgerblue',
      },
      {
        name: '简历',
        url: '/resume/',
        icon: 'i-ri-book-2-line', 
        color: 'hotpink',
      }
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
