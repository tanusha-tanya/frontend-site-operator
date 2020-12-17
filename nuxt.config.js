import colors from 'vuetify/es5/util/colors'

require('dotenv').config()

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'spa',
  layoutTransition: {
    name: 'layout',
    mode: '',
  },
  loading: {
    color: '#00b8d4',
    height: '3px',
  },
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Global CSS
   */
  css: ['assets/animation.scss', 'assets/toastification.scss'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '~/plugins/vue-toastification',
    '~/plugins/vue-slide-up-down',
    '~/plugins/vue-the-mask',
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/dotenv',
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    [
      '@mole-inc/nuxt-validate',
      {
        lang: 'ru',
      },
    ],
  ],
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: `${process.env.API_URL_AUTH_SERVICE}/user/signin`,
            method: 'post',
            propertyName: 'data.token',
          },
          // logout: { url: '/api/auth/logout', method: 'post' },
          user: {
            url: `${process.env.API_URL_AUTH_SERVICE}/user/me`,
            method: 'get',
            propertyName: 'data',
          },
          logout: false,
          // user: false,
        },
        // tokenType: 'bearer',
        // globalToken: true,
        tokenRequired: true,
        autoFetchUser: false,
      },
    },
    redirect: {
      login: '/login',
      logout: '/login',
      callback: '/login',
      home: '/',
    },
    cookie: {
      prefix: 'oper.',
      options: {
        path: '/',
      },
    },
  },
  router: {
    middleware: ['auth'],
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
        light: {
          primary: colors.cyan.darken2,
          accent: colors.cyan.darken3,
          secondary: colors.cyan.darken3,
          info: colors.cyan.lighten1,
          warning: colors.cyan.base,
          error: colors.red.accent4,
          success: colors.cyan.accent4,
        },
      },
    },
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    transpile: ['vee-validate', /^vuetify/, 'vue-toastification'],
  },
}
