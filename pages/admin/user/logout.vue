<template>
    
</template>

<script>
export default {
    async mounted () {
        await this.$store.dispatch('user/logOut')
        window.location = this.$config.baseUrl
    }
}
</script>