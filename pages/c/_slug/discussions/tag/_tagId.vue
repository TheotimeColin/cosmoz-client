<template>
    <div class="page" v-if="$constellation">
        <div class="Page_wrapper Page_wrapper--feed Wrapper Wrapper--xs">
            <content-feed
                :constellation="$constellation._id"
                :disable-create="!$isConsteMember"
                :enable-tags="true"
                :tag="$route.params.tagId.toLowerCase()"
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
        await this.$preFetch()
    }
}
</script>