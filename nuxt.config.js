require('dotenv').config()
import redirectSSL from 'redirect-ssl'
import sitemap from './router/sitemap.js'

export default {
    head: {
        title: `Cosmoz, rencontres hors-ligne en groupe sur Paris.`,
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: 'Fais des rencontres amicales ou amoureuses sur Paris en participant à nos expériences insolites dans nos lieux partenaires. Groupes mixtes, seulement entre filles ou entre LGBTQ : découvre la rencontre sans applis.' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }
        ],
        script: [
            { src: 'sib.js', type: 'text/javascript', async: true },
            { src: 'https://accounts.google.com/gsi/client', async: true, defer: true }
        ]
    },
    
    css: [
        '@fortawesome/fontawesome-svg-core/styles.css',
        '@/assets/scss/global.scss'
    ],

    styleResources: {
        scss: [
            '@/assets/scss/base/config.scss',
            '@/assets/scss/base/variables.scss',
            '@/assets/scss/base/mixins.scss',
        ]
    },

    plugins: [
        { src: '@/plugins/base.js' }
    ],

    components: {
        dirs: [
            '~/components',
            '~/components/partials',
            '~/components/base',
            '~/components/forms',
            '~/components/interactive'
        ]
    },         

    buildModules: [
        '@nuxtjs/moment',
        '@nuxtjs/pwa',
        [ '@nuxtjs/router', {
            path: 'router',
            fileName: 'index.js',
            keepDefaultRouter: true,
        } ]
    ],

    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/gtm',
        'cookie-universal-nuxt',
        'nuxt-i18n',
        '@nuxtjs/auth-next',
        '@nuxtjs/moment',
        '@nuxtjs/style-resources',
        '@nuxtjs/sitemap',
        [ '@nuxtjs/recaptcha', {
            hideBadge: true,
            version: 3,
            siteKey: process.env.RECAPTCHA
        } ],
        ['nuxt-stripe-module', {
            publishableKey: process.env.STRIPE_PUBLIC,
        }],
    ],

    sitemap: sitemap,

    loading: {
        color: '#471ffe',
        height: '3px'
    },
    
    pwa: {
        meta: {
            title: 'Cosmoz',
            author: 'Théotime Colin',
        },
        manifest: {
            name: 'Cosmoz',
            short_name: 'Cosmoz',
            background_color: '#1d1b27',
            theme_color: '#1d1b27',
            lang: 'fr',
            display: 'standalone',
            start_url: '/feed'
        },
        workbox: {
            runtimeCaching: [ {
                urlPattern: 'https://fonts.googleapis.com/.*',
                handler: 'cacheFirst',
                method: 'GET',
                strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
            } ]
        }   
    },

    moment: {
        defaultLocale: 'fr',
        timezone: true,
        defaultTimezone: 'Europe/Paris',
        locales: ['fr']
    },

    publicRuntimeConfig: {
        baseDomain: process.env.BASE_DOMAIN,
        socialDomain: process.env.SOCIAL_DOMAIN,

        socialUrl: process.env.SOCIAL_URL,
        baseUrl: process.env.BASE_URL,
        appUrl: process.env.APP_URL,
        adminUrl: process.env.ADMIN_URL,
        blogUrl: process.env.BLOG_URL,
        dashboardUrl: process.env.DASHBOARD_URL,

        PEXELS: process.env.PEXELS,
        gtm: {
            id: process.env.GTM_ID
        },
        recaptcha: {
            siteKey: process.env.RECAPTCHA
        }
    },

    gtm: {
        id: process.env.GTM_ID,
        enabled: process.env.NODE_ENV == 'PRODUCTION',
        // debug: process.env.NODE_ENV != 'PRODUCTION',
        pageTracking: true,
        respectDoNotTrack: false
    },

    i18n: {
        locales: [
            { code: 'fr', iso: 'fr-FR', file: 'fr.js' }
        ],
        langDir: '@/translations/',
        defaultLocale: 'fr',
        lazy: true
    },

    serverMiddleware: [
        { path: '/api', handler: '~/api' },
        redirectSSL.create({ enabled: process.env.NODE_ENV == 'PRODUCTION' })
    ],

    server: {},

    auth: {
        cookie: {
          options: {
            domain: '.' + process.env.BASE_DOMAIN
          }
        },
        redirect: {
            logout: false,
            login: '/compte/login',
            home: false,
            callback: false
        },
        strategies: {
            local: {
                endpoints: {
                    login: { url: process.env.NUXT_ENV_API_URL + '/user', method: 'post', propertyName: 'token' },
                    logout: { url: process.env.NUXT_ENV_API_URL + '/user/logout', method: 'post' },
                    user: { url: process.env.NUXT_ENV_API_URL + '/user', method: 'get', propertyName: 'user' }
                }
            }
        }
    },

    build: {
        extend (config) {
            config.module.rules.push({
                test: /\.svg.html$/,
                loader: 'raw-loader'
            })
        },
        babel: {
            presets(env, [preset, options]) {
                return [ ["@babel/preset-env", {}] ]
            },
            plugins: [
                [
                    "@babel/plugin-transform-runtime", { regenerator: true }
                ]
            ]
        }      
    },
    
    axios: {
        baseURL: process.env.NUXT_ENV_API_URL
    },

    router: {
        linkActiveClass: 'is-active',
        linkExactActiveClass: 'is-active-exact'
    }
}
