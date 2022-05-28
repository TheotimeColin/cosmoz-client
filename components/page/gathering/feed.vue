<template>
    <div>
        <content-feed
            placeholder="Une question ? Une information à donner ?"
            read="user"
            :max="3"
            :gathering="gathering._id"
        />
    </div>
</template>

<script>
export default {
    name: 'PageGatheringFeed',
    props: {
        gathering: { type: Object, default: () => {} }
    },
    computed: {
        user () { return this.$store.getters['user/self'] },
    }
}
</script>

<style>

</style>