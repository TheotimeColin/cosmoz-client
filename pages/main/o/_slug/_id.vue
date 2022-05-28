<template>
    <div>
        <template v-if="!isLoading && gathering">
            <app-banner :background="gathering.hero">
                <template slot="return">
                    <link-base class="d-none@s" :to="{ path: localePath({ name: 'g' }) }" icon-before="long-arrow-left">Retour aux événements</link-base>
                </template>
                
                <div>
                    {{ gathering.title }}
                </div>
            </app-banner>
            <div class="Wrapper">
                <div class="d-flex fx-reverse@xs">
                    <nav-body class="fx-grow pt-20 pb-60" :items="navItems" />

                    <div class="width-s fx-no-shrink n-mt-60 ml-40 mb-60 p-relative" v-if="$biggerThan('s')">
                        <page-gathering-manage :gathering="gathering" />
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
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
    </div>
</template>

<script>
export default {
    name: 'GatheringPage',
    async fetch () {
        this.isLoading = true 

        await this.$store.dispatch('gathering/get', { query: { id: this.$route.params.id }})

        this.isLoading = false 
    },
    data: () => ({
        isLoading: true,

    }),
    computed: {
        user () { return this.$store.getters['user/self'] },
        gathering () {
            return this.$store.getters['gathering/findOne']({
                id: this.$route.params.id
            })
        },
        navItems () {
            return [
                {
                    id: 'index',
                    component: 'page-gathering',
                    label: 'Détails',
                    props: { gathering: this.gathering }
                }, {
                    id: 'delivery',
                    component: 'page-gathering-feed',
                    label: 'Annonces & discussion',
                    props: { gathering: this.gathering }
                }, {
                    id: 'client',
                    component: 'page-gathering-after',
                    label: 'After space',
                    props: { gathering: this.gathering }
                }
            ]
        }
    },
    methods: {
        
    },
    head () {
        let meta = {
            title: `${this.gathering.title} organisé par ${this.gathering.organization ? this.gathering.organization.name : ''} ${this.$t('meta.append')}`,
            meta: [
                { hid: 'description', name: 'description', content: this.gathering.intro },
                { property: 'og:title', content: `${this.gathering.title} organisé par ${this.gathering.organization ? this.gathering.organization.name : ''} ${this.$t('meta.append')}` },
                { property: 'og:url', content: this.$config.baseUrl + '/o/' + (this.gathering.organization ? this.gathering.organization.slug : 'event') + '/' + this.gathering.id },
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
