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
        statuses () {
            return this.$store.getters['status/find']()
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