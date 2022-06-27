<template>
    <div class="Messages" v-if="user">
        <div class="Messages_list">
            <nuxt-link v-for="channel in channels" :to="localePath({ name: 'messages-channelId', params: { channelId: channel._id }})" class="+mt-5 Messages_channel" :key="channel._id">
                <div class="mr-10">
                    <user-icon v-bind="$getUser(channel.users.filter(u => u != user._id)[0])" :no-link="true" />
                </div>

                <div class="ft-title-2xs">
                    {{ $getUser(channel.users.filter(u => u != user._id)[0]).name }}
                </div>
            </nuxt-link>
        </div>

        <div class="Messages_content">
            <transition name="fade">
                <nuxt-child />
            </transition>
        </div>

        <!-- <div class="block-r">
            Nouvelle conversation 
            <div v-for="friend in friends" class="+mt-5 c-pointer" :key="friend._id">
                <user-icon v-bind="friend" :no-link="true" :display-name="true" @click.native="() => createChannel([ friend._id ])" />    
            </div>
        </div> -->
    </div>
</template>

<script>
export default {
    name: 'MessagesIndex',
    layout: 'app',
    async fetch () {
        await this.$store.dispatch('user/softFetch', this.user.friends)

        await this.$store.dispatch('channel/fetch', {
            query: { users: this.user._id }
        })
    },
    computed: {
        user () { return this.$store.getters['user/self'] },
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
        async createChannel (users) {

            this.$store.dispatch('channel/create', {
                users: [ ...users, this.user._id ]
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.Messages {
    display: flex;
    overflow: hidden;
    height: calc(100% - var(--app-height) - var(--header-height));
}

.Messages_list {
    background-color: var(--color-bg-weak);
    width: 275px;
    flex-shrink: 0;
    padding: 10px;
}

.Messages_channel {
    display: flex;
    align-items: center;
    padding: 8px;
    min-height: 60px;
    border-radius: 10px;

    &:hover {
        background-color: var(--color-bg-xweak);
    }
}

.Messages_content {
    flex-grow: 1;
}

.page-enter-active,
.page-leave-active {
  transition: none;
}

.page-enter {
  opacity: 1;
  transform: none;
}

.page-leave-to {
  opacity: 1;
  transform: none;
}
</style>