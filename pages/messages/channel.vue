<template>
    <div class="Messages" :class="{ 'is-conversation': $route.query.channelId }">
        <div class="Messages_list shadow">
            <template v-if="isLoading">
                <placeholder class="+mt-10" :ratio="30" v-for="i in 10" :key="i" />
            </template>
            <template v-else>
                <div class="+mt-5 p-10 text-center">
                    <button-base icon-before="plus" @click="isNew = true">Nouvelle conversation</button-base>
                </div>
                
                <nuxt-link v-for="channel in channels" :to="{ query: { channelId: channel._id } }" :class="{ 'is-current': $route.query.channelId && $route.query.channelId == channel._id }" class="+mt-5 Messages_channel" :key="channel._id">
                    <div class="mr-10">
                        <user-icon v-bind="$getUser(channel.users.filter(u => u != user._id)[0])" :modifiers="['m']" :no-link="true" />
                    </div>

                    <div class="ml-3">
                        <div class="ft-title-2xs ellipsis-1 ellipsis-break">
                            {{ $pluralize(channel.users.filter(u => u != user._id).map(u => $getUser(u).name)) }}
                        </div>
                        <div class="ft-s color-ft-weak ellipsis-1 ellipsis-break" v-if="getLastMessage(channel._id)">
                            <fa icon="far fa-check" v-if="getLastMessage(channel._id).owner == user._id" />

                            {{ getLastMessage(channel._id).content }}
                        </div>
                    </div>
                </nuxt-link>
            </template>
        </div>

        <div class="Messages_content">
            <messages-channel :id="$route.query.channelId" v-if="$route.query.channelId" />
        </div>

        <popin :is-active="isNew" :modifiers="['s', 'no-overflow']" @close="isNew = false">
            <template slot="content">
                <form @submit.prevent="onSubmit" class="Messages_form">
                    <div class="p-15 bg-bg-strong mb-15">
                        <input-user-select :items="friends" placeholder="À qui veux-tu écrire ?" v-model="formData.users" />
                    </div>

                    <input-area class="fx-grow ph-15" placeholder="Que veux-tu dire ?" v-model="formData.content" v-show="formData.users.length > 0" />

                    <div class="ph-15 pb-15 text-right">
                        <button-base :modifiers="['cosmoz']" icon-after="paper-plane-top" :disabled="formData.users.length <= 0 || !formData.content" :loading="isNewLoading">
                            Envoyer
                        </button-base>
                    </div>
                </form>
            </template>
        </popin>
    </div>
</template>

<script>
import io from 'socket.io-client'
const socket = io(process.env.NUXT_ENV_API_URL)

export default {
    name: 'MessagesIndex',
    layout: 'app',
    transition (to, from) {
        if (to.name.includes('channel')) {
            return { name: 'slide-in', mode: 'in-out' }
        } else if (from) {
            return { name: 'slide-out', mode: 'in-out' }
        }
    },
    beforeMount () {
        socket.on('new-message', (message) => {
            this.$store.commit('messages/updateOne', message)
        })

        socket.on('new-channel', (channel) => {
            this.$store.commit('channel/updateOne', channel)
        })
    },
    async fetch () {
        this.isLoading = true

        await this.$store.dispatch('channel/fetch', {
            query: { users: this.user._id }
        })

        await this.$store.dispatch('messages/fetch', {
            query: {channel: { $in : this.channels.map(c => c._id) } }
        })
        
        await this.$store.dispatch('user/softFetch', [
            ...this.user.friends,
            ...this.channels.reduce((t, c) => [...t, ...c.users.reduce(((ut, u) => [ ...ut, u]), [])], [])
        ])

        this.isLoading = false
    },
    data: () => ({
        isLoading: false,
        isNew: false,
        isNewLoading: false,
        formData: {
            users: [],
            content: ''
        }
    }),
    computed: {
        friends () {
            return this.$store.getters['user/find']({
                _id: { $in: this.user.friends }
            })
        },
        channels () {
            return this.$store.getters['channel/find']({
                users: { $contains: this.user._id }
            })
        }
    },
    methods: {
        getLastMessage (_id) {
            return this.$store.getters['messages/findOne']({
                channel: _id,
                sort: { createdAt: 'asc' }
            })
        },
        async onSubmit () {
            this.isNewLoading = true

            const response = await this.$store.dispatch('channel/create', {
                users: [ this.user._id, ...this.formData.users ],
                content: this.formData.content
            })

            if (response.status != 1) {
                
            } else {
                this.$router.push({ query: { channelId: response.data.channel._id }})
                this.isNew = false
            }

            this.isNewLoading = false
        }
    }
}
</script>

<style lang="scss" scoped>
.Messages {
    display: flex;
    overflow: hidden;
    height: calc(100vh - var(--app-height) - var(--header-height));
}

.Messages_list {
    background-color: var(--color-bg-weak);
    width: 275px;
    flex-shrink: 0;
    padding: 10px;
    overflow: auto;
    @include hide-scrollbars;
}

.Messages_channel {
    display: flex;
    align-items: center;
    padding: 10px;
    min-height: 60px;
    border-radius: 4px;

    &.is-current {
        background-color: var(--color-cosmoz);
        
        &:hover {
            background-color: var(--color-cosmoz);
        }
    }

    &:hover {
        background-color: var(--color-bg-xweak);
    }
}

.Messages_content {
    flex-grow: 1;
}

.Messages_form {
    display: flex;
    flex-direction: column;
    height: 100%;
}

@include breakpoint-s {

    .Messages {
        display: block;
        height: auto;
    }
    
    .Messages_content {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
        width: 100%;
        height: 100%;
        background-color: var(--color-bg);
        transition: all 300ms ease;
        transform: translateX(100%);
        box-shadow: 0 0 0 999px color-opacity('bg-xstrong', -100%);
    }

    .Messages_list {
        min-height: calc(100vh - var(--app-height));
        overflow: visible;
        width: auto;
        background-color: var(--color-bg);
    }

    .Messages.is-conversation {
        
        .Messages_content {
            transform: translateX(0);
            box-shadow: 0 0 0 999px color-opacity('bg-xstrong', 0%);
        }
    }
}

</style>