<template>
    <popin :is-active="isActive" query="messages" :modifiers="['panel', 'm']" @close="onClose()">
        <div class="PopinBase_header" slot="header">
            <div class="PopinBase_headerLeft">
                <button-base :modifiers="['round', 'transparent', 'ripples']" icon-before="arrow-left" @click="() => {channelId ? channelId = false : onClose() }" />

                <template v-if="channel && authorData">
                    <user-icon v-bind="authorData" class="mr-10" />

                    <p class="ft-title-xs line-1 ellipsis-1 ellipsis-break">
                        {{ authorData.name }}
                    </p>
                </template>
                <template v-else>
                    <p class="ft-title-xs line-1 ellipsis-1 ellipsis-break">
                        Messagerie
                    </p>
                </template>
            </div>
        </div>
        <template slot="content" slot-scope="{ isPopinVisible }">
            <div class="Messages" :class="{ 'is-conversation': channelId || isNewLoading }">
                <div class="Messages_container">
                    <div class="Messages_list shadow">
                        <template v-if="isLoading">
                            <placeholder class="+mt-10" :ratio="30" v-for="i in 10" :key="i" />
                        </template>
                        <template v-else>
                            <slider-block class="+mt-15 pv-15 bg-bg-strong" :slots="inactiveFriends.map(u => u._id)" :offset="15" :offset-v="0" :margin="10" v-if="inactiveFriends.length > 0">
                                <div v-for="friend in friends" :slot="friend._id" :key="friend._id">
                                    <user-icon
                                        v-bind="friend"
                                        @click.native="createChannel(friend._id)"
                                        :modifiers="['l']"
                                        :no-link="true"
                                    />
                                </div>
                            </slider-block>

                            <div class="p-10 +mt-15">
                                <p class="ft-title-xs mb-15 ph-5" v-if="inactiveFriends.length > 0">Conversations</p>
                                
                                <div v-for="channel in channels" :class="{ 'is-current': channelId == channel._id, 'is-unread': channel.unread }" class="+mt-5 Messages_channel" @click="channelId = channel._id" :key="channel._id">
                                    <div class="mr-10">
                                        <user-icon v-bind="$getUser(channel.users.filter(u => u != user._id)[0])" :modifiers="['m']" :no-link="true" />
                                    </div>

                                    <div class="ml-3">
                                        <div class="ft-title-2xs ellipsis-1 ellipsis-break">
                                            {{ $pluralize(channel.users.filter(u => u != user._id).map(u => $getUser(u) ? $getUser(u).name : null)) }}
                                        </div>
                                        <div class="Messages_channelPreview ft-s ellipsis-1 ellipsis-break" v-if="channel.lastMessage">
                                            <fa icon="far fa-check" v-if="channel.lastMessage.owner == user._id" />

                                            {{ channel.lastMessage.content }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>

                    <div class="Messages_content" v-if="channelId">
                        <messages-channel :id="channelId"/>
                    </div>
                </div>
            </div>
        </template>
    </popin>
</template>

<script>
export default {
    name: 'MessagesPopin',
    data: () => ({
        isLoading: false,
        isWriting: false,
        isNew: false,
        isNewLoading: false,
        channelId: null,
        formData: {
            users: [],
            content: ''
        }
    }),
    computed: {
        inactiveFriends () {
            return this.friends.filter(f => !this.channels.find(c => c.users.length == 2 && c.users.includes(f._id)))
        },
        friends () {
            return this.$store.getters['user/find']({
                _id: { $in: this.user.friends }
            })
        },
        channels () {
            return this.$store.getters['channel/find']({
                users: { $contains: this.user._id },
                sort: { lastUpdate: 'asc' }
            })
        },
        isActive () {
            return this.$store.state.page.popins.messages
        },
        channel () {
            if (!this.channelId) return null

            return this.$store.getters['channel/findOne']({
                _id: this.channelId
            })
        },
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
    },
    watch: {
        isActive (v) {
            if (!v) this.channelId = ''
        }
    },
    methods: {
        onClose () {
            this.$store.commit('page/popin', { messages: null })
        },
        async createChannel (_id) {
            this.isNewLoading = true
            let exists = false

            exists = this.channels.find(c => {
                return c.users.length == 2 && c.users.includes(_id)
            })
            
            
            if (!exists) {
                const response = await this.$store.dispatch('channel/create', {
                    users: [ this.user._id, _id ]
                })

                if (response.status == 1) exists = response.data.channel
            }

            if (exists) this.channelId = exists._id

            this.isNewLoading = false
        }
    }
}
</script>

<style lang="scss" scoped>
.Messages {
    overflow: hidden;
    display: flex;
    height: 100%;

    &.is-conversation {

        .Messages_list {
            overflow: hidden;
        }

        .Messages_container {
            transform: translateX(-50%);
        }
    }
}

.Messages_container {
    width: 200%;
    height: 100%;
    flex-shrink: 0;
    display: flex;
    transition: all 200ms ease-out;
}

.Messages_list {
    flex-grow: 0;
    flex-shrink: 0;
    overflow: auto;
    width: 50%;
    @include mini-scrollbar;
}

.Messages_channel {
    display: flex;
    align-items: center;
    padding: 10px;
    min-height: 60px;
    border-radius: 4px;
    cursor: pointer;

    &.is-current {
        background-color: var(--color-cosmoz);
        
        &:hover {
            background-color: var(--color-cosmoz);
        }
    }

    &.is-unread {
        font: var(--ft-s-medium);
        color: var(--color-ft-light);
    }

    &:hover {
        background-color: var(--color-bg-xweak);
    }
}

.Messages_content {
    flex-grow: 0;
    flex-shrink: 0;
    width: 50%
}

.Messages_channel {
    color: var(--color-ft-weak);
}

.Messages_form {
    display: flex;
    flex-direction: column;
    height: 100%;
}

// @include breakpoint-s {

//     .Messages {
//         display: block;
//         height: auto;
//         height: 100%;
//     }
    
//     .Messages_content {
//         display: block;
//         position: fixed;
//         top: 0;
//         left: 0;
//         z-index: 100;
//         width: 100%;
//         height: 100%;
//         background-color: var(--color-bg);
//         transition: all 300ms ease;
//         transform: translateX(100%);
//         box-shadow: 0 0 0 999px color-opacity('bg-xstrong', -100%);
//     }

//     .Messages_list {
//         height: 100%;
//         overflow: visible;
//         width: auto;
//         background-color: var(--color-bg);
//     }

//     .Messages.is-conversation {
        
//         .Messages_content {
//             transform: translateX(0);
//             box-shadow: 0 0 0 999px color-opacity('bg-xstrong', 0%);
//         }
//     }
// }

</style>