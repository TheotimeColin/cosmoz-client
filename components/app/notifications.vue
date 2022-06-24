<template>
    <popin :is-active="isActive" :modifiers="['panel', 'panel-bottom', 's']" :title="'Notifications'" query="notifications" @close="() => $store.commit('page/toggleNotifs', false)">
        <template slot="headerRight">
            <button-base :modifiers="['s']" @click="readAll">Tout marquer comme lu</button-base>
        </template>
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
    methods: {
        readAll () {
            if (this.$refs.manager) this.$refs.manager.readAll()
        }
    }
}
</script>

<style lang="scss" scoped>
</style>