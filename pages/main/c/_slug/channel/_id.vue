<template>
    <div class="Wrapper Wrapper--xs pv-40">
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

        let meta = {
            
        }

        return meta
    }
}
</script>