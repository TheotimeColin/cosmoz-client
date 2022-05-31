
<template>
    <div class="Constellation page" :class="{ 'is-event': isEventPage }" v-if="orga">
        <div class="Wrapper">
            <page-const-banner :min="isMin" :is-event="isEventPage" v-bind="orga" />

            <div class="Constellation_content d-flex d-block@s pt-30@xs">
                <div class="width-xs fx-no-shrink mr-40 width-100@s ml-0@s mb-40@s" v-show="!isEventPage">
                    <page-const-nav :slug="orga.slug" />
                </div>

                <div class="fx-grow">
                    <transition name="page">
                        <nuxt-child :orga="orga" />
                    </transition>
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
    },
    data: () => ({
        isLoading: false,
    }),
    computed: {
        isMin () { return !this.$route.name.includes('c-slug_') },
        isEventPage () { return this.$store.state.page.current == 'event' },
        user () { return this.$store.getters['user/self'] },
        orga () {
            return this.$store.getters['organization/findOne']({
                slug: this.$route.params.slug
            })
        }
    },
    watch: {
        $route () {
            if (process.client) window.scrollTo(0, 0)
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

<style lang="scss" scoped>  
    .Constellation.is-event {

        .Constellation_content {
            padding: 0;
        }
    }

    .Constellation_content {
        padding: 30px 0;
    }

    .page-enter-active,
    .page-leave-active {
        transition: all 200ms;
    }

    .page-enter {
        opacity: 0;
        transform: translateY(3px);
    }

        .page-leave-to {
        opacity: 0;
        transform: translateY(-3px);
    }
</style>