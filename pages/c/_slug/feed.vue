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

        await this.$store.dispatch('gathering/fetch', {
            query: { constellation: this.$constellation._id, status: 'active' }
        })

        await this.$store.dispatch('user/softFetch', this.$constellation.members)

        this.isLoading = false
    },
    data: () => ({
        isLoading: false,
        showFull: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        admins () {
            return this.$store.getters['user/find']({
                _id: { $in: [ ...this.$constellation.admins, ...this.$constellation.organizers ] }
            })
        },
        users () {
            return this.$store.getters['user/find']({
                _id: { $in: this.$constellation.members }
            })
        },
        gatherings () {
            return this.$store.getters['gathering/find']({
                status: 'active',
                constellation: this.$constellation._id
            })
        },
        isFollowed () {
            return this.user ? this.user.followed.includes(this.$constellation._id) : false
        },
        pastEvents () {
            return this.gatherings.filter(g => g.isPast)
        },
        upcomingEvents () {
            return this.gatherings.filter(g => !g.isPast)
        }
    },
    head () {
        if (!this.$constellation) return {}
        
        let meta = {
            title: `${this.$constellation.name} organise ses événements sur Cosmoz ${this.$t('meta.append')}`,
        }

        return meta
    }
}
</script>