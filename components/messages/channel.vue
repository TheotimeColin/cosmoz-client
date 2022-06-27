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
        
        <div class="Channel_content">
            <messages-item
                class="+mb-20"
                v-for="group in messagesOrdered"
                :items="group[1]"
                :key="group[0]"
            />
        </div>

        <form @submit.prevent="onSubmit" class="Channel_editor">
            <input-base type="text" :modifiers="['no-label']" placeholder="Envoyer un message..." v-model="formData.content" />

            <button-base class="ml-10" type="submit" icon-before="paper-plane" v :modifiers="['s', 'round', 'cosmoz']" />
        </form>
    </div>
</template>

<script>
import io from 'socket.io-client'
const socket = io(process.env.NUXT_ENV_API_URL)

export default {
    name: 'ChannelId',
    async fetch () {
        if (this.id) {
            await this.fetchData()
        }
    },
    props: {
        id: { type: String }
    },
    beforeMount () {
        socket.on('new-message', (message) => {
            this.$store.commit('messages/updateOne', message)
        })
    },
    watch: {
        ['$route.params.channelId'] (v) {
            this.fetchData()
        }
    },
    computed: {
        authorData () {
            let mainAuthor = this.channel.users.filter(u => u != this.user._id)

            if (mainAuthor[0]) return this.$getUser(mainAuthor[0])

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
                    createdAt: 'asc'
                }
            })
        },
        messagesOrdered () {
            let result = this.messages.reduce((obj, item) => {
                let newObj = { ...obj }
                let type = this.$moment(item.createdAt).format('YYYMMDDH:mm') + item.owner
                
                if (!newObj[type]) {
                    newObj[type] = [ item ]
                } else {
                    newObj[type].unshift(item)
                }

                return newObj
            }, {})

            result = Object.entries(result)

            return result
        }
    },
    data: () => ({
        formData: {
            content: ''
        }
    }),
    methods: {
        fetchData () {
            return new Promise(async resolve => {

                await this.$store.dispatch('channel/softFetch', [ this.id ])

                if (this.channel && this.messages.length <= 0) {
                    await this.$store.dispatch('messages/fetch', {
                        softRefresh: true,
                        query: { channel: this.channel._id }
                    })

                    await this.$store.dispatch('user/softFetch', this.messages.map(m => m.owner))
                }

                this.init = true

                resolve(true)
            })
        },
        async onSubmit () {
            this.isLoading = true

            const response = await this.$store.dispatch('messages/create', {
                ...this.formData,
                channel: this.channel._id
            })
            
            this.formData = {
                content: ''
            }

            this.isLoading = false
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