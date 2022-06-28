<template>
    <div class="Channel">
        <div class="Channel_head" v-if="authorData">
            <div class="Channel_iconContainer">
                <button-base :modifiers="['round', 'transparent', 'ripples']" icon-before="arrow-left" @click="$router.replace({ query: {} })" />
            </div>

            <user-icon v-bind="authorData" class="mr-10" />

            <h1 class="ft-title-xs line-1 ellipsis-1 ellipsis-break">
                {{ authorData.name }}
            </h1>
        </div>
        
        <div class="o-hidden p-relative fx-grow" v-if="isLoading">
            <placeholder :modifiers="['full']" />
        </div>
        <template v-else>
            <transition-group tag="div" class="Channel_content">
                <messages-item
                    class="+mb-20"
                    v-for="group in messagesOrdered"
                    :is-group="channel.users.length > 2"
                    :items="group[1]"
                    :test="group[0]"
                    :key="group[0]"
                />
            </transition-group>

            <transition name="fade">
                <div v-show="isWriting" class="Channel_indicator" key="writing">{{ isWriting }}</div>
            </transition>

            <form @submit.prevent="onSubmit" class="Channel_editor">
                <input-base type="text" :modifiers="['no-label']" placeholder="Envoyer un message..." v-model="formData.content" />

                <button-base class="ml-10" type="submit" icon-before="paper-plane" :loading="isSubmitLoading" :modifiers="['s', 'round', 'cosmoz']" />
            </form>
        </template>
    </div>
</template>

<script>
import debounce from 'lodash.debounce'

export default {
    name: 'ChannelId',
    props: {
        id: { type: String }
    },
    data: () => ({
        isLoading: true,
        isInit: false,
        isSubmitLoading: false,
        formData: {
            content: ''
        }
    }),
    watch: {
        id: {
            immediate: true,
            async handler (v) {
                if (v) {
                    await this.fetchData(v)
                    
                    if (this.channel && this.channel.unread) {
                        this.$store.dispatch('channel/update', {
                            _id: this.channel._id,
                            params: { $addToSet: { readBy: this.user._id } }
                        })
                    }

                    this.formData = {
                        content: ''
                    }

                    this.$store.commit('channel/setCurrent', v)
                }
            }
        },
        ['formData.content'] (v) {
            if (v) this.$store.commit('channel/setCurrentWriting', true)

            this.stopWriting()
        }
    },
    beforeDestroy () {
        this.$store.commit('channel/setCurrent', null)
    },
    computed: {
        authorData () {
            if (!this.channel) return null

            let users = this.channel.users.filter(u => u != this.user._id).map(u => this.$getUser(u)).filter(u => u)

            if (users.length == 1) {
                return users[0]
            } else if (users.length > 0) {
                return {
                    ...users[0],
                    name: this.$pluralize(users.map(u => u.name))
                }
            }
            
            return null
        },
        channel () {
            if (!this.id) return null

            return this.$store.getters['channel/findOne']({
                _id: this.id
            })
        },
        messages () {
            if (!this.channel) return []

            return this.$store.getters['messages/find']({
                channel: this.channel._id,
                sort: {
                    createdAt: 'desc'
                }
            })
        },
        messagesOrdered () {
            let id = 9999999
            let lastUser = null
            let lastDate = null

            let result = this.messages.reduce((obj, item) => {
                let newObj = { ...obj }
                let diff = lastDate ? this.$moment.duration(this.$moment(lastDate).diff(this.$moment(item.createdAt))) : null

                if (lastUser != item.owner) id -= 1
                if (diff && diff.asHours() > 1) id -= 1

                lastDate = item.createdAt
                lastUser = item.owner
                
                if (!newObj[id]) {
                    newObj[id] = [ item ]
                } else {
                    newObj[id].push(item)
                }

                return newObj
            }, {})

            result = Object.entries(result).sort((a, b) => a[0] - b[0])

            return result
        },
        isWriting () {
            let users = this.$store.state.channel.isWriting.filter(i => i.channel == this.id && i.user != this.user._id)

            if (users.length > 0) {
                return this.$pluralize(users.map(u => this.$getUser(u.user).name)) + (users.length > 1 ? ` sont en train d'écrire...` : ` est en train d'écrire...`)
            }

            return false
        }
    },
    methods: {
        stopWriting: debounce(function () {
            this.$store.commit('channel/setCurrentWriting', false)
        }, 3000),
        fetchData () {
            return new Promise(async resolve => {
                this.isLoading = true

                await this.$store.dispatch('channel/softFetch', [ this.id ])

                if (this.channel) {
                    await this.$store.dispatch('messages/fetch', {
                        softRefresh: true,
                        query: { channel: this.channel._id }
                    })

                    await this.$store.dispatch('user/softFetch', this.messages.map(m => m.owner))
                }

                this.isInit = true
                
                setTimeout(() => this.isLoading = false, 100)

                resolve(true)
            })
        },
        async onSubmit () {
            this.isSubmitLoading = true

            this.$store.commit('channel/setCurrentWriting', false)

            const response = await this.$store.dispatch('messages/create', {
                ...this.formData,
                channel: this.channel._id
            })

            this.formData = {
                content: ''
            }

            this.isSubmitLoading = false
        }
    }
}
</script>

<style lang="scss" scoped>
.Channel {
    display: flex;
    height: calc(100vh - var(--app-height) - var(--header-height) - var(--sticky-height));
    flex-direction: column;
}

.Channel_head {
    height: var(--app-height);
    flex-shrink: 0;
    display: none;
    align-items: center;
    background-color: var(--color-bg-strong);
    @include shadow;
}

.Channel_content {
    display: flex;
    flex-direction: column-reverse;
    overflow: auto;
    flex-grow: 1;
    padding: 20px;
}

.Channel_editor {
    display: flex;
    align-items: center;
    padding: 10px 10px;
    background-color: var(--color-bg-weak);
}

.Channel_indicator {
    padding: 10px;
    background-color: var(--color-bg-strong);
    transition: all 150ms ease;
}

@include breakpoint-s {
    .Channel_head {
        display: flex;
    }

    .Channel {
        display: flex;
        height: 100vh;
        flex-direction: column;
    }
}
</style>