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
            subtitle: this.$route.params.id ? this.$route.params.id : 'général', fa: 'hashtag'
        })

        let meta = {
            
        }

        return meta
    }
}
</script>