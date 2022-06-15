<template>
    <popin :is-active="isActive" :modifiers="['panel', 's']" :title="'Notifications'" query="notifications" @close="() => $store.commit('page/toggleNotifs', false)">
        <div slot="content">
            <notification-manager ref="manager" />
        </div>
    </popin>
</template>

<script>
export default {
    name: 'Notifications',
    data: () => ({
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        isActive () { return this.$store.state.page.isNotifications }
    },
    watch: {
        isActive (v) {
            if (v && this.$refs.manager) {
                this.$refs.manager.fetch()
                this.$refs.manager.readAll()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
</style>