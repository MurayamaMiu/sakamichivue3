import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  bundler: viteBundler(),

  locales: {
    '/': {
      lang: 'ja-JP',
      title: '坂道ウィキ',
      description: '坂道グループのウィキサイト',
      selectLanguageName: '日本語',
    },
    '/zh-CN/': {
      lang: 'zh-CN',
      title: '坂道维基',
      description: '关于坂道组合的维基网站',
      selectLanguageName: '简体中文',
    },
    '/zh-TW/': {
      lang: 'zh-TW',
      title: '坂道維基',
      description: '關於坂道組合的維基網站',
      selectLanguageName: '正體中文',
    },
  },

  theme: defaultTheme({
    logo: 'https://vuejs.press/images/hero.png',

    locales: {
      '/': {
        selectLanguageName: '日本語',
        sidebar: [
          '/',
          {
            text: '櫻坂46',
            link: '/sakurazaka/',
            children: [
              {
                text: 'グループ歴史',
                link: '/sakurazaka/history.md',
              },
              {
                text: 'メンバー',
                link: '/sakurazaka/members.md',
                children: [
                  {
                    text: '守屋麗奈',
                    link: '/sakurazaka/history.md',
                  },
                  {
                    text: '田村保乃',
                    link: '/sakurazaka/members.md',
                  },
                  {
                    text: '村山美羽',
                    link: '/sakurazaka/members.md',
                  },
                  {
                    text: '谷口愛季',
                    link: '/sakurazaka/members.md',
                  },
                  {
                    text: '小田倉麗奈',
                    link: '/sakurazaka/members.md',
                  },
                ],
              },
            ],
          },
          {
            text: '乃木坂46',
            link: '/nogizaka/',
            children: [
              {
                text: 'グループ歴史',
                link: '/nogizaka/history.md',
              },
              {
                text: 'メンバー',
                link: '/nogizaka/members.md',
              },
            ],
          },
          {
            text: '日向坂46',
            link: '/hinatazaka/',
            children: [
              {
                text: 'グループ歴史',
                link: '/hinatazaka/history.md',
              },
              {
                text: 'メンバー',
                link: '/hinatazaka/members.md',
              },
            ],
          },
          {
            text: '欅坂46',
            link: '/keyakizaka/',
            // collapsible:true,
            // collapsed:true,
            children: [
              {
                text: 'グループ歴史',
                link: '/keyakizaka/history.md',
              },
              {
                text: 'メンバー',
                link: '/keyakizaka/members.md',
              },
            ],
          },
        ],
      },
      '/zh-CN/': {
        selectLanguageName: '简体中文',
        sidebar: [
          '/',
          {
            text: '樱坂46',
            link: '/zh-CN/sakurazaka/',
            children: [
              {
                text: '团队历史',
                link: '/zh-CN/sakurazaka/history.md',
              },
              {
                text: '成员',
                link: '/zh-CN/sakurazaka/members.md',
              },
            ],
          },
          {
            text: '乃木坂46',
            link: '/zh-CN/nogizaka/',
            children: [
              {
                text: '团队历史',
                link: '/zh-CN/nogizaka/history.md',
              },
              {
                text: '成员',
                link: '/zh-CN/nogizaka/members.md',
              },
            ],
          },
          {
            text: '日向坂46',
            link: '/zh-CN/hinatazaka/',
            children: [
              {
                text: '团队历史',
                link: '/zh-CN/hinatazaka/history.md',
              },
              {
                text: '成员',
                link: '/zh-CN/hinatazaka/members.md',
              },
            ],
          },
          {
            text: '榉坂46',
            link: '/keyakizaka/',
            children: [
              {
                text: '团队历史',
                link: '/zh-CN/keyakizaka/history.md',
              },
              {
                text: '成员',
                link: '/zh-CN/keyakizaka/members.md',
              },
            ],
          },
        ],
      },
      '/zh-TW/': {
        selectLanguageName: '正體中文',
        sidebar: [
          '/',
          {
            text: '櫻坂46',
            link: '/zh-TW/sakurazaka/',
            children: [
              {
                text: '團隊歷史',
                link: '/zh-TW/sakurazaka/history.md',
              },
              {
                text: '成員',
                link: '/zh-TW/sakurazaka/members.md',
              },
            ],
          },
          {
            text: '乃木坂46',
            link: '/zh-TW/nogizaka/',
            children: [
              {
                text: '團隊歷史',
                link: '/zh-TW/nogizaka/history.md',
              },
              {
                text: '成員',
                link: '/zh-TW/nogizaka/members.md',
              },
            ],
          },
          {
            text: '日向坂46',
            link: '/zh-TW/hinatazaka/',
            children: [
              {
                text: '團隊歷史',
                link: '/zh-TW/hinatazaka/history.md',
              },
              {
                text: '成員',
                link: '/zh-TW/hinatazaka/members.md',
              },
            ],
          },
          {
            text: '欅坂46',
            link: '/keyakizaka/',
            children: [
              {
                text: '團隊歷史',
                link: '/zh-TW/keyakizaka/history.md',
              },
              {
                text: '成員',
                link: '/zh-TW/keyakizaka/members.md',
              },
            ],
          },
        ],
      },
    },
  }),

  // 打包输出目录
  dest: 'public/docs',
  base: '/docs/',
})
