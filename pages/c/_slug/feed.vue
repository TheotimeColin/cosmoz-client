<template>
    <div class="page" v-if="!isLoading">
        <div class="Page_wrapper Page_wrapper--feed Wrapper Wrapper--xs">
            <content-feed
                :constellation="$constellation._id"
                :disable-create="!$isConsteMember"
                read="g-member"
            />
        </div>
    </div>
</template>

<script>
import ConstellationMixin from '@/mixins/constellation'
import PermissionsMixin from '@/mixins/permissions'

export default {
    mixins: [ ConstellationMixin, PermissionsMixin ],
    layout: 'app',
    async fetch () {
        this.isLoading = true

        await this.$preFetch()

        this.isLoading = false
    },
    data: () => ({
        isLoading: false,
        showFull: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] }
    }
}
</script>