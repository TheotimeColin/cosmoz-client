<template>
    <div class="page">
        <div class="Page_wrapper Page_wrapper--feed Wrapper Wrapper--xs">
            
        </div>
    </div>
</template>

<script>
import ConstellationMixin from '@/mixins/constellation'

export default {
    mixins: [ ConstellationMixin ],
    layout: 'app',
    async fetch () {
        await this.$preFetch()
    },
    data: () => ({
        isLoading: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] }
    },
    head () {
        let meta = {
            
        }

        return meta
    }
}
</script>