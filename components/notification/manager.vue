<template>
    <div class="NotifManager">
        <notification-item
            v-for="notif in notifications"
            class="Notif_item"
            v-bind="notif"
            :author="notif.user"
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
        notifications () {
            return this.$store.getters['notification/find']({
                owner: this.user._id,
                sort: { createdAt: 'asc' }
            })
        },
    },
    mounted () {
        // setTimeout(() => this.fetch(), 1000)
        // setInterval(this.fetch, 60000)
    },
    beforeDestroy () {
        window.clearInterval(this.fetch)
    },
    methods: {
        async fetch () {
            await this.$store.dispatch('notification/fetch', {
                owner: this.user._id
            })

            let origins = this.notifications.reduce((origins, n) => [ ...origins, ...n.origins ], [])

            let users = [
                ...this.notifications.map(n => n.user).filter(n => n),
                ...origins.filter(o => o.type == 'user').map(o => o._id)
            ]

            let gatherings = [
                ...this.notifications.map(n => n.gathering).filter(n => n),
                ...origins.filter(o => o.type == 'gathering').map(o => o._id)
            ]

            let statuses = [
                ...this.notifications.map(n => n.status).filter(n => n),
                ...origins.filter(o => o.type == 'status').map(o => o._id)
            ]
            
            let constes = [
                ...this.notifications.map(n => n.constellation).filter(n => n),
                ...origins.filter(o => o.type == 'constellation').map(o => o._id)
            ]

            this.$store.dispatch('user/softFetch', users)
            this.$store.dispatch('gathering/softFetch', gatherings)
            this.$store.dispatch('status/softFetch', statuses)
            this.$store.dispatch('status/softFetch', constes)
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