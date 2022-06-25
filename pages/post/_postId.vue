<template>
    <div class="Page">
        <div class="Page_wrapper Page_wrapper--feed Wrapper Wrapper--xs">
            <content-post v-bind="status" :no-link="true" :max-comments="99"  v-if="status"/>
        </div>
    </div>
</template>

<script>
export default {
    layout: 'app',
    transition (to, from) {
        if (to.name.includes('postId')) {
            return { name: 'slide-in', mode: 'in-out' }
        } else if (from) {
            return { name: 'slide-out', mode: 'in-out' }
        }
    },
    async fetch () {
        await this.$store.dispatch('status/get', this.$route.params.postId)
    },
    data: () => ({
        isLoading: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        status () {
            return this.$store.getters['status/findOne']({
                _id: this.$route.params.postId
            })
        }
    }
}
</script>

<style lang="scss" scoped>
    .Page {
        background-color: var(--color-bg);
    }
</style>
