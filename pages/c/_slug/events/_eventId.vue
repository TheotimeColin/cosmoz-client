<template>
    <div class="Page page pb-150">
        <template v-if="!isLoading && gathering">
            <div class="bg-cover-50 bg-bg-xstrong bg-cover-100@xs" :style="{ '--background': `url(${gathering.hero})` }">
                <div class="Wrapper Wrapper--xs text-center pv-60 ratio-25@xs">
                    <h1 class="ft-title-m d-none@xs">{{ gathering.title }}</h1>
                </div>
            </div>
            <div class="Wrapper Wrapper--xs n-mt-20 p-relative n-mt-0@xs">
                <page-gathering-manage :gathering="gathering" ref="manage" />
            
                <content-feed
                    class="mt-20 mt-10@xs"
                    read="public"
                    :max="3"
                    :auto-statuses="autoStatuses"
                    :gathering="gathering._id"
                    ref="feed"
                />
            </div>
        </template>
        <template v-else-if="isLoading">
            <placeholder :ratio="15" />

            <div class="Wrapper Wrapper--xs">
                <placeholder class="mt-15" :ratio="40" />
                <placeholder class="mt-15" :ratio="10" />

                <placeholder class="mt-15 bg-bg" :ratio="30" />
                <placeholder class="mt-15 bg-bg" :ratio="30" />
                <placeholder class="mt-15 bg-bg" :ratio="50" />
            </div>
        </template>
        <template v-else-if="!isLoading && !gathering">
            <div class="Wrapper">
                <div class="p-20 mv-20 bg-bg-strong text-center">Cet événement n'existe pas (ou plus).</div>
            </div>
        </template>
    </div>
</template>

<script>
import ConstellationMixin from '@/mixins/constellation'

export default {
    name: 'GatheringPage',
    mixins: [ ConstellationMixin ],
    layout: 'app',
    transition (to, from) {
        if (to.name.includes('eventId')) {
            return { name: 'slide-in', mode: 'in-out' }
        } else if (from) {
            return { name: 'slide-out', mode: 'in-out' }
        }
    },
    async fetch () {
        this.isLoading = true

        await this.$preFetch()

        let result = this.$store.getters['gathering/findOne']({
            id: this.$route.params.eventId,
            status: 'active'
        })

        if (!result) {
            await this.$store.dispatch('gathering/get', { query: { id: this.$route.params.eventId, status: 'active' }})
        }

        if (this.gathering) {
            await this.$store.dispatch('user/softFetch', this.gathering.users.map(u => u._id))

            if (this.user && this.gathering.isPast) {
                await this.$store.dispatch('mention/fetch', { query: {
                    target: this.user._id,
                    gathering: this.gathering._id
                }})
            }

            await this.$store.dispatch('reaction/fetch', {
                query: { id: { '$includes': this.gathering._id } }
            })
        }

        this.isLoading = false 
    },
    data: () => ({
        isLoading: false,
    }),
    computed: {
        gathering () {
            return this.$store.getters['gathering/findOne']({
                id: this.$route.params.eventId,
                status: 'active'
            })
        },
        isOrga () {
            return this.user && this.user.role == 'admin'
        },
        hasBooked () {
            return this.gathering.users.find(s => s.status == 'confirmed' && s._id == this.user._id)
        },
        autoStatuses () {
            let statuses = []

            if (!this.gathering) return statuses

            statuses = [ ...statuses,  {
                _id: `gathering-created-${this.gathering._id}`,
                type: 'status',
                title: this.gathering.title,
                subtitle: `On espère que tu as hâte de participer !`,
                createdAt: this.$moment(this.gathering.createdAt),
                actions: this.gathering.isPast ? [] : [
                    {
                        text: 'Poser une question',
                        modifiers: ['s'],
                        iconBefore: 'comments-question',
                        on: {
                            click: () => {
                                if (this.$refs.feed) this.$refs.feed.openEditor()
                            }
                        }
                    }, { 
                        text: 'Je participe !',
                        modifiers: ['light'],
                        iconBefore: 'arrow-right',
                        on: {
                            click: () => {
                                if (this.$refs.manage) this.$refs.manage.openFull()
                            }
                        }
                    }
                ]
            } ]

            statuses = [ ...statuses,  {
                _id: `gathering-soon-${this.gathering._id}`,
                type: 'status',
                title: `L'événement commence bientôt 😱`,
                subtitle: `Tu as hâte ? N'oublie pas de te désinscrire si tu as un empêchement !`,
                enableReactions: true,
                createdAt: this.$moment(this.gathering.date).subtract(1, 'days'),
                actions: this.gathering.isPast ? [] : [
                    {
                        text: 'Se désinscrire',
                        modifiers: ['xs', 'weak'],
                        on: {
                            click: () => {
                                if (this.$refs.manage) this.$refs.manage.openFull()
                            }
                        }
                    }
                ]
            } ]

            statuses = [ ...statuses,  {
                _id: 'step-start',
                type: 'step',
                title: `Début de l'événement`,
                createdAt: this.$moment(this.gathering.date),
            } ]

            statuses = [ ...statuses,  {
                _id: `gathering-during-${this.gathering._id}`,
                type: 'status',
                title: `L'événement bat son plein 🔥`,
                createdAt: this.$moment(this.gathering.date).add(1, 'seconds'),
                actions: [
                    {
                        text: 'Poster des photos',
                        modifiers: ['cosmoz'],
                        iconBefore: 'images',
                        on: {
                            click: () => {
                                if (this.$refs.feed) this.$refs.feed.openEditor()
                            }
                        }
                    }
                ]
            } ]

            statuses = [ ...statuses,  {
                _id: 'step-end',
                type: 'step',
                title: `Fin de l'événement`,
                createdAt: this.$moment(this.gathering.date).add(3, 'hours').subtract(1, 'second'),
            } ]

            statuses = [ ...statuses,  {
                _id: `gathering-end-${this.gathering._id}`,
                type: 'status',
                title: `Tout les bonnes choses ont une fin...`,
                subtitle: `Merci d'avoir participé à l'événement. Prends un moment pour remercier les organisateurs !`,
                enableReactions: true,
                createdAt: this.$moment(this.gathering.date).add(3, 'hours'),
                actions: [
                    {
                        text: 'Poster un message',
                        modifiers: ['light'],
                        iconBefore: 'heart',
                        on: {
                            click: () => {
                                if (this.$refs.feed) this.$refs.feed.openEditor()
                            }
                        }
                    }
                ]
            } ]

            return statuses
        }
    },
    head () {
        if (!this.gathering || !this.$constellation) return {}

        let meta = {
            meta: [
                { hid: 'description', name: 'description', content: this.gathering.intro },
                { property: 'og:title', content: `${this.gathering.title} organisé par ${this.$constellation ? this.$constellation.name : ''} ${this.$t('meta.append')}` },
                { property: 'og:url', content: this.$config.baseUrl + '/c/' + (this.$constellation.slug) + '/events/' + this.gathering.id },
                { property: 'og:image', content: this.gathering.hero },
                { property: 'og:description', content: this.gathering.intro },
                { property: 'og:site_name', content: 'Cosmoz, rencontres hors-ligne.' },
                { property: 'twitter:card', content: 'summary_large_image' },
            ]
        }

        return meta
    }
}
</script>

<style lang="scss" scoped>
    .Page {
        background-color: var(--color-bg);
    }
</style>
