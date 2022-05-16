<template>
    <div class="Feed">
        <content-editor
            class="Feed_item p-20"
            :placeholder="placeholder"
            @submit="onSubmit"
            v-if="!disableCreate"
            ref="editor"
        />

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

        <div class="text-center mt-20" v-if="displayedStatuses.length < statusesData.length">
            <button-base :modifiers="['light']" @click="page++">Afficher la suite</button-base>
        </div>
        <div class="text-center color-ft-weak mt-20" v-else-if="displayedStatuses/length > 0">
            <p>Fin du fil.</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Feed',
    props: {
        max: { type: Number, default: 5 },
        gathering: { type: String },
        placeholder: { type: String },
        disableInteract: { type: Boolean, default: false },
        disableCreate: { type: Boolean, default: false }
    },
    data: () => ({
        statusesData: [],
        page: 0
    }),
    async fetch () {
        let query = {}

        if (this.gathering) {
            query.gathering = this.gathering
            query.parent = '$null'
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
                if (v) {
                    let statuses = await this.$store.dispatch('user/mapUsers', {
                        items: v, property: 'owner'
                    })

                    this.statusesData = await Promise.all(statuses.map(async s => {
                        let children = await this.$store.dispatch('user/mapUsers', { items: s.children, property: 'owner' })

                        return { ...s, children }
                    }))
                }
            }
        }
    },
    methods: {
        async onSubmit (formData) {
            try {
                const response = await this.$store.dispatch('status/create', {
                    ...formData,
                    gathering: this.gathering
                })
                
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
    border-radius: 5px;
    background-color: var(--color-bg-strong);

    & + & {
        margin-top: 10px;
    }
}
</style>