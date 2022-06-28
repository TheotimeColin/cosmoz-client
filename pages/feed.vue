<template>
    <div class="Page_wrapper Page_wrapper--feed Wrapper Wrapper--xs">
        <block-advice class="mv-20 shadow-s" v-if="!$store.state.auth.user.notifications.find(n => n.type == 'onboarding' && n.id == 'welcomed')" />
    
        <content-feed placeholder="Publier quelque chose..." />
    </div>
</template>

<script>
export default {
    name: 'DashboardIndex',
    middleware: ['loggedUser'],
    layout: 'app',
    async fetch () {
        this.isLoading = true

        await this.$store.dispatch('gathering/fetch', {
            query: { status: 'active' }
        })

        this.isLoading = false
    },
    data: () => ({
        isLoading: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] }
    }
}
</script>