<template>
    <div>
        <template v-if="!isLoading && gathering">
            <app-banner :background="gathering.hero">
                <div>
                    {{ gathering.title }}
                </div>
            </app-banner>
            <div class="Wrapper o-hidden@s">
                <div class="d-flex fx-reverse@xs">
                    <nav-body class="fx-grow pt-20 pb-60" :items="navItems" :default="hasBooked ? 'after' : ''" />

                    <div class="width-s fx-no-shrink n-mt-60 ml-30 mb-60 p-relative" v-if="$biggerThan('s')">
                        <page-gathering-manage :gathering="gathering" />
                    </div>
                </div>
            </div>
        </template>
        <template v-else-if="isLoading">
            <app-banner class="bg-bg-xstrong">
                <placeholder :ratio="10" />
                <placeholder class="mt-10" :ratio="10" />
                <placeholder class="mt-20" :ratio="5" />
            </app-banner>

            <div class="Wrapper n-mt-20">
                <placeholder class="mt-10 bg-bg" :ratio="30" />
                <placeholder class="mt-10 bg-bg" :ratio="30" />
                <placeholder class="mt-10 bg-bg" :ratio="50" />
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
export default {
    name: 'GatheringPage',
    async fetch () {
        this.isLoading = true 

        let result = this.$store.getters['gathering/findOne']({
            id: this.$route.params.id,
            status: 'active'
        })

        if (!result) {
            await this.$store.dispatch('gathering/get', { query: { id: this.$route.params.id, status: 'active' }})
        }

        this.isLoading = false 
    },
    data: () => ({
        isLoading: true,
    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        gathering () {
            return this.$store.getters['gathering/findOne']({
                id: this.$route.params.id,
                status: 'active'
            })
        },
        isOrga () {
            return this.user && this.user.role == 'admin'
        },
        hasBooked () {
            return this.gathering.users.find(s => s.status == 'confirmed' && s._id == this.user._id)
        },
        navItems () {
            return [
                {
                    id: 'index',
                    component: 'page-gathering',
                    label: 'Détails',
                    props: { gathering: this.gathering }
                }, {
                    id: 'feed',
                    component: 'page-gathering-feed',
                    label: 'Discussion',
                    props: { gathering: this.gathering }
                }, {
                    id: 'orga',
                    component: 'page-gathering-orga',
                    label: 'Organisation',
                    disabled: !this.isOrga,
                    props: { gathering: this.gathering }
                }, {
                    id: 'after',
                    component: 'page-gathering-after',
                    label: 'Afterspace',
                    props: { gathering: this.gathering }
                }
            ]
        }
    },
    mounted () {
        if (!this.gathering) return

        this.$emit('page', {
            subtitle: `Organisé par ${this.gathering.constellation.name}`, fa: ''
        })

        this.$store.commit('page/set', {
            subtitle: `Organisé par ${this.gathering.constellation.name}`, fa: ''
        })

        this.$store.commit('page/setCurrent', 'event')
    },
    beforeDestroy () {  
        this.$store.commit('page/setCurrent', '')
    },
    head () {
        if (!this.gathering) return {}

        let meta = {
            title: `${this.gathering.title} organisé par ${this.gathering.constellation ? this.gathering.constellation.name : ''} ${this.$t('meta.append')}`,
            meta: [
                { hid: 'description', name: 'description', content: this.gathering.intro },
                { property: 'og:title', content: `${this.gathering.title} organisé par ${this.gathering.constellation ? this.gathering.constellation.name : ''} ${this.$t('meta.append')}` },
                { property: 'og:url', content: this.$config.baseUrl + '/c/' + (this.gathering.constellation ? this.gathering.constellation.slug : 'event') + '/events/' + this.gathering.id },
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
