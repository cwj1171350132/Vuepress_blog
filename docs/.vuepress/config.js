// const { description } = require('../../package')

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: '前端菜鸟小陈',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: '前端菜鸟小城的博客',

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['link', { rel: 'icon', href: `/logo.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#4987AF' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],

  base:'/Vuepress_blog/',
  theme: 'reco',
  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    // repo: 'cwj1171350132/Vuepress_blog/',
    editLinks: true,
    docsDir: 'docs',
    editLinkText: '编辑此页',
    lastUpdated: false,
    sidebarDepth: 3,
    lastUpdated: '上次更新',
    nav: [
      {
        text: '主页',
        link: '/',
      },
      {
        text: '博客',
        link: '/article/',
        items: [ 
          { text: 'javascript', link: '/article/javascript/koa' },
          { text: 'linux', link: '/article/linux/SetProxy' },
        ]
      },
    ],
    sidebar: [
      {
        title: '引言',
        collapsable: false,
        children: ['/']
      },
      {
        title: 'linux',
        collapsable: false,
        children: [
          '/article/linux/SetProxy',
        ]
      },
      {
        title: 'javascript',
        collapsable: false,
        children: [
          '/article/javascript/koa',
          '/article/javascript/ArrayCopy',
        ]
      },
    ]
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
