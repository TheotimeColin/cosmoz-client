import storeUtils from '@/utils/store'
import { parseUser } from '@/utils/parsers'

export default {
    namespaced: true,
    state: () => ({
        guestId: null,
        hasSubscription: false,
        subscription: null,
        items: {}
    }),
    mutations: {
        updateOne (state, value) {
            state.items = storeUtils.updateOne(state, value)
        },
        deleteOne (state, id) {
            state.items = storeUtils.deleteOne(state, id)
        },
        refresh (state, values) {
            state.items = storeUtils.refresh(values)
        },
        update (state, user) {
            if (user && user.role == 'guest') state.guestId = user._id
        },
        setSubscription (state, data) {
            state.subscription = data
            state.hasSubscription = state.subscription ? true : false
        }
    },
    actions: {
        async logOut ({ state }) {
            try {
                await this.$auth.logout()

                if (response.data.status != 1) throw Error('error')
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async fetchOne ({ commit }, id) {
            try {
                const response = await this.$axios.$get(storeUtils.getQuery('/entities', {
                    id, type: 'user'
                }))
                
                let user = response.data ? parseUser(response.data) : null

                return user
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async fetch ({ state, commit }, params = {}) {
            try {
                const response = await this.$axios.$get(storeUtils.getQuery('/entities', {
                    ...params.query, type: 'user',
                }), { cancelToken: params.cancelToken ? params.cancelToken.token : undefined })

                if (params.refresh !== false) commit('refresh', response.data)

                return response.data
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async update ({ rootState }, params) {
            try {
                const response = await this.$axios.$post('/entities', {
                    _id: rootState.auth.user._id,
                    params,
                    type: 'user'
                })
                
                if (response.errors.length > 0) throw Error(response.errors[0])

                this.$auth.fetchUser()
    
                return response
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async updateSettings ({ rootState }, params) {
            try {
                let settings = rootState.auth.user.settings ? rootState.auth.user.settings : {}

                settings = { ...settings, ...params }

                const response = await this.$axios.$post('/entities', {
                    _id: rootState.auth.user._id, params: {
                        settings
                    }, type: 'user'
                })
                
                if (response.errors.length > 0) throw Error(response.errors[0])

                this.$auth.fetchUser()
    
                return response
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async updateNotification ({ rootState }, notification) {
            try {
                let notifications = rootState.auth.user.notifications.slice()

                if (!notification.status) notification.status == 'read'

                let found = false
                notifications.map(n => {
                    let existing = n.id == notification.id && n.type == notification.type
                    if (existing) found = true

                    return { ...n, ...(existing ? notification : {}) }
                })

                if (!found) notifications = [ ...notifications, notification ]

                const response = await this.$axios.$post('/entities', {
                    _id: rootState.auth.user._id, params: {
                        notifications
                    }, type: 'user'
                })
                
                if (response.errors.length > 0) throw Error(response.errors[0])

                this.$auth.fetchUser()
    
                return response
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async requestPassword ({ commit }, email) {
            try {
                const response = await this.$axios.$post('/user/reset', {
                    email
                })

                if (response.errors.length > 0) throw Error(response.errors[0])

                return response
            } catch (e) {
                return storeUtils.handleErrors(e, commit, `Échec de l'envoi du mot de passe`, this)
            }
        },
        async resetPassword ({ commit }, data) {
            try {
                const response = await this.$axios.$post('/user/reset/confirm', {
                    ...data
                })

                if (response.errors.length > 0) throw Error(response.errors[0])

                return response
            } catch (e) {
                return storeUtils.handleErrors(e, commit, `Échec de la modification du mot de passe`, this)
            }
        }
    },
    getters: {
        self: (state, getters, root) => {
            return parseUser(root.auth.user)
        },
        items: (state) => {
            return Object.values(state.items).map(item => parseUser(item))
        },
        find: (state, getters) => (search, raw = false) => {
            let items = raw ? Object.values(state.items) : getters.items

            if (search) {
                Object.keys(search).forEach(key => {
                    if (search[key] == '$notNull') {
                        items = items.filter(item => item[key])
                    } else if (search[key] == '$notSelf') {
                        items = items.filter(item => getters.self && item[key] != getters.self._id)
                    } else if (key == '$in') {
                        items = items.filter(item => search[key].includes(item._id))
                    } else {
                        items = items.filter(item => item[key] == search[key])
                    }
                })
            }

            return items.sort((a, b) => a.createdAt && b.createdAt ? b.createdAt.valueOf() - a.createdAt.valueOf() : false)
        },
        groupBy: (state, getters) => (property) => {
            let items = getters.items

            items = items.reduce((obj, item) => {
                let newObj = { ...obj }

                if (!newObj[item[property]]) {
                    newObj[item[property]] = [ item ]
                } else {
                    newObj[item[property]].push(item)
                }

                return newObj
            }, {})

            return items
        },
        findOne: (state, getters) => (search, raw = false) => {
            let items = raw ? Object.values(state.items) : getters.items
            return items.find(item => item[Object.keys(search)[0]] == Object.values(search)[0])
        }
    }
}