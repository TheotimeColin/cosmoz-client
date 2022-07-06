import Vue from 'vue'
import moment from 'moment-timezone'
moment.tz.setDefault('Europe/Paris')
import { NuxtHammer } from 'nuxt-hammer'
import CONSTANTS from '@/utils/constants'
import striptags from 'striptags'

import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { far } from '@fortawesome/pro-regular-svg-icons'

import { faHeart, faLock, faBell, faPaperPlane, faCompass, faStar, faCalendar, faHandWave, faHome, faCalendarStar, faComments, faMessageLines, faCrown, faSparkles, faFaceGrinSquintTears, faUserHelmetSafety, faBurgerCheese, faCat, faTree, faBasketball, faUsers, faBars } from '@fortawesome/pro-solid-svg-icons'

import { faMapMarkerAlt, faCalendarLines, faHeart as falHeart, faComments as falComments } from '@fortawesome/pro-light-svg-icons'

import { faDiscord, faInstagram, faTwitter, faWhatsapp } from '@fortawesome/free-brands-svg-icons'

config.autoAddCss = false
library.add(far, faHeart, faDiscord, faInstagram, faTwitter, faWhatsapp, faLock, faBell, faPaperPlane, faCompass, faStar, faCalendar, faHandWave, faHome, faCalendarStar, faComments, faMessageLines, faCrown, faSparkles, faMapMarkerAlt, faCalendarLines, falHeart, falComments, faFaceGrinSquintTears, faUserHelmetSafety, faBurgerCheese, faCat, faTree, faBasketball, faUsers, faBars)

Vue.component('fa', FontAwesomeIcon)

moment.locale('fr')

Vue.mixin({
    filters: {
        specials: (value) => {
            if (!value || process.server) return value

            let characters = ['?', '!', ':']
            
            characters.forEach(char => {
                value = value.replace(`/ ${char}/g`, ' ' + char);
                // value = value.replaceAll(' ' + char, ' ' + char)
            })

            return value
        },
        striptags: (value) => {
            return value ? striptags(value) : ''
        },
        verticalize: (value) => {
            if (!value || process.server) return ''

            let done = false

            let characters = [
                { char: '&', replace: '<br>&' },
                { char: ',', replace: ',<br>' }
            ]
            
            characters.forEach(char => {
                if (done) return
                 
                if (value.includes(char.char)) done = true
                // value = value.replaceAll(char.char, char.replace)
                value = value.replace(`/${char.char}/g`, char.replace);
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
                { regex: /\*(.*?)\*/g, wrap: '<b>*</b>' }
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
                value = value.replace(`/ ${char}/g`, ' ' + char);
                // value = value.toString().replaceAll(' ' + char, ' ' + char)
            })

            return value
        },
        fixed: (value) => {
            return ('0' + value).slice(-2)
        },
    },
    data: () => ({
        isMounted: false,
        $categories: {
            news: { color: 'gum', fa: 'fa-thumbtack', slug: 'actualite' },
            seo: { color: 'pond', fa: 'fa-search', slug: 'referencement-seo' },
            identity: { color: 'ice', fa: 'fa-store', slug: 'identite-de-marque' },
            value: { color: 'duck', fa: 'fa-gem', slug: 'valeur-percue' }
        },
    }),
    mounted () {
        setTimeout(() => this.isMounted = true, 200)
    },
    computed: {
        user () { return this.$store.getters['user/self'] },
        $baseUrl () { return  this.$config.baseUrl },
        $dashboardUrl () { return this.$config.dashboardUrl },
        $blogUrl () { return this.$config.blogUrl },
        $shopUrl () { return this.$config.shopUrl },
        $bg () { return CONSTANTS.bg },
        $const () { return CONSTANTS },
        $windowSize () { return this.$store.state.page.breakpoint },
        $isIntroduced () {
            if (!this.user || !this.$route.params.slug) return false

            let constellation = this.$store.getters['constellation/findOne']({ slug: this.$route.params.slug })

            if (!constellation) return false
            if (constellation.type == 'group') return true

            return this.$store.getters['user/notif']('introduced', constellation._id)
        }
    },
    methods: {
        $randomBetween: (min, max) => {
            return Math.floor(Math.random() * (max - min + 1) + min)
        },
        $date (date, short) {
            let day = this.$moment(date)

            if (this.$moment().format('YYYYMMD') == day.format('YYYYMMD')) {
                return `Aujourd'hui`
            } else if (this.$moment().add(1, 'day').format('YYYYMMD') == day.format('YYYYMMD')) {
                return `Demain`
            } else {
                return day.format(short ? 'dddd' : 'dddd D MMMM')
            }
        },
        $random: (array) => {
            return array[Math.floor(Math.random() * (array.length))]
        },
        $copy (text) {
            if (!navigator.clipboard) {
                this.$store.commit('flashes/add', {
                    title: `Copié dans le presse-papier (local)`,
                    text: `"${text}"`,
                    type: 'success'
                })

                console.log('Copié dans le presse-papier ' + text)

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
        $getUser (v) {
            if (this.user && v == this.user._id) return this.user

            let result = this.$store.getters['user/findOne']({ _id: v })
            return result ? result : null
        },
        $tLoad (e, params = {}) {
            this.$store.commit('tooltips/open', {
                element: e.target, params: { load: true }, ...params
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
                    name: "Cosmoz",
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
        $smallerThan (v) {
            return this.$store.getters['page/smallerThan'](v)
        },
        $biggerThan (v) {
            return this.$store.getters['page/biggerThan'](v)
        },
        $randomColor () {
            return ['cream', 'alpine', 'memo', 'ocean', 'tulip'][Math.floor(Math.random() * (5))]
        },
        $groupBy (items, type, params = {}) {
            let result = items.reduce((obj, item) => {
                let newObj = { ...obj }

                if (!newObj[item[type]]) {
                    newObj[item[type]] = [ item ]
                } else {
                    newObj[item[type]].push(item)
                }

                return newObj
            }, {})

            if (params.orderBy) {
                result = Object.entries(result).sort((a, b) => b[1].length - a[1].length)
            }

            return result
        },
        $isFixedPosition(node) {
            while (node && node.nodeName.toLowerCase() !== 'body') {
                if (window.getComputedStyle(node).getPropertyValue('position').toLowerCase() === 'fixed')  {          
                    return true
                }

                if (window.getComputedStyle(node).getPropertyValue('overflow').toLowerCase() === 'auto') {
                    return true
                }
                
                node = node.parentNode
            }

            return false
        },
        $pluralize (users) {
            return this.$tc(`utils.users`, users.length == 1 ? 0 : users.length - 1, {
                users: users.length == 2 ? users.join(' et ') : users.slice(0, 2).join(', '),
                others: users.length - 2
            })
        },
        $ellipsis (str, maxLength) {
            if (str.length > maxLength) {
                return str.slice(0, maxLength - 3) + '...';
            }
            
            return str
        }
    }
})

Vue.use(NuxtHammer)