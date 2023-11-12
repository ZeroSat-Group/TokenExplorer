import stylelint from 'vite-plugin-stylelint'

export default defineNuxtConfig({
  app: {
    head: {
      title: 'BrcCash',
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: './favicon-32x32.png'
        }
      ]
    }
  },
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/devtools',
    '@nuxtjs/i18n',
    '@pinia-plugin-persistedstate/nuxt'
  ],
  css: ['@/assets/styles/basic.scss', 'vue-final-modal/style.css'],
  i18n: {
    langDir: 'locales',
    lazy: true,
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        file: 'en.json',
        name: 'English'
      },
      {
        code: 'zh',
        iso: 'zh-CN',
        file: 'zh.json',
        name: '中文'
      }
    ]
    // useI18n: {
    //   legacy: false,
    //   locale: 'en'
    // }
  },
  components: [
    '~/components',
    '~/blocks',
    '~/components/dialogs',
    '~/components/icons'
  ],
  plugins: [
    '~/plugins/vue-final-modal.ts',
    '~/plugins/api/index.ts',
    '~/plugins/naive-ui.ts',
    '~/plugins/directive/index.ts',
    '~/plugins/unisat.client.ts',
    '~/plugins/gosat.client.ts'
  ],
  pinia: {
    autoImports: [['defineStore', 'definePiniaStore']]
  },
  vite: {
    optimizeDeps: {
      include:
        process.env.NODE_ENV === 'development'
          ? ['naive-ui', 'vueuc', 'date-fns-tz/esm/formatInTimeZone']
          : []
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/main.scss" as *;'
        }
      }
    },
    plugins: [
      stylelint({
        fix: true
      })
    ]
  },
  runtimeConfig: {
    public: {
      dev: process.env.NUXT_PUBLIC_TEST_ENV,
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL,
      orccashUrl: process.env.NUXT_PUBLIC_ORCCASH_URL,
      orc20Url: process.env.NUXT_PUBLIC_ORC20_URL
    }
  },
  devtools: {
    enabled: true,
    vscode: {}
  },
  build: {
    transpile:
      process.env.NODE_ENV === 'production'
        ? [
            'naive-ui',
            'vueuc',
            '@css-render/vue3-ssr',
            '@juggle/resize-observer'
          ]
        : ['@juggle/resize-observer']
  }
})
