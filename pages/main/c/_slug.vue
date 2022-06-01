
<template>
    <div class="Constellation page" :class="{ 'is-event': isEventPage }" v-if="orga">
        <div class="Constellation_content fx-grow">
            <page-const-banner :min="isMin" :is-event="isEventPage" v-bind="orga" class="d-none@xs" v-if="$biggerThan('xs')" />

            <transition name="page">
                <nuxt-child :orga="orga" />
            </transition>
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

        this.$store.commit('page/set', { currentConst: this.orga._id })
    },
    beforeDestroy () {
        this.$store.commit('page/set', { isDisableFooter: false, subtitle: '', currentConst: '' })
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
        $route () { if (process.client) window.scrollTo(0, 0) }
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
    .Constellation {
        position: relative;
        height: calc(100vh - var(--header-height, 0px));
        overflow: hidden;
        display: flex;
        margin-left: 320px;
    }

    .Constellation_content {
        overflow: auto;
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

    @include breakpoint-s {
        .Constellation {
            height: auto;
            overflow: hidden;
            margin-left: 0;
        }

        .Constellation_content {
            overflow: visible;
        }
    }
</style>