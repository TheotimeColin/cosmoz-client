<template>
    <div class="Feed">
        <content-editor
            class="Feed_item p-20"
            :placeholder="placeholder"
            @submit="onSubmit"
            ref="editor"
        />

        <content-post
            v-for="status in statuses"
            class="Feed_item"
            v-bind="status"
            @submit="onSubmit"
            :key="status._id"
            ref="posts"
        />
    </div>
</template>

<script>
export default {
    name: 'Feed',
    props: {
        gathering: { type: String },
        placeholder: { type: String }
    },
    async fetch () {
        let query = {}

        if (this.gathering) query.gathering = this.gathering

        await this.$store.dispatch('status/fetch', { query })
    },
    computed: {
        user () { return this.$store.getters['user/self'] },
        statuses () {
            return this.$store.getters['status/find']({
                parent: '$isNull'
            })
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

                if (formData.parent) {
                    let parent = this.$refs.posts.find(p => p._id == formData.parent)

                    if (parent) {
                        parent.pushComment({ ...formData, owner: this.user })
                        parent.reset()
                    }
                }

                this.$refs.editor.reset()
            } catch (e) {
                console.log(e)
            }
        },
        pushStatus (v) {

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