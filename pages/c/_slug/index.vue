<template>
    <div v-if="$constellation">
        <div class="bg-cover-100 ratio-15 ratio-35@xs" :style="{ '--background': `url(${$constellation.hero}` }"
            v-if="$constellation.hero"></div>

        <div class="Page_wrapper d-flex Wrapper d-block@s">
            <div class="fx-grow">
                <div class="block mb-40 o-hidden" v-if="$constellation.description && $constellation.description != '<p></p>'">
                    <h1 class="ft-title-xs mb-15">
                        À propos du groupe
                    </h1>

                    <div class="TextBody" :class="{ 'ellipsis-2': !showFull }" v-html="$constellation.description">
                    </div>

                    <link-base class="mt-20" @click="showFull = true" v-show="!showFull">En savoir plus</link-base>
                </div>

                <div v-if="upcomingEvents.length > 0">
                    <div class="fx-center mb-20">
                        <h2 class="ft-title-xs">
                            <span class="round-s bg-bg-strong mr-5">{{ upcomingEvents.length }}</span> Événements à
                            venir
                        </h2>

                        <button-base :modifiers="['s']"
                            :to="{ name: 'c-slug-events', params: { slug: $constellation.slug } }">Voir tout
                        </button-base>
                    </div>
                    <block-gathering class="mb-20" :status-only="true" v-bind="upcomingEvents[0]"
                        :key="upcomingEvents[0]._id" />
                </div>

                <div class="pt-20 br-s bg-bg-weak mv-20" v-if="pastEvents.length > 0">
                    <p class="ft-title-xs mb-20 ph-20">
                        <span class="round-s bg-bg-xstrong mr-5">{{ pastEvents.length }}</span> Événements passés
                    </p>

                    <slider-block :slots="pastEvents.map(g => g._id)" :ratio="130" item-class="width-2xs"
                        :offset="$smallerThan('xs') ? 15 : 20" :offset-v="20" :margin="10">
                        <div v-for="gathering in pastEvents" :slot="gathering._id" :key="gathering._id">
                            <block-gathering :modifiers="['square']" :status-only="true" v-bind="gathering" />
                        </div>
                    </slider-block>
                </div>
            </div>

            <div class="width-xs ml-30 fx-no-shrink ml-0@s width-100@s">
                <div class="block-r p-15 mb-10">
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

                <div class="block-r p-15" v-if="users.length > 5">
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

export default {
    mixins: [ ConstellationMixin ],
    layout: 'app',
    async fetch() {
        await this.$preFetch()

        if (this.$constellation.type == 'group') this.$router.push(this.localePath({ name: 'c-slug-feed', params: { slug: this.$constellation.slug } }))

        if (this.$constellation) {
            await this.$store.dispatch('gathering/softFetch', this.$constellation.gatherings)

            await this.$store.dispatch('user/softFetch', this.$constellation.members)
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
        isFollowed () {
            return this.user ? this.user.followed.includes(this.$constellation._id) : false
        },
        pastEvents () {
            return this.gatherings.filter(g => g.isPast)
        },
        upcomingEvents () {
            return this.gatherings.filter(g => !g.isPast)
        }
    }
}
</script>