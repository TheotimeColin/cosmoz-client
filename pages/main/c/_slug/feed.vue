<template>
    <div class="">
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
}
</script>