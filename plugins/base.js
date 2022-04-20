import Vue from 'vue'
import moment from 'moment'
import { ButtonBase, PopinBase } from 'instant-coffee-core'
import Validators from '@/utils/validators'
import { NuxtHammer } from 'nuxt-hammer'
moment.locale('fr')

Vue.mixin({
    filters: {
        specials: (value) => {
            if (!value || process.server) return ''

            let characters = ['?', '!', ':']
            
            characters.forEach(char => {
                value = value.replaceAll(' ' + char, ' ' + char)
            })

            return value
        },
        striptags: (value) => {
            return value ? value.replace(/(<([^>]+)>)/gi, '') : ''
        },
        verticalize: (value) => {
            if (!value || process.server) return ''

            let characters = [
                { char: ',', replace: ',<br>' }
            ]
            
            characters.forEach(char => {
                value = value.replaceAll(char.char, char.replace)
            })

            return value
        },
        round: (value, decimals = 2) => {
            return (Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals)
        },
        toHTML: (value) => {
            if (!value || process.server) return ''

            let regexes = [
                { regex: /\--(.*?)\--/g, wrap: '<span class="text-through">*</span>' },
                { regex: /\*(.*?)\*/g, wrap: '<span class="secondary">*</span>' }
            ]

            regexes.forEach(regex => {
                let matched = regex.regex.exec(value)

                if (matched) {
                    let wrap = regex.wrap.replace('*', matched[1])
                    value = value.replace(matched[0], wrap)
                }
            })

            let characters = ['?', '!', ':']
            
            characters.forEach(char => {
                value = value.replaceAll(' ' + char, ' ' + char)
            })

            return value
        },
        fixed: (value) => {
            return ('0' + value).slice(-2)
        }
    },
    data: () => ({
        $categories: {
            news: { color: 'gum', fa: 'fa-thumbtack', slug: 'actualite' },
            seo: { color: 'pond', fa: 'fa-search', slug: 'referencement-seo' },
            identity: { color: 'ice', fa: 'fa-store', slug: 'identite-de-marque' },
            value: { color: 'duck', fa: 'fa-gem', slug: 'valeur-percue' }
        },
    }),
    computed: {
        $baseUrl () { return  this.$config.baseUrl },
        $dashboardUrl () { return this.$config.dashboardUrl },
        $blogUrl () { return this.$config.blogUrl },
        $shopUrl () { return this.$config.shopUrl }
    },
    methods: {
        $randomBetween: (min, max) => {
            return Math.floor(Math.random() * (max - min + 1) + min)
        },
        $copy (text) {
            if (!navigator.clipboard) {
                this.$store.commit('flashes/add', {
                    title: `Copié dans le presse-papier (local)`,
                    text: `"${text}"`,
                    type: 'success'
                })

                return 
            }

            navigator.clipboard.writeText(text).then(() => {
                this.$store.commit('flashes/add', {
                    title: `Copié dans le presse-papier`,
                    text: `"${text}"`,
                    type: 'success'
                })
            })
        },
        $tOpen (content, e, params = {}) {
            this.$store.commit('tooltips/open', {
                content, element: e.target, ...params
            })
        },
        $tClose () {
            this.$store.commit('tooltips/close')
        },
        $theme (value) {
            let theme = { color: 'pond', fa: 'fa-heart' }

            theme = this.$data.$categories[value]

            return theme
        },
        $slugToCategory (slug) {
            let result = ''

            Object.keys(this.$data.$categories).forEach(key => {
                if (this.$data.$categories[key].slug == slug) result = key
            })

            return result
        },  
        $absolute (value) {
            return process.env.BASE_URL + value
        },
        $authorData () {
            return {
                "@type": "Person",
                name: "Théotime Colin",
                brand: {
                    "@type": "Organization",
                    name: "L'Arrière Boutique",
                    email: "bonjour@gatherings.fr",
                }
            }
        },
        $round (value, decimals = 2) {
            return (Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals)
        },
        $shuffle (array) {
            let currentIndex = array.length,  randomIndex;
            
            while (currentIndex != 0) {
            
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;

                [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
            }
            
            return array
        },
        $onPopinOpen () {
            this.$store.commit('page/toggleOverflow', false)
        },
        $onPopinClose () {
            this.$store.commit('page/toggleOverflow', true)
        },
        $validator (type) {
            return Validators[type]
        },
        $smallerThan (v) {
            return this.$store.getters['page/smallerThan'](v)
        },
        $biggerThan (v) {
            console.log('bigger')
            console.log(this.$store.getters['page/biggerThan'](v))
            return this.$store.getters['page/biggerThan'](v)
        }
    }
})

Vue.component('ButtonBase', ButtonBase)
Vue.component('PopinBase', PopinBase)
Vue.use(NuxtHammer)