<template>
    <div class="page" v-if="!isLoading">
        <div class="Page_wrapper Page_wrapper--feed Wrapper Wrapper--xs">
            <div class="block-f p-0 +mt-20 +mt-10@s" v-if="upcomingEvents.length > 0">
                <div class="ph-20 pt-20">
                    <h2 class="ft-title-xs">
                        <span class="round-s bg-bg-strong mr-5">{{ upcomingEvents.length }}</span> Événements à
                        venir
                    </h2>

                    <block-gathering
                        class="mt-20"
                        v-bind="upcomingEvents[0]"
                    />
                </div>

                <div class="pt-20">
                    <slider-block :slots="upcomingEvents.slice(1, 15).map(g => g._id)" :ratio="130" item-class="width-2xs" :offset="$smallerThan('xs') ? 15 : 20" :offset-v="20"  :margin="10" v-if="upcomingEvents.length - 1 > 0">
                        <div v-for="gathering in upcomingEvents.slice(1, 15)" :slot="gathering._id" :key="gathering._id">
                            <block-gathering :modifiers="['square']" :status-only="true" v-bind="gathering" />
                        </div>
                    </slider-block>
                </div>
            </div>

            <div class="fx-center mv-40">
                <p class="ft-title-3xs fx-no-shrink mr-15 color-ft-xweak">Publications</p>
                <hr class="Separator">
            </div>
            
            <template v-if="!isLoading">
                <component
                    v-for="feedItem in feed"
                    :is="feedItem.type"
                    class="+mt-20 +mt-10@s"
                    v-bind="feedItem"
                    :key="feedItem._id"
                />
            </template>
            <template v-else>
                <placeholder class="+mt-20 +mt-10@s" :ratio="33" v-for="i in 10" :key="i" />
            </template>
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
        upcomingEvents () {
            let gatherings = this.$store.getters['gathering/find']({
                constellation: this.$constellation._id,
                status: 'active',
                isPast: false,
                sort: { date: 'desc' }
            })

            return gatherings
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
                ...this.tagStatuses,
            ].filter(s => s && s.sortDate)

            return statuses.sort((a, b) => {
                return this.$moment(b.sortDate).valueOf() - this.$moment(a.sortDate).valueOf()
            })
        }
    },
}
</script>