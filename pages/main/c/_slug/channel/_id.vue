<template>
    <div class="Page_wrapper Page_wrapper--feed Wrapper Wrapper--xs">
        <content-feed :constellation="constellation._id" read="g-member" />
    </div>
</template>

<script>
export default {
    props: {
        constellation: { type: Object }
    },
    data: () => ({
        isLoading: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] }
    },
    head () {
        this.$emit('page', {
            subtitle: this.$route.params.id ? this.$route.params.id : 'général', fa: 'hashtag'
        })

        this.$store.commit('page/set', {
            subtitle: this.$route.params.id ? this.$route.params.id : 'général', fa: 'hashtag'
        })

        let meta = {
            
        }

        return meta
    }
}
</script>