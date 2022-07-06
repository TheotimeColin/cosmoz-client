<template>
    <div class="page" v-if="!isLoading">
        <div class="Page_wrapper Page_wrapper--feed Wrapper Wrapper--xs">
            <component
                v-for="feedItem in feed"
                :is="feedItem.type"
                class="+mt-20 +mt-10@s"
                v-bind="feedItem"
                :key="feedItem._id"
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
        await this.$store.dispatch('constellation/fetchFeed', this.$constellation._id)

        this.isLoading = false
    },
    data: () => ({
        isLoading: false,
        showFull: false
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        gatherings () {
            let gatherings = this.$store.getters['gathering/find']({
                constellation: this.$constellation._id,
                isAttending: true,
                status: 'active',
                sort: { date: 'asc' },
                date: { $and: [
                    { $lte: this.$moment().add(10, 'days').toDate() },
                    { $gte: this.$moment().subtract(10, 'days').toDate() },
                ]}
            })

            return gatherings.map(g => ({
                ...g,
                type: g.isPast ? 'content-gathering-end' : 'block-gathering',
                sortDate: g.isPast ? g.date : this.$moment(g.date).subtract(2, 'days').toDate()
            }))
        },
        mainStatus () {
            let statuses = this.$store.getters['status/find']({
                constellation: this.$constellation._id,
                sort: { createdAt: 'asc' },
                createdAt: { $gte: this.$moment().subtract(3, 'days').toDate() }
            })

            if (!statuses || statuses.length <= 0) return null

            let posts = statuses.filter(i => i.content && i.images.length <= 0).slice(0, 3)
            let photos = statuses.filter(i => i.images.length > 0).slice(0, 5)

            return {
                all: [ ...photos.map(s => s._id), ...posts.map(s => s._id) ],
                statuses: { photos, posts },
                type: 'content-conste-tag',
                sortDate: this.$moment(statuses[0].createdAt).add(2, 'minutes').toDate()
            }
        },
        tagStatuses () {
            let statuses = this.$store.getters['status/find']({
                _id: { $notIn: (this.mainStatus ? this.mainStatus.all : []) },
                constellation: this.$constellation._id,
                sort: { createdAt: 'asc' },
                createdAt: { $gte: this.$moment().subtract(15, 'days').toDate() }
            })

            let byTags = Object.entries(this.$groupBy(statuses, 'tags'))

            return byTags.map(s => {
                let posts = s[1].items.filter(i => i.content && i.images.length <= 0).slice(0, 3)
                let photos = s[1].items.filter(i => i.images.length > 0).slice(0, 5)

                return s[1].items.length >= 3 ? {
                    statuses: { photos, posts },
                    hashtag: s[0],
                    type: 'content-conste-tag',
                    sortDate: s[1].items ? s[1].items[0].createdAt : null
                } : null
            }).filter(t => t)
        },
        feed () {
            let statuses = []

            statuses = [
                this.mainStatus,
                ...this.gatherings,
                ...this.tagStatuses,
            ].filter(s => s && s.sortDate)

            return statuses.sort((a, b) => {
                return this.$moment(b.sortDate).valueOf() - this.$moment(a.sortDate).valueOf()
            })
        }
    },
}
</script>