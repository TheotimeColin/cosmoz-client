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
        
        <div class="o-hidden p-relative fx-grow" v-if="isLoading && !isInit">
            <placeholder :modifiers="['full']" />
        </div>
        <template v-else>
            <div class="Channel_content">
                <messages-item
                    class="+mb-20"
                    v-for="group in messagesOrdered"
                    :is-group="channel.users.length > 2"
                    :items="group[1]"
                    :key="group[0]"
                />
            </div>

            <form @submit.prevent="onSubmit" class="Channel_editor">
                <input-base type="text" :modifiers="['no-label']" placeholder="Envoyer un message..." v-model="formData.content" />

                <button-base class="ml-10" type="submit" icon-before="paper-plane" :loading="isSubmitLoading" :modifiers="['s', 'round', 'cosmoz']" />
            </form>
        </template>
    </div>
</template>

<script>
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
            handler (v) {
                if (v) this.fetchData(v)
            }
        }
    },
    computed: {
        authorData () {
            if (!this.channel) return null

            let users = this.channel.users.filter(u => u != this.user._id).map(u => this.$getUser(u))

            if (users.length == 1) return users[0]
            
            return {
                ...users[0],
                name: this.$pluralize(users.map(u => u.name))
            }
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
            let id = 0
            let lastUser = null
            let lastDate = null

            let result = this.messages.reduce((obj, item) => {
                let newObj = { ...obj }
                let diff = lastDate ? this.$moment.duration(this.$moment(lastDate).diff(this.$moment(item.createdAt))) : null

                if (lastUser != item.owner) id += 1
                if (diff && diff.asHours() > 1) id += 1

                lastDate = item.createdAt
                lastUser = item.owner
                
                if (!newObj[id]) {
                    newObj[id] = [ item ]
                } else {
                    newObj[id].unshift(item)
                }

                return newObj
            }, {})

            result = Object.entries(result)

            return result
        }
    },
    methods: {
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
                this.isLoading = false

                resolve(true)
            })
        },
        async onSubmit () {
            this.isSubmitLoading = true

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