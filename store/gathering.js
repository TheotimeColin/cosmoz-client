import storeUtils from '@/utils/store'
import moment from 'moment-timezone'
moment.tz.setDefault('Europe/Paris')

export default {
    namespaced: true,
    state: () => ({
        items: {}
    }),
    mutations: {
        updateOne (state, value) {
            state.items = storeUtils.updateOne(state, value)
        },
        deleteOne (state, id) {
            state.items = storeUtils.deleteOne(state, id)
        },
        softRefresh (state, values) {
            state.items = storeUtils.softRefresh(state, values)
        },
        refresh (state, values) {
            state.items = storeUtils.refresh(values)
        }
    },
    actions: { 
        async fetch ({ state, commit }, params = {}) {
            try {
                const response = await this.$axios.$get(storeUtils.getQuery('/entities', {
                    ...params.query, type: 'gathering',
                }), { cancelToken: params.cancelToken ? params.cancelToken.token : undefined })

                if (params.refresh !== false) commit('refresh', response.data)

                return response.data
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async softFetch ({ state, dispatch, commit }, items) {
            return await storeUtils.softFetch(items, { state, dispatch, commit })
        },
        async get ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$get(storeUtils.getQuery('/entities', {
                    ...params.query, type: 'gathering'
                }))

                commit('updateOne', Array.isArray(response.data) ? response.data[0] : response.data)

                return response.data
            } catch (e) {
                console.error(e)
                return null
            }
        },
        async create ({ commit }, params = {}) {
            try {
                const response = await this.$axios.$post('/entities', {
                    ...params, type: 'gathering'
                })
                
                if (response.status == 0) throw Error(response.errors[0])

                commit('updateOne', response.data)
                
                return response
            } catch (e) {
                return storeUtils.handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async delete ({ commit }, _id) {
            try {
                const response = await this.$axios.$delete('/entities', {
                    params: { _id, type: 'gathering' }
                })

                commit('utils/addFlash', {
                    type: response.status == 1 ? 'success' : 'error'
                }, { root: true })
                
                if (response.status == 0) throw Error(response.errors[0])
                
                commit('deleteOne', _id)
                
                return response
            } catch (e) {
                return storeUtils.handleErrors(e, commit, `Une erreur est survenue`)
            }
        },
        async updateBookStatus ({ commit }, params) {
            try {
                const response = await this.$axios.$post('/gathering/book', params)
                
                if (response.status == 0) throw Error(response.errors[0])

                commit('updateOne', response.data)
                
                return response
            } catch (e) {
                return storeUtils.handleErrors(e, commit, `Une erreur est survenue`)
            }
        }
    },
    getters: {
        items: (state) => {
            return Object.values(state.items).map(item => {
                let thumbnail = ''
                let hero = ''

                if (item.cover) {
                    if (item.cover.medias.find(m => m.size == 's')) thumbnail = item.cover.medias.find(m => m.size == 's').src
                    
                    if (item.cover.medias.find(m => m.size == 'm')) hero = item.cover.medias.find(m => m.size == 'm').src
                }

                return {
                    ...item,
                    thumbnail,
                    isFull: !item.max || item.users.filter(u => u.status == 'attending' || u.status.status == 'confirmed').length >= item.max,
                    isPast: moment(item.date).isBefore(moment()),
                    display: moment(item.date).isBefore(moment()),
                    hero,
                    users: item.users.map(user => {
                        if (user.picture) {
                            if (user.picture.medias.find(m => m.size == 's')) user.profileSmall = user.picture.medias.find(m => m.size == 's').src
                            
                            if (user.picture.medias.find(m => m.size == 'm')) user.profileLarge = user.picture.medias.find(m => m.size == 'm').src
                        }

                        return user
                    })
                }
            })
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
        findOne: (state, getters, root) => (search, raw = false) => {
            let items = raw ? Object.values({ ...state.items }) : getters.items

            let result = storeUtils.searchItems(items, search, root.auth.user)
            return result[0] ? result[0] : null
            
            return items.find(item => item[Object.keys(search)[0]] == Object.values(search)[0])
        }
    }
}