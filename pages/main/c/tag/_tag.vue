<template>
    <div class="p-40">
        <content-feed />
    </div>
</template>

<script>
export default {
    props: {
        orga: { type: Object }
    },
    data: () => ({
        isLoading: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] }
    },
    head () {
        this.$store.commit('page/set', {
            subtitle: this.$route.params.tag ? this.$route.params.tag : 'général', fa: 'hashtag'
        })

        let meta = {
            
        }

        return meta
    },
    beforeDestroy () {
        this.$store.commit('page/set', { subtitle: '' })
    }
}
</script>