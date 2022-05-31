<template>
    <div class="Orga page" v-if="orga">
        <div class="Wrapper">
            <page-const-banner v-bind="orga" />
            
            <div class="d-flex pv-30 d-block@s pt-30@xs">
                <div class="width-xs fx-no-shrink mr-40 width-100@s ml-0@s mb-40@s">
                    <page-const-nav :slug="orga.slug" />
                </div>

                <div class="fx-grow o-hidden">
                    <div v-if="upcomingEvents.length > 0">
                        <block-gathering
                            v-for="gathering in upcomingEvents"
                            class="mb-20"
                            :status-only="true"
                            v-bind="gathering"
                            :key="gathering._id"
                        />
                    </div>
                    <div class="bg-bg-xstrong p-30 text-center br-s" v-else>
                        <fa icon="far fa-clock" class="ft-xl color-ft-xweak line-1"></fa>

                        <p class="mt-10 max-width-m m-auto">Ce créateur n'a pas de rencontres programmées pour l'instant. Reste à l'écoute !</p>

                        <button-base class="mt-20" :modifiers="['light']" icon-before="plus" @click="onFollow" v-if="!this.isFollowed">
                            Suivre
                        </button-base>
                    </div>

                    <div class="pt-20 br-s bg-bg-weak mv-40" v-if="pastEvents.length > 0">
                        <p class="ft-title-xs mb-20 ph-20">
                            <span class="round-s bg-bg-xstrong mr-5">{{ pastEvents.length }}</span> Rencontres passés
                        </p>

                        <slider-block
                            :slots="pastEvents.map(g => g._id)"
                            :ratio="100"
                            item-class="width-2xs"
                            :offset="$smallerThan('xs') ? 15 : 20"
                            :offset-v="20"
                        >
                            <div v-for="gathering in pastEvents" :slot="gathering._id" :key="gathering._id">
                                <block-gathering
                                    :modifiers="['square']"
                                    :status-only="true"
                                    v-bind="gathering"
                                />
                            </div>
                        </slider-block>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'OrganizationPage',
    async fetch () {
        const response = await this.$store.dispatch('organization/get', {
            query: { slug: this.$route.params.slug }
        })

        if (response) {
            await this.$store.dispatch('gathering/fetch', {
                query: {
                    organization: response._id
                }
            })
        }
    },
    data: () => ({
        isLoading: false,
        followAction: 0
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        orga () {
            return this.$store.getters['organization/findOne']({
                slug: this.$route.params.slug
            })
        },
        gatherings () {
            return this.$store.getters['gathering/find']({
                organization: { '$id': this.orga._id }
            })
        },
        isFollowed () {
            return this.user ? this.user.followed.includes(this.orga._id) : false
        },
        pastEvents () {
            return this.gatherings.filter(g => g.isPast)
        },
        upcomingEvents () {
            return this.gatherings.filter(g => !g.isPast)
        }
    },
    methods: {
        async onFollow () {
            this.isLoading = true

            await this.$store.dispatch('user/update', {
                followed: this.isFollowed ? { $pull: this.orga._id } : { $addToSet: this.orga._id }
            })
            
            setTimeout(() => {
                this.followAction = this.isFollowed ? -1 : 1
                this.isLoading = false
            }, 50)
        }
    },
    head () {
        if (!this.orga) return {}
        
        let meta = {
            title: this.orga.name + ' organise ses événements sur Cosmoz',
            meta: [
                { hid: 'description', name: 'description', content: this.orga.intro },

                { property: 'og:title', content: this.orga.name  + ' organise ses événements sur Cosmoz' },
                { property: 'og:url', content: this.$config.baseUrl + '/o/' + this.orga.slug },
                { property: 'og:image', content: this.orga.logo },
                { property: 'og:description', content: this.orga.intro },
                { property: 'og:site_name', content: 'Cosmoz, rencontres hors-ligne.' },
                { property: 'twitter:card', content: 'summary_large_image' },
            ]
        }

        return meta
    }
}
</script>