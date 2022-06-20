<template>
    <div class="NotifManager">
        <notification-item
            v-for="notif in notifications"
            class="Notif_item"
            v-bind="notif"
            :key="notif._id"
        />

        <div class="block-r text-center bg-bg-strong" v-if="notifications.length <= 0">
            Pas encore de notifications.
        </div>
    </div>
</template>

<script>
export default {
    name: 'Notifications',
    data: () => ({
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        notifications () {
            return this.$store.getters['notification/find']({
                owner: this.user._id,
                sort: { createdAt: 'asc' }
            })
        },
    },
    mounted () {
        this.fetch()
    },
    methods: {
        async fetch () {
            await this.$store.dispatch('notification/fetch', {
                owner: this.user._id
            })
        },
        async readAll () {
            this.$store.dispatch('notification/readAll')
        }
    }
}
</script>

<style lang="scss" scoped>
.NotifManager {
    padding: 10px;

    & + & {
        // margin-top: 20px;
    }
}
</style>