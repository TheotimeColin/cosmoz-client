<template>
    <div v-if="$constellation">
        <div class="Page_wrapper Page_wrapper--feed d-flex Wrapper d-block@s">
            <div class="fx-grow o-hidden o-visible@s mt-10@s">
                <div class="+mt-20 block-f p-0 +mt-10@s" v-if="upcomingEvents.length > 0">
                    <div class="ph-20 pt-20">
                        <h2 class="ft-title-xs">
                            <span class="round-s bg-bg-xstrong mr-5">{{ upcomingEvents.length }}</span> Événements à
                            venir
                        </h2>
                    </div>

                    <div class="pt-20">
                        <slider-block :slots="upcomingEvents.map(e => e._id)" :ratio="130" item-class="width-2xs" :offset="20" :offset-v="20" :margin="10" v-if="upcomingEvents.length > 0">
                            <div v-for="gathering in upcomingEvents" :slot="gathering._id" :key="gathering._id">
                                <block-gathering :modifiers="['square']" :status-only="true" v-bind="gathering" />
                            </div>
                        </slider-block>
                    </div>
                </div>
                <div class="+mt-20 block-f p-20 text-center bg-bg-strong +mt-10@s" v-else>
                    Pas encore d'événements à venir
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

            <div class="width-s ml-30 fx-no-shrink ml-0@s width-100@s mt-20@s">     
                <div class="+mt-10 block o-hidden" v-if="$constellation.description && $constellation.description != '<p></p>'">
                    <h1 class="ft-title-xs mb-15">
                        À propos du groupe
                    </h1>

                    <text-body :value="$constellation.description" :truncate="100" />
                </div>

                <div class="+mt-10 block-r p-15">
                    <div class="fx-center">
                        <h2 class="ft-title-2xs">
                            Organisateurs du groupe
                        </h2>

                        <!-- <link-base :to="{ name: 'c-slug-members', params: { slug: $constellation.slug }}">Voir tout
                        </link-base> -->
                    </div>

                    <div class="n-mh-3 mt-15">
                        <div class="p-3 d-inline-block" v-for="user in admins" :key="user._id">
                            <user-icon v-bind="user" />
                        </div>
                    </div>
                </div>

                <div class="+mt-10 block-r p-15" v-if="users.length > 5">
                    <div class="fx-center">
                        <h2 class="ft-title-3xs">
                            <span class="round-s bg-bg-strong mr-5">{{ users.length }}</span> Membres
                        </h2>

                        <link-base :to="{ name: 'c-slug-members', params: { slug: $constellation.slug }}">Voir tout
                        </link-base>
                    </div>

                    <div class="n-mh-3 mt-15">
                        <div class="p-3 d-inline-block" v-for="user in users" :key="user._id">
                            <user-icon v-bind="user" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ConstellationMixin from '@/mixins/constellation'
import PermissionsMixin from '@/mixins/permissions'

export default {
    mixins: [ ConstellationMixin, PermissionsMixin ],
    layout: 'app',
    async fetch() {
        await this.$preFetch(true)
        
        if (this.$constellation) {
            await this.$store.dispatch('constellation/fetchFeed', this.$constellation._id)
        }
    },
    data: () => ({
        isLoading: false,
        showFull: false
    }),
    computed: {
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
        upcomingEvents () {
            return this.gatherings.filter(g => !g.isPast && g.type == 'official')
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
            if (!this.$isConsteMember) return []

            let statuses = []

            statuses = [
                this.mainStatus,
                ...this.tagStatuses,
            ].filter(s => s && s.sortDate)

            return statuses.sort((a, b) => {
                return this.$moment(b.sortDate).valueOf() - this.$moment(a.sortDate).valueOf()
            })
        }
    }
}
</script>