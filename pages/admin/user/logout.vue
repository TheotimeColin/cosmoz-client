<template>
    
</template>

<script>
export default {
    async mounted () {
        await this.$auth.logout()

        window.location = this.$config.baseUrl
    }
}
</script>