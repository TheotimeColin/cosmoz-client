<template>
    <div class="Orga page" v-if="orga">
        <div class="Wrapper">
            <div class="Orga_cover outflow@s" :style="{ backgroundImage: `url(${orga.hero})` }">
                <quick-menu
                    :modifiers="['strong']"
                    :items="[
                        { label: `Copier l'ID`, fa: 'hashtag', action: () => $copy(orga._id) }
                    ]"
                />
            </div>

            <div class="fx-center p-15 bg-bg d-block@s outflow@s">
                <div class="d-flex fxa-center">
                    <orga-icon :modifiers="$smallerThan('s') ? ['l'] : ['xl']" v-bind="orga" />

                    <div class="ml-15">
                        <h1 class="ft-title-xs">{{ orga.name }}</h1>
                        <h2 class="ft-m ft-s@s">{{ orga.intro }}</h2>
                    </div>
                </div>
                <div class="d-flex fxa-center ml-20 ml-0@s fx-reverse@s pv-15@s mt-15@s br-s bg-bg-xstrong@s">
                    <p class="ft-s text-right mr-10 mr-0@s mt-5@s" v-if="orga.followers + followAction > 0">
                        Suivi par {{ orga.followers + followAction }} personnes
                    </p>

                    <button-base :modifiers="['light']" icon-before="plus" :loading="isLoading" @click="onFollow" v-if="!this.isFollowed">
                        Suivre
                    </button-base>
                    <button-base icon-before="check" :loading="isLoading" @click="onFollow" v-else>
                        Suivi
                    </button-base>
                </div>
            </div>
            
            <div class="d-flex pv-60 d-block@s pt-30@xs">
                <div class="fx-grow o-hidden">
                    <div v-if="upcomingEvents.length > 0">
                        <p class="ft-title-m mb-20">
                            <span class="round bg-bg-2xstrong mr-5">{{ upcomingEvents.length }}</span> Événements à venir
                        </p>

                        <block-gathering
                            v-for="gathering in upcomingEvents"
                            class="mt-20"
                            :status-only="true"
                            v-bind="gathering"
                            :key="gathering._id"
                        />
                    </div>
                    <div class="bg-bg-xstrong p-30 text-center br-s" v-else>
                        <fa icon="far fa-clock" class="ft-xl color-ft-xweak line-1"></fa>

                        <p class="mt-10 max-width-m m-auto">Ce créateur n'a pas d'événements programmés pour l'instant. Reste à l'écoute !</p>

                        <button-base class="mt-20" :modifiers="['light']" icon-before="plus" @click="onFollow" v-if="!this.isFollowed">
                            Suivre
                        </button-base>
                    </div>

                    <div class="pt-20 br-s bg-bg mv-40" v-if="pastEvents.length > 0">
                        <p class="ft-title-xs mb-20 ph-20">
                            <span class="round-s bg-bg-xstrong mr-5">{{ pastEvents.length }}</span> Événements passés
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

                <div class="width-s fx-no-shrink ml-40 width-100@s ml-0@s mb-40@s">
                    <div class="bg-bg p-20 br-s">
                        
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

<style lang="scss" scoped>
    .Orga_cover {
        background-size: cover;
        background-position: center;
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        padding: 10px;

        &::before {
            content: "";
            display: block;
            @include ratio(33);
        }
    }

    @include breakpoint-xs {

    }
</style>