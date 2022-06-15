
<template>
    <div class="Constellation page" :class="{ 'is-event': isEventPage }">
        <div class="Constellation_content fx-grow" v-if="constellation">
            <page-const-banner
                :min="isMin"
                :is-event="isEventPage"
                v-bind="constellation" class="d-none@s"
            />

            <nuxt-child :constellation="constellation" />
        </div>
    </div>
</template>

<script>
import striptags from 'striptags'

export default {
    name: 'ConstellationPage',
    async fetch () {
        this.$store.commit('page/set', { isOpenNav: true })

        await this.$store.dispatch('constellation/get', {
            query: { slug: this.$route.params.slug }
        })

        await this.$store.dispatch('gathering/fetch', {
            query: { constellation: this.constellation._id, status: 'active' }
        })
    },
    beforeDestroy () {
        this.$store.commit('page/set', { isOpenNav: false, subtitle: '' })
    },
    data: () => ({
        isLoading: false,
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
                { hid: 'description', name: 'description', content: striptags(this.constellation.description) },
                { property: 'og:title', content: this.constellation.name  + ' organise ses événements sur Cosmoz' },
                { property: 'og:url', content: this.$config.baseUrl + '/c/' + this.constellation.slug },
                { property: 'og:image', content: this.constellation.logoLarge },
                { property: 'og:description', content: striptags(this.constellation.description) },
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
        margin-left: 340px;
        overflow: hidden;
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