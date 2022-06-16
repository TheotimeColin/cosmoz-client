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
        softRefresh (state, values) {
            state.items = storeUtils.softRefresh(state, values)
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
                
                return null
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async fetchOne ({ commit }, id) {
            try {
                const response = await this.$axios.$get(storeUtils.getQuery('/entities/get', {
                    id, type: 'user'
                }))

                let user = null

                if (response.data) {
                    commit('updateOne', response.data)
                    user =  parseUser(response.data)
                }
                
                return user
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async fetch ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$post('/entities/get', {
                    ...params.query, type: 'user',
                }, { cancelToken: params.cancelToken ? params.cancelToken.token : undefined })

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

                await this.$auth.fetchUser()
    
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

                await this.$auth.fetchUser()
    
                return response
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async updateTidbit ({ rootState }, params) {
            try {
                let tidbits = rootState.auth.user.tidbits ? rootState.auth.user.tidbits : []

                if (tidbits.find(t => t.type == params.type)) {
                    tidbits = tidbits.map(tid => ({
                        ...tid,
                        ...(tid.type == params.type ? params : {})
                    }))
                } else {
                    tidbits = [ ...tidbits, params ]
                }

                const response = await this.$axios.$post('/entities', {
                    _id: rootState.auth.user._id, params: {
                        tidbits
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

                await this.$auth.fetchUser()
    
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
        },
        async softFetch ({ state, dispatch, commit }, items) {
            return parseUser(await storeUtils.softFetch(items, { state, dispatch, commit }))
        },
        async mapUsers ({ state, dispatch }, params) {
            return new Promise(async (resolve, reject) => {
                try {
                    let result = []
                    let users = state.items

                    for (let item of params.items) {
                        if (!users[params.property ? item[params.property] : item]) {
                            console.log('====== FETCH USERS =======')

                            let newUsers = await dispatch('fetch')
                            if (newUsers) users = storeUtils.refresh(newUsers)
                        }

                        let user = users[params.property ? item[params.property] : item]
                        
                        result = [
                            ...result,
                            { ...item, owner: user ? parseUser(user) : null }
                        ]
                    }

                    resolve(result)
                } catch (e) {
                    console.error(e)
                    reject([])
                }
            })
        },
        async unmatch ({ dispatch }, target) {
            try {
                const response = await this.$axios.$post('/affinities/remove-match', { _id: target._id })
                
                if (response.errors.length > 0) throw Error(response.errors[0])

                await dispatch('fetchOne', target.id)
                await this.$auth.fetchUser()
                
                return true
            } catch (e) {
                console.error(e)
                return false
            }
        },
        async createRequest ({ dispatch }, target) {
            try {
                const response = await this.$axios.$post('/affinities/create-request', { _id: target._id })
                
                if (response.errors.length > 0) throw Error(response.errors[0])

                await dispatch('fetchOne', target.id)
                await this.$auth.fetchUser()
                
                return response.data
            } catch (e) {
                console.error(e)
                return false
            }
        },
        async cancelRequest ({ dispatch }, target) {
            try {
                const response = await this.$axios.$post('/affinities/cancel-request', { _id: target._id })
                
                if (response.errors.length > 0) throw Error(response.errors[0])

                await dispatch('fetchOne', target.id)
                await this.$auth.fetchUser()
                
                return true
            } catch (e) {
                console.error(e)
                return false
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
        find: (state, getters, root) => (search, raw = false) => {
            let items = raw ? Object.values(state.items) : getters.items
            return search ? storeUtils.searchItems(items, search, root.auth.user) : items
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