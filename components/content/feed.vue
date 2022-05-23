<template>
    <div class="Feed">
        <content-editor
            class="Feed_item p-15 mb-20 br-s bg-bg"
            :placeholder="placeholder"
            :read="read"
            @submit="onSubmit"
            v-if="!disableCreate"
            ref="editor"
        />

        <transition-group name="fade">

            <content-post
                v-for="status in displayedStatuses"
                class="Feed_item"
                v-bind="status"
                @submit="onSubmit"
                :active-gathering="gathering"
                :disableCreate="disableInteract"
                :key="status._id"
                ref="posts"
            />
        </transition-group>

        <div class="Feed_item p-20 bg-bg br-s text-center color-ft-weak" v-if="statusesData.length <= 0 && !isLoading">
            Aucun message sur ce fil.
        </div>

        <div class="text-center mt-20" v-if="displayedStatuses.length < statusesData.length">
            <button-base :modifiers="['light']" @click="page++">Afficher la suite</button-base>
        </div>
        <div class="text-center color-ft-xweak mt-20" v-else-if="displayedStatuses.length > 0">
            <p>Fin du fil.</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Feed',
    props: {
        read: { type: String, default: 'affinity' },
        max: { type: Number, default: 5 },
        gathering: { type: String },
        author: { type: String },
        placeholder: { type: String, default: 'Publier quelque chose...' },
        disableInteract: { type: Boolean, default: false },
        disableCreate: { type: Boolean, default: false }
    },
    data: () => ({
        statusesData: [],
        isLoading: true,
        page: 0
    }),
    async fetch () {
        this.isLoading = true

        let query = { parent: '$null' }

        if (this.gathering) {
            query.gathering = this.gathering
            await this.$store.dispatch('status/fetch', { query })
        } else if (this.author) {
            query.owner = this.author
            query.gathering = '$null'
            await this.$store.dispatch('status/fetch', { query })
        } else {
            await this.$store.dispatch('status/fetchFeed')
        }
    },
    computed: {
        user () { return this.$store.getters['user/self'] },
        statuses () {
            let query = {}
        
            if (this.gathering) query.gathering = this.gathering
            if (this.author) query.owner = this.author

            return this.$store.getters['status/find']({
                ...query
            })
        },
        displayedStatuses () {
            return this.statusesData.slice(0, this.max * (this.page + 1))
        }
    },
    watch: {
        statuses: {
            immediate: true,
            deep: true,
            async handler (v) {
                this.isLoading = true
                

                if (v) {
                    if (this.statusesData.length !== v.length) this.statusesData = []

                    let statuses = await this.$store.dispatch('user/mapUsers', {
                        items: v, property: 'owner'
                    })

                    this.statusesData = await Promise.all(statuses.map(async s => {
                        let children = s.children ? await this.$store.dispatch('user/mapUsers', { items: s.children, property: 'owner' }) : []

                        return { ...s, children }
                    }))

                }

                this.isLoading = false
            }
        }
    },
    methods: {
        async onSubmit (formData) {
            try {
                let data = { ...formData, read: this.read }

                if (this.gathering) {
                    data.gathering = this.gathering
                    data.read = 'public'
                }

                const response = await this.$store.dispatch('status/create', data)
                
                if (response.status == 0) throw Error(response.errors[0])

                if (this.$refs.editor) this.$refs.editor.reset()
                
                if (response.data.parent) { // RESET COMMENT EDITOR
                    let parent = this.$refs.posts.find(p => p._id == response.data.parent._id)

                    if (parent) parent.reset()
                }
            } catch (e) {
                console.log(e)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.Feed_item {

    & + & {
        margin-top: 20px;
    }
}
</style>