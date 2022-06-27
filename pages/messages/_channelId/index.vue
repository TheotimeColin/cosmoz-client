<template>
    <div class="Channel">
        <div class="Channel_content">
            <messages-item
                :author="$getUser(message.owner)"
                class="+mt-10"
                v-for="message in messages"
                :items="[
                    message
                ]"
                :key="message._id"
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
        if (this.$route.params.channelId) {
            await this.$store.dispatch('channel/fetch', {
                query: { _id: this.$route.params.channelId }
            })

            await this.$store.dispatch('messages/fetch', {
                query: { channel: this.$route.params.channelId }
            })
        }
    },
    beforeMount () {
        socket.on('new-message', (message) => {
            // this.$store.messages.commit('updateOne', message)
        })
    },
    computed: {
        user () { return this.$store.getters['user/self'] },
        channel () {
            if (!this.$route.params.channelId) return null

            return this.$store.getters['channel/findOne']({
                _id: this.$route.params.channelId
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
    },
    data: () => ({
        formData: {
            content: ''
        }
    }),
    methods: {
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

<style lang="scss">
.Channel {
    display: flex;
    height: calc(100vh - var(--app-height) - var(--header-height) - var(--sticky-height));
    flex-direction: column;
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
</style>