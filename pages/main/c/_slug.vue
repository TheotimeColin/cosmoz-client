
<template>
    <div class="Constellation page" :class="{ 'is-event': isEventPage }">
        <div class="Constellation_content fx-grow" v-if="constellation">
            <page-const-banner
                :min="isMin"
                :is-event="isEventPage"
                v-bind="{ ...constellation, ...page }" class="d-none@s"
            />

            <nuxt-child :constellation="constellation" @page="(v) => page = v" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'ConstellationPage',
    async fetch () {
        const response = await this.$store.dispatch('constellation/get', {
            query: { slug: this.$route.params.slug }
        })

        this.$store.commit('page/set', { currentConst: this.constellation._id })
    },
    beforeDestroy () {
        this.$store.commit('page/set', { isDisableFooter: false, subtitle: '', currentConst: '' })
    },
    data: () => ({
        isLoading: false,
        page: { subtitle: '', fa: '' }
    }),
    computed: {
        isMin () { return !this.$route.name.includes('c-slug_') },
        isEventPage () { return this.$store.state.page.current == 'event' },
        user () { return this.$store.getters['user/self'] },
        constellation () {
            return this.$store.getters['constellation/findOne']({
                slug: this.$route.params.slug
            })
        }
    },
    watch: {
        $route () { if (process.client) window.scrollTo(0, 0) }
    },
    head () {
        if (!this.constellation) return {}
        
        let meta = {
            title: this.constellation.name + ' organise ses événements sur Cosmoz',
            meta: [
                { hid: 'description', name: 'description', content: this.constellation.intro },
                { property: 'og:title', content: this.constellation.name  + ' organise ses événements sur Cosmoz' },
                { property: 'og:url', content: this.$config.baseUrl + '/o/' + this.constellation.slug },
                { property: 'og:image', content: this.constellation.logo },
                { property: 'og:description', content: this.constellation.intro },
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
        // height: calc(100vh - var(--header-height, 0px));
        // display: flex;
        margin-left: 320px;

        &::before {
            content: "";
            background-color: var(--color-bg-strong);
            position: absolute;
            top: 0;
            left: -100%;
            height: 200%;
            width: 100%;
        }
    }

    .Constellation_content {
        // overflow: auto;
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
            // height: auto;
            // overflow: hidden;
            margin-left: 0;
        }

        .Constellation_content {
            // overflow: visible;
        }
    }
</style>